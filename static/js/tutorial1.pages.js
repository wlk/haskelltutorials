// Module for the guide pages
tutorial1.pages = {};

// Unshow a string
tutorial1.pages.unString = function(str){
    return str.replace(/^"(.*)"$/,"$1").replace(/\\"/,'"');
}

// Random message from a list of messages
tutorial1.pages.rmsg = function(choices) {
    return choices[Math.floor((Math.random()*100) % choices.length)];
}

// Simple HTML encoding
tutorial1.pages.htmlEncode = function(text,shy){
    var x = $('<div></div>');
    x.text(text);
    return x.html();
}
tutorial1.pages.isNum = function(result) {
  var retval =
    /(Num|Fractional|Integral|Floating)\s+[a-z]+\s+=>\s+[a-z]+/.test( result.type ) ||
    /\(Ord\s+[a-z]\s*,\s*(Num|Fractional|Integral|Floating)\s+[a-z]+\)\s+=>\s+[a-z]+/.test( result.type ) ||
    result.type == "Integer" ||
    result.type == "Int" ||
    result.type == "Bool";
    return retval;
}

// The nemesis
tutorial1.nemesis = "chirs";

// All pages
tutorial1.pages.list =
    [
        {title:'Tutorial 1: Expressions',
         guide:
         '<div class="indent">' +
         '<h3>Tutorial 1: Expressions</h3>' +
         //title="Click me to insert &quot;start&quot; into the console." style="cursor: pointer;"
         '<p>Type <code>start</code>  at the <span style="color: purple">&#955;</span> prompt to start the tutorial.</p>' +
         '<p>Or try typing any Haskell expression and see what happens.</p>' +
         '<p>To go to the next step in the tutorial use <code>next</code>, to go back use <code>back</code>.</p>' +
         '<p>This tutorial has four sections:</p>'+
         '<ol>'+
         '<li>Integer Expressions (<code>start</code>)</li>'+
         '<li>Syntax of Expressions (<code>step4</code>)</li>'+
         '<li>Functions (<code>step10</code>)</li>'+
         '<li>Equations (<code>step</code>)</li>'+
         '</ol>'+
/*
         '<small class="note">(click to insert)</small>:</p>' +
         '<p>' +
         '<code title="Click me to insert &quot;23 * 36&quot; into the console." style="cursor: pointer;">23 * 36</code> or <code title="Click me to insert &quot;reverse ' +
         '&quot;hello&quot;&quot; into the console." style="cursor: pointer;">reverse ' +
         '"hello"</code> or <code title="Click me to insert &quot;foldr (:) [] [1,2,3]&quot; into the console." style="cursor: pointer;">foldr (:) [] [1,2,3]</code> or <code title="Click me to insert." style="cursor: pointer;">do line <- getLine; putStrLn line</code> or <code>readFile "/welcome"</code>' +
         '</p>' +
         '<p><a href="https://hackage.haskell.org/package/pure-io-0.2.0/docs/PureIO.html#g:2">These</a> IO actions are supported in this app.</p>' +
         '<p><strong>Other cool learning places</strong></pa>' +
         '<p class="clearfix">' +
         'You can also run real Haskell code—file I/O, ' +
         'web apps, and lots more in <a href="https://www.fpcomplete.com/page/project-build">an online IDE</a>. See also the <a href="https://www.fpcomplete.com/school">school of Haskell</a> for practical tutorials.' +
         '</p>' +
         '</div>' +
         */
         '</div>'
        },
        ////////////////////////////////////////////////////////////////////////
        // Lesson 1

        // Simple integer arithmetic
        {lesson:1,
         title:'Integer Expressions',
         guide:
         '<h3>Integer Expressions</h3>'
         + "<p>We start with some simple integer arithmetic. "
         +"At the prompt on the left there you can type in Haskell expressions.</p>"
         +"<p>Type an integer number, e.g. <code>42</code>,  and observe that it evaluates to itself.</p>"
        },
        {
          trigger:tutorial1.pages.isNum, /*function(result){
              return tutorial1.pages.isNum(result);
          },*/
          guide:function(result){
            if (!result) result = {expr:'42',value:42};
            var complied = /\d+/.test(result.expr);//.replace(/ /g,'')=="42";
            var valid = /^[0-9\.\+\-\*\(\)]+\s*$/.test(result.expr);
            var hasdiv = /\//.test(result.expr);
            var who = complied? 'we' : 'you';
            var next_step = "<p>Now type a simple integer arithmetic operation, e.g. <code>6*7</code>, and observe that it evaluates to the expected result.</p>";
            if (valid) {
              if (complied) {
                return "<p>OK, no surprises so far, you got back the number "+result.value+" as expected.</p>"+next_step;
              } else {
                return "<p>OK, you typed something more complicated but it worked, you got back the number "+result.value+" as expected.</p>"+next_step;
              }
            } else {
//                If they used a division
                if (hasdiv) {
/\//
return '<p>'+
"When you use the '/' sign for division, Haskell will treat the numbers as real rather than integer."+next_step;
+'</p>';
                } else {
return '<p>'+
"What you typed does not seem to be a simple integer arithmetic expression, but it looks like it worked all right!"
+'</p>'+next_step;

            }
            }
        }

        },
        // Expression Syntax

        {lesson:2,
         title:'Syntax of Expressions',
         trigger:tutorial1.pages.isNum,
          guide:function(result){
            if (!result) result = {expr:'6*7',value:42};
            var complied = result.expr.replace(/ /g,'')=="42";
            var valid = result.expr.match(/^[0-9\.\+\-\*\(\)]+\s*$/);
            var hasdiv =result.expr.match(/\//);
            var who = complied? 'we' : 'you';
            var next_step =
            "<h3>Syntax of Expressions</h3>"
            +"<p>You can use parenthesis to group subexpressions, "
            +"e.g. <code>(3+4)*6</code>, but they are optional.</p><p>The arithmetic operations have the same precedence as in maths, e.g. <code>3+4*6</code> means <code>3+(4*6)</code>.</p>"
            +"<p>You can let Haskell prove this for you: try <code>3+(4*6) == 3+4*6</code>.</p>";
            return next_step;


        }

        },
        // Expression Syntax - cont'd
        {
          trigger:tutorial1.pages.isNum,
          guide:function(result){
            if (!result) result = {expr:'6*7',value:42};
            var complied = /Bool/.test(result.type);
            var valid = result.expr.match(/^[0-9\.\+\-\*\(\)\s=]+\s*$/);
            var msg="";
            if (valid) {
                msg="<p>So this expression returned "+result.value+" and it illustrates the use of the equality test operator.</p>"+next_step;
            } else {
              msg='<p>'+
              "What you typed did not return True or False but nevermind."
              +'</p>'+next_step;
            }
            var next_step =
            "<p>You can nest as many parentheses as you like (even if it looks silly): <code>((6))*(((7)))</code></p>";
            return msg+next_step;
          }
        },

        // Expression Syntax - Corner cases 1
        {trigger:tutorial1.pages.isNum,
          guide:function(result){
            if (!result) result = {expr:'((6))*(((7)))',value:42};
            tutorial1.continueOnError = true;
            var next_step =
            "<h3>Special Cases</h3><p>There are some special cases, in particular regarding the '-' sign. For example, try <code>4+-3</code>.";
            return next_step;
        }
        },

        // Expression Syntax - Corner cases 2
        {
          trigger:function(result){
              return /^\s+Not\s+in\s+scope:\s+.[\+\-\*\/][\+\-\*\/]./.test(result.error);
          },
          guide:function(result){
          tutorial1.continueOnError = true;
          var matches = result.error.match(/^\s+Not\s+in\s+scope:\s+.([\+\-\*\/][\+\-\*\/])./);
          return   "<p>As you can see, this fails:  Haskell thinks you wanted to use a special operation '"+matches[1]+"'.</p>"
            +"<p>Now, try <code>4+ -3</code> (that's right, just an extra space).</p>";
        }
        },

        // Expression Syntax - Corner cases 3
        {
          trigger:function(result){
            // This is triggered on the previous expression
              return /^\s+Precedence\s+parsing\s+error/.test(result.error);
          },
          guide:function(result){
          tutorial1.continueOnError = true;
          return  "<p>Again, that did not work as expected: Haskell does not allow you to combine 'infix' operations (like 3+4) with 'prefix' operations (like '-4').</p>"+
          "<p>So what should we do? Enclose the infix operation in parentheses: <code>4+(-3)</code></p>";
        }
        },

        // Expression Syntax - Corner case 4
        {
          trigger:tutorial1.pages.isNum,
          guide:function(result){
          tutorial1.continueOnError = false;
          var valid = /[0-9]+\+\-[0-9]+/.test(result.expr);
          var next_step = "<p>And yes, that one worked! So in general it is best to enclose negative numbers with parentheses in expressions. Type <code>next</code> for the next lesson.</p>";
              return next_step;
       }


        },

// Functions
        {lesson:3,
         title:'Functions',
         trigger:function(result){
               return true;
         },

          guide:function(result){
          if (!result) result = {expr:'4+-3',value:1};
          var valid = /[0-9]+\+\-[0-9]+/.test(result.expr);
          var next_step = "<h3>Functions</h3>"
          +"<p>A function has a textual name (e.g. 'abs' or 'sin') rather than an operator.</p><p>It takes argument(s), performs some computation, and produces result(s).</p><p>To use a function in Haskell, you apply it to an argument: write the function followed by the argument, separated by a space.</p><p>For example try <code>abs 7</code>.";
              return next_step;
       }

        },

// Functions (2)
        {
          // We carry on if they typed a function and it evaluated to something numerical
          trigger:function(result){
                     var retval = tutorial1.pages.isNum(result);
                     var retexpr = /^\s*\w+\s+/.test(result.expr);
                     return retval && retexpr;
                },
          guide:function(result){
          if (!result) result = {expr:'abs 7',value:7};
          var valid = /abs\s+[0-9]+/.test(result.expr);
          var msg = "";
          if (valid) {
            msg = "<p>As expected, applying abs to a positive number just returns its value</p>";
          } else  {
            msg = "<p>What you typed was not what I expected, hope you got what you wanted.</p>";
          }
          return msg+"<p>Now let's try a negative number: <code>abs (-3)</code>.</p>";
       },

        },


        // Functions (3)
        {
          trigger:function(result){
            var retval = tutorial1.pages.isNum(result);
            var retexpr = /^\s*\w+\s+/.test(result.expr);
            return retval && retexpr;
          },
          guide:function(result){
            if (!result) result = {expr:'abs -3',value:3};
            var valid = /abs\s+\(\s*\-[0-9]+\s*\)/.test(result.expr);
            var msg = "";
            if (valid) {
              msg = "<p>And indeed, applying abs to a negative number returns the absolute value</p>";
            } else  {
              msg = "<p>What you typed was not what I expected, hope you got what you wanted.</p>";
            }
            return msg+
            "<p>Functions can take several arguments, e.g. min and max take two arguments. The arguments are given after the function,  separated by whitespace.</p><p>For example, <code>min 3 8</code> or <code>max 3 8</code>.</p>";
        }
        },

        // Functions (4)
        {
          trigger:function(result){
            var retval = tutorial1.pages.isNum(result);
            var retexpr = /^\s*\w+\s+/.test(result.expr);
            return retval && retexpr;
          },
          guide:function(result){
            if (!result) result = {expr:'abs -3',value:3};
            var valid = /\w+(\s+[\(\)\-0-9]+)+/.test(result.expr);
            var msg = "";
            if (valid) {
              msg = "<p>See? No need for parentheses!</p>";
            } else  {
              msg = "<p>What you typed was not what I expected, hope you got what you wanted.</p>";
            }
            return msg+'<p>'+
            "To combine functions you need to know their precedence. In Haskel this is simple: Function application binds tighter than anything else. For example, try <code>sqrt 9+7</code>."
            +'</p>';
        }
        },

        // Functions (5)
        {
          trigger:function(result){
            var retval = tutorial1.pages.isNum(result);
            var retexpr = /^\s*\w+\s+/.test(result.expr);
            return retval && retexpr;
          },
          guide:function(result){
            if (!result) result = {expr:'sqrt 9+7',value:10.0};
            var valid = /sqrt\s+\d+\s*[\+\-\*]\s*\d+/.test(result.expr);
            var msg = "";
            if (valid) {
              msg = "<p>Surprised? Haskell interprets this as <code>(sqrt 9)+7</code>, not <code>sqrt (9+7)</code>.</p>";
            } else  {
              msg = "<p>What you typed was not what I expected, hope you got what you wanted.</p>";
            }
            return msg+'<p>'+
            "So now try <code>sqrt (9+7)</code>."
            +'</p>';
        }
      },

      // Functions (6)
      {
        trigger:function(result){
          var retval = tutorial1.pages.isNum(result);
          var retexpr = /^\s*\w+\s+/.test(result.expr);
          return retval && retexpr;
        },
        guide:function(result){
          if (!result) result = {expr:'sqrt (9+7)',value:4.0};
          var valid = /sqrt\s+\(\s*\d+\s*[\+\-\*]\s*\d+\s*\)/.test(result.expr);
          var msg = "";
          if (valid) {
            msg = "<p>That worked as expected!</p>"+
            "<p>So if an argument to a function is an expression, you need to put it in parentheses.</p>";
          } else  {
            msg = "<p>What you typed was not what I expected, hope you got what you wanted.</p>";
          }
          tutorial1.continueOnError=true;
          return msg+'<p>'+
          "So what about combining two functions? Try for example to apply 'min' to 'max 3 4' and '5'."
          +'</p>';
      }
    },

    // Functions (7)
    {
      trigger:function(result){
        // This can generate an error, we should test here against the actual expressions not the results
var retval = /min\s+\d+\s+max\s+\d+\s+\d+/.test(result.expr) ||
/min\s+max\s+\d+\s+\d+\s+\d+/.test(result.expr) ||
/min\s+\(\s*max\s+\d+\s+\d+\s*\)\s+\d+/.test(result.expr) ||
/min\s+\d+\s+\(\s*max\s+\d+\s+\d+\s*\)/.test(result.expr);
        return retval;
      },
      guide:function(result){
var msg="";
                if (/min\s+\d+\s+max\s+\d+\s+\d+/.test(result.expr)) {
msg = "That doesn't work: Haskell thinks you're trying to apply 'min' to 4 arguments.  You need parentheses around the inner function call, e.g. <code>min 5 (max 3 4)</code>.";
                } else if (/min\s+max\s+\d+\s+\d+\s+\d+/.test(result.expr) ) {
                    msg ="That doesn't work: Haskell thinks you're trying to apply 'min' to 4 arguments. You need parentheses around the inner function call, e.g. <code>min (max 3 4) 5</code>.";
                } else if (/min\s+\(\s*max\s+\d+\s+\d+\s*\)\s+\d+/.test(result.expr)) {
                    msg = "Well done, putting parentheses around the inner function call identifies it a a separate expression.";
                } else if (/min\s+\d+\s+\(\s*max\s+\d+\s+\d+\s*\)/.test(result.expr)) {
                    msg = "Well done, putting parentheses around the inner function call identifies it a a separate expression.";
                } else {
                    // should not happen!
                }
        return msg+'<p>'+
        "type <code>next</code> to continue to the next section"
        +'</p>';
    }
  },


    ];

/*
4. Equations
4.1 Equations are used to give names to values, e.g.
<code>answer = 42</code>
CHECK11: /\w+\s*=\s*\d+/
If OK say
"That did not work, sorry. In the interactive interpreter, you need to use the keyword 'let' to indicate that you are writing an equation. Try this: 'let answer = 42'
CHECK12: /let\s+\w+\s*=\s*\d+/
If OK say "OK, nothing happened. Now just type 'answer'"
NOTE: ideally I would capture the name of the variable and use it.
say "Equations give names to values. So now 'answer' is just another name for '42'
Else
CHECK14: /\w+/
say "The name $1 is not yet defined, maybe you mistyped?"
Else
say "Whatever"

4.2
An equation in Haskell is a mathematical equation: it says
  that the left hand side and the right hand side denote the same
  value.
The left hand side should be a name that you're giving a
  value to.

So now you can say 'let double = answer * 2'
CHECK: /let\s+\w+\s*=\s*\w+\s*[\*\+\-\/]\s*\d+/

But not 'let answer = answer * 2'
If you tried it, you see nothing happened. But now try to evaluate 'answer' (by typing 'answer')

This actually creates a loop because you want to name an expression in terms of itself. Reassignment is not allowed in a pure functional language like Haskell.

Other things you can't say is e.g. 'let 2*single=double'
CHECK: /let\s+\d\s*[\+\-\*\/]\s*]\w+\s*=\s*\w+/
if OK say "The LHS must be a name, not an expression"
*/
