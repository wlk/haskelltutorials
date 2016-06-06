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
      {title:'Haskell Interactive Tutorials',
       guide:
       
       '<h3>Haskell Interactive Tutorials</h3>' +
       //title="Click me to insert &quot;start&quot; into the console." style="cursor: pointer;"
       '<p>In this environment you can try out Haskell code or take tutorials that guide you by prompting you to enter pieces of code and give you feedback on them. '+
       'Each tutorial has its own url,'+
       ' e.g. for Tutorial 3.1 the url is <a href="'+tutorial31.url+'">'+tutorial31.url+'</a>.</p>'+
//       '<br>'+
       '<p>This coding environment does not offer all the functionality of the Haskell compiler <tt>ghc</tt> or the interactive Haskell interpreter <tt>ghci</tt>, because that would allow hackers to compromise your computer. Any feature that could potentially be a security risk has been disabled.</p>'+
       '<p>Only <a href="https://hackage.haskell.org/package/pure-io-0.2.0/docs/PureIO.html#g:2">these</a> IO actions are supported in this app (more about this later in the course).</p>' +
       '<p>Type <code>start</code>  at the <span style="color: purple">&#955;</span> prompt to start the tutorial.</p>'
//       +'<p>Or try typing any Haskell expression and see what happens.' +
//       '<small class="note">(click to insert)</small>:</p>' +
//       '<p>' +
//       '<code title="Click me to insert &quot;23 * 36&quot; into the console." style="cursor: pointer;">23 * 36</code> or <code title="Click me to insert &quot;reverse ' +
//       '&quot;hello&quot;&quot; into the console." style="cursor: pointer;">reverse ' +
//       '"hello"</code> or <code title="Click me to insert &quot;foldr (:) [] [1,2,3]&quot; into the console." style="cursor: pointer;">foldr (:) [] [1,2,3]</code> or <code title="Click me to insert." style="cursor: pointer;">do line <- getLine; putStrLn line</code> or <code>readFile "/welcome"</code>' +
//       '</p>'        
      },
        {title:'Tutorial 3.1: Lists and Recursion',
         guide:
         '<h3>Tutorial 3.1: Lists and Recursion</h3>' +
         '<p>This tutorial will show you how to comput with lists. \
         You will learn how to create and use recursive functions to traverse lists.</p>'+
         '<p>Type <code>next</code> at the <span style="color: purple">&#955;</span> prompt to start the first section of the tutorial.</p>' +
         '<p>To go to the next step in the tutorial use <code>next</code>, to go back use <code>back</code>.</p>' +
         '<p>This tutorial consists of the following sections:</p>'+
         '<ol>'+
         '<li>Computing with lists <code>step3</code>></li>'+
         '<li>Recursion on lists <code>step4</code></li>'+
         '<li>Defining conditional functions <code>step5</code></li>'+
         '<li>Recursive definition of <tt>filter</tt> <code>step6</code></li>'+
         '<li>Computations over lists <code>step9</code></li>'+
         '<li>Function composition <code>step10</code></li>'+         
         '<li>Folding a list (reduction) <code>step11</code></li>'+      
         '<li>Point-free style <code>step16</code></li>'+      
         '</ol>'
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
				'length [] = 0</tt><br>'+
				'length x:xs = 1 + length xs</tt></pre>'+
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
        
        // Computations over lists
        {
        	trigger:tutorial31.pages.isTrue,
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
          trigger:tutorial31.pages.isTrue, 
          guide:function(result){
        	  return "<h3>Function composition</h3>"+
        	    '<p>As explained in the notes, we can express a large compution by “chaining together” a sequence of functions that perform smaller computations using the <tt>(.)</tt>operator, e.g. <tt>f . g</tt>. This operation is particularly useful in the composition of <tt>map</tt> operations.'+
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
        	trigger:tutorial31.pages.isTrue,
          guide:function(result){
        	  return "<h3>Folding a list (reduction)</h3>"+

        	    '<p>An iteration over a list to produce a singleton value is called a <tt>fold</tt>.'+
        	    'There are several variations: folding from the left, folding from the right, several variations having to do with “initialisation”, and some more advanced variations.</p>'+

        	    '<p>Folds may look tricky at first, but they are extremely powerful, and they are used a lot! And they aren’t actually very complicated.</p>'+

        	'<p>The left fold (<tt>foldl</tt>) processes the list from the left.'+

        	    'Think of it as an iteration across a list, going left to right.'+

        	    'A typical example is e.g. <code>foldl (\\acc elt -> elt:acc) "" "Reversing a string"</code> which unsurprisingly reverts a string.</p>'+
        	'<p>Now go ahead and define your own example using <tt>foldl</tt>.</p>';

          }
        },
              
        // foldr
        {
        	trigger:tutorial31.pages.isTrue,
          guide:function(result){
        	  tutorial31.continueOnError=true;
        	  return "<p>The right fold (<tt>foldr</tt>) is similar to foldl, but it works from right to left. Some typical examples are:</p>"+
        	  '<code>sum xs = foldr (+) 0 xs</code> and'+
        	  '<code>product xs = foldr (*) 1 xs</code>'+
        	  '<p>What happens if you replace <tt>foldl</tt> with <tt>foldr</tt> in the string reversal example? <code>foldl (\\acc elt -> elt:acc) "" "Reversing a string"</code></p>';
        }
        },
                  
        {
        
        	trigger:tutorial31.pages.isError,
          guide:function(result){        	  
        	  return '<p>The result is an error, because <tt>foldr</tt> and <tt>foldl</tt> expect different types of functions:</p>'+
        	  '<ul><li><tt>foldl</tt> expects a function that takes as first argument the accumulator and as second argument the element of the list.'+
        	  ' The type signature is <pre>foldl ::  (a -> b -> a) -> a -> [b] -> a</pre></li>'+
        	  '<li><tt>foldr</tt> expects them in the opposite order, its type signature is <pre>foldl ::  (a -> b -> b) -> b -> [a] -> b</pre></li></ul>'+
        	  '<p>So go ahead, change the order and try again. What do you get? <code>foldl (\\acc elt -> elt:acc) "" "Reversing a string"</code></p>';
        }
        },
        
        {
    	trigger:tutorial31.pages.isString,
        guide:function(result){
      	  return '<p>As you can see, you get the same string back, no reversal occured. Can you change the definition to get a reversed string with foldr? '+
      	  '<code>foldr (\\elt acc -> elt:acc) "" "Reversing a string"</code></p>';
      }
      },        

        // Function returning several results
        {
          trigger:tutorial31.pages.isString,          
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
        	trigger:tutorial31.pages.isTrue,
        	guide:function(result){
        	return '<h3>Point-free style</h3>'+
        	'<p>We can actually “factor out” the xs that appears at the right of each side of the equation, and write:</p>'+
        	'<p><code>sum      = foldr (+) 0</code></p>'+
        	'<p><code>product  = foldr (*) 1</code></p>'+
        	'<p>This is called "point free" style,'+"it means that you're programming solely with the functions; the data isn't mentioned directly.</p>"+
        	'<p>Try this out for yourself and see if you can define other functions using this style.</p>';
        	}
        },
//        {
//        	trigger:tutorial31.pages.isTrue,
//        	guide:function(result){
//        	return '<h3>Point-free style</h3>'+
//        	'<p>We can actually “factor out” the xs that appears at the right of each side of the equation, and write:</p>'+
//        	'<p><code>sum      = foldr (+) 0</code></p>'+
//        	'<p><code>product  = foldr (*) 1</code></p>'+
//        	'<p>This is called "point free" style,'+"it means that you're programming solely with the functions; the data isn't mentioned directly.</p>";
//        	}
//        },
                       
    {
        	trigger:tutorial31.pages.isTrue,
    	  guide:function(result){
    		  
    	    var msg="<h3>And that's the end of Tutorial 3.1!</h3>" +
    	    		"<p>Well done, another Haskell tutorial finished!.</p>" +
    	    		"<p>Let's recap what we've learned:</p>" +
    	            '<ol>'+
    	            '<li>Computing with lists and recursive functions</li>'+	            
    	            "<li>Defining conditional functions in a variety of ways</li>"+
    	            '<li>Computations over lists using filter, map, foldl and foldr</li>'+
    	            '<li>Point-free style</li>'+    	            
    	            '</ol>';

    	    return msg;
    	  },
    	},        

    ];
