var variables = require('./GameFunds/variables'),
    gameMenu = require('./GameMenu/gameMenu');

exports.logIn = function(key) {
    ctx.clear();
    
    ctx.point(0, 3, 'Enter an username: ' + username);
    ctx.point(0, 4, 'Enter a password: ' + password);

    if(!isUsernameSet)
        variables.enterUsername(key);
    
    else if(!isPasswordSet){
        variables.enterPassword(key);
        
        if(isPasswordSet){
            
            variables.getRequest();
            var dbContent = JSON.parse(fs.readFileSync('alphaDummy.json'));

            var usernameIndex = variables.searchArray(dbContent['username'], username),
                passwordIndex = variables.searchArray(dbContent['password'], password);
                        console.log(username + ' '  + password);

            if(usernameIndex == -1){
                ctx.point('No such user found');
                username = '';
                password = '';
                isUsernameSet = false;
                isPasswordSet = false;
            }   
            // damn son nemo is found
            if(usernameIndex == passwordIndex && passwordIndex != -1){
                userProfile = dbContent[username + '-Profile'];
                userFriends = userProfile['friends'];
                profileUsername = username;
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
}

