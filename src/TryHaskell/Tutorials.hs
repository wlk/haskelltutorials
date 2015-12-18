{-# LANGUAGE ExtendedDefaultRules #-}
{-# LANGUAGE PatternGuards #-}
{-# LANGUAGE ViewPatterns #-}
{-# LANGUAGE GeneralizedNewtypeDeriving #-}
{-# LANGUAGE OverloadedStrings   #-}
{-# OPTIONS -fno-warn-type-defaults #-}

module TryHaskell.Tutorials where

import TryHaskell.BuildPage

import           Control.Concurrent
import           Control.Monad
import           Data.Monoid
import           Lucid
import           Lucid.Bootstrap
import           Snap.Core
import qualified Data.Text as T

-- | The tutorial page.
tut :: Int -> MVar Stats -> Snap ()
tut tut_no stats =
  do void (logVisit stats)
     writeLazyText
       (renderText
          (html_ (do head_ headContent_tut
                     body_ (bodyContent_tut tut_no))))
  where headContent_tut =
          do title_ "Haskell Tutorials -- Interactive tutorials in your browser"
             meta_ [charset_ "utf-8"]
             css "//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css"
             -- css  (T.pack ("/static/css/tutorial"++(show tut_no)++".css"))
             css  (T.pack ("/static/css/tutorial.css"))
             css "//fonts.googleapis.com/css?family=Merriweather"
        css url =
          link_ [rel_ "stylesheet",type_ "text/css",href_ url]          

-- | Content of the body.
bodyContent_tut :: Int -> Html ()
bodyContent_tut tut_no =
  do container_
       (row_ (span12_ (do bodyUsers
                          (bodyHeader_tut tut_no))))
     warningArea
     consoleArea
     bodyFooter_tut
     scripts_tut tut_no

-- | The header.
bodyHeader_tut :: Int -> Html ()
bodyHeader_tut tut_no =
  div_ [class_ "haskell-icon-container"]
       (a_ [href_ (T.pack ("/tutorial"++(show tut_no)))]
           (table_ (tr_ (do td_ (img_ [src_ "/static/UoG_colour.png", alt_ "[U. Glasgow logo]", width_ "220"])
                            td_ [class_ "try-haskell"] " Haskell Tutorials "
                            td_ (p_ [class_ "haskell-icon"] mempty)))))

-- | The footer with links and such.
bodyFooter_tut :: Html ()
bodyFooter_tut =
  footer_ (container_ (row_ (span12_ (p_ [class_ "muted credit"] links))))
  where links =
          do a_ [href_ "http://github.com/wimvanderbauwhede/tryhaskell"] "@HaskellMOOC variant of TryHaskell"
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
scripts_tut :: Int -> Html ()
scripts_tut tut_no =
  do 
     let 
        tut_pages_js_str = T.pack $ "/static/js/tutorial"++(show tut_no)++".pages.js"
        tut_js_str = T.pack $  "/static/js/tutorial"++(show tut_no)++".js"
     script_ [src_ "//code.jquery.com/jquery-2.0.3.min.js"] ""
     -- script_ [src_ "/static/js/jquery-2.0.3.js"] ""
     script_ [src_ "/static/js/jquery.console.js"] ""
     script_ [src_ tut_js_str] ""
     script_ [src_ tut_pages_js_str ] ""
     script_ "var gaJsHost = ((\"https:\" == document.location.protocol) ? \"https://ssl.\" : \"http://www.\");\
              \document.write(unescape(\"%3Cscript src='\" + gaJsHost + \"google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E\"));"
     script_ "try {\
              \var pageTracker2 = _gat._getTracker(\"UA-7443395-14\");\
              \pageTracker2._setDomainName(\"none\");\
              \pageTracker2._setAllowLinker(true);\
              \pageTracker2._trackPageview(location.pathname + location.search + location.hash);\
              \window.ga_tracker = pageTracker2;\
              \} catch(err) {}"              
