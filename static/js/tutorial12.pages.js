
// Module for the guide pages
tutorial12.pages = {};

// Unshow a string
tutorial12.pages.unString = function(str){
    return str.replace(/^"(.*)"$/,"$1").replace(/\\"/,'"');
}

// Random message from a list of messages
tutorial12.pages.rmsg = function(choices) {
    return choices[Math.floor((Math.random()*100) % choices.length)];
}

// Simple HTML encoding
tutorial12.pages.htmlEncode = function(text,shy){
    var x = $('<div></div>');
    x.text(text);
    return x.html();
}

// Added by WV
tutorial12.pages.isNum = function(result) {
  var retval =
    /(Num|Fractional|Integral|Floating)\s+[a-z]+\s+=>\s+[a-z]+/.test( result.type ) ||
    /\(Ord\s+[a-z]+\s*,\s*(Num|Fractional|Integral|Floating)\s+[a-z]+\)\s+=>\s+[a-z]+/.test( result.type ) ||
    /\((Num|Fractional|Integral|Floating)\s+[a-z]+\s*,\s*Ord\s+[a-z]+\)\s+=>\s+[a-z]+/.test( result.type ) ||
    result.type == "Integer" ||
    result.type == "Int" ||
    result.type == "Bool";
    return retval;
}

// All pages
tutorial12.pages.list =
    [
      {title:'Haskell Interactive Tutorials',
       guide:
       
       '<h3>Haskell Interactive Tutorials</h3>' +
       //title="Click me to insert &quot;start&quot; into the console." style="cursor: pointer;"
       '<p>In this environment you can try out Haskell code or take tutorials that guide you by prompting you to enter pieces of code and give you feedback on them. Each tutorial has its own url,'+
       'e.g. for Tutorial 1.2 it is <a href="'+tutorial12.url+'">'+tutorial12.url+'</a>.</p>'+
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
       '</p>'        
      },
        {title:'Tutorial 1.2: Functions and Lists',
         guide:
//         '<div class="indent">' +
        	 // <span data-step="step3" class="code">HERE</span> 
         '<h3>Tutorial 1.2: The Essentials: Functions and Lists</h3>' +
         '<p>This tutorial will guide you through two essential concepts of the Haskell language: functions and lists. \
         You will learn the syntax, how to create and use functions and lists.</p>'+
         '<p>Type <code>step3</code> at the <span style="color: purple">&#955;</span> prompt to start the first section of the tutorial.</p>' +
         '<p>To go to the next step in the tutorial use <code>next</code>, to go back use <code>back</code>.</p>' +
         '<p>This tutorial has XX sections:</p>'+
         '<ol>'+
         '<li>Defining a Function (<code>step3</code>)</li>'+
         '<li>Functions without a Name: Lambda Functions(<code>step5</code>)</li>'+
         '<li>Lists (<code>step12</code>)</li>'+
         '<li>XX (<code>step19</code>)</li>'+
         '</ol>'
//         +'</div>'
        },
        ////////////////////////////////////////////////////////////////////////
        // Lesson 1

        // Simple integer arithmetic
        {lesson:1,
         title:'Defining a function',
         guide:
         '<h3>Defining a function</h3>'+
        	 '<p>In Haskell, many functions are pre-defined in a standard library called the Prelude.'+
        	 'We have already encountered some of them in the previous tutorial, e.g. <tt>abs</tt>, <tt>max</tt> and <tt>min</tt>.</p>'+

        	 '<p>But the essence of functional programming is defining your own functions to solve your problems!</p>'+

        	 '<p>A function is defined by an equation. There are two ways to define a function. You can either define a named function, e.g.'+

        	 	'<code>f x = x+1</code></p>'+

        	 	'<p>The left hand side (lhs) of the equation looks like a variable – and that’s what it is! '+
        	 	'The right hand side (rhs) is an expression that uses the local variable and defines the result of the expression.</p>'+
        	 	"<p>If you enter the equation above or a similar one, you'll see it does indeed return an expression.</p>"
        },
        {
          trigger:function(result){
              return /Expr/.test(result.type);
          }, 
          guide:function(result){
        	 	return '<p>To use the function, you apply it to an argument, e.g.'+

        	 	'<code>f 3</code>.</p>'

                    }
        },        	 
        
        {
            trigger:tutorial12.pages.isNum,
            guide:function(result){
          	 	return         	 '<p>You can of also define functions with multiple arguments, e.g.'+

        	 	'<code>add3nums x y z = x + y + z</code>.</p>';
            }
        },   
        {
        trigger:function(result){
            return /Expr/.test(result.type);
        }, 
        guide:function(result){
      	 	return '<p>To use it, e.g. <code>10 + 4* add3nums 1 2 3</code>.</p>'   ;
        }
      },      

        // Lambda Functions

        {lesson:2,
         title:'Lambda Functions',
         trigger:tutorial12.pages.isNum,
          guide:function(result){
        	  return '<h3>Functions without a Name: Lambda Functions</h3>'+
        	'<p>You can also define a function without a name, known as a "lambda function" (or "anonymous function" in other languages),'+
        	'for example <code>\\x -> x+1</code>.</p>'+
        	'<p>On the lhs of the arrow you list the arguments, on the rhs the expression.</p>'+
        	
        	'<p>You can use this function straightaway, for example:'+        	  
        	'<code>(\\x -> x+1 ) 4</code>.</p>';
        }
        },
        
        // Lambda Functions - cont'd
        {
          trigger:tutorial12.pages.isNum,
          guide:function(result){
            return "<p>Or you can use an equation to assign the lambda function to a variable: "+

	"<code>fl = \\x -> x+1</code>.</p>";
          }
        },        
        
        
        // Expression Syntax - cont'd
        {
          trigger:function(result){
              return /Expr/.test(result.type);
          }, 
          guide:function(result){
        	  return "<p>In that way you can use it later: <code>fl 4</code>.</p>"+
        	  "<p>You can of course also define lambda functions with multiple arguments, e.g. "+
        	  "<code>add3numsl = \\x y z -> x + y + z</code>"+
        	  "<p>You can use this function in exactly the same way as a named function, e.g. <code>10 + 4* add3numsl 1 2 3</code>.</p>";   
          }
        },

        // Expression Syntax - Corner cases 1
        {lesson:3,
        	title:'Lists',
        	trigger:tutorial12.pages.isNum,
          guide:function(result){
        	  return "<h3>Lists</h3>"+
        	  "<p>A list is a single value that contains several other values. The elements are written in square parentheses, separated by commas, e.g."+
        	  '<code>[2.718, 50.0, -1.0]</code> or <code>[1,2,4,8]</code> or <code>["A","list","of","strings"]</code>.</p>';
        }
        },

        // Expression Syntax - Corner cases 2
        {
          trigger:function(result){
              return /\[\w+\]/.test(result.type);
          },
          guide:function(result){
        	  return "<h3>Function returning several results</h3>"+
              '<p>Actually, a function can return only one result.</p>'+
              '<p>However, lists allow you to package up several values into one object, which can be returned by a function.'+
              'Here is a function <tt>minmax</tt> that returns both the smaller and the larger of two numbers:</p>'+
              '<p><code>minmax = \\x y -> [min x y, max x y]</code></p>'+
              '<p>(You can ignore the error message)</p>'+
              '<p>So, for example <code>minmax 3 8</code> and <code>minmax 8 3</code> both return the list [3,8].</p>';
        }
        },

        // Expression Syntax - Corner cases 3
        {
          trigger:function(result){
            // This is triggered on the previous expression
        	  //*** Here check if they did run that function and return the result, if they didn't just carry on
        	  return /\[\w+\]/.test(result.type);
          },
          guide:function(result){
        	  return "<p>You can write a constant list, e.g. <code>[2,4,6,8]</code>, and as this is a valid expression you can assign it to a variable, e.g."+
        	  '<code>mylist = [2,4,6,8]</code></p>'+
        	  '<p>But the elements of a list can also be expressions, which are evaluated when they are accessed. Suppose you define:</p>'+
        	  '<p><code>answer = 42</code></p>'+
        	  "<p><code>yourlist = [7, answer+1, 7*8]</code></p>";
        }
        },

        // Expression Syntax - Corner case 4
        {
          trigger:function(result){
          
          //*** Here need to check that they actually did something like that, if they did return the result
        	  return /\[\w+\]/.test(result.type);
          },
          
          guide:function(result){
        	  return "<p>Then when you evalue <code>yourlist</code> you get <code>"+result.value+"</code>.</p>";
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
                     var retval = tutorial12.pages.isNum(result);
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
            var retval = tutorial12.pages.isNum(result);
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
            var retval = tutorial12.pages.isNum(result);
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
            var retval = tutorial12.pages.isNum(result);
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
          var retval = tutorial12.pages.isNum(result);
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
          tutorial12.continueOnError=true;
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
    tutorial12.continueOnError=true;
    return msg;
  }
},
{
  trigger:function(result){
    if(result.error && /Evaluation killed/.test(result.error)) {
        // remove the last element from tutorial12.equations!
        var drop = tutorial12.equations.pop();
//        alert(tutorial12.equations);
//        alert(drop);
    }
    return true;
  },
  guide:function(result){
    var msg="<p>If you tried it, you got an error message 'Evaluation killed!'</p>\
    <p>In a pure functional language like Haskell, you can't define a name in terms of itself.</p>\
    <p>And furthermore, you can only assign a name once!</p>\
    <p>For example, try <code>answer = 43</code>.</p>";
    tutorial12.continueOnError=true;
    return msg;
  }
},
{
  trigger:function(result){
    if(result.error && /Conflicting/.test(result.error)) {
        // remove the last element from tutorial12.equations!
        var drop = tutorial12.equations.pop();
//        alert(tutorial12.equations);
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
