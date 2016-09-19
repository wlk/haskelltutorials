// WV: actually, this is entirely generic
// Main tutorial2 module.
tutorial2 = {};
tutorial2.url=window.location.href;
tutorial2.hostname = '127.0.0.1';
tutorial2.port = '4001';

// A success hook which can be bound and rebound or set as null.
tutorial2.successHook = null;

// The current page number.
tutorial2.currentPage = null;
tutorial2.nPages = null;

// Stdout state from the current IO evaluation.
tutorial2.stdout = [];

// Stdin state for the current IO evaluation.
tutorial2.stdin = [];

// IO expression.
tutorial2.io = null;

// WV extensions for HaskellMOOC
// Allow continue on error
tutorial2.continueOnError = false;
// Handle context for equations
tutorial2.equations=[];
// 20160915 allow to remove equations
tutorial2.isEq = false;
tutorial2.has_eq = function(varname) {
	var has_varname=false;
	
    for (var i = 0; i <  tutorial2.equations.length; i++) {
        var eq = tutorial2.equations[i];
    	
        var chunks = eq.split(/\s*=\s*/);
        var lhs = chunks[0].trim(); // WV: but somehow there is still a trailing whitespace char after the varname in lhs!
        //alert(eq+':'+varname+'<>'+lhs);
        varre = new RegExp('\\b'+varname+'\\b');
        if (varre.test(lhs)) {
        	//alert('Found '+varname);
       	 	has_varname=true;
       	 	break;
        }
    }
	return has_varname;	
}
tutorial2.forget = function(varname) {
	var remaining_eqs = [];
         for (var i = 0; i <  tutorial2.equations.length; i++) {
             var eq = tutorial2.equations[i];
             var chunks = eq.split(/\s*=\s*/);
             var lhs = chunks[0].trim(); // WV: but somehow there is still a trailing whitespace char after the varname in lhs!             
             varre = new RegExp('\\b'+varname+'\\b');
             if (!varre.test(lhs)) {
            	 remaining_eqs.push(tutorial2.equations[i]);
             } else {
            	 //alert('Forgetting '+varname);
             }
         }
         tutorial2.equations=remaining_eqs;
}

tutorial2.undo  = function() {
//    if (tutorial2.isEq) {
     tutorial2.equations.pop();
//    }
}

tutorial2.wipe = function() {    
     tutorial2.equations=[]  ;  
}

// Files in the file system.
tutorial2.files = {
    "/hello": "Hello, World!",
    "/files": "Your file system changes will stick around in your browser's local storage!",
    "/welcome": "Welcome to your mini filesystem! Try playing with this function: getDirectoryContents",
    "/functions": "You can also check out removeFile, writeFile, appendFile"
};

try {
    if(typeof(Storage)!=="undefined")
    {
        tutorial2.files = (localStorage.files && JSON.parse(localStorage.files))
            || tutorial2.files;
    };
} catch (e){ tutorial2.files = {} }

tutorial2.showWarnings = function() {
    !navigator.cookieEnabled     && $("#cookie-warning").show();
    window['localStorage']==null && $("#storage-warning").show();
}

// A pre-command hook which can prevent the command from being run if
// it returns true.
tutorial2.preCommandHook = function(line,report){
    var m, pages = tutorial2.pages.list;
    tutorial2.nPages = pages.length;
    tutorial2.isEq = false;
    // if the line matches step{$n} then get page $n from  tutorial2.pages.list (i.e. pages)
    if (m = line.trim().match(/^step\s*([0-9]+)/)) {
        var n = m[1] * 1;
        if (n <= pages.length) {
            tutorial2.setPage(n,null);
            report();
            return [true,'True'];
        }
    }
    else if (m = line.trim().match(/^lesson([0-9]+)/)) {
        // 'lesson' is simply an attribute of a page, a label to say to which lesson a page belongs.
        var n = m[1] * 1;
        for (var i = 0; i < pages.length; i++) {
            if (pages[i].lesson == n) {
                tutorial2.setPage(i,null);
                report();
                return [true,'True'];
            }
        }
    } else if (line.trim() == 'next') {
        if (tutorial2.currentPage < tutorial2.pages.list.length) {
            tutorial2.setPage(tutorial2.currentPage + 1);
        }
        report();
        return [true,'True'];
    } else if (line.trim() == 'back' || line.trim() == 'prev') {
        if (tutorial2.currentPage > 1) {
            tutorial2.setPage(tutorial2.currentPage - 1);
        }
        report();
        return [true,'True'];
    } else if (line.trim() == 'start' ) {
        tutorial2.setPage(1,null);
        report();
        return [true,'True'];        
    } else if (line.trim() == 'help' ) {
        tutorial2.setPage(tutorial2.pages.list.length,null);
        report();
        return [true,'True'];
    } else if (/^reset/.test(line.trim()) ) {
        tutorial2.reset();
        report();        
        return [true,'True'];
        
    } else if (/^(erase|wipe)/.test(line.trim()) ) {
        tutorial2.wipe();
        report();        
        return [true,'True'];
        
    } else if (/^undo/.test(line.trim()) ) {
        tutorial2.undo();
        report();        
        return [true,'True'];
    } else if (/^(context|show)/.test(line.trim()) ) {        
        report();     
        //alert('{ '+ tutorial2.equations.join(';') +' }');
        return [true,'True'];        
    } else if (/^forget/.test(line.trim()) ) {
        var chunks = line.trim().split(/\s+/);
        var varname = chunks[1];
        tutorial2.forget(varname);
        report();
        return [true,'True'];
    }  else if (/^\\/.test( line.trim() ) ) { // this is because application requires parentheses anyway
    	var nline = line.trim();
    	var exprs = nline.split(/\s*\-\>\s*/);
    	//line = exprs[1];
    	line = nline; // try to return the whole lambda function
    }  else if (!/^let/.test( line.trim() ) && /^\w+\s*=[^=\>\<]/.test( line.trim() ) ) { // (\s+\w+)*    	
    	// This is an equation.     	
        var nnline = line.trim();
        var nline=nnline.replace(/=/,' = ');
        var chunks = nline.split(/\s+=\s+/);
        var lhs = chunks[0].trim();
        var rhs=chunks[1];
        
        tutorial2.isEq = true;
        if (tutorial2.equations.length>0) {//alert( 'test dups'+lhs );
        	if (tutorial2.has_eq(lhs)) {        	
        		tutorial2.forget(lhs);
        	}
        }
        tutorial2.equations.push(nline);
        var context = '';
        if (tutorial2.equations.length>0) {
        	context = 'let {'+ tutorial2.equations.join(';') +' } in ';
        }
         // Now, if the rhs is a lambda we should not return the lhs
         // This is weak, because if I bind a lambda to f and then bind f to g, I'm still in trouble
         var isLambda = false;
         if (/^\\/.test(rhs)) {
        	 isLambda = true;      
         }
         
         // This is a naive check for recursion, we ignore the context         
         var re = new RegExp('\\b'+lhs+'\\b');
         if (re.test(rhs)) {
//        	 alert('Recursion!');
             tutorial2.equations.pop();
             tutorial2.isEq = false;
             line = 'let '+nline+' in '+lhs;
         } else {
        	 if (!isLambda) {
             line = context + lhs;
        	 } else {
        		 var exprs = rhs.split(/\s*\-\>\s*/);
        		 var expr = exprs[1];
        		 line = context + expr;
//        		 alert(line);
        	 }
         }
        return [false,line];
    }  else if (!/^let/.test( line.trim() ) && /^\w+(\s+\w+)+\s*(=[^=\>\<]|\|)/.test( line.trim() ) ) {        
    	// This is an equation for a function.     
    	// Return a lambda function e.g. f x = x => return \x -> x
        var nline = line.trim();        
        var tline1=nline.replace(/==/,'##');
        var tline2=tline1.replace(/=/,' = ');
        var tline3 = tline2.replace(/=\s+=/,'=');
        nline = tline3.replace(/##/,'==');        
        var now = new Date().getTime();
        if (/\|/.test(nline)) {
        	var fixed_guard_line =nline.replace(/\|/, '= let res'+now+' | ');
        	fixed_guard_line+=' in res'+now;        
        	nline = fixed_guard_line;
        }
        var chunks = nline.split(/\s+/);
        chunks.shift();        
        var retval = '\\'+chunks.join(' ');
        var retval2 = retval.replace(/=/,'->');
//        alert(nline+' => ' + retval2);
        tutorial2.isEq = true;
        var chunks=nline.split(/\s*=\s*/);
        var lhs = chunks[0].trim();
        if (tutorial2.equations.length>0) {//alert( 'test dups <'+lhs+'>' );
        	if (tutorial2.has_eq(lhs)) {        	
        		tutorial2.forget(lhs);
        	}
        }
        
        tutorial2.equations.push(nline);
        var context = '';
        if (tutorial2.equations.length>0) {
        	context = 'let {'+ tutorial2.equations.join(';') +' } in '+retval2;//'True';
        }
//        alert(context);
        line = context;                
        return [false,line];
    	
    } else {
        // OK, an expression that is not an equation
    	
        line = 'let {'+ tutorial2.equations.join(';') +' } in '+line.trim();
//        alert(line);
    }
    return [false,line];
};

// Make the console controller.
tutorial2.makeController = function(){
    tutorial2.controller = $('#console').console({
        promptLabel: 'λ ',
        commandValidate: function(line){
            if (line == "") return false;
            else return true;
        },
        commandHandle: function(line,report){
//            alert(tutorial.io);
            if(tutorial2.io === null){
                var retval = tutorial2.preCommandHook(line,report);
                var ignoreCommand = retval[0];
                var newLine = retval[1];
                if(!ignoreCommand){
                    tutorial2.ajaxCommand(newLine,report,[]);
                }
            } else {
                tutorial2.stdin.push(line);
                tutorial2.ajaxCommand(tutorial2.io,report,tutorial2.stdin);
            }
        },
        autofocus: true,
        animateScroll: true,
        promptHistory: true,
        welcomeMessage: 'Type Haskell expressions in here.',
        continuedPromptLabel: '> '
    });
};

// Make an AJAX command to the server with the given line.
tutorial2.ajaxCommand = function(line,report,stdin){
    var args = { 'exp': line,
                 'args': JSON.stringify([stdin,tutorial2.files])
               };
    $.ajax({
        url: '/eval',
        dataType: 'json',
        type: 'POST',
        data: args,
        success: function(result){
            if(result.stdout !== undefined){
 //               alert(result.stdout);
                tutorial2.files = result.files;
                result = result.stdout;
                tutorial2.io = line;
                var msgs = [];
                if(result != null){
                    for(var i = tutorial2.stdout.length; i < result.length; i++) {
                        msgs.push({ msg: result[i], className: 'jquery-console-stdout' });
                    }
                }
                tutorial2.stdout = result;
                tutorial2.controller.continuedPrompt = true;
                report(msgs);
                tutorial2.controller.continuedPrompt = false;
            } else {
                if(result.error !== undefined){
//                	alert('ERROR:'+result.error);
                	if (/No\ instance\ for\ .Typeable/.test(result.error)) {
//                		alert(args.exp);
                		tutorial2.continueOnError=true;
                		result.error = ":: ? -> ?";
                	} else
                	if (/No\ instance\ for\ .Show/.test(result.error)) {
//                		alert(result.error);
//                		tutorial2.continueOnError=true;
                		result.error = "Sorry, I can't display this result.";
                	}
//                	else
//                		if (/No\ instance\ for\ ./.test(result.error)) {
//                    		tutorial2.continueOnError=true;
//                    		result.error = ":: Expr";
//                    	}
//                	if (/Could\ not\ deduce\ .Ord/.test(result.error)) {
//                		
//                	}
// A type error goes here,
// What I want is the option to carry on
                    result.expr = args.exp;                    
                    if (tutorial2.continueOnError) {
                        if(tutorial2.successHook != null) {
                            tutorial2.successHook(result);
                        }
                        report([{ msg: result.error || 'Unspecified error. Have you installed mueval?',
                              className:'jquery-console-stdout' }]);
                    } else {
                    report([{ msg: result.error || 'Unspecified error. Have you installed mueval?',
                              className:'jquery-console-error' }]);
                    }
                } else if(result.success){
                    // So this is where we get when a computation just works
                    result = result.success;
                    var msgs = [];
                    for(var i = tutorial2.stdout.length; i < result.stdout.length; i++) {
                        msgs.push({ msg: result.stdout[i], className: 'jquery-console-stdout' });
                    }
                    if(tutorial2.successHook != null) {
                        tutorial2.successHook(result);
                    }
                    if(result.type !== 'IO ()' && !result.value.match(/^</))
                        msgs.push({ msg: result.value, className: 'jquery-console-value' });
                    msgs.push({ msg: ':: ' + result.type, className: 'jquery-console-type' });
                    report(msgs);
                    tutorial2.files = result.files;
                }
                if (tutorial2.continueOnError) {
 // nothing                        
                } else {
                    tutorial2.io = null;
                    tutorial2.stdout = [];
                    tutorial2.stdin = [];
                }
            }
            if(typeof(Storage)!=="undefined")
            {
                localStorage.files = JSON.stringify(tutorial2.files);
            }
        }
    });
};

// Make the guide on the rhs.
tutorial2.makeGuide = function(){
    var match = window.location.href.match(/#step([0-9]+)$/);
    if(match){
        tutorial2.setPage(match[1]*1,null);
    } else {
        tutorial2.setPage(1,null);
    }
};

// Set the current page.
tutorial2.setPage = function(n,result){
    var page = tutorial2.pages.list[n-1];
    if(page){
        // Update the current page content
        var guide = $('#guide');
        var stepcounter = (tutorial2.currentPage != null) ? '<div style="color: grey; text-align:right">[step '+(tutorial2.currentPage+1)+'/'+tutorial2.nPages+']</div>' : '';
        guide.html(stepcounter+(typeof page.guide == 'string'? page.guide : page.guide(result)));
        tutorial2.makeGuidSamplesClickable();
        // Update the location anchor
        if (tutorial2.currentPage != null)
            window.location = '/tutorial2'+'/#step' + n;
        tutorial2.currentPage = n;
        // Setup a hook for the next page
        var nextPage = tutorial2.pages.list[n];
        
        if(nextPage) {
            tutorial2.successHook = function(result){
                if (nextPage.trigger &&
                    nextPage.trigger(result))
                    tutorial2.setPage(n+1,result);
            };
        }
    } else {
        throw "Unknown page number: " + n;
    }
};


//Set the current page.
tutorial2.reset = function(){
   
        // Update the current page content
        var guide = $('#guide');
  
        tutorial2.makeGuidSamplesClickable();
        // Update the location anchor  
            window.location = '/tutorial2/';            
};


// Make the code examples in the guide clickable so that they're
// inserted into the console.
tutorial2.makeGuidSamplesClickable = function() {
    $('#guide code').each(function(){
        $(this).css('cursor','pointer');
        $(this).attr('title','Click me to insert "' +
                     $(this).text() + '" into the console.');
        $(this).click(function(){
            tutorial2.controller.promptText($(this).text());
            tutorial2.controller.inner.click();
        });
    });
    $('span.code').each(function(){
    	
        $(this).css('cursor','pointer');
        
//        $(this).attr('title','Click me to insert "' +
//                     $(this).text() + '" into the console.');
        $(this).click(function(){
//        	$(this).css('color','blue');
            tutorial2.controller.promptText($(this).attr('data-step'));            
            tutorial2.controller.inner.click();            
        });
    });
    
}

// Display the currently active users
tutorial2.activeUsers = function(){
    var active = $('.active-users');
    // Tomorrow theme
    var colors =
        [// Tomorrow theme
          "#f5871f" // Orange
         ,"#eab700" // Yellow
         ,"#718c00" // Green
         ,"#3e999f" // Aqua
         ,"#4271ae" // Blue
         ,"#8959a8" // Purple
         // Solarized theme
         ,"#073642" // base02
         ,"#586e75" // base01
         ,"#b58900" // yellow
         ,"#cb4b16" // orange
         ,"#dc322f" // red
         ,"#d33682" // magenta
         ,"#6c71c4" // violet
         ,"#268bd2" // blue
         ,"#2aa198" // cyan
         ,"#859900" // green
        ]
    var color_index = 0;
    var color_cache = {};
    function update(){
        if(!$('.active-users').is(':visible')) return;
        $.get('/users',function(users){
            users = JSON.parse(users);
            $('.active-users .user').remove();
            var color;
            for(var i = 0; i < users.length; i++){
                if(typeof color_cache[users[i][0].toString()] != 'number') {
                    color_cache[users[i][0].toString()] = color_index;
                    color_index++;
                }
                color = colors[color_cache[users[i][0].toString()] % colors.length];
                if (!color) color = colors[5];
                active.append($('<div class="user"></div>').css('background-color',color));
            }
        });
    }
//    setInterval(update,5000);
    update();
};

// Handy method.
String.prototype.trim = function() {
    return this.replace(/^[\t ]*(.*)[\t ]*$/,'$1');
};

// Main entry point.
$(function(){
    tutorial2.showWarnings();
    tutorial2.makeController();
    tutorial2.makeGuide();
    tutorial2.activeUsers();
});
