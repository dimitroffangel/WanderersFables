var variables = require('./GameFunds/variables');

exports.register = function(key){
    ctx.clear();
    
    if(!isUsernameSet){
        variables.enterUsername();
        
        if(isUsernameSet){
            var dbContent = JSON.parse(fs.readFileSync('alphaDummy.json'));
            
            var foundAt = variables.searchArray(pleaseWork['username'], username);
                
            if(foundAt != -1){
                ctx.point(0, 2, 'The chosen username is taken');
                isUsernameSet = false;
                username = '';
            }
        }
    }
    
    else if(!isPasswordSet)
        variables.enterPassword();

    else if(isPasswordSet){
            isUsernameSet = false;
            isPasswordSet = false;
            
            variables.postRequestUserData();
            currentLoginState = 'LoginMenu';
            ctx.point(0, 12, username + ' VS ' + password);
            username = '';
            password = '';
    }
}