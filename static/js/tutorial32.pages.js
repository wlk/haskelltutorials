var thistutorial = tutorial32;
// Module for the guide pages
tutorial32.pages = {};

// Unshow a string
tutorial32.pages.unString = function(str){
    return str.replace(/^"(.*)"$/,"$1").replace(/\\"/,'"');
}

// Random message from a list of messages
tutorial32.pages.rmsg = function(choices) {
    return choices[Math.floor((Math.random()*100) % choices.length)];
}

// Simple HTML encoding
tutorial32.pages.htmlEncode = function(text,shy){
    var x = $('<div></div>');
    x.text(text);
    return x.html();
}

// Added by WV
tutorial32.pages.isNum = function(result) {
  var retval =
    /(Num|Fractional|Integral|Floating)\s+[a-z]+\s+=>\s+[a-z]+/.test( result.type ) ||
    /\(Ord\s+[a-z]+\s*,\s*(Num|Fractional|Integral|Floating)\s+[a-z]+\)\s+=>\s+[a-z]+/.test( result.type ) ||
    /\((Num|Fractional|Integral|Floating)\s+[a-z]+\s*,\s*Ord\s+[a-z]+\)\s+=>\s+[a-z]+/.test( result.type ) ||
    result.type == "Integer" ||
    result.type == "Int" ||
    result.type == "Bool";
    return retval;
}

//Added by WV
tutorial32.pages.isString = function(result) {
  var retval =
    /Char/.test( result.type );
    return retval;
}

// Added by WV
tutorial32.pages.isBool = function(result) {
  var retval = result.type == "Bool";
    return retval;
}

//Added by WV
tutorial32.pages.isError = function(result) {
  var retval = (typeof result.error !== 'undefined');
//  alert(result.error +' => '+retval);
    return retval;
}

// Added by WV
tutorial32.pages.isList = function(result) {
  var retval = /\[\w+\]/.test( result.type ) 
    return retval;
}

tutorial32.pages.isTrue = function(result) {
	    return true;
	}

// All pages
tutorial32.pages.list =
    [

        {title:'Tutorial 3.2: More Computations on Lists',
         guide:
         '<h3>Tutorial 3.2: More Computations on Lists</h3>' +
         '<p>This tutorial introduces some more advanced computations with lists. \
         You will learn how to create and use recursive functions to traverse lists.</p>'+
         '<p>Type <code>next</code> at the <span style="color: purple">&#955;</span> prompt to start the first section of the tutorial.</p>' +         
         '<p>This tutorial consists of the following sections:</p>'+
         '<ol>'+
         '<li>Computations with lists <code>step2</code></li>'+
         '<li>Function composition <code>step3</code></li>'+         
         '<li>Folding a list (reduction) <code>step4</code></li>'+      
         '<li>Point-free style <code>step9</code></li>'+      
         '</ol>'+
         '<p>For help about the tutorial environment type <code>help</code> at the <span style="color: purple">&#955;</span> prompt.</p>' 
        },
        ////////////////////////////////////////////////////////////////////////
        // Computations over lists
        {
        	trigger:tutorial32.pages.isTrue,
          guide:function(result){
            return '<h3>Computations over lists</h3>'+

            '<p>Many computatations that would be for/while loops in an imperative language are naturally expressed as list computations in a functional language.</p>'+

          '<p>There are some common cases:</p>'+
        '<ul>'+
                '<li>Perform a computation on each element of a list: <tt>map</tt></li>'+

                '<li>Iterate over a list, from left to right: <tt>foldl</tt></li>'+

                '<li>Iterate over a list, from right to left: <tt>foldr</tt></li>'+
        '</ul>'+
            '<p>It’s good practice to use functions like <tt>filter</tt> and these three functions when applicable.'+

            "Let's look at maps and folds in some more detail.</p><p><code>next</code></p>";
          }
        },        
        
        
        // Function composition
        {
          trigger:tutorial32.pages.isTrue, 
          guide:function(result){
        	  return "<h3>Function composition</h3>"+
        	    '<p>As explained in the notes, we can express a large compution by “chaining together” a sequence of functions that perform smaller computations using the <tt>(.)</tt> operator, e.g. <tt>f . g</tt>. This operation is particularly useful in the composition of <tt>map</tt> operations. '+
        	    'A common style is to define a set of simple computations using <tt>map</tt>, and to compose them.</p>'+
        	    '<p>The following relationship is very useful to refactor your code:</p>'+
        	    '<pre>'+
        	      'map f (map g xs) = map (f . g) xs'+
        	    '</pre>'+
        	'<p>This theorem is frequently used, in both directions. For example, if we want to take a list of numbers and perform two operations on each number, we could write:</p>'+
        	'<code> map (+5) (map (*3) [1..10])</code>'+
        	'<p>But we could equally write:</p>'+
        	'<code> map ((+5) . (*3)) [1..10]</code>'+
        	'<p>Now write your own example of the use of <tt>map</tt></p>';
    	     
          }
        },

        // Folding a list (reduction)
        {
        	trigger:tutorial32.pages.isTrue,
          guide:function(result){
        	  return "<h3>Folding a list (reduction)</h3>"+

        	    '<p>An iteration over a list to produce a singleton value is called a <tt>fold</tt>. '+
        	    'There are several variations: folding from the left, folding from the right, several variations having to do with “initialisation”, and some more advanced variations.</p>'+

        	    '<p>Folds may look tricky at first, but they are extremely powerful, and they are used a lot! And they aren’t actually very complicated.</p>'+

        	'<p>The left fold (<tt>foldl</tt>) processes the list from the left. '+

        	    'Think of it as an iteration across a list, going left to right. '+

        	    'A typical example is e.g.<br><code>foldl (\\acc elt -> elt:acc) "" "Reversing a string"</code><br>which unsurprisingly reverts a string.</p>'+
        	'<p>Now go ahead and define your own example using <tt>foldl</tt>.</p>';

          }
        },
              
        // foldr
        {
        	trigger:tutorial32.pages.isTrue,
          guide:function(result){
        	  tutorial32.continueOnError=true;
        	  return "<p>The right fold (<tt>foldr</tt>) is similar to foldl, but it works from right to left. Some typical examples are:</p>"+
        	  '<code>sum xs = foldr (+) 0 xs</code> and <br>'+
        	  '<code>product xs = foldr (*) 1 xs</code><br>'+
        	  '<p>What happens if you replace <tt>foldl</tt> with <tt>foldr</tt> in the string reversal example?</p> <code>foldr (\\acc elt -> elt:acc) "" "Reversing a string"</code></p>';
        }
        },
                  
        {
        
        	trigger:tutorial32.pages.isError,
          guide:function(result){        	  
        	  return '<p>The result is an error, because <tt>foldr</tt> and <tt>foldl</tt> expect different types of functions:</p>'+
        	  '<ul><li><tt>foldl</tt> expects a function that takes as first argument the accumulator and as second argument the element of the list.'+
        	  ' The type signature is <pre>foldl ::  (a -> b -> a) -> a -> [b] -> a</pre></li>'+
        	  '<li><tt>foldr</tt> expects them in the opposite order, its type signature is <pre>foldr ::  (a -> b -> b) -> b -> [a] -> b</pre></li></ul>'+
        	  '<p>So go ahead, change the order and try again. What do you get?</p> <code>foldr (\\acc elt -> elt:acc) "" "Reversing a string"</code></p>';
        }
        },
        
        {
    	trigger:tutorial32.pages.isString,
        guide:function(result){
      	  return '<p>As you can see, you get the same string back, no reversal occured. Can you change the definition to get a reversed string with foldr?</p> '+
      	  '<p><code>foldr (\\elt acc -> elt:acc) "" "Reversing a string"</code></p>';
      }
      },        

        // Function returning several results
        {
          trigger:tutorial32.pages.isString,          
          guide:function(result){
        	  var theStr = result.expr.replace(/^.*\"\s+\"/,'"');        	  
        	  var theRevStr=theStr.split("").reverse().join("");        	  
        	  if (result.value==theRevStr) {
        		  return '<p>Well done, you defined a string reversal function with foldr!</p>'+"<p><code>next</code></p>";;
        	  } else if (result.value==theStr){
        		  return '<p>Looks like you still return the original string '+theStr+', try again!</p>';
        	  } else {
        		  
        		  return '<p>The string you returned is not a reversal of the original string '+theStr+', try again!</p>';
        	  }
        }
        },
        
        {
        	trigger:tutorial32.pages.isTrue,
        	guide:function(result){
        	return '<h3>Point-free style</h3>'+
        	'<p>We can actually “factor out” the xs that appears at the right of each side of the equation, and write:</p>'+
        	'<p><code>sum      = foldr (+) 0</code></p>'+
        	'<p><code>product  = foldr (*) 1</code></p>'+
        	'<p>This is called "point free" style,'+"it means that you're programming solely with the functions; the data isn't mentioned directly.</p>"+
        	'<p>Try this out for yourself and see if you can define other functions using this style.</p>';
        	}
        },
                       
    {
        	trigger:tutorial32.pages.isTrue,
    	  guide:function(result){
    		  
    	    var msg="<h3>And that's the end of Tutorial 3.2!</h3>" +    	    		
    	    		"<p>In this tutorial you've learned to:</p>" +
    	            '<ol>'+    	            
    	            '<li>Do computations over lists using map, foldl and foldr</li>'+
    	            '<li>Program in point-free style</li>'+    	            
    	            '</ol>';

    	    return msg;
    	  },
    	},        
    	
        {title:'Haskell Interactive Tutorials',
    	   	 guide:    	    	  
    	   	       '<h3>Haskell Interactive Tutorials</h3>' +
    	   	       '<p>In this environment you can try out Haskell code or take tutorials that guide you by prompting you to enter pieces of code and give you feedback on them. '+
    	   	       'Each tutorial has its own url,'+
    	   	       ' the url for this tutorial is <a href="'+thistutorial.url+'">'+thistutorial.url+'</a>.</p>'+
    	   	       '<h4>Functionality</h4>' +
    	   	       '<p>This coding environment does not offer all the functionality of the Haskell compiler <tt>ghc</tt> or the interactive Haskell interpreter <tt>ghci</tt>, '+
    	   	       'because that would allow hackers to compromise your computer. Any feature that could potentially be a security risk has been disabled.</p>'+
    	   	       '<p>Only <a href="https://hackage.haskell.org/package/pure-io-0.2.0/docs/PureIO.html#g:2">the following</a> IO actions are supported in this app (more about this later in the course).</p>' +
    	   	       '<p>You cannot declare your own types or load content from modules</p>'+
    	   	       '<h4>Navigation commands</h4>' +
    	   	       '<p>You can either type commands at the <span style="color: purple">&#955;</span> prompt or click on any command link in the tutorial text (styled like this: <code>help</code>), this will insert that command at the prompt.</p>' +
    	   	       '<p>To navigate between steps in the tutorial you can use following commands:</p>' +
    	   	       '<ul>' +
    	   	       '<li>To start the tutorial: type <code>start</code> at the <span style="color: purple">&#955;</span> prompt </li>' +
    	   	       '<li>To go to the next step: <code>next</code></li>' +
    	   	       '<li>To go to the previous step: <code>prev</code> or <code>back</code> </li>' +
    	   	       '<li>To go to a particular step <i>n</i>: <code>step<i>n</i></code></li>' +
    	   	       '<li>To see this help message: <code>help</code> '+
    	   	       '</ul>' +
    	   	       '<p>On the command line you can use the left and right arrows or <tt>Ctrl-b</tt> and <tt>Ctrl-f</tt>, as well as <tt>Ctrl-a</tt> to jump to the start of the line and <tt>Ctrl-e</tt> to jump to the end of the line.</p>' +
    	   	    '<p>You can use the up and down arrows or <tt>Ctrl-p</tt> and <tt>Ctrl-n</tt> to navigate through the history of commands you entered.</p>' +
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

    ];
