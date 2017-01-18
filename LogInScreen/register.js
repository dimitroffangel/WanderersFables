var variables = require('../GameFunds/variables');

exports.register = function(key){
    ctx.clear();
    
    if(!isEmailSet)
        variables.enterEmail();
    
    else if(!isUsernameSet){
        variables.enterUsername();
    }
    
    else if(!isPasswordSet)
        variables.enterPassword();

    else if(isPasswordSet){
            isEmailSet = false;
            isUsernameSet = false;
            isPasswordSet = false;
            
            //variables.postRequestUserData();
            socket.emit('Register', {email: email, username:username,password: password});
            currentLoginState = 'LoginMenu';
    
            socket.on('registerFailed', function(data){
                isEmailSet = false;
                isUsernameSet = false;
                isPasswordSet = false;
            });
            ctx.point(0, 12, email + 'V' + username + ' VS ' + password);
            email = '';
            username = '';
            password = '';
    }
}