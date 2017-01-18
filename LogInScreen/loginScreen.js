var variables = require('../GameFunds/variables'),
    logIn = require('./logIn'),
    register = require('./register');

function printCurrentMode(key){
    var i,
        length;
    
    if(currentLoginState == 'LoginMenu'){
        length = logInOptions.length;
        
        for(i = 0; i < length; i+=1){
            ctx.bg(255, 0, 0);
            
            ctx.box(boxX, boxY + (i+1) * 4, boxWidth, boxHeight);
            
            ctx.text(boxX, boxY + (i+1) * 4, '\t' + logInOptions[i]);
            
            ctx.cursor.restore();
            console.log('\n');
        }
    }
    
    if(currentLoginState == 'Log In')
        logIn.logIn(key);
        
    else if(currentLoginState == 'Register')
        register.register(key);        
}

exports.loginMenu = function(key){
    ctx.clear();
    
    ctx.point(0, 2, 'Cursor at ' + logInOptions[currentLoginIndex]);
    
    if(!key)
        return;
    
    if(currentLoginState == 'LoginMenu' &&
       key.name == 'up' && currentLoginIndex > 0)
        currentLoginIndex-=1;
    
    else if(currentLoginState == 'LoginMenu' &&
            key.name == 'down' && currentLoginIndex < logInOptions.length - 1)
        currentLoginIndex+=1;
    else if(currentLoginState == 'LoginMenu' &&
            key.name == 'return')
        currentLoginState = logInOptions[currentLoginIndex];

    printCurrentMode(key);
    if(loggedUsername != '')
        return;
    
    ctx.point(0, 2, 'Cursor at ' + logInOptions[currentLoginIndex]);
}