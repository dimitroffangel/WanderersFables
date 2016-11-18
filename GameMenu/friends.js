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
        else if((friendChosenOption == 'Chat with a friend' ||
                friendChosenOption == 'Show friends') && 
                friendIndex < userFriends.length -1)
            friendIndex+=1;
        else if(friendChosenOption=='Choose state'&& friendIndex<stateOptions.length - 1)
            friendIndex+=1;
    }
    else if(key.name == 'backspace')
        friendChosenOption = 'Friends Menu';
    
    else if(key.name == 'return' && lastKey != 'return'){
           if(friendChosenOption == 'Friends Menu'){
                friendChosenOption = friendsOptions[friendIndex];
                if(friendChosenOption == 'Accept friend requests'){
                    variables.getRequest();     
                    var db = JSON.parse(fs.readFileSync('alphaDummy.json'));
                    userProfile = db[profileUsername + '-Profile'];
                }
               else if(friendChosenOption == 'Chat with a friend' ||
                       friendChosenOption == 'Show friends'){
                    variables.getRequest();
                   var db = JSON.parse(fs.readFileSync('alphaDummy.json'));
                   userProfile = db[profileUsername+'-Profile'];
                   userFriends = userProfile['friends'];
               }
            }
        else if(friendChosenOption == 'Chat with a friend'){
            friendChosenOption = 'Chatting';
            variables.getRequest();
            var db =
                JSON.parse(fs.readFileSync('alphaDummy.json'));
            chatFriend = userFriends[friendIndex];
            friendProfile = db[chatFriend + '-Profile'];
            allChats = db['chat'];
            chatHistory = allChats[chatFriend + '-' + profileUsername];
            if(!chatHistory)
                chatHistory = allChats[profileUsername + '-' + chatFriend];
        }
        
        else if(friendChosenOption == 'Chatting'){
            variables.postRequestSendMessage(profileUsername, chatFriend);
            inputMessage = '';
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
            
            var isFound = variables.searchArray(db.username, inputFriendRequest);
            if(isFound != -1){
                console.log(inputFriendRequest);
                variables
                    .postRequestFriendRequest(profileUsername, inputFriendRequest);
                variables.getRequest();
                ctx.point(0, 4, 'Your friend request was sent');
            }
            else{
                ctx.point(0, 4, 'User with such a name is non-existent');
                inputFriendRequest = '';
            }
        }   
        else if(friendChosenOption == 'Accept friend requests'){
            variables
                .postRequestAcceptFriend(profileUsername, 
                                         userProfile['requestsFrom'][friendIndex]);
            friendChosenOption = 'Friends Menu';
        }
        else if(friendChosenOption == 'Choose state'){
            variables.getRequest();
            
            userState = stateOptions[friendIndex];
            variables.postRequestChangeState(userState);
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
    
    else if(friendChosenOption == 'Show friends' ||
            friendChosenOption == 'Chat with a friend'){
        length = userFriends.length;
        
        for(i = 0; i < length; i+=1)
            ctx.point(0, 4+i, userFriends[i]);
    }
    
    else if(friendChosenOption == 'Chatting'){
        if(key.name != 'return' && key.name != 'up' && key.name != 'down' &&
           key.name != 'right' && key.name != 'left')
            inputMessage += key.name;
        
        variables.getRequest();
            var db =
                JSON.parse(fs.readFileSync('alphaDummy.json'));
            allChats = db['chat'];
            chatHistory = allChats[chatFriend + '-' + profileUsername];
            if(!chatHistory)
                chatHistory = allChats[profileUsername + '-' + chatFriend];
        
        i = 0;
        length = chatHistory.length;
        
        if(key.name == 'right' && onPage + 10 <= length)
            onPage+=10;
        else if(key.name == 'left' && onPage - 10 >= 0)
            onPage-=10;
        
        ctx.point(0, 3,chatFriend + ': ' + friendProfile['State']);
        ctx.point(0, 4,'Message: ' + inputMessage);
        
        while(i < length && i < 10){
            ctx.point(0, 5 + i, chatHistory[i + onPage]);
            i+=1;
        }
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
        length = userProfile['requestsFrom'].length;
        
        for(i = 0; i < length; i+=1)
            ctx.point(0, 4, userProfile['requestsFrom'][i]);
    }
    
    else if(friendChosenOption == 'Choose state'){
        ctx.point(0, 2, 'Current state: '  + userState);
        ctx.point(0, 3, 'Current chosen state: ' + stateOptions[friendIndex]);
    }
}

function printIndex(){
    if(friendChosenOption == 'Friends Menu')
        ctx.point(0, 1, friendsOptions[friendIndex] + friendIndex);
    else if(friendChosenOption == 'Chat with a friend' ||
            friendChosenOption == 'Show friends')
        ctx.point(0, 1, userFriends[friendIndex] + ' ' +userFriends.length);
}