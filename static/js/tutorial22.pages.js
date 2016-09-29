var thistutorial = tutorial22;
// Module for the guide pages
tutorial22.pages = {};

// Unshow a string
tutorial22.pages.unString = function(str){
    return str.replace(/^"(.*)"$/,"$1").replace(/\\"/,'"');
}

// Random message from a list of messages
tutorial22.pages.rmsg = function(choices) {
    return choices[Math.floor((Math.random()*100) % choices.length)];
}

// Simple HTML encoding
tutorial22.pages.htmlEncode = function(text,shy){
    var x = $('<div></div>');
    x.text(text);
    return x.html();
}

// Added by WV
tutorial22.pages.isNum = function(result) {
  var retval =
    /(Num|Fractional|Integral|Floating)\s+[a-z]+\s+=>\s+[a-z]+/.test( result.type ) ||
    /\(Ord\s+[a-z]+\s*,\s*(Num|Fractional|Integral|Floating)\s+[a-z]+\)\s+=>\s+[a-z]+/.test( result.type ) ||
    /\((Num|Fractional|Integral|Floating)\s+[a-z]+\s*,\s*Ord\s+[a-z]+\)\s+=>\s+[a-z]+/.test( result.type ) ||
    result.type == "Integer" ||
    result.type == "Int" ||
    result.type == "Bool";
    return retval;
}

tutorial22.pages.isBool = function(result) {
    return (result.type == "Bool");
}


    


// All pages
tutorial22.pages.list =
    [
      
        {title:'Tutorial 2.2: More Boolean Operations',
         guide:
         
         '<h3>Tutorial 2.2: More Boolean Operations</h3>' +
         '<p>We are going to look at further operations on boolean values in this session.</p>'+
         '<p>To start the tutorial type <code>next</code> at the <span style="color: purple">&#955;</span> prompt.</p>' +
         '<p>For help about the tutorial environment type <code>help</code> at the <span style="color: purple">&#955;</span> prompt.</p>' 
         
        },
        ////////////////////////////////////////////////////////////////////////
        // Lesson 1

        // Simple boolean operators
        {lesson:1,
         title:'Boolean Negation',
         guide:
         '<h3>Boolean Negation</h3>'
         + "<p>Boolean values are either True or False. True is the opposite of False, and vice versa. The not function returns the opposite boolean value, the logical complement. Try <code>not True</code></p>"
        },
        {
          trigger:tutorial22.pages.isBool, 
          guide:function(result){
            if (!result) result = {expr:'not True',value:'False'};
            var rexpr = result.expr.replace(/^let\s.+\sin\s+/, "");
            var complied = /False/.test(result.value);            
            var valid = /True|False/.test(result.value);

	    var msg = "";
            if (valid) {
              if (complied) {
                msg = "<p>You got back the boolean value "+result.value+" as expected.</p>";
              } else {
		var trimmedExpr = result.expr.replace(/^let\s.+\sin\s+/, "");
                msg = '<p>OK, you calculated <code>' + trimmedExpr +'</code>,so you got back the truth value '+result.value+' as you would expect.</p>';
              }
            } else {
                msg = '<p>'+
                    "What you typed does not seem to be a simple boolean operation but it did something sensible!"
                    +'</p>';
		
            }
            tutorial22.continueOnError = true;
	    var next_step = "<p>Now perform a double negation, e.g. <code> not (not False)</code> and observe that the final result is the same as the initial value.</p>";
	      return msg + next_step;

          }

        },
        // && and ||
        {lesson:2,
         title:'Boolean And',
         trigger:function(result){
	   bracketError = /applied\s+to\s+two\s+arguments/.test(result.error);
	   booleanResult = result.type === "Bool";
           return bracketError || booleanResult;
	 },
         guide:function(result){
           var msg = "";
	   if (/applied\s+to\s+two\s+arguments/.test(result.error)) {
	       msg = msg + "<p>Remember to use brackets round the innermost not function call, since this must be evaluated first: <code>not (not True)</code></p>."
	   }
           else {
               msg = msg +  "<p>You got back the boolean value "+result.value+" as expected.</p>";
           }
           var next_step =
            "<h3>The And operator</h3>"
            +"<p>Use the && infix operator as a boolean conjunction (AND function). This only evaluates to True when both its inputs are True."
            +"i.e. <code>True && True</code>. </p>";
	   return msg + next_step;
	 }
        },

        {
         trigger:function(result){
             // user did &&, result is boolean True
             andFunction = /\&\&/.test(result.expr);
	     booleanResult = result.type === "Bool";
             trueResult =  /True/.test(result.value);
             return andFunction && booleanResult && trueResult;
         },
         guide:function(result){
             var msg = "<p>You got back the result " + result.value + " as expected.</p>";
             var next_step = "<p>Now try evaluating an AND expression where one of the inputs is False, e.g. <code>False && True</code>. What will the output value be?</p>";
             return msg + next_step;
         }
        },

	{
         trigger:function(result) {
             // user did &&, result is boolean False
             andFunction = /\&\&/.test(result.expr);
	     booleanResult = result.type === "Bool";
             falseResult =  /False/.test(result.value);
             return andFunction && booleanResult && falseResult;
	 },
         guide:function(result){
             var msg = "<p>You got back the result " + result.value + " as expected.</p>";
             var next_step = "<h3>The Or operator</h3>"
             + "<p>Boolean disjunction (logical OR) is the dual of the AND operation. In Haskell, use the infix || operator for OR. When at least one of the inputs is True, then the output of OR will be True. Try <code>True || False</code>.</p>";
             return msg + next_step;
         }
        },

	{
         trigger:function(result) {
             // user did ||, result is boolean True
             orFunction = /\|\|/.test(result.expr);
	     booleanResult = result.type === "Bool";
             orResult =  /True/.test(result.value);
             return orFunction && booleanResult && orResult;
	 },
         guide:function(result){
             var msg = "<p>You got back the result " + result.value + " as expected.</p>";
             var next_step = "<p>When both of the inputs are False, then the output of OR will be False. Try <code>False || False</code>.</p>";
             return msg + next_step;
         }
        },

	{
         trigger:function(result) {
             // user did ||, result is boolean False
             orFunction = /\|\|/.test(result.expr);
	     booleanResult = result.type === "Bool";
             orResult =  /False/.test(result.value);
             return orFunction && booleanResult && orResult;
	 },
         guide:function(result){
             var msg = "<p>You got back the result " + result.value + " as expected.</p>";
             var next_step = "<h3>Exclusive OR</h3>"
                 + "<p>Haskell also defines the xor function, which returns true when its two boolean arguments are different (one is True and the other is False). Try <code>True `xor` False</code>. (Notice that we specify xor as an infix function with the backquotes here.)</p>";
             return msg + next_step;
         }
        },
        
        
        {
         trigger:function(result) {
             // user did xor, result is boolean False
             xorFunction = /xor/.test(result.expr);
	     booleanResult = result.type === "Bool";
             xorResult =  /True/.test(result.value);
             return xorFunction && booleanResult && xorResult;
	 },
         guide:function(result){
            return "<p>It's straightforward to enumerate the full truth table for two-input boolean functions. We could use a list comprehension expression to enumerate the input values: <code>[(x,y) | x<-[False, True], y<-[False, True]]</code>. Then we could map the boolean function over these input values (extracted from the pairs). For instance, here are the enumerated output values for the xor function: <code>map (\\inputs -> xor (fst inputs) (snd inputs)) [(x,y) | x<-[False, True], y<-[False, True]]</code>.</p>";
          }
        },

        {
         trigger:function(result) {
             // user did map, result is a boolean list
             mapFunction = /map/.test(result.expr);
	     boolListResult = result.type === "[Bool]";
             return mapFunction && boolListResult;
	 },
         guide:function(result){
             return "<h3>Logic Operations with More Inputs</h3>"
                 + "<p>Sometimes, boolean logic functions like AND and OR have more than two inputs. Haskell supports these multi-input boolean operations with and and or functions that take a list of boolean values as a single input. Effectively, this is a fold of the && or || operator over the input list of boolean values.</p>"
                 + "<p>Try <code>and [False, True, False, True]</code> or <code>or [True, True, False]</code>, for instance.</p>";
          }
        },

        {
         trigger:function(result) {
             // user did and or or, result is a boolean
             logicFunction = (/and/.test(result.expr)) || (/or/.test(result.expr));
	     booleanResult = result.type === "Bool";
             return logicFunction && booleanResult;
	 },
         guide:function(result){
             var msg = "<p>You got back the result " + result.value + " as expected.</p>";
             var next_step = "<h3>if Expressions</h3>"
                 + "<p>You might be used to <tt>if</tt> statements in imperative programming languages. Haskell has <tt>if</tt> expressions, which evaluate to either the <tt>then</tt> value or the <tt>else</tt> value, based on the <tt>if</tt> value.</p> Try <code>if 2*2==4 then &quot;happy&quot; else &quot;sad&quot;</code>.</p>"
             return msg + next_step;
          }
        },

        // lots of detail on if Expressions now
        {
         trigger:function(result){
             // result is String
             // expression contains if
             var stringResult =
                 (result.type === "String") ||
                 (result.type === "[Char]");
             var ifExpr = /if/.test(result.expr);
             return stringResult && ifExpr;
         },
         guide:function(result){
            var msg = "<p>This if expression returned "+result.value+", as you might expect.</p>";
            var next_step =
		"<p>The Haskell if expression is equivalent to the <tt>?:</tt> ternary operator in C-like languages. The first subexpression (after the if) must have type Bool, then the subsequent two subexpressions (after then and else respectively) must have the same type as each other.</p>"
                + "<p>What happens if we supply a non-Boolean value for the first subexpression? Try <code>if 1 then 0 else -1</code>.</p>";
	      tutorial22.continueOnError = true;
            return msg+next_step;
          }
        },

        // if expr, type error
        {
          trigger:function(result){
	      var typeError =
		  (/^\s+Couldn\'t\s+match\s+expected\s+type/.test(result.error)) || 
		  (/^\s+No\s+instance\s+for/.test(result.error)) ||
                  (/^\s+Could\s+not\s+deduce/.test(result.error));
              return typeError;
          },
          guide:function(result){
              tutorial22.continueOnError = true;
              return   "<p>As you can see, this if expression fails to evaluate. Haskell tries to interpret the first subexpression as a Bool value, and fails.</p><p>There are other ways to have typing issues with if expressions, for instance when the then and else subexpressions have different types. Try <code>if False then 42 else &quot;foo&quot;</code>.</p>";
          }
        },

        // then/else expr, type error
        {
          trigger:function(result){
	      var typeError =
		  (/^\s+Couldn\'t\s+match\s+expected\s+type/.test(result.error)) || 
		  (/^\s+No\s+instance\s+for/.test(result.error)) ||
                  (/^\s+Could\s+not\s+deduce/.test(result.error));
              return typeError;
          },
          guide:function(result){
              tutorial22.continueOnError = false;
              return "<p>Once again, this if expression fails to evaluate because of type errors. Haskell detects that the then value and the else value have incompatible types, so it complains.</p>"
                  + "<p>It is possible to have two values that are <i>similar</i>, i.e. they could be specialized to the same type, based on their type classes. For instance, try <code>if True then 42 else pi</code>.</p>";
          }
        },

        {
	  trigger:function(result){
	    return true;
	  },
	  guide:function(result){
		  
	    var msg="<h3>And that's the end of Tutorial 2.2!</h3>" +
	    		"<p>Well done, you have completed another Haskell tutorial!.</p>" +
	    		"<p>Let's recap what we've just discovered:</p>" +
	            '<ul>'+
	            '<li>Boolean not, &amp;&amp;,||  and xor operations</li>' +
		    '<li>Boolean functions on lists</li>' +
                    '<li>if/then/else conditional expressions</li>' +
	            '</ul></p>';

	    return msg;
	  },
	},
    {title:'Haskell Interactive Tutorials',
      	 guide:    	    	  
      	       '<h3>Haskell Interactive Tutorials</h3>' +
      	       '<p>In this environment you can try out Haskell code or take tutorials that guide you by prompting you to enter pieces of code and give you feedback on them. '+
      	       'Each tutorial has its own url,'+
      	       ' for this tutorial the url is <a href="'+tutorial22.url+'">'+tutorial22.url+'</a>.</p>'+
      	       '<h4>Functionality</h4>' +
      	       '<p>This coding environment does not offer all the functionality of the Haskell compiler <tt>ghc</tt> or the interactive Haskell interpreter <tt>ghci</tt>, '+
      	       'because that would allow hackers to compromise your computer. Any feature that could potentially be a security risk has been disabled.</p>'+
      	       '<p>Only <a href="https://hackage.haskell.org/package/pure-io-0.2.0/docs/PureIO.html#g:2">the following</a> IO actions are supported in this app (more about this later in the course).</p>' +    	       
      	       '<h4>Navigation commands</h4>' +
      	       '<p>To navigate between steps in the tutorial you can use following commands:</p>' +
      	       '<ul>' +
      	       '<li>To start the tutorial: type <code>start</code> at the <span style="color: purple">&#955;</span> prompt </li>' +
      	       '<li>To go to the next step: <code>next</code></li>' +
      	       '<li>To go to the previous step: <code>prev</code> or <code>back</code> </li>' +
      	       '<li>To go to a particular step <i>n</i>: <code>step<i>n</i></code></li>' +
      	       '<li>To see this help message: <code>help</code> '+
      	       '</ul>' +
      	       '<h4>Manipulating the context</h4>' +    	       
      	       '<p>The environment keeps a list of all equations you defined, we call this the <i>context</i>. Every computation you execute uses this context as follows:</p>' +
      	       '<pre>'+
      	       'let<br>'+
      	       '  <i>context</i><br>'+
      	       'in<br>'+
      	       '  <i>your_expression</i>'+
      	       '</pre>' +
  	    	   '<p>You can access and manipulate the context in the following ways:</p>' +
  	    	   '<ul>' +
      	       '<li>Inspect the context: <code>context</code> or <code>show</code></li>' +
      	       '<li>Remove the last added equation: <code>undo</code></li>' +
      	       '<li>Remove the equation for a given variable: <code>forget <i>varname</i></code></li>' +
   	       '<li>Erase the entire context: <code>erase</code> or <code>wipe</code></li>' +
   	       '<li>Reset the tutorial completely: <code>reset</code></li>' +
      	       '</ul>'
      	      },	
	
]
