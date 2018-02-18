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
                friendIndex<pleaseWork['friends'].length -1)
                friendIndex+=1;
        else if(friendChosenOption=='Choose state'&& friendIndex < stateOptions.length - 1)
            friendIndex+=1;
    }
    else if(key.name == 'backspace')
        friendChosenOption = 'Friends Menu';
    
    else if(key.name == 'return' && lastKey != 'return'){
           if(friendChosenOption == 'Friends Menu')
                friendChosenOption = friendsOptions[friendIndex];
        else if(friendChosenOption == 'Chat with a friend'){
            friendChosenOption = 'Chatting';
            chatFriend =pleaseWork['friends'][friendIndex];
            //friendProfile = pleaseWork[chatFriend];
            //allChats = pleaseWork['chat'];
            /*chatHistory = allChats[chatFriend + '-' + profileUsername];
            if(!chatHistory)
                chatHistory = allChats[profileUsername + '-' + chatFriend];
                */
        }
        
        else if(friendChosenOption == 'Chatting'){
            socket.emit('SendMessage', {sender:profileUsername, senderID:userID,
                                        deliverTo:chatFriend,message:inputMessage});
       //     variables.postRequestSendMessage(profileUsername, userID, chatFriend);
            inputMessage = '';
        }
        
        else if(friendChosenOption == 'Show friends'){
            socket.emit('RequestFriendProfile', {username:userProfile,userID:userID,
                                                 friend:pleaseWork['friends'][friendIndex]});
            socket.on('FriendProfile', function(data){
                friendProfile = data.friendProfile;
            });
            //friendProfile = pleaseWork[pleaseWork[profileUsername + userID]
              //                         ['friends'][friendIndex]];
            friendChosenOption = 'Friend Profile';
        }
        else if(friendChosenOption == 'Send friend request'){
            var isFound = undefined,
                isFriend = variables.searchArray(pleaseWork['friends'], inputFriendRequest),
                isRequested = variables.
            searchArray(pleaseWork['requestsFrom'], inputFriendRequest);
            
            socket.emit('RequestFriendProfile', {username:userProfile,userID:userID,
                                                 friend:inputFriendRequest});
            socket.on('FriendProfile', function(data){
            console.log(isRequested);
                
                if(data.friendProfile && !isFriend && isFriend != 0){
                    console.log('Friend: ' + ' ' + isFriend);
                    
                    socket.emit('SendFriendRequest', {username:profileUsername,userID:userID,
                                                      reciever:inputFriendRequest});
                    /*variables
                        .postRequestFriendRequest(profileUsername, userID, 
                                                  inputFriendRequest);*/
                    ctx.point(0, 4, 'Your friend request was sent');
                }
                
                else{
                    ctx.point(0, 4, 'User with such a name is non-existent');
                    inputFriendRequest = '';
                }
            });
        }
        else if(friendChosenOption == 'Accept friend requests'){
            socket.emit('AcceptFriendRequest',
                        {requester:pleaseWork['requestsFrom'][friendIndex],
                         concordant:profileUsername+userID});
       /*     variables
                .postRequestAcceptFriend(profileUsername + userID, 
                        pleaseWork['requestsFrom'][friendIndex]);
           */ friendChosenOption = 'Friends Menu';
        }
        
        else if(friendChosenOption == 'Choose state'){
            userState = stateOptions[friendIndex];
            socket.emit('ChangeState', {username:profileUsername,
                                        userID:userID,state:userState});
            
          //  variables.postRequestChangeState(userState);
        }
          console.log(userState);
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
        length = pleaseWork['friends'].length;
        
        for(i = 0; i < length; i+=1)
            ctx.point(0, 4+i, pleaseWork['friends'][i]);
    }
    
    else if(friendChosenOption == 'Chatting'){
        if(key.name != 'return' && key.name != 'up' && key.name != 'down' &&
           key.name != 'right' && key.name != 'left' && key.name){
            if(key.name == 'space')
                inputMessage += ' ';
            else
                inputMessage += key.name;
           }
        
            socket.on('AllChats', function(data){chatHistory=data.chat;});
            // variables.getRequest();
            /*chatHistory = allChats[chatFriend + '-' + profileUsername + userID];
            if(!chatHistory && chatHistory.length!= 0){
                chatHistory = allChats[profileUsername + userID+ '-' + chatFriend];
            }*/
        
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
        ctx.point(0, 3, 'Name: ' + 
                  pleaseWork['friends'][friendIndex]);
        ctx.point(0, 4, 'Level: ' + friendProfile['level']);
        ctx.point(0, 5, 'Wins: ' + friendProfile['wins']);
    }
    
    else if(friendChosenOption == 'Send friend request'){
        if(key.name != 'return'){
            console.log(countera99);
                if(!inputFriendRequest)
                    variables.enterText('Enter player"s name and his id:', false);
                else
                    return;
        }
    }

    else if(friendChosenOption == 'Accept friend requests' && pleaseWork['requestsFrom']){
        length = pleaseWork['requestsFrom'].length;
        
        for(i = 0; i < length; i+=1)
            ctx.point(0, 4+i, pleaseWork['requestsFrom'][i]);
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
        ctx.point(0, 1, 'ChatList' + ' ' + friendIndex + 1/* pleaseWork['friends'] + ' '
                  + pleaseWork['friends'].length*/);
}