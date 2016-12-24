var variables = require('./GameFunds/variables'),
    cardMaking = require('./GameFunds/cardMaking'),
    gameMenu = require('./GameMenu/gameMenu');

exports.logIn = function(key) {
    ctx.clear();

    if(!isUsernameSet){
        variables.enterUsername();
    }
    
    else if(!isPasswordSet)
        variables.enterPassword();

    else if(isPasswordSet){
         /*   var usernameIndex = variables.searchArray(pleaseWork['username'], username),
                passwordIndex = variables.searchArray(pleaseWork['password'], password);
           */             ctx.point(0, 20, username + ' VS '  + password);               
        
            socket.emit('LogIn', {username: username, password:password});
            socket.on('LogConfirm', function(data){
                if(data.isLogged)
                    isLogged = true;
            });
        
        console.log(isLogged);
            // damn son nemo is found
            if(/*usernameIndex == passwordIndex && passwordIndex != -1*/
               isLogged){
                profileUsername = username;
                
                socket.on('LoggedState', function(data){userState=data.state});
                
                socket.on('UserID', function(data){userID = 
                    JSON.parse(JSON.stringify(data.userID));});
                
                socket.on('Characters', function(data){
                    if(!data.chars)
                        return;
                    
                    createdCharacters = data.chars;
                });
             
                
                socket.on('Decks', function(data){
                    if(!data.createdDecks)
                        return;
                    
                    var decksLength = data.createdDecks.length,
                        i = 0,
                        j = 0;
                    
                    for(; i < data.createdDecks.length; i+=1){
                        playerDecks
                            .push({name:data.createdDecks[i].name,deck:[], 
                                    isUsable:data.createdDecks[i].isUsable}); 
                        for(; j < data.createdDecks[i]['deck'].length; j+=1){
                            playerDecks[0].deck.push
                                ((findCard(data.createdDecks[i]['deck'][j])));
                        }
                    }
                });
                
            // variables.getDeckRequest();    
            // variables.postRequestChangeState('online');
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

function findCard(cardName){
    var i,
        length = cardMaking.allCards.length;
    
    for(i = 0; i < length; i+=1){
        var currentCard = cardMaking.allCards[i];
        
        if(currentCard.name == cardName)
            return currentCard;
    }
            
    Error('Coud not find a card matching the specified name');
}