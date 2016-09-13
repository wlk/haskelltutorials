// WV: actually, this is entirely generic
// Main tutorial32 module.
tutorial32 = {};
tutorial32.url=window.location.href;
tutorial32.hostname = '127.0.0.1';
tutorial32.port = '4001';

// A success hook which can be bound and rebound or set as null.
tutorial32.successHook = null;

// The current page number.
tutorial32.currentPage = null;
tutorial32.nPages = null;

// Stdout state from the current IO evaluation.
tutorial32.stdout = [];

// Stdin state for the current IO evaluation.
tutorial32.stdin = [];

// IO expression.
tutorial32.io = null;

// WV extensions for HaskellMOOC
// Allow continue on error
tutorial32.continueOnError = false;
// Handle context for equations
tutorial32.equations=[];
tutorial32.isEq = false;
tutorial32.forget = function(varname) {
//	alert('FORGET');
	var remaining_eqs = [];
         for (var i = 0; i <  tutorial32.equations.length; i++) {
             var eq = tutorial32.equations[i];
             var chunks = eq.split(/\s*=\s*/);
             var lhs = chunks[0].trim(); // WV: but somehow there is still a trailing whitespace char after the varname in lhs!             
//             alert('<'+lhs+'><'+varname+'>');
             varre = new RegExp('\\b'+varname+'\\b');
             if (!varre.test(lhs)) {
//            	 alert('Pushing '+eq);
            	 remaining_eqs.push(tutorial32.equations[i]);
             }
         }
         tutorial32.equations=remaining_eqs;
//         alert(varname+" => "+tutorial32.equations);
}

tutorial32.undo  = function() {
//    if (tutorial32.isEq) {
     tutorial32.equations.pop();
//    }
}

tutorial32.wipe = function() {    
     tutorial32.equations=[]  ;  
}

// Files in the file system.
tutorial32.files = {
    "/hello": "Hello, World!",
    "/files": "Your file system changes will stick around in your browser's local storage!",
    "/welcome": "Welcome to your mini filesystem! Try playing with this function: getDirectoryContents",
    "/functions": "You can also check out removeFile, writeFile, appendFile"
};

try {
    if(typeof(Storage)!=="undefined")
    {
        tutorial32.files = (localStorage.files && JSON.parse(localStorage.files))
            || tutorial32.files;
    };
} catch (e){ tutorial32.files = {} }

tutorial32.showWarnings = function() {
    !navigator.cookieEnabled     && $("#cookie-warning").show();
    window['localStorage']==null && $("#storage-warning").show();
}

// A pre-command hook which can prevent the command from being run if
// it returns true.
tutorial32.preCommandHook = function(line,report){
    var m, pages = tutorial32.pages.list;
    tutorial32.nPages = pages.length;
    tutorial32.isEq = false;
    // if the line matches step{$n} then get page $n from  tutorial32.pages.list (i.e. pages)
    if (m = line.trim().match(/^step\s*([0-9]+)/)) {
        var n = m[1] * 1;
        if (n <= pages.length) {
            tutorial32.setPage(n,null);
            report();
            return [true,'True'];
        }
    }
    else if (m = line.trim().match(/^lesson([0-9]+)/)) {
        // 'lesson' is simply an attribute of a page, a label to say to which lesson a page belongs.
        var n = m[1] * 1;
        for (var i = 0; i < pages.length; i++) {
            if (pages[i].lesson == n) {
                tutorial32.setPage(i,null);
                report();
                return [true,'True'];
            }
        }
    } else if (line.trim() == 'next') {
        if (tutorial32.currentPage < tutorial32.pages.list.length) {
            tutorial32.setPage(tutorial32.currentPage + 1);
        }
        report();
        return [true,'True'];
    } else if (line.trim() == 'back' || line.trim() == 'prev') {
        if (tutorial32.currentPage > 1) {
            tutorial32.setPage(tutorial32.currentPage - 1);
        }
        report();
        return [true,'True'];
    } else if (line.trim() == 'start' ) {
        tutorial32.setPage(1,null);
        report();
        return [true,'True'];        
    } else if (line.trim() == 'help' ) {
        tutorial32.setPage(tutorial32.pages.list.length,null);
        report();
        return [true,'True'];
    } else if (/^reset/.test(line.trim()) ) {
        tutorial32.reset();
        report();        
        return [true,'True'];
        
    } else if (/^(erase|wipe)/.test(line.trim()) ) {
        tutorial32.wipe();
        report();        
        return [true,'True'];
        
    } else if (/^undo/.test(line.trim()) ) {
        tutorial32.undo();
        report();        
        return [true,'True'];
    } else if (/^(context|show)/.test(line.trim()) ) {        
        report();     
        alert('{ '+ tutorial32.equations.join(';') +' }');
        return [true,'True'];        
    } else if (/^forget/.test(line.trim()) ) {
        var chunks = line.trim().split(/\s+/);
        var varname = chunks[1];
        tutorial32.forget(varname);
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
        tutorial32.isEq = true;
        tutorial32.equations.push(nline);
        var context = '';
        if (tutorial32.equations.length>0) {
        	context = 'let {'+ tutorial32.equations.join(';') +' } in ';
        }
         var chunks = nline.split(/\s+=\s+/);
         var lhs = chunks[0];
         var rhs=chunks[1];
         // Now, if the rhs is a lambda we should not return the lhs
         // This is weak, because if I bind a lambda to f and then bind f to g, I'm still in trouble
         var isLambda = false;
         if (/^\\/.test(rhs)) {
        	 isLambda = true;      
//        	 alert("LAMBDA:"+rhs);
         }
         //lhs.replace(/\W+/g,'');
         //rhs.replace(/\W+/g,'');
//         alert('PRE:<'+lhs+'><'+rhs+'>');
         // This is a naive check for recursion, we ignore the context
         
         var re = new RegExp('\\b'+lhs+'\\b');
         if (re.test(rhs)) {
//        	 alert('Recursion!');
             tutorial32.equations.pop();
             tutorial32.isEq = false;
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
        tutorial32.isEq = true;
        
        tutorial32.equations.push(nline);
        var context = '';
        if (tutorial32.equations.length>0) {
        	context = 'let {'+ tutorial32.equations.join(';') +' } in '+retval2;//'True';
        }
//        alert(context);
        line = context;                
        return [false,line];
    	
    } else {
        // OK, an expression that is not an equation
    	
        line = 'let {'+ tutorial32.equations.join(';') +' } in '+line.trim();
//        alert(line);
    }
    return [false,line];
};

// Make the console controller.
tutorial32.makeController = function(){
    tutorial32.controller = $('#console').console({
        promptLabel: 'λ ',
        commandValidate: function(line){
            if (line == "") return false;
            else return true;
        },
        commandHandle: function(line,report){
//            alert(tutorial.io);
            if(tutorial32.io === null){
                var retval = tutorial32.preCommandHook(line,report);
                var ignoreCommand = retval[0];
                var newLine = retval[1];
                if(!ignoreCommand){
                    tutorial32.ajaxCommand(newLine,report,[]);
                }
            } else {
                tutorial32.stdin.push(line);
                tutorial32.ajaxCommand(tutorial32.io,report,tutorial32.stdin);
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
tutorial32.ajaxCommand = function(line,report,stdin){
    var args = { 'exp': line,
                 'args': JSON.stringify([stdin,tutorial32.files])
               };
    $.ajax({
        url: '/eval',
        dataType: 'json',
        type: 'POST',
        data: args,
        success: function(result){
            if(result.stdout !== undefined){
 //               alert(result.stdout);
                tutorial32.files = result.files;
                result = result.stdout;
                tutorial32.io = line;
                var msgs = [];
                if(result != null){
                    for(var i = tutorial32.stdout.length; i < result.length; i++) {
                        msgs.push({ msg: result[i], className: 'jquery-console-stdout' });
                    }
                }
                tutorial32.stdout = result;
                tutorial32.controller.continuedPrompt = true;
                report(msgs);
                tutorial32.controller.continuedPrompt = false;
            } else {
                if(result.error !== undefined){
//                	alert('ERROR:'+result.error);
                	if (/No\ instance\ for\ .Typeable/.test(result.error)) {
//                		alert(args.exp);
                		tutorial32.continueOnError=true;
                		result.error = ":: ? -> ?";
                	} else
                	if (/No\ instance\ for\ .Show/.test(result.error)) {
//                		alert(result.error);
//                		tutorial32.continueOnError=true;
                		result.error = "Sorry, I can't display this result.";
                	}
//                	else
//                		if (/No\ instance\ for\ ./.test(result.error)) {
//                    		tutorial32.continueOnError=true;
//                    		result.error = ":: Expr";
//                    	}
//                	if (/Could\ not\ deduce\ .Ord/.test(result.error)) {
//                		
//                	}
// A type error goes here,
// What I want is the option to carry on
                    result.expr = args.exp;                    
                    if (tutorial32.continueOnError) {
                        if(tutorial32.successHook != null) {
                            tutorial32.successHook(result);
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
                    for(var i = tutorial32.stdout.length; i < result.stdout.length; i++) {
                        msgs.push({ msg: result.stdout[i], className: 'jquery-console-stdout' });
                    }
                    if(tutorial32.successHook != null) {
                        tutorial32.successHook(result);
                    }
                    if(result.type !== 'IO ()' && !result.value.match(/^</))
                        msgs.push({ msg: result.value, className: 'jquery-console-value' });
                    msgs.push({ msg: ':: ' + result.type, className: 'jquery-console-type' });
                    report(msgs);
                    tutorial32.files = result.files;
                }
                if (tutorial32.continueOnError) {
 // nothing                        
                } else {
                    tutorial32.io = null;
                    tutorial32.stdout = [];
                    tutorial32.stdin = [];
                }
            }
            if(typeof(Storage)!=="undefined")
            {
                localStorage.files = JSON.stringify(tutorial32.files);
            }
        }
    });
};

// Make the guide on the rhs.
tutorial32.makeGuide = function(){
    var match = window.location.href.match(/#step([0-9]+)$/);
    if(match){
        tutorial32.setPage(match[1]*1,null);
    } else {
        tutorial32.setPage(1,null);
    }
};

// Set the current page.
tutorial32.setPage = function(n,result){
    var page = tutorial32.pages.list[n-1];
    if(page){
        // Update the current page content
        var guide = $('#guide');
        var stepcounter = (tutorial32.currentPage != null) ? '<div style="color: grey; text-align:right">[step '+(tutorial32.currentPage+1)+'/'+tutorial32.nPages+']</div>' : '';
        guide.html(stepcounter+(typeof page.guide == 'string'? page.guide : page.guide(result)));
        tutorial32.makeGuidSamplesClickable();
        // Update the location anchor
        if (tutorial32.currentPage != null)
            window.location = '/tutorial32'+'/#step' + n;
        tutorial32.currentPage = n;
        // Setup a hook for the next page
        var nextPage = tutorial32.pages.list[n];
        
        if(nextPage) {
            tutorial32.successHook = function(result){
                if (nextPage.trigger &&
                    nextPage.trigger(result))
                    tutorial32.setPage(n+1,result);
            };
        }
    } else {
        throw "Unknown page number: " + n;
    }
};


//Set the current page.
tutorial32.reset = function(){
   
        // Update the current page content
        var guide = $('#guide');
  
        tutorial32.makeGuidSamplesClickable();
        // Update the location anchor  
            window.location = '/tutorial32/';            
};


// Make the code examples in the guide clickable so that they're
// inserted into the console.
tutorial32.makeGuidSamplesClickable = function() {
    $('#guide code').each(function(){
        $(this).css('cursor','pointer');
        $(this).attr('title','Click me to insert "' +
                     $(this).text() + '" into the console.');
        $(this).click(function(){
            tutorial32.controller.promptText($(this).text());
            tutorial32.controller.inner.click();
        });
    });
    $('span.code').each(function(){
    	
        $(this).css('cursor','pointer');
        
//        $(this).attr('title','Click me to insert "' +
//                     $(this).text() + '" into the console.');
        $(this).click(function(){
//        	$(this).css('color','blue');
            tutorial32.controller.promptText($(this).attr('data-step'));            
            tutorial32.controller.inner.click();            
        });
    });
    
}

// Display the currently active users
tutorial32.activeUsers = function(){
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
    tutorial32.showWarnings();
    tutorial32.makeController();
    tutorial32.makeGuide();
    tutorial32.activeUsers();
});
