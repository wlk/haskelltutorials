{-# LANGUAGE ExtendedDefaultRules #-}
{-# LANGUAGE PatternGuards #-}
{-# LANGUAGE ViewPatterns #-}
{-# LANGUAGE GeneralizedNewtypeDeriving #-}
{-# LANGUAGE OverloadedStrings   #-}
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

module TryHaskell.BuildPage where

import           Control.Concurrent
import           Control.Monad
import           Control.Monad.Trans
import           Data.ByteString (ByteString)
import           Data.HashMap.Strict (HashMap)
import qualified Data.HashMap.Strict as M    
import           Data.Monoid
import           Data.Time
import           Lucid
import           Lucid.Bootstrap
import           Prelude hiding (div,head)
import           Snap.Core

data Stats = Stats
  { statsUsers :: !(HashMap ByteString UTCTime) }

-- | Log the current user's visit to the stats table.
logVisit :: MVar Stats -> Snap ByteString
logVisit stats =
  do ipHeaderFilter
     addr <- fmap rqRemoteAddr getRequest
     now <- liftIO getCurrentTime
     let updateStats (Stats u) = Stats (M.insert addr now u)
     liftIO (modifyMVar_ stats (return . updateStats))
     return addr

-- | The home page.
home :: MVar Stats -> Snap ()
home stats =
  do void (logVisit stats)
     writeLazyText
       (renderText
          (html_ (do head_ headContent
                     body_ bodyContent)))
  where headContent =
          do title_ "Try Haskell! An interactive tutorial in your browser"
             meta_ [charset_ "utf-8"]
             css "//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css"
             css "/static/css/tryhaskell.css"
             css "//fonts.googleapis.com/css?family=Merriweather"
        css url =
          link_ [rel_ "stylesheet",type_ "text/css",href_ url]
          
-- | Content of the body.
bodyContent :: Html ()
bodyContent =
  do container_
       (row_ (span12_ (do bodyUsers
                          bodyHeader)))
     warningArea
     consoleArea
     bodyFooter
     scripts

-- | The active users display.
bodyUsers :: Html ()
bodyUsers =
  div_ [class_ "active-users"]
       (div_ "Active users")

-- | The header.
bodyHeader :: Html ()
bodyHeader =
  div_ [class_ "haskell-icon-container"]
       (a_ [href_ "/"]
           (table_ (tr_ (do td_ (p_ [class_ "haskell-icon"] mempty)
                            td_ [class_ "try-haskell"] "Try Haskell"))))

-- | An area for warnings (e.g. cookie warning)
warningArea :: Html ()
warningArea =
  div_ [class_ "warnings"]
       (container_
          (row_ (do span6_ [hidden_ "",id_ "cookie-warning"]
                           (div_ [class_ "alert alert-error"]
                                 "Cookies are required. Please enable them.")
                    span6_ [hidden_ "",id_ "storage-warning"]
                           (div_ [class_ "alert alert-error"]
                                 "Local storage is required. Please enable it."))))

-- | The white area in the middle.
consoleArea :: Html ()
consoleArea =
  div_ [class_ "console"]
       (container_
          (row_ (do span6_ [id_ "console"] mempty
                    span6_ [id_ "guide"] mempty)))

-- | The footer with links and such.
bodyFooter :: Html ()
bodyFooter =
  footer_ (container_ (row_ (span12_ (p_ [class_ "muted credit"] links))))
  where links =
          do a_ [href_ "http://github.com/chrisdone/tryhaskell"] "Try Haskell"
             " by "
             a_ [href_ "http://twitter.com/christopherdone"] "@christopherdone"
             ", concept inspired by "
             a_ [href_ "http://tryruby.org/"] "Try Ruby"
             ", Haskell evaluator powered by Gwern Branwen's "
             a_ [href_ "http://hackage.haskell.org/package/mueval"] "Mueval"
             ",  and console by "
             a_ [href_ "http://github.com/chrisdone/jquery-console"] "jquery-console"
             "."   

-- | Scripts; jquery, console, tryhaskell, ga, the usual.
scripts :: Html ()
scripts =
  do script_ [src_ "//code.jquery.com/jquery-2.0.3.min.js"] ""
     script_ [src_ "/static/js/jquery.console.js"] ""
     script_ [src_ "/static/js/tryhaskell.js"] ""
     script_ [src_ "/static/js/tryhaskell.pages.js"] ""
     script_ "var gaJsHost = ((\"https:\" == document.location.protocol) ? \"https://ssl.\" : \"http://www.\");\
              \document.write(unescape(\"%3Cscript src='\" + gaJsHost + \"google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E\"));"
     script_ "try {\
              \var pageTracker2 = _gat._getTracker(\"UA-7443395-14\");\
              \pageTracker2._setDomainName(\"none\");\
              \pageTracker2._setAllowLinker(true);\
              \pageTracker2._trackPageview(location.pathname + location.search + location.hash);\
              \window.ga_tracker = pageTracker2;\
              \} catch(err) {}"
         
