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

            var usernameIndex = variables.searchPattern(dbContent['username'], username),
                passwordIndex = variables.searchPattern(dbContent['password'],password);
            
            if(usernameIndex == -1){
                ctx.point('No such user found');
                username = '';
                password = '';
                isUsernameSet = false;
                isPasswordSet = false;
            }   
            
            else{ // check password match
                var usernameCommasFound = 0,
                    passwordCommasFound = 0;
                
                for(var i = usernameIndex; i >= 0; i-=1){
                    if(dbContent.username[i] == ',')
                        usernameCommasFound +=1;
                }
                
                // now, search in the password field
                for(var i = passwordIndex; i>= 0; i-=1){
                    if(dbContent.password[i] == ',')
                        passwordCommasFound+=1;
                }
            }
            
            // damn son nemo is found
            if(passwordCommasFound == usernameCommasFound && passwordIndex != -1){
                currentLoginState = 'LoginMenu';
                userProfile = dbContent[username + '-Profile'];
                userFriends = userProfile['friends'];
                profileUsername = username;
                username = '';
                password = '';
                isUsernameSet = false;
                isPasswordSet = false;
                gameMenu.loadMenu();
                currentModeState = 'Game Menu';
            }
        }
    }
}

