{-# LANGUAGE ExtendedDefaultRules #-}
{-# LANGUAGE PatternGuards #-}
{-# LANGUAGE ViewPatterns #-}
{-# LANGUAGE GeneralizedNewtypeDeriving #-}
{-# LANGUAGE OverloadedStrings   #-}
{-# LANGUAGE CPP #-}
{-# OPTIONS -fno-warn-type-defaults -fno-warn-deprecations #-}

-- | Try Haskell!  

{-
    127.0.0.1:4001
        /static",serveDirectory static => no idea, guess it does not work like it should
        /eval?exp=6*7 => 42
        /users => users stats)
        / => normal home page
How do I enable SSL?

First, you need to install snap-server with -fopenssl. If you have already installed snap-server, you might want to uninstall it first with ghc-pkg unregister -f snap-server to avoid potential version conflicts.

Once you have done that, run your application as follows using values appropriate to your setup.

./app --ssl-port=443 --ssl-cert=cert.pem --ssl-key=key.pem
    
    -}

module TryHaskell where

import           Paths_tryhaskell

import           Control.Arrow ((***))
import           Control.Applicative ((<$>),(<|>))
import           Control.Concurrent
import           Control.Monad
import           Control.Monad.Trans
import           Data.Aeson as Aeson
import           Data.Bifunctor
import           Data.ByteString (ByteString)
import           Data.ByteString.Char8 (pack)
import           Data.ByteString.Lazy (fromChunks)
import qualified Data.ByteString.Lazy as L (ByteString)
import qualified Data.Cache.LRU.IO as LRU
import qualified Data.HashMap.Strict as M
import           Data.Hashable
import           Data.Map (Map)
import qualified Data.Map as Map
import           Data.Maybe
import           Data.Monoid
import           Data.Text (unpack)
import qualified Data.Text as S
import           Data.Text.Encoding (decodeUtf8)
import           Data.Text.Lazy (Text)
import qualified Data.Text.Lazy as T
-- import           Data.Time.Format.Locale
import           Data.Time
import           Prelude hiding (div,head)
import           PureIO (Interrupt(..),Output(..),Input(..),IOException(..))
import           Safe
import           Snap.Core
import           Snap.Http.Server hiding (Config)
import           Snap.Util.FileServe
import           System.Environment (getEnvironment, lookupEnv)
import           System.Exit
import           System.IO (stderr, hPutStrLn) --
#if ! MIN_VERSION_time(1,5,0)
import           System.Locale --
#endif
import           System.Process.Text.Lazy
import           TryHaskell.BuildPage
import           TryHaskell.Tutorials

tutorials :: MVar Stats -> [(ByteString, Snap ())]
tutorials stats = map (\tut_no ->(pack ("/tutorial"++(show tut_no)),tut tut_no stats)) [1,2,11,12,31,32,22,23]

data EvalResult
  = ErrorResult !Text
  | SuccessResult !(Text,Text,Text) ![Text] !(Map FilePath String)
  | GetInputResult ![Text] !(Map FilePath String)
  deriving (Show,Eq)

--data Stats = Stats
--  { statsUsers :: !(HashMap ByteString UTCTime) }

type Cache = LRU.AtomicLRU (ByteString, ByteString) Value

-- | Setup the server threads and state.
setupServer :: IO ((MVar Stats,ThreadId), Cache)
setupServer =
  do checkMuEval
     mCacheLimit <- (readMay =<<) <$> lookupEnv "CACHE_LIMIT"
     cache <- LRU.newAtomicLRU (mCacheLimit <|> Just 1000)
     stats <- newMVar (Stats mempty)
     expire <- forkIO (expireVisitors stats)
     return ((stats,expire),cache)

-- | Start a web server.
startServer :: Cache
            -> MVar Stats
            -> IO ()
startServer cache stats =
  do env <- getEnvironment
     static <- getDataFileName "static"
     let port =
           maybe 4001 read $
           lookup "PORT" env
     let config =
           setPort port .
           setAccessLog ConfigNoLog .
           setErrorLog ConfigNoLog .
           setVerbose False
     httpServe (config defaultConfig)
               (dispatch static cache stats) -- so this part is what needs to change to support urls with different names

-- | Ensure mueval is available and working
checkMuEval :: IO ()
checkMuEval =
  do result <- mueval False "()"
     case result of
       Left err -> die err -- putStrLn $ msg err
       _ -> return ()
  where
    die err = do hPutStrLn stderr ("ERROR: mueval " ++ msg err)
                 exitFailure
    msg err | T.null err = "failed to start"
            | otherwise  = "startup failure:\n" ++ T.unpack err

-- | Dispatch on the routes.
dispatch :: FilePath -> Cache -> MVar Stats -> Snap ()
dispatch static cache stats =
  route $ [("/static",serveDirectory static)
        ,("/eval",eval cache stats)
        ,("/users",users stats)
        ,("/",home stats)
        ,("/tryhaskell",home stats)
       ] ++ (tutorials stats)

        
-- | Write out the list of current users.
users :: MVar Stats -> Snap ()
users statsv =
  do stats <- liftIO (readMVar statsv)
     writeLBS (encode (map (show . hash *** epoch)
                           (M.toList (statsUsers stats))))
  where epoch :: UTCTime -> Integer
        epoch = read . formatTime defaultTimeLocale "%s"
{-
-- | Log the current user's visit to the stats table.
logVisit :: MVar Stats -> Snap ByteString
logVisit stats =
  do ipHeaderFilter
     addr <- fmap rqRemoteAddr getRequest
     now <- liftIO getCurrentTime
     let updateStats (Stats u) = Stats (M.insert addr now u)
     liftIO (modifyMVar_ stats (return . updateStats))
     return addr
-}
-- | Reap visitors that have been inactive for one minute.
expireVisitors :: MVar Stats -> IO ()
expireVisitors stats =
  forever
    (do threadDelay (1000 * 1000 * 15)
        now <- getCurrentTime
        modifyMVar_ stats
                    (return .
                     Stats .
                     M.filter (not . (>60) . diffUTCTime now) .
                     statsUsers))

-- | Evaluate the given expression.
eval :: Cache -> MVar Stats -> Snap ()
eval cache stats =
  do mex <- getParam "exp"
     args <- getParam "args"
     case mex of
       Nothing -> error "exp expected"
       Just ex ->
         do let key = (ex,fromMaybe "" args)
            logit ex args
            liftIO (cachedEval key cache args ex) >>= jsonp
  where
        logit ex _ =
          do ip <- logVisit stats
             now <- liftIO getCurrentTime
             liftIO (appendFile "/tmp/tryhaskell-log"
                                 (show now ++  " " ++
                                  S.unpack (decodeUtf8 ip) ++
                                  "> " ++
                                  (S.unpack . decodeUtf8) ex ++
                                  "\n"))

-- | Read from the cache for the given expression (and context), or
-- otherwise generate the JSON.
cachedEval :: (Eq k, Ord k)
           => k -> LRU.AtomicLRU k Value -> Maybe ByteString -> ByteString
           -> IO Value
cachedEval key cache args ex =
  do mCached <- LRU.lookup key cache
     case mCached of
       Just cached -> return cached
       Nothing ->
         do o <- case getArgs of
                   Nothing -> muevalToJson ex mempty mempty
                   Just (is,fs) -> muevalToJson ex is fs
            case o of
              (Object i)
                | Just _ <- M.lookup "error" i -> return ()
              _ ->
                LRU.insert key o cache
            return o
  where getArgs = fmap toLazy args >>= decode

-- | Output a JSON value, possibly wrapping it in a callback if one
-- was requested.
jsonp :: Value -> Snap ()
jsonp o =
  do mcallback <- getParam "callback"
     writeLBS (case mcallback of
                 Nothing -> encode o
                 Just c -> toLazy c <> "(" <> encode o <> ");")

-- | Evaluate the given expression and return the result as a JSON value.
muevalToJson :: MonadIO m => ByteString -> [String] -> Map FilePath String -> m Value
muevalToJson ex is fs =
  do result <- liftIO (muevalOrType (unpack (decodeUtf8 ex)) is fs)
     case result of
       ErrorResult "can't find file: Imports.hs\n" -> muevalToJson ex is fs
       ErrorResult e ->
         return
           (codify
              (ErrorResult
                 (if e == ""
                     then helpfulMsg
                     else e)))
       _ -> return (codify result)
  where helpfulMsg = "No result, evaluator might've been killed due to heavy traffic. Retry?"
        codify result =
          Aeson.object
            (case result of
               ErrorResult err ->
                 [("error" .= err)]
               SuccessResult (expr,typ,value') stdouts files ->
                 [("success" .=
                   Aeson.object [("value"  .= value')
                                ,("expr"   .= expr)
                                ,("type"   .= typ)
                                ,("stdout" .= stdouts)
                                ,("files"  .= files)])]
               GetInputResult stdouts files ->
                 [("stdout" .= stdouts)
                 ,("files" .= files)])

-- | Strict bystring to lazy.
toLazy :: ByteString -> L.ByteString
toLazy = fromChunks . return

-- | Try to evaluate the given expression. If there's a mueval error
-- (i.e. a compile error), then try just getting the type of the
-- expression.
muevalOrType :: String -> [String] -> Map FilePath String -> IO EvalResult
muevalOrType e is fs =
  do typeResult <- mueval True e
     case typeResult of
       Left err ->
         return (ErrorResult err)
       Right (expr,typ,_) ->
         if T.isPrefixOf "IO " typ
            then muevalIO e is fs
            else
              do evalResult <- mueval False e
                 case evalResult of
                   Left err ->
                     if T.isPrefixOf "No instance for" err ||
                        T.isPrefixOf "Ambiguous " err
                        then return (SuccessResult (expr,typ,"") mempty fs)
                        else return (ErrorResult err)
                   Right (_,_,val) ->
                     return (SuccessResult (expr,typ,val) mempty fs)

-- | Try to evaluate the expression as a (pure) IO action, if it type
-- checks and evaluates, then we're going to enter a potential
-- (referentially transparent) back-and-forth between the server and
-- the client.
--
-- It handles stdin/stdout and files.
muevalIO :: String -> [String] -> Map FilePath String -> IO EvalResult
muevalIO e is fs =
  do result <- mueval False ("runTryHaskellIO " ++ show (convert (Input is fs)) ++ " (" ++ e ++ ")")
     case result of
       Left err ->
         return (ErrorResult err)
       Right (_,_,readMay . T.unpack -> Just r) ->
         ioResult e (bimap (second oconvert) (second oconvert) r)
       _ ->
         return (ErrorResult "Problem running IO.")
  where convert (Input os fs') = (os,Map.toList fs')
        oconvert (os,fs') = Output os (Map.fromList fs')

-- | Extract an eval result from the IO reply.
ioResult :: String -> Either (Interrupt,Output) (String,Output) -> IO EvalResult
ioResult e r =
  case r of
    Left i ->
      case i of
        (InterruptException ex,_) ->
          return
            (ErrorResult
               (case ex of
                  UserError err -> T.pack err
                  FileNotFound fp -> T.pack ("File not found: " <> fp)
                  DirectoryNotFound fp -> T.pack ("Directory not found: " <> fp)))
        (InterruptStdin,Output os fs) ->
          return (GetInputResult (map T.pack os) fs)
    Right (value',Output os fs) ->
      do typ <- mueval True e
         return
           (case typ of
              Left err ->
                ErrorResult err
              Right (_,iotyp,_) ->
                SuccessResult (T.pack e,iotyp,T.pack value')
                              (map T.pack os)
                              fs)

-- | Evaluate the given expression and return either an error or an
-- (expr,type,value) triple.
mueval :: Bool -> String -> IO (Either Text (Text,Text,Text))
mueval typeOnly e =
  do env <- getEnvironment
     importsfp <- getDataFileName "Imports.hs"
     let timeout = maybe "1" id $ lookup "MUEVAL_TIMEOUT" env
         options = ["-i","-t",timeout,"--expression",e] ++
                   ["--no-imports","-l",importsfp] ++
                   ["--type-only" | typeOnly]
     (status,out,err) <- readProcessWithExitCode "mueval" options ""
     case status of
       ExitSuccess ->
         case T.lines out of
           [e',typ,value'] | T.pack e == e' -> return (Right (T.pack e,typ,value'))
           _ -> do appendFile "/tmp/tryhaskell-log"
                               (e ++
                                " -> " ++
                                show out ++ " (bad output)" ++
                                "\n")
                   return (Left ("Unable to get type and value of expression: " <> T.pack e))
       ExitFailure{} ->
         case T.lines out of
           [e',_typ,value'] | T.pack e == e' -> return (Left value')
           [e',_typ]        | T.pack e == e' -> return (Left "Evaluation killed!")
           _ ->
             return (Left (out <> if out == "" then err <> " " <> T.pack (show status)  else ""))

