var variables = require('./GameFunds/variables'),
    gameMenu = require('./GameMenu/gameMenu');

exports.logIn = function(key) {
    ctx.clear();

    if(!isUsernameSet){
        variables.enterUsername();
    }
    
    else if(!isPasswordSet)
        variables.enterPassword();

    else if(isPasswordSet){
            var usernameIndex = variables.searchArray(pleaseWork['username'], username),
                passwordIndex = variables.searchArray(pleaseWork['password'], password);
                        ctx.point(0, 20, username + ' VS '  + password);
                        

            /*if(usernameIndex == -1){
                ctx.point('No such user found');
                username = '';
                password = '';
                isUsernameSet = false;
                isPasswordSet = false;
            } */  
            
            // damn son nemo is found
            if(usernameIndex == passwordIndex && passwordIndex != -1){
                console.log('logged in');
                userProfile = pleaseWork[username + userID];
                profileUsername = username;
                userID = '#' + pleaseWork['uid'][usernameIndex];
                variables.postRequestChangeState('online');
                username = '';
                password = '';
                isUsernameSet = false;
                isPasswordSet = false;  
                currentLoginState = 'LoginMenu';
                gameMenu.loadMenu();
                currentModeState = 'Game Menu';
            }
        }
}

