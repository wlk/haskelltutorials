// WV: actually, this is entirely generic
// Main tutorial2 module.
tutorial23 = {};
tutorial23.url=window.location.href;
tutorial23.hostname = '127.0.0.1';
tutorial23.port = '4001';

// A success hook which can be bound and rebound or set as null.
tutorial23.successHook = null;

// The current page number.
tutorial23.currentPage = null;
tutorial23.nPages = null;

// Stdout state from the current IO evaluation.
tutorial23.stdout = [];

// Stdin state for the current IO evaluation.
tutorial23.stdin = [];

// IO expression.
tutorial23.io = null;

// WV extensions for HaskellMOOC
// Allow continue on error
tutorial23.continueOnError = false;
// Handle context for equations
tutorial23.equations=[];
tutorial23.isEq = false;
tutorial23.forget = function(varname) {
//	alert('FORGET');
	var remaining_eqs = [];
         for (var i = 0; i <  tutorial23.equations.length; i++) {
             var eq = tutorial23.equations[i];
             var chunks = eq.split(/\s*=\s*/);
             var lhs = chunks[0].trim(); // WV: but somehow there is still a trailing whitespace char after the varname in lhs!             
//             alert('<'+lhs+'><'+varname+'>');
             varre = new RegExp('\\b'+varname+'\\b');
             if (!varre.test(lhs)) {
//            	 alert('Pushing '+eq);
            	 remaining_eqs.push(tutorial23.equations[i]);
             }
         }
         tutorial23.equations=remaining_eqs;
//         alert(varname+" => "+tutorial23.equations);
}

tutorial23.undo  = function() {
    if (tutorial23.isEq) {
     tutorial23.equations.pop();
    }
}


// Files in the file system.
tutorial23.files = {
    "/hello": "Hello, World!",
    "/files": "Your file system changes will stick around in your browser's local storage!",
    "/welcome": "Welcome to your mini filesystem! Try playing with this function: getDirectoryContents",
    "/functions": "You can also check out removeFile, writeFile, appendFile"
};

try {
    if(typeof(Storage)!=="undefined")
    {
        tutorial23.files = (localStorage.files && JSON.parse(localStorage.files))
            || tutorial23.files;
    };
} catch (e){ tutorial23.files = {} }

tutorial23.showWarnings = function() {
    !navigator.cookieEnabled     && $("#cookie-warning").show();
    window['localStorage']==null && $("#storage-warning").show();
}

// A pre-command hook which can prevent the command from being run if
// it returns true.
tutorial23.preCommandHook = function(line,report){
    var m, pages = tutorial23.pages.list;
    tutorial23.nPages = pages.length;
    tutorial23.isEq = false;
    // if the line matches step{$n} then get page $n from  tutorial23.pages.list (i.e. pages)
    if (m = line.trim().match(/^step([0-9]+)/)) {
        var n = m[1] * 1;
        if (n <= pages.length) {
            tutorial23.setPage(n,null);
            report();
            return [true,'True'];
        }
    }
    else if (m = line.trim().match(/^lesson([0-9]+)/)) {
        // 'lesson' is simply an attribute of a page, a label to say to which lesson a page belongs.
        var n = m[1] * 1;
        for (var i = 0; i < pages.length; i++) {
            if (pages[i].lesson == n) {
                tutorial23.setPage(i,null);
                report();
                return [true,'True'];
            }
        }
    } else if (line.trim() == 'next') {
        if (tutorial23.currentPage < tutorial23.pages.list.length) {
            tutorial23.setPage(tutorial23.currentPage + 1);
        }
        report();
        return [true,'True'];
    } else if (line.trim() == 'back' || line.trim() == 'prev') {
        if (tutorial23.currentPage > 1) {
            tutorial23.setPage(tutorial23.currentPage - 1);
        }
        report();
        return [true,'True'];
    } else if (line.trim() == 'help' || line.trim() == 'start' ) {
        tutorial23.setPage(2,null);
        report();
        return [true,'True'];
    } else if (/^undo/.test(line.trim()) ) {
        tutorial23.undo();
        report();        
        return [true,'True'];
    } else if (/^forget/.test(line.trim()) ) {
        var chunks = line.trim().split(/\s+/);
        var varname = chunks[1];
        tutorial23.forget(varname);
        report();
        return [true,'True'];
    }  else if (!/^let/.test( line.trim() ) && /^\w+(\s+\w+)*\s*=[^=\>\<]/.test( line.trim() ) ) {
    	// This is an equation.     	
        var nline = line.trim();
        tutorial23.isEq = true;
        tutorial23.equations.push(nline);
        var context = '';
        if (tutorial23.equations.length>0) {
        	context = 'let {'+ tutorial23.equations.join(';') +' } in ';
        }
         var chunks = nline.split(/\s+=\s+/);
         var lhs = chunks[0];
         var rhs=chunks[1];
         // Now, if the rhs is a lambda we should not return the lhs
         // This is weak, because if I bind a lambda to f and then bind f to g, I'm still in trouble
         var isLambda = false;
         if (/\\/.test(rhs)) {
        	 isLambda = true;      
        	 alert("LAMBDA:"+rhs)
         }
         //lhs.replace(/\W+/g,'');
         //rhs.replace(/\W+/g,'');
//         alert('PRE:<'+lhs+'><'+rhs+'>');
         // This is a naive check for recursion, we ignore the context
         
         var re = new RegExp('\\b'+lhs+'\\b');
         if (re.test(rhs)) {
//        	 alert('Recursion!');
             tutorial23.equations.pop();
             tutorial23.isEq = false;
             line = 'let '+nline+' in '+lhs;
         } else {
             if (!isLambda) {
		 line = context + lhs;
             } else {
        	 line = context + '"'+rhs+'"';
             }
         }
        return [false,line];
    } else {
        // OK, an expression that is not an equation
        line = 'let {'+ tutorial23.equations.join(';') +' } in '+line.trim();
    }
    return [false,line];
};

// Make the console controller.
tutorial23.makeController = function(){
    tutorial23.controller = $('#console').console({
        promptLabel: 'λ ',
        commandValidate: function(line){
            if (line == "") return false;
            else return true;
        },
        commandHandle: function(line,report){
//            alert(tutorial.io);
            if(tutorial23.io === null){
                var retval = tutorial23.preCommandHook(line,report);
                var ignoreCommand = retval[0];
                var newLine = retval[1];
                if(!ignoreCommand){
                    tutorial23.ajaxCommand(newLine,report,[]);
                }
            } else {
                tutorial23.stdin.push(line);
                tutorial23.ajaxCommand(tutorial23.io,report,tutorial23.stdin);
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
tutorial23.ajaxCommand = function(line,report,stdin){
    var args = { 'exp': line,
                 'args': JSON.stringify([stdin,tutorial23.files])
               };
    $.ajax({
        url: '/eval',
        dataType: 'json',
        type: 'POST',
        data: args,
        success: function(result){
            if(result.stdout !== undefined){
 //               alert(result.stdout);
                tutorial23.files = result.files;
                result = result.stdout;
                tutorial23.io = line;
                var msgs = [];
                if(result != null){
                    for(var i = tutorial23.stdout.length; i < result.length; i++) {
                        msgs.push({ msg: result[i], className: 'jquery-console-stdout' });
                    }
                }
                tutorial23.stdout = result;
                tutorial23.controller.continuedPrompt = true;
                report(msgs);
                tutorial23.controller.continuedPrompt = false;
            } else {
                if(result.error !== undefined){
// A type error goes here,
// What I want is the option to carry on
                    result.expr = args.exp                    
                    if (tutorial23.continueOnError) {
                        if(tutorial23.successHook != null) {
                            tutorial23.successHook(result);
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
                    for(var i = tutorial23.stdout.length; i < result.stdout.length; i++) {
                        msgs.push({ msg: result.stdout[i], className: 'jquery-console-stdout' });
                    }
                    if(tutorial23.successHook != null) {
                        tutorial23.successHook(result);
                    }
                    if(result.type !== 'IO ()' && !result.value.match(/^</))
                        msgs.push({ msg: result.value, className: 'jquery-console-value' });
                    msgs.push({ msg: ':: ' + result.type, className: 'jquery-console-type' });
                    report(msgs);
                    tutorial23.files = result.files;
                }
                if (tutorial23.continueOnError) {
 // nothing                        
                } else {
                    tutorial23.io = null;
                    tutorial23.stdout = [];
                    tutorial23.stdin = [];
                }
            }
            if(typeof(Storage)!=="undefined")
            {
                localStorage.files = JSON.stringify(tutorial23.files);
            }
        }
    });
};

// Make the guide on the rhs.
tutorial23.makeGuide = function(){
    var match = window.location.href.match(/#step([0-9]+)$/);
    if(match){
        tutorial23.setPage(match[1]*1,null);
    } else {
        tutorial23.setPage(1,null);
    }
};

// Set the current page.
tutorial23.setPage = function(n,result){
    var page = tutorial23.pages.list[n-1];
    if(page){
        // Update the current page content
        var guide = $('#guide');
        var stepcounter = (tutorial23.currentPage != null) ? '<div style="color: grey; text-align:right">[step '+(tutorial23.currentPage+1)+'/'+tutorial23.nPages+']</div>' : '';
        guide.html(stepcounter+(typeof page.guide == 'string'? page.guide : page.guide(result)));
        tutorial23.makeGuidSamplesClickable();
        // Update the location anchor
        if (tutorial23.currentPage != null)
            window.location = '/tutorial23'+'/#step' + n;
        tutorial23.currentPage = n;
        // Setup a hook for the next page
        var nextPage = tutorial23.pages.list[n];
        
        if(nextPage) {
            tutorial23.successHook = function(result){
                if (nextPage.trigger &&
                    nextPage.trigger(result))
                    tutorial23.setPage(n+1,result);
            };
        }
    } else {
        throw "Unknown page number: " + n;
    }
};

// Make the code examples in the guide clickable so that they're
// inserted into the console.
tutorial23.makeGuidSamplesClickable = function() {
    $('#guide code').each(function(){
        $(this).css('cursor','pointer');
        $(this).attr('title','Click me to insert "' +
                     $(this).text() + '" into the console.');
        $(this).click(function(){
            tutorial23.controller.promptText($(this).text());
            tutorial23.controller.inner.click();
        });
    });
}

// Display the currently active users
tutorial23.activeUsers = function(){
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
    tutorial23.showWarnings();
    tutorial23.makeController();
    tutorial23.makeGuide();
    tutorial23.activeUsers();
});
