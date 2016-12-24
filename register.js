var variables = require('./GameFunds/variables');

exports.register = function(key){
    ctx.clear();
    
    if(!isUsernameSet){
        variables.enterUsername();
    }
    
    else if(!isPasswordSet)
        variables.enterPassword();

    else if(isPasswordSet){
            isUsernameSet = false;
            isPasswordSet = false;
            
            //variables.postRequestUserData();
            socket.emit('Register', {username:username, password: password});
            currentLoginState = 'LoginMenu';
            ctx.point(0, 12, username + ' VS ' + password);
            username = '';
            password = '';
    }
}