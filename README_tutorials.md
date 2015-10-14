# How To Create a New Tutorial

All tutorials must be name `tutorial${tut_no}` with `tut_no` an unsigned integer.
For each tutorial, create following files (e.g. by copying `tutorial1`):

  /static/tutorial${tut_no}.js
  /static/tutorial${tut_no}.pages.js
  /static/css/tutorial${tut_no}.css

Then add them to the `tryhaskell.cabal` build script. But this does not actually work after the fact, so you have to copy the files manually to

  ./.cabal-sandbox/share/x86_64-osx-ghc-7.8.3/tryhaskell-0.0/static/

Also add the tutorial number to the list `tutorials` in `TryHaskell.hs`.

A tutorial consists of a number of lessons, each with a number of steps.

tutorial1.pages.list is the list of all the pages in the tutorial, each page corresponds to a step. The page can be labeled with the attribute 'lesson:$n', this marks the start of the lesson.
Each page has a 'guide' attribute, containing the text to display. Any text labeled <code>...</code> will be inserted into the interpreter.
The guide can also contain the logic to deal with the results of the expression evaluation.
This work as follows: guide defines a function of 'result'. This is a record `{expr:$expr, value:$value, type:$type}`, so you get both the expression and the result of its evaluation. With that you can do whatever you like.
`guide` can also contain an attribute `trigger`, a function of `result` which returns `true` or `false` and is used to determine if the next step can be displayed. So as long as this is not true, you don't go to the next step.

There are some auxiliary functions defined to make life easier:

`rmsg` takes a list of messages to return and selects one at random
`unString` turns a string into a value
`htmlEncode` does what you think it does
