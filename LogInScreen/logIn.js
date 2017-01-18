var variables = require('../GameFunds/variables'),
    cardMaking = require('../CardComponent/cardMaking'),
    gameMenu = require('../GameMenu/gameMenu');

exports.logIn = function(key) {
    ctx.clear();

    if(!isEmailSet){
        variables.enterEmail();
    }
    
    else if(!isPasswordSet)
        variables.enterPassword();

    else if(isPasswordSet){
        ctx.point(0, 20, email + ' VS '  + password);               
        
        socket.emit('LogIn', {email:email, password:password});
        socket.on('LogConfirm', function(data){
            if(data.isLogged)
                isLogged = true;
            else{
                isEmailSet = false;
                isPasswordSet = false;
                email = '';
                password = '';
                currentLoginState = 'LoginMenu';
                console.log('Written data was not matched');
            }
        });
    
        // damn son nemo is found
        if(isLogged){                
            socket.on('userData', function(data){
                // set currentState, profileUsername and his id
                userState=data.state;
                profileUsername = data.username;
                userID = data.userID;
                // accept database characters
                if(data.chars){
                    createdCharacters = data.chars;
                    for(var i =0;i < createdCharacters.length; i+=1){
                        createdCharacters[i].duration = 0;
                        createdCharacters[i].attack = 0;
                        createdCharacters[i].tempAttack = 0;
                        createdCharacters[i].hasWindfury = 0;
                    }
                }
                // accept database decs
                if(data.createdDecks){
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
                }
            });
            
            socket.on('UserID', function(data){
            });
            
            ctx.point(width - 20, 3,profileUsername + ' 42');
            socket.on('Characters', function(data){
            });
         
            
        socket.on('Decks', function(data){
               
               });
               
               email = '';
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