var thistutorial = tutorial31;
// Module for the guide pages
tutorial31.pages = {};

// Unshow a string
tutorial31.pages.unString = function(str){
    return str.replace(/^"(.*)"$/,"$1").replace(/\\"/,'"');
}

// Random message from a list of messages
tutorial31.pages.rmsg = function(choices) {
    return choices[Math.floor((Math.random()*100) % choices.length)];
}

// Simple HTML encoding
tutorial31.pages.htmlEncode = function(text,shy){
    var x = $('<div></div>');
    x.text(text);
    return x.html();
}

// Added by WV
tutorial31.pages.isNum = function(result) {
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
tutorial31.pages.isString = function(result) {
  var retval =
    /Char/.test( result.type );
    return retval;
}

// Added by WV
tutorial31.pages.isBool = function(result) {
  var retval = result.type == "Bool";
    return retval;
}

//Added by WV
tutorial31.pages.isError = function(result) {
  var retval = (typeof result.error !== 'undefined');
//  alert(result.error +' => '+retval);
    return retval;
}

// Added by WV
tutorial31.pages.isList = function(result) {
  var retval = /\[\w+\]/.test( result.type ) 
    return retval;
}

tutorial31.pages.isTrue = function(result) {
	    return true;
	}

// All pages
tutorial31.pages.list =
    [

        {title:'Tutorial 3.1: Lists and Recursion',
         guide:
         '<h3>Tutorial 3.1: Lists and Recursion</h3>' +
         '<p>This tutorial will show you how to comput with lists. \
         You will learn how to create and use recursive functions to traverse lists.</p>'+
         '<p>Type <code>next</code> at the <span style="color: purple">&#955;</span> prompt to start the first section of the tutorial.</p>' +         
         '<p>This tutorial consists of the following sections:</p>'+
         '<ol>'+
         '<li>Computing with lists <code>step2</code></li>'+
         '<li>Recursion on lists <code>step3</code></li>'+
         '<li>Defining conditional functions <code>step4</code></li>'+
         '<li>Recursive definition of <tt>filter</tt> <code>step5</code></li>'+
         '</ol>'+
         '<p>For help about the tutorial environment type <code>help</code> at the <span style="color: purple">&#955;</span> prompt.</p>' 
        },
        ////////////////////////////////////////////////////////////////////////
        // Lesson 1

        // 
        {lesson:1,
         title:'Computing with lists',
         guide:
         '<h3>Computing with lists</h3>'+
         '<p>There are two approaches to working with lists:</p>'+
        '<ul>'+
                '<li>Write functions to do what you want, using recursive definitions that traverse the list structure.</li>'+
                '<li>Write combinations of the standard list processing functions.</li>'+
        '</ul>'+
            '<p>The second approach is preferred, but the standard list processing functions do need to be defined, and those definitions use the first approach (recursive definitions).'+
            "We’ll cover both methods.</p><p><code>next</code></p>"
        },
        {
        	trigger:tutorial31.pages.isTrue,
          guide:function(result){
        	 	return '<h3>Recursion on lists</h3>'+
        	 	'<p>As we have already seen, a list is built from the empty list <tt>[]</tt> and the function <tt>cons</tt> or in operator form <tt>(:)</tt>.'+
        	 	    '<p>Every list must be either<br>'+
        	 	        '<tt>[]</tt> or<br>'+
        	 	        '<tt>(x:xs)</tt> for some <tt>x</tt> (the head of the list) and <tt>xs</tt> (the tail).<br>'+
        	 	    'where <tt>(x:xs)</tt> is an alternative syntax for <tt>cons x xs</tt></p>'+
        	 	'<p>The recursive definition follows the structure of the data:<br>'+
        	 	        'Base case of the recursion is <tt>[]</tt>.<br>'+
        	 	        'Recursion (or induction) case is <tt>(x:xs)</tt>.</p>'+
        	 	'<p>However, in order to create such recursive definitions, we must first see how we can create conditional functions: functions that define both the base case and the induction case.</p></p><p><code>next</code></p>';
                    }
        },        	 
        
        {
        	trigger:tutorial31.pages.isTrue,
            guide:function(result){
            	return '<h3>Defining conditional functions</h3>'+
            	
          	 	'<p>In Haskell, there are several ways to define conditional functions. The easiest way is to write a definition for each case, as is done in the notes, e.g. <br>'+
				'<pre>'+
				'length [] = 0<br>'+
				'length x:xs = 1 + length xs'+
				'</pre>'+
				'<p>Unfortunately, this style does not work in the web-based environment because it only supports <i>single-line expressions</i>. However, there are other ways. The most straightforward is to use an <i>if-then-else</i> expression:</p>'+
				'<pre>'+
				'length lst =<br>'+
				'  if lst == []<br>'+
				'    then 0<br>'+
				'    else let x:xs = lst in 1 + length xs'+
				'</pre>'+
				          	 	'<p>Alternatively, you can use what is known as "guards", e.g. </p>'+
				          	 	'<pre>'+
				'length lst<br>'+
				'  | lst == [] = 0<br>'+
				'  | otherwise = let x:xs = lst in 1 + length xs'+
				'</pre>'+
				          	 	'<p>This is particularly useful if you have many conditions (similar to a "case" statement in other languages)</p>'+
				          	 	'<p>Finally, you can use multi-line functions using the where-clause and semicolons:</p>'+
				'<pre>'+
				"f = f' where f' 1 = 0; f' x = x + f' (x-1)"+
				'</pre>'+
          	 	"<p>All of these can be written on a single line so you can use them in the web-based environment. So ho ahead and define your own <tt>length</tt> function, and try it out: <code> length ['a','c' .. 'w']</p>";       
            
            }
        },   
        {
        	trigger:tutorial31.pages.isNum,
        guide:function(result){
      	 	return '<h3>Recursive definition example: <tt>filter</tt></h3>'+
      	  '<p>The function  <tt>filter</tt> is given a predicate (a function that gives a Boolean result) and a list, and returns a list of the elements that satisfy the predicate.</p>'+
      	  '<p>Filtering is useful for the “generate and test” programming paradigm.</p>'+
      	  '<p>Try this <code>filter (<5) [3,9,2,12,6,4]</code><tt> -- > [3,2,4]</tt> or create your own example.</p>';      	 
        }
      },      
      {
      	trigger:tutorial31.pages.isList,
      guide:function(result){
    	 	return '<p>Now define your own <tt>filter</tt> function and use it to filter the example list <code>[3,9,2,12,6,4]</code>.</p>';
      }
    }, 
        // 

        {//lesson:2,
         //title:'',
         trigger:tutorial31.pages.isList,
          guide:function(result){
//        	  if (result.value)
//        	  alert(result.expr+' => '+result.value);
        	  return '<p>Well done, your <tt>filter</tt> function works correctly!</p>'+
        	  '<p>A possible recursive definition is:</p>'+
'<pre>filter pred lst<br>  | null lst = []<br>  | otherwise = if pred x <br>     then x:filter pred xs<br>     else filter pred xs<br>       where x:xs=lst</pre>'+
'</p><p>Or on a single line: '+        	  
        	  '<code>filter pred lst | null lst = [] | otherwise = if pred x then x:filter pred xs else filter pred xs where x:xs=lst</code></p>';
        }
        },
                                  
    {
        	trigger:tutorial31.pages.isTrue,
    	  guide:function(result){
    		  
    	    var msg="<h3>And that's the end of Tutorial 3.1!</h3>" +
    	    		"<p>Well done, another Haskell tutorial finished!.</p>" +
    	    		"<p>Let's recap what we've learned:</p>" +
    	            '<ol>'+
    	            '<li>Computing with lists and recursive functions</li>'+	            
    	            "<li>Defining conditional functions in a variety of ways</li>"+
    	            '<li>Computations over lists using filter</li>'+    	            
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
