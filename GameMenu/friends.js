var variables = require('../GameFunds/variables');

var lastKey = 'return';

exports.friendsMenu = function(key){
    ctx.clear();
    printIndex();
    printFriendMode(key);
    
    if(key.name == 'up' && friendIndex > 0)
        friendIndex-=1;
    else if(key.name == 'down'){
        if(friendChosenOption == 'Friends Menu' && 
           friendIndex < friendsOptions.length - 1)
            friendIndex+=1;
        else if(friendChosenOption == 'Chat with a friend' ||
                friendChosenOption == 'Show friends' && 
                friendIndex < userFriends.length -1)
            friendIndex+=1;
    }
    else if(key.name == 'return' && lastKey != 'return'){
           if(friendChosenOption == 'Friends Menu'){
                friendChosenOption = friendsOptions[friendIndex];
                if(friendChosenOption == 'Accept friend requests'){
                    variables.getRequest();
                    var dbContent = fs.readFileSync('alphaDummy.json');
                    
                }
            }
        else if(friendChosenOption == 'Show friends'){
            variables.getRequest();
            var db = 
                JSON.parse(fs.readFileSync('alphaDummy.json'));
            friendProfile = db[userFriends[friendIndex] + '-Profile'];
            friendChosenOption = 'Friend Profile';
        }
        else if(friendChosenOption == 'Send friend request'){
            variables.getRequest();
            var db = JSON.parse(fs.readFileSync('alphaDummy.json'));
            
            var isFound = variables.searchPattern(db.username, inputFriendRequest);
            if(isFound != -1){
                var requestTo = db[userFriends[friendIndex] + '-Profile'];
                requestTo.requestsFrom.push('mama');
                variables.postRequestFriendRequest(profileUsername, userFriends[friendIndex]);
                variables.getRequest();
                ctx.point(0, 4, 'Your friend request was sent');
            }
            else{
                ctx.point(0, 4, 'User with such a name is non-existent');
                inputFriendRequest = '';
            }
        }   
        friendIndex = 0;
    }
    
    printIndex();
    lastKey = key.name;
}

function printFriendMode(key){
    var i,
        length;
    
    if(friendChosenOption == 'Friends Menu'){
        length = friendsOptions.length;
        
        for(i = 0; i < length; i+=1){
            ctx.bg(255, 0, 0);
            ctx.box(boxX,  boxY + (i + 1) * 4, boxWidth, boxHeight);
            
            ctx.text(boxX, boxY + (i + 1) * 4,'\t' +  friendsOptions[i]);
            
            ctx.cursor.restore();
            console.log('\n');
        }
    }
    
    else if(friendChosenOption == 'Show friends'){
        length = userFriends.length;
        
        for(i = 0; i < length; i+=1)
            ctx.point(0, 4+i, userFriends[i]);
    }
    
    else if(friendChosenOption == 'Friend Profile'){
        ctx.point(0, 3, 'Name: ' + userFriends[friendIndex]);
        ctx.point(0, 4, 'Level: ' + friendProfile['Level']);
        ctx.point(0, 5, 'Wins: ' + friendProfile['Wins']);
    }
    
    else if(friendChosenOption == 'Send friend request'){
        if(key.name != 'return')
            inputFriendRequest += key.name;
        ctx.point(0, 3, 'Enter player"s name:' + inputFriendRequest);
    }

    else if(friendChosenOption == 'Accept friend requests'){
        length = userRequests.length;
        
        for(i = 0; i <length;i+=1)
            ctx.point(0, 4+i, userRequests[i]);
    }
}

function printIndex(){
    if(friendChosenOption == 'Friends Menu')
        ctx.point(0, 1, friendsOptions[friendIndex] + friendIndex);
    else if(friendChosenOption == 'Chat with a friend' ||
            friendChosenOption == 'Show friends')
        ctx.point(0, 1, userFriends[friendIndex] + userFriends.length);
}