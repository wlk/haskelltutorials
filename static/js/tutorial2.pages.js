
// Module for the guide pages
tutorial2.pages = {};

// Unshow a string
tutorial2.pages.unString = function(str){
    return str.replace(/^"(.*)"$/,"$1").replace(/\\"/,'"');
}

// Random message from a list of messages
tutorial2.pages.rmsg = function(choices) {
    return choices[Math.floor((Math.random()*100) % choices.length)];
}

// Simple HTML encoding
tutorial2.pages.htmlEncode = function(text,shy){
    var x = $('<div></div>');
    x.text(text);
    return x.html();
}

// Added by WV
tutorial2.pages.isNum = function(result) {
  var retval =
    /(Num|Fractional|Integral|Floating)\s+[a-z]+\s+=>\s+[a-z]+/.test( result.type ) ||
    /\(Ord\s+[a-z]+\s*,\s*(Num|Fractional|Integral|Floating)\s+[a-z]+\)\s+=>\s+[a-z]+/.test( result.type ) ||
    /\((Num|Fractional|Integral|Floating)\s+[a-z]+\s*,\s*Ord\s+[a-z]+\)\s+=>\s+[a-z]+/.test( result.type ) ||
    result.type == "Integer" ||
    result.type == "Int" ||
    result.type == "Bool";
    return retval;
}

tutorial2.pages.isBool = function(result) {
    return (result.type == "Bool");
}


    


// All pages
tutorial2.pages.list =
    [
      {title:'Haskell Interactive Tutorials',
       guide:
       '<div class="indent">' +
       '<h3>Haskell Interactive Tutorials</h3>' +
       //title="Click me to insert &quot;start&quot; into the console." style="cursor: pointer;"
       '<p>In this environment you can try out Haskell code or take tutorials that guide you by prompting you to enter pieces of code and give you feedback on them. Each tutorial has its own url, e.g. for Tutorial 1 it is <a href="'+tutorial2.url+'">'+tutorial2.url+'</a>.</p>'+
       '<br>'+
       '<p>This coding environment does not offer all the functionality of the Haskell compiler <tt>ghc</tt> or the interactive Haskell interpreter <tt>ghci</tt>, because that would allow hackers to compromise your computer. Any feature that could potentially be a security risk has been disabled.</p>'+
       '<p>Only <a href="https://hackage.haskell.org/package/pure-io-0.2.0/docs/PureIO.html#g:2">these</a> IO actions are supported in this app (more about this later in the course).</p>' +
       '<p>Type <code>start</code>  at the <span style="color: purple">&#955;</span> prompt to start the tutorial.</p>' +
       '<p>Or try typing any Haskell expression and see what happens.' +
       '<small class="note">(click to insert)</small>:</p>' +
       '<p>' +
       '<code title="Click me to insert &quot;23 * 36&quot; into the console." style="cursor: pointer;">23 * 36</code> or <code title="Click me to insert &quot;reverse ' +
       '&quot;hello&quot;&quot; into the console." style="cursor: pointer;">reverse ' +
       '"hello"</code> or <code title="Click me to insert &quot;foldr (:) [] [1,2,3]&quot; into the console." style="cursor: pointer;">foldr (:) [] [1,2,3]</code> or <code title="Click me to insert." style="cursor: pointer;">do line <- getLine; putStrLn line</code> or <code>readFile "/welcome"</code>' +
       '</p>' +

       '</div>'
      },
        {title:'Tutorial 2: Booleans and Lists',
         guide:
         '<div class="indent">' +
         '<h3>Tutorial 2: Booleans and Lists</h3>' +
         '<p>Let\'s get some more experience with Boolean values and expressions.</p>'+
         '<p>To go to the next step in the tutorial use <code>next</code>, to go back use <code>back</code>.</p>' +
         '</div>'
        },
        ////////////////////////////////////////////////////////////////////////
        // Lesson 1

        // Simple integer arithmetic
        {lesson:1,
         title:'Boolean Expressions',
         guide:
         '<h3>Boolean Equality</h3>'
         + "<p>Like many other languages, the double-equals operator == is used for testing value equality. "
         +"<p>Type an integer equality test, e.g. <code>42==42</code>,  and observe that it evaluates to True.</p>"
        },
        {
          trigger:tutorial2.pages.isBool, 
          guide:function(result){
            if (!result) result = {expr:'42==42',value:'True'};
            var rexpr = result.expr.replace(/^let\s.+\sin\s+/, "");
            var complied = /True/.test(result.value);            
            var valid = /True|False/.test(result.value);
            var next_step = "<p>Now compare two different integer values for equality, e.g. <code>1 == 2</code>, and observe that the result is False.</p>";
            if (valid) {
              if (complied) {
                return "<p>OK, no surprises so far, you got back the truth value "+result.value+" as expected.</p>"+next_step;
              } else {
                return "<p>OK, you compared two values that are not equal, so you got back the truth value "+result.value+" as you would expect.</p>"+next_step;
              }
            } else {
                return '<p>'+
                    "What you typed does not seem to be a simple integer arithmetic expression, but it did something sensible!"
                    +'</p>'+next_step;
		
            }
          }

        },
        // Compare for inequality now
        {lesson:2,
         title:'The not-equals operator',
         trigger:tutorial2.pages.isBool,
           guide:function(result){
            if (!result) result = {expr:'1==2',value:'False'};
            var complied = /False/.test(result.value);            
            var valid = /True|False/.test(result.value);
            var next_step =
            "<h3>The not-equals operator</h3>"
            +"<p>Use the /= operator (it's supposed to look like an equals sign with a line through it), to test for inequality, "
            +"e.g. <code>1 /= 2</code>. </p>";
            if (valid) {
		if (complied) {
                    return "<p>OK, no surprises so far, you got back the truth value "+result.value+" as expected.</p>"+next_step;
		} else {
                    return "<p>OK, you compared two values that are not equal, so you got back the truth value "+result.value+" as you would expect.</p>"+next_step;
		}
            } else {
                return '<p>'+
                    "What you typed does not seem to be a simple integer arithmetic expression, but it did something sensible!"
                    +'</p>'+next_step;
		
            }
           }
        },
        
        // Expression Syntax - cont'd
        {
         trigger:tutorial2.pages.isBool,
          guide:function(result){
	      tutorial2.continueOnError = true;
            return "<p>You can apply these operations to other data types. Try comparing two Strings for equality, e.g. <code>\"hello\" == \"hola\"</code>.</p>";
          }
        },

	{
	 // this is a complex trigger - looking for an error or a correctly typed result!
         trigger:function(result) {
	     variableError = /^Not\s+in\s+scope/.test(result.error)
	     missingQuoteError = /lexical\s+error\s+in\s+string/.test(result.error)
	     booleanResult = result.type == "Bool";
	     return variableError || missingQuoteError || booleanResult
	 },
         guide:function(result){
	     msg = "";
	     if (/^Not\s+in\s+scope/.test(result.error)) {
		 msg = "<p>Did you forget to use double quotes \" \" around your strings? If so, Haskell thinks that you are referring to named values (like program variables)???"
	     }
	     if (/lexical\s+error\s+in\s+string/.test(result.error)) {
		 msg = "<p>Did you forget a double quote \" at the beginning or end of one of your strings?"
	     }
             tutorial2.continueOnError = false;
             return   msg + "<p> Now try String inequality <code>\"foo\" /= \"bar\"</code></p>";
         }
        },

        {
         trigger:tutorial2.pages.isBool,
          guide:function(result){
            return "<p>You can apply these operations to other data types. You might also try comparing two Bools directly, e.g. <code>True /= False</code>.</p>";
          }
        },

        
        
        // Expression Syntax - cont'd
        {
          trigger:tutorial2.pages.isBool,
          guide:function(result){
            if (!result) result = {expr:'True/=False',value:'True'};
            var complied = /Bool/.test(result.type);            
            var rexpr = result.expr.replace(/^let\s.+\sin\s+/, "");
            var valid = /True|False/.test(rexpr);
            
            var msg="";
            if (valid) {
                msg="<p>So this expression returned "+result.value+", illustrating the use of the equality test operator.</p>";
            } 
            var next_step =
		  "<p>Now, what happens if you try to compare two values with different types? e.g. <code>True == 1</code>.";
	      tutorial2.continueOnError = true;
            return msg+next_step;
          }
        },

        // Expression Syntax - Corner cases 2
        {
          trigger:function(result){
	      var typeError =
		  (/^\s+Couldn\'t\s+match\s+expected\s+type/.test(result.error)) || 
		  (/^\s+No\s+instance\s+for/.test(result.error));
              return typeError;
          },
          guide:function(result){
          tutorial2.continueOnError = false;
          return   "<p>As you can see, this equality test fails:  Haskell cannot compare two values that have <em>different types</em>. The full story is more complex, but for now, we can see that types <em>limit</em> the operations we can apply to particular values.</p>" +
		  "<p>Haskell supports the standard comparison/relational operators, <, <=, >, >=. Try a simple comparison, e.g. <code>10 &gt; 9</p>";
        }
        },

        // Expression Syntax - Corner cases 3
        {
          trigger:tutorial2.pages.isBool,
          guide:function(result){
          return  "<p>Note that relational operators also work on lists, in a dictionary-order manner (lexicographic). e.g. Try <code>[1,2,3] &lt; [1,2,3,4]</p>";
        }
        },

// should we talk about string comparisons, 
// about Eq class?

        {
          trigger:tutorial2.pages.isBool,
          guide:function(result){
          tutorial2.continueOnError = false;
          var next_step = "<p>Now let's think about list membership. We want a boolean function that returns true if a value is part of a list, and false otherwise. This is the elem function. Try <code>elem 1 [1,2,3]</code></p>";
              return next_step;
	}
        },

	{
	  trigger:tutorial2.pages.isBool,
	  guide:function(result){
            if (!result) result = {expr:'elem 1 [1,2,3]',value:'True'};
            var complied = /Bool/.test(result.type);            
            var rexpr = result.expr.replace(/^let\s.+\sin\s+/, "");
            var valid = /True|False/.test(result.value);
            var matches = rexpr.match(/^\s*elem\s+([0-9]+) (\[[^\]]*\])/);
	    var element = matches[1];
            var msg="<p>The element " + element + " is " + (result.value)?"":" not " + "part of the list.";
	    var next_step = msg + "<p>The elem function can be written infix, like an arithmetic operator, by enclosing its name in backquotes ``. Try <code>3.1 `elem` [1.2, 2.3, 3.1, 4.5]</code>."
            return next_step;
	      
	}
	},
	{
	  trigger:tutorial2.pages.isBool,
	  guide:function(result){
	      var msg ="<p>In fact, Haskell permits any two-argument function to be written as an infix operator using backquote characters.";
	      return msg;
          }
        },

// List membership
        {lesson:3,
         title:'Functions',
         trigger:function(result){
               return true;
         },

          guide:function(result){
          if (!result) result = {expr:'4+-3',value:1};
          var rexpr = result.expr.replace(/^let\s.+\sin\s+/, "");
          var valid = /[0-9]+\+\-[0-9]+/.test(rexpr);
          var next_step = "<h3>Functions</h3>"
          +"<p>A function has a textual name (e.g. 'abs' or 'sin') rather than an operator.</p><p>It takes argument(s), performs some computation, and produces result(s).</p><p>To use a function in Haskell, you apply it to an argument: write the function followed by the argument, separated by a space.</p><p>For example try <code>abs 7</code>.";
              return next_step;
       }

        },

// Functions (2)
        {
          // We carry on if they typed a function and it evaluated to something numerical
          trigger:function(result){
                     var retval = tutorial2.pages.isNum(result);
                     var retexpr = /^\s*\w+\s+/.test(result.expr);
                     return retval && retexpr;
                },
          guide:function(result){
          if (!result) result = {expr:'abs 7',value:7};
          var rexpr = result.expr.replace(/^let\s.+\sin\s+/, "");
          var valid = /abs\s+[0-9]+/.test(rexpr);
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
            var retval = tutorial2.pages.isNum(result);
            var retexpr = /^\s*\w+\s+/.test(result.expr);
            return retval && retexpr;
          },
          guide:function(result){
            if (!result) result = {expr:'abs -3',value:3};
            var rexpr = result.expr.replace(/^let\s.+\sin\s+/, "");
            var valid = /abs\s+\(\s*\-[0-9]+\s*\)/.test(rexpr);
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
            var retval = tutorial2.pages.isNum(result);
            var retexpr = /^\s*\w+\s+/.test(result.expr);
            return retval && retexpr;
          },
          guide:function(result){
            if (!result) result = {expr:'abs -3',value:3};
            var rexpr = result.expr.replace(/^let\s.+\sin\s+/, "");
            var valid = /\w+(\s+[\(\)\-0-9]+)+/.test(rexpr);
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
            var retval = tutorial2.pages.isNum(result);
            var retexpr = /^\s*\w+\s+/.test(result.expr);
            return retval && retexpr;
          },
          guide:function(result){
            if (!result) result = {expr:'sqrt 9+7',value:10.0};
            var rexpr = result.expr.replace(/^let\s.+\sin\s+/, "");
            var valid = /sqrt\s+\d+\s*[\+\-\*]\s*\d+/.test(rexpr);
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
          var retval = tutorial2.pages.isNum(result);
          var retexpr = /^\s*\w+\s+/.test(result.expr);
          return retval && retexpr;
        },
        guide:function(result){
          if (!result) result = {expr:'sqrt (9+7)',value:4.0};
          var rexpr = result.expr.replace(/^let\s.+\sin\s+/, "");
          var valid = /sqrt\s+\(\s*\d+\s*[\+\-\*]\s*\d+\s*\)/.test(rexpr);
          var msg = "";
          if (valid) {
            msg = "<p>That worked as expected!</p>"+
            "<p>So if an argument to a function is an expression, you need to put it in parentheses.</p>";
          } else  {
            msg = "<p>What you typed was not what I expected, hope you got what you wanted.</p>";
          }
          tutorial2.continueOnError=true;
          return msg+'<p>'+
          "So what about combining two functions? Try for example to apply 'min' to 'max 3 4' and '5'."
          +'</p>';
      }
    },

    // Functions (7)
    {
      trigger:function(result){
    	  var rexpr = result.expr.replace(/^let\s.+\sin\s+/, "");
    	  alert(rexpr);
        // This can generate an error, we should test here against the actual expressions not the results
var retval = /m(in|ax)\s+\d+\s+m(in|ax)\s+\d+\s+\d+/.test(rexpr) ||
/m(in|ax)\s+m(in|ax)\s+\d+\s+\d+\s+\d+/.test(rexpr) ||
/m(in|ax)\s+\(\s*m(in|ax)\s+\d+\s+\d+\s*\)\s+\d+/.test(rexpr) ||
/m(in|ax)\s+\d+\s+\(\s*m(in|ax)\s+\d+\s+\d+\s*\)/.test(rexpr);
        return retval;
      },
      guide:function(result){
    	  var rexpr = result.expr.replace(/^let\s.+\sin\s+/, "");
var msg="";
                if (/min\s+\d+\s+max\s+\d+\s+\d+/.test(rexpr)) {
msg = "That doesn't work: Haskell thinks you're trying to apply 'min' to 4 arguments.  You need parentheses around the inner function call, e.g. <code>min 5 (max 3 4)</code>.";
                } else if (/min\s+max\s+\d+\s+\d+\s+\d+/.test(rexpr) ) {
                    msg ="That doesn't work: Haskell thinks you're trying to apply 'min' to 4 arguments. You need parentheses around the inner function call, e.g. <code>min (max 3 4) 5</code>.";
                } else if (/min\s+\(\s*max\s+\d+\s+\d+\s*\)\s+\d+/.test(rexpr)) {
                    msg = "Well done, putting parentheses around the inner function call identifies it a a separate expression.";
                } else if (/min\s+\d+\s+\(\s*max\s+\d+\s+\d+\s*\)/.test(rexpr)) {
                    msg = "Well done, putting parentheses around the inner function call identifies it a a separate expression.";
                } else {
                    // should not happen!
                }
        return msg+'<p>'+
        "type <code>next</code> to continue to the next section"
        +'</p>';
    }
  },
// Equations
{lesson:4,
 title:'Equations',
 trigger:function(result){
       return true;
 },
 guide:function(result){


var msg="<h3>Equations</h3>"
+"<p>Equations are used to give names to values, e.g. <code>answer = 42</code>.</p>";
return msg;
}
},

{
  trigger:function(result){
    // alert(result.expr);
    var retval = /\w+\s*=[^=><]/.test(result.expr);
    // alert(retval);
    return retval;
  },
  guide:function(result){
    // So here we know it was an assignment
    var msg="<p>OK, you've defined an equation, now let's use it. Just type <code>answer</code>.</p>";
    return msg;
  }
},

{
  trigger:function(result){
    return true;
  },
  guide:function(result){
    var msg= "<p>Equations give names to values. So now 'answer' is just another name for '42'</p>"
    +"<p>An equation in Haskell is a mathematical equation: it says\
      that the left hand side and the right hand side denote the same\
      value.</p>\
    <p>The left hand side should be a name that you're giving a\
      value to.</p>\
      <p>So now you can say <code>double = answer * 2</code>.</p>";
      return msg;
  }
},

{
  trigger:function(result){
    var retval = /\w+\s*=\s*\w+\s*[\*\+\-\/]\s*\d+/.test(result.expr);
    return retval;
  },
  guide:function(result){
    var msg="But you can't say <code>answer = answer * 2</code>!";
    tutorial2.continueOnError=true;
    return msg;
  }
},
{
  trigger:function(result){
    if(result.error && /Evaluation killed/.test(result.error)) {
        // remove the last element from tutorial2.equations!
        var drop = tutorial2.equations.pop();
//        alert(tutorial2.equations);
//        alert(drop);
    }
    return true;
  },
  guide:function(result){
    var msg="<p>If you tried it, you got an error message 'Evaluation killed!'</p>\
    <p>In a pure functional language like Haskell, you can't define a name in terms of itself.</p>\
    <p>And furthermore, you can only assign a name once!</p>\
    <p>For example, try <code>answer = 43</code>.</p>";
    tutorial2.continueOnError=true;
    return msg;
  }
},
{
  trigger:function(result){
    if(result.error && /Conflicting/.test(result.error)) {
        // remove the last element from tutorial2.equations!
        var drop = tutorial2.equations.pop();
//        alert(tutorial2.equations);
//        alert(drop);
    }
    return true;
  },
  guide:function(result){
	  if(/Conflicting/.test(result.error)) {
    var msg="<p>As you can see, you get an error 'Conflicting assignments'</p>" +
    		"<p>Reassignment is not allowed, variables are what is called 'immutable'.</p>" +
    		"<p>This is a very important property because it means that you can always, anywhere in a program, replace a variable with its corresponding expression.</p>" +
    		"<p>Please type <code>next</code> to continue to the recap page.</p>";
    return msg;
	  } else {
		  
	  }
  },
},
{
	  trigger:function(result){
	    return true;
	  },
	  guide:function(result){
		  
	    var msg="<h3>And that's the end of Tutorial 1!</h3>" +
	    		"<p>Well done, you finished your first Haskell tutorial!.</p>" +
	    		"<p>Let's recap what we've learned:</p>" +
	            '<ol>'+
	            '<li>Expressions: evaluate mathematical expressions, operators, rules of precedence and role of parenthese, infix and prefix operations.</li>'+	            
	            '<li>Functions: calling existing functions, combining them and including them in expressions.</li>'+
	            '<li>Equations: naming expressions using assignments, immutable variables.</li>'+
	            '</ol>';

	    return msg;
	  },
	},

    ];
