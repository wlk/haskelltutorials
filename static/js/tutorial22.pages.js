
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
         '<p>We are going to look at some more boolean operations today.</p>'+
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
         + "<p>Boolean values are either True or False. True is the opposite of False, and vice verse. The not function returns the opposite boolean value, the logical complement. Try <code>not True</code></p>"
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
	   booleanResult = result.type == "Bool";
           return bracketError || booleanResult;
	 },
         guide:function(result){
           var msg = "";
	   if (/applied\s+to\s+two\s+arguments/.test(result.error)) {
	       msg = msg + "<p>Remember to use brackets round the innermost not function call, since this must be evaluated first: <code>not (not True)</code></p>."
	   }
           var next_step =
            "<h3>The And operator</h3>"
            +"<p>Use the && infix operator as a boolean And. This only evaluates to True when both its inputs are True."
            +"e.g. <code>True && True</code>. </p>";
	   return msg + next_step;
	 }
        },

   // FIXME - need a custom trigger to check we did an AND
        
        // Expression Syntax - cont'd
        {
         trigger:tutorial22.pages.isBool,
          guide:function(result){
	      tutorial22.continueOnError = true;
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
             tutorial22.continueOnError = false;
             return   msg + "<p> Now try String inequality <code>\"foo\" /= \"bar\"</code></p>";
         }
        },

        {
         trigger:tutorial22.pages.isBool,
          guide:function(result){
            return "<p>You can apply these operations to other data types. You might also try comparing two Bools directly, e.g. <code>True /= False</code>.</p>";
          }
        },

        
        
        // Expression Syntax - cont'd
        {
          trigger:tutorial22.pages.isBool,
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
	      tutorial22.continueOnError = true;
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
          tutorial22.continueOnError = false;
          return   "<p>As you can see, this equality test fails:  Haskell cannot compare two values that have <em>different types</em>. The full story is more complex, but for now, we can see that types <em>limit</em> the operations we can apply to particular values.</p>" +
		  "<p>Haskell supports the standard comparison/relational operators, <, <=, >, >=. Try a simple comparison, e.g. <code>10 &gt; 9</p>";
        }
        },

        // Expression Syntax - Corner cases 3
        {
          trigger:tutorial22.pages.isBool,
          guide:function(result){
          return  "<p>Note that relational operators also work on lists, in a dictionary-order manner (lexicographic). e.g. Try <code>[1,2,3] &lt; [1,2,3,4]</p>";
        }
        },

	{
	  trigger:tutorial22.pages.isBool,
	  guide:function(result) {
	    return "<p> Since strings are lists of characters in Haskell, we can do the same kinds of comparison operations on strings. Check whether Aadvark comes before Aaronic in the dictionary with this code: <code>&quot;Aardvark&quot; &lt; &quot;Aaronic&quot;";
	  }
	},
// should we talk about string comparisons, 
// about Eq class?

        {
          trigger:tutorial22.pages.isBool,
          guide:function(result){
          tutorial22.continueOnError = false;
          var next_step = "<p>Now let's think about list membership. We want a boolean function that returns true if a value is part of a list, and false otherwise. This is the elem function. Try <code>elem 1 [1,2,3]</code></p>";
              return next_step;
	}
        },

	{
	  trigger:tutorial22.pages.isBool,
	  guide:function(result){
            if (!result) result = {expr:'elem 1 [1,2,3]',value:'True'};
            var complied = /Bool/.test(result.type);            
            var rexpr = result.expr.replace(/^let\s.+\sin\s+/, "");
            var valid = /True|False/.test(result.value);
            var matches = rexpr.match(/^\s*elem\s+([0-9]+) (\[[^\]]*\])/);
	    var element = matches[1];
            var msg="<p>You see that element " + element + " is " + ((result.value)?"":" not ") + "part of the list.</p>";
	    var next_step = msg + "<p>The elem function can be written infix, like an arithmetic operator, by enclosing its name in backquotes ``. Try <code>3 `elem` [1, 2, 3, 4, 5]</code>."
            return next_step;
	      
	}
	},
	{
	  trigger:tutorial22.pages.isBool,
	  guide:function(result){
	      var next_step ="<p>In fact, Haskell permits any two-argument function to be written as an infix operator using backquote characters. For a further example, try the max function as an infix operator: <code>42 `max` 13</code>";
	      return next_step;
          }
        },

	{
	  trigger:tutorial22.pages.isNum,
	  guide:function(result){
	      var next_step = "<p>Also note that any Haskell infix operator, e.g. +, can be written as a prefix operator by enclosing it in parentheses, like <code>(+) 1 1</code>";
	      return next_step;
	  }
	},

{
	  trigger:function(result){
	    return true;
	  },
	  guide:function(result){
		  
	    var msg="<h3>And that's the end of Tutorial 2.2!</h3>" +
	    		"<p>Well done, you finished another Haskell tutorial!.</p>" +
	    		"<p>Let's recap what we've just discovered:</p>" +
	            '<ul>'+
	            '<li>Equality and Comparison Operators</li>' +
		    '<li>Testing List membership with the elem function</li>' +
                    '<li>Using infix and prefix operations.</li>' +
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
