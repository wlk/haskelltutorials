// WV: actually, this is entirely generic
// Main tutorial1 module.
tutorial1 = {};

// A success hook which can be bound and rebound or set as null.
tutorial1.successHook = null;

// The current page number.
tutorial1.currentPage = null;
tutorial1.nPages = null;

// Stdout state from the current IO evaluation.
tutorial1.stdout = [];

// Stdin state for the current IO evaluation.
tutorial1.stdin = [];

// IO expression.
tutorial1.io = null;

// WV extensions for HaskellMOOC
// Allow continue on error
tutorial1.continueOnError = false;
// Handle context for equations
tutorial1.equations=[];
tutorial1.isEq = false;
tutorial1.forget = function(varname) {
//	alert('FORGET');
	var remaining_eqs = [];
         for (var i = 0; i <  tutorial1.equations.length; i++) {
             var eq = tutorial1.equations[i];
             var chunks = eq.split(/\s*=\s*/);
             var lhs = chunks[0].trim(); // WV: but somehow there is still a trailing whitespace char after the varname in lhs!             
//             alert('<'+lhs+'><'+varname+'>');
             varre = new RegExp('\\b'+varname+'\\b');
             if (!varre.test(lhs)) {
//            	 alert('Pushing '+eq);
            	 remaining_eqs.push(tutorial1.equations[i]);
             }
         }
         tutorial1.equations=remaining_eqs;
//         alert(varname+" => "+tutorial1.equations);
}

tutorial1.undo  = function() {
    if (tutorial1.isEq) {
     tutorial1.equations.pop();
    }
}


// Files in the file system.
tutorial1.files = {
    "/hello": "Hello, World!",
    "/files": "Your file system changes will stick around in your browser's local storage!",
    "/welcome": "Welcome to your mini filesystem! Try playing with this function: getDirectoryContents",
    "/functions": "You can also check out removeFile, writeFile, appendFile"
};

try {
    if(typeof(Storage)!=="undefined")
    {
        tutorial1.files = (localStorage.files && JSON.parse(localStorage.files))
            || tutorial1.files;
    };
} catch (e){ tutorial1.files = {} }

tutorial1.showWarnings = function() {
    !navigator.cookieEnabled     && $("#cookie-warning").show();
    window['localStorage']==null && $("#storage-warning").show();
}

// A pre-command hook which can prevent the command from being run if
// it returns true.
tutorial1.preCommandHook = function(line,report){
    var m, pages = tutorial1.pages.list;
    tutorial1.nPages = pages.length;
    tutorial1.isEq = false;
    // if the line matches step{$n} then get page $n from  tutorial1.pages.list (i.e. pages)
    if (m = line.trim().match(/^step([0-9]+)/)) {
        var n = m[1] * 1;
        if (n <= pages.length) {
            tutorial1.setPage(n,null);
            report();
            return [true,'True'];
        }
    }
    else if (m = line.trim().match(/^lesson([0-9]+)/)) {
        // 'lesson' is simply an attribute of a page, a label to say to which lesson a page belongs.
        var n = m[1] * 1;
        for (var i = 0; i < pages.length; i++) {
            if (pages[i].lesson == n) {
                tutorial1.setPage(i,null);
                report();
                return [true,'True'];
            }
        }
    } else if (line.trim() == 'next') {
        if (tutorial1.currentPage < tutorial1.pages.list.length) {
            tutorial1.setPage(tutorial1.currentPage + 1);
        }
        report();
        return [true,'True'];
    } else if (line.trim() == 'back' || line.trim() == 'prev') {
        if (tutorial1.currentPage > 1) {
            tutorial1.setPage(tutorial1.currentPage - 1);
        }
        report();
        return [true,'True'];
    } else if (line.trim() == 'help' || line.trim() == 'start' ) {
        tutorial1.setPage(2,null);
        report();
        return [true,'True'];
    } else if (/^undo/.test(line.trim()) ) {
        tutorial1.undo();
        report();        
        return [true,'True'];
    } else if (/^forget/.test(line.trim()) ) {
        var chunks = line.trim().split(/\s+/);
        var varname = chunks[1];
        tutorial1.forget(varname);
        report();
        return [true,'True'];
    }  else if (!/^let/.test( line.trim() ) && /^\w+(\s+\w+)*\s*=[^=\>\<]/.test( line.trim() ) ) {
        var nline = line.trim();
        tutorial1.isEq = true;
        tutorial1.equations.push(nline);
        var context = '';
        if (tutorial1.equations.length>0) {
        	context = 'let {'+ tutorial1.equations.join(';') +' } in ';
        }
         var chunks = nline.split(/\s+=\s+/);
         var lhs = chunks[0];
         var rhs=chunks[1];
         //lhs.replace(/\W+/g,'');
         //rhs.replace(/\W+/g,'');
//         alert('PRE:<'+lhs+'><'+rhs+'>');
         // This is a naive check for recursion, we ignore the context
         
         var re = new RegExp('\\b'+lhs+'\\b');
         if (re.test(rhs)) {
//        	 alert('Recursion!');
             tutorial1.equations.pop();
             tutorial1.isEq = false;
             line = 'let '+nline+' in '+lhs;
         } else {
             line = context + lhs;
         }
        return [false,line];
    } else {
        // OK, an expression that is not an equation
        line = 'let {'+ tutorial1.equations.join(';') +' } in '+line.trim();
    }
    return [false,line];
};

// Make the console controller.
tutorial1.makeController = function(){
    tutorial1.controller = $('#console').console({
        promptLabel: 'λ ',
        commandValidate: function(line){
            if (line == "") return false;
            else return true;
        },
        commandHandle: function(line,report){
//            alert(tutorial.io);
            if(tutorial1.io === null){
                var retval = tutorial1.preCommandHook(line,report);
                var ignoreCommand = retval[0];
                var newLine = retval[1];
                if(!ignoreCommand){
                    tutorial1.ajaxCommand(newLine,report,[]);
                }
            } else {
                tutorial1.stdin.push(line);
                tutorial1.ajaxCommand(tutorial1.io,report,tutorial1.stdin);
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
tutorial1.ajaxCommand = function(line,report,stdin){
    var args = { 'exp': line,
                 'args': JSON.stringify([stdin,tutorial1.files])
               };
    $.ajax({
        url: '/eval',
        dataType: 'json',
        type: 'POST',
        data: args,
        success: function(result){
            if(result.stdout !== undefined){
 //               alert(result.stdout);
                tutorial1.files = result.files;
                result = result.stdout;
                tutorial1.io = line;
                var msgs = [];
                if(result != null){
                    for(var i = tutorial1.stdout.length; i < result.length; i++) {
                        msgs.push({ msg: result[i], className: 'jquery-console-stdout' });
                    }
                }
                tutorial1.stdout = result;
                tutorial1.controller.continuedPrompt = true;
                report(msgs);
                tutorial1.controller.continuedPrompt = false;
            } else {
                if(result.error !== undefined){
// A type error goes here,
// What I want is the option to carry on
                    result.expr = args.exp                    
                    if (tutorial1.continueOnError) {
                        if(tutorial1.successHook != null) {
                            tutorial1.successHook(result);
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
                    for(var i = tutorial1.stdout.length; i < result.stdout.length; i++) {
                        msgs.push({ msg: result.stdout[i], className: 'jquery-console-stdout' });
                    }
                    if(tutorial1.successHook != null) {
                        tutorial1.successHook(result);
                    }
                    if(result.type !== 'IO ()' && !result.value.match(/^</))
                        msgs.push({ msg: result.value, className: 'jquery-console-value' });
                    msgs.push({ msg: ':: ' + result.type, className: 'jquery-console-type' });
                    report(msgs);
                    tutorial1.files = result.files;
                }
                if (tutorial1.continueOnError) {
 // nothing                        
                } else {
                    tutorial1.io = null;
                    tutorial1.stdout = [];
                    tutorial1.stdin = [];
                }
            }
            if(typeof(Storage)!=="undefined")
            {
                localStorage.files = JSON.stringify(tutorial1.files);
            }
        }
    });
};

// Make the guide on the rhs.
tutorial1.makeGuide = function(){
    var match = window.location.href.match(/#step([0-9]+)$/);
    if(match){
        tutorial1.setPage(match[1]*1,null);
    } else {
        tutorial1.setPage(1,null);
    }
};

// Set the current page.
tutorial1.setPage = function(n,result){
    var page = tutorial1.pages.list[n-1];
    if(page){
        // Update the current page content
        var guide = $('#guide');
        var stepcounter = (tutorial1.currentPage != null) ? '<div style="color: grey; text-align:right">[step '+(tutorial1.currentPage+1)+'/'+tutorial1.nPages+']</div>' : '';
        guide.html(stepcounter+(typeof page.guide == 'string'? page.guide : page.guide(result)));
        tutorial1.makeGuidSamplesClickable();
        // Update the location anchor
        if (tutorial1.currentPage != null)
            window.location = '/tutorial1'+'/#step' + n;
        tutorial1.currentPage = n;
        // Setup a hook for the next page
        var nextPage = tutorial1.pages.list[n];
        
        if(nextPage) {
            tutorial1.successHook = function(result){
                if (nextPage.trigger &&
                    nextPage.trigger(result))
                    tutorial1.setPage(n+1,result);
            };
        }
    } else {
        throw "Unknown page number: " + n;
    }
};

// Make the code examples in the guide clickable so that they're
// inserted into the console.
tutorial1.makeGuidSamplesClickable = function() {
    $('#guide code').each(function(){
        $(this).css('cursor','pointer');
        $(this).attr('title','Click me to insert "' +
                     $(this).text() + '" into the console.');
        $(this).click(function(){
            tutorial1.controller.promptText($(this).text());
            tutorial1.controller.inner.click();
        });
    });
}

// Display the currently active users
tutorial1.activeUsers = function(){
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
    tutorial1.showWarnings();
    tutorial1.makeController();
    tutorial1.makeGuide();
    tutorial1.activeUsers();
});
