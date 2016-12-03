// importing
    var variables = require('../GameFunds/variables'),
        cardMaking = require('../GameFunds/cardMaking'),
        playGame = require('../GameMenu/playGame');

var lastKey = 'return';

exports.forgeMenu = function(key){
    
    ctx.clear();
    printCurrentMode(key);
    printIndex();
    
    if(!key)
        return;
    
    if(key.name == 'return' && lastKey != 'return'){
        if(forgeChosenOption == 'Created decks'){
            rebuildingDeck = playerDecks[forgeIndex];
            printChosenDeck();
            indexOnDeck = forgeIndex;
            forgeChosenOption = 'Rebuild a deck';
        }
        
        else if(forgeChosenOption == 'Rebuild a deck'){
            
        }
        
        else if(forgeChosenOption == 'Create a deck' && 
                !isChoosingDeckCards && deckName != ''){
            playerDecks.push({name: deckName, deck:[], isUsable: false});
            deckName = '';
            isChoosingDeckCards = true;
            indexOnDeck = forgeIndex;
            createDeck(key);
            onPage = 0;
            printIndex();
            lastKey = key.name;
            return;
        }
        
        else if(forgeChosenOption == 'Forge Menu')
            forgeChosenOption = forgeMenu[forgeIndex];
        
        forgeIndex = 0;
    }
    
    // writing the deck's name
    else if(forgeChosenOption == 'Create a deck' && key.name != 'return' && 
            key.name != 'backspace' && key.name != 'down' && 
            key.name != 'up' && key.name != 'space')
        deckName += key.name;
    
    else if(key.name == 'backspace'){
        // cancel the creation of a new deck
        if(forgeChosenOption == 'Create a deck'){
            deckName = '';
            isChoosingDeckCards = false;
        }
       
    // if the user is rebuilding the deck and he has not finished make the deck unusable
        else if(forgeChosenOption == 'Rebuilding a deck'){
            if(playerDecks[forgeIndex].deck.length < 30)
                playerDecks[forgeIndex].isUsable = false;
        }
        
        forgeIndex = 0;
        forgeChosenOption = 'Forge Menu';
    }
    
    // move between the menu options
    else if(key.name == 'up' && forgeIndex > 0 && 
            forgeChosenOption == 'Forge Menu')
        forgeIndex-=1;
    else if(key.name == 'down' && forgeIndex < forgeMenu.length -1 && 
            forgeChosenOption == 'Forge Menu')
        forgeIndex+=1;
    
    lastKey = key.name;
    printIndex();
}

function printIndex(){
    
    if(forgeChosenOption == 'Rebuild a deck'){
        ctx.point(0,2, onPage + '|On card: ' + (forgeIndex + 1) + 
        '| Cards in deck: ' + playerDecks[indexOnDeck].deck.length);
    
    }
    
    else if(!isChoosingDeckCards)
        ctx.point(0,0,forgeMenu[forgeIndex] + ' ' + forgeIndex);
    else if(playerDecks[indexOnDeck]){
        ctx.point(0,2, onPage + '|On card: ' + (forgeIndex + 1) + 
        '| Cards in deck: ' + playerDecks[indexOnDeck].deck.length);
    }
}

function printCurrentMode(key){
    var i,
        length;
    
    if(forgeChosenOption == 'Forge Menu'){
        length = forgeMenu.length;
        
        for(i = 0; i < length; i+=1){
            ctx.bg(255, 0, 0);
            ctx.box(boxX,  boxY + (i + 1) * 4, boxWidth, boxHeight);
            
            ctx.text(boxX, boxY + (i + 1) * 4,'\t' +  forgeMenu[i]);
            
            ctx.cursor.restore();
            console.log('\n');
        }
    }
    
    else if(forgeChosenOption == 'Created decks')
        seeDecks();
    
    else if(forgeChosenOption == 'Create a deck' || forgeChosenOption == 'Change a card')
        createDeck(key);
    
    else if(forgeChosenOption == 'Rebuild a deck')
        printChosenDeck(key);
}

function seeDecks(key){
    ctx.clear();
    
    var i,
        length = playerDecks.length;
    
    ctx.point(width - 20, 2, length + 'mama');
    
    for(i = 0; i < length; i+=1)
        ctx.point(0, i + 1 + 1, playerDecks[i].name);
    
    if(!key)
        return;
    
    if(key.name == 'up' && forgeIndex > 0)
        forgeIndex-=1;
    else if(key.name == 'down' && forgeIndex < length -1)
        forgeIndex+=1;
}

function printChosenDeck(key){
    ctx.clear();
    
    var i = 0,
        length = rebuildingDeck.deck.length;
    
    while(i < height - 2 && i < length && i < 10){
        if(!rebuildingDeck.deck[i + onPage])
            break;
        
        printCard(i+3, rebuildingDeck.deck[i + onPage], onPage + i + 1);
        i+=1;
    }

    if(!key)
        return;
    
    if(key.name == 'up' && forgeIndex > 0)
        forgeIndex-=1;
    else if(key.name == 'down' && forgeIndex < length - 1)
        forgeIndex+=1;
    else if(key.name=='right'&& onPage + 10 < length)
        onPage+=10;
    else if(key.name == 'right' && onPage + i > length)
        onPage= length - (onPage + 10);
    else if(key.name == 'left' && onPage - 10 >= 0)
        onPage-= 10;
    else if(key.name == 'i'){
        ctx.point(0, 1, isShowingInfo + 'mama');
        if(isShowingInfo){
            isInformationDrawn = false;
            isShowingInfo = false;
        }
        
        else{
            isShowingInfo = true;
            playGame.showInfoOnCard(rebuildingDeck.deck[forgeIndex]);
        }
    }
    
    else if(key.name == 'return'){
        rebuildingDeck.deck.splice(forgeIndex, 1);
        forgeChosenOption = 'Change a card';
        isChoosingDeckCards = true;
        forgeIndex = 0;
        onPage = 0;
        createDeck();
    }
 }

function createDeck(key){
    if(!isChoosingDeckCards){
        if(deckName == '')
            ctx.point(0, 2, 'Enter a name for the deck...');

        else
            ctx.point(0, 2, 'Enter a name for the deck...' + deckName);
        
        return;
    }
    
    ctx.clear();
    
    var i = 0 + onPage,
        length = cardMaking.allCards.length,
        availableCards = [];
    
    while(availableCards.length < height - 2 &&
          availableCards.length < 10 && i < length){
        var currentCard = cardMaking.allCards[i];
        
        if(!currentCard.isOwned){
            i+=1;
            continue;
        }
        
        availableCards.push(currentCard);
        printCard(availableCards.length + 2, currentCard, i+1 - onPage);
        i+=1;
    }
    
    if(!key)
        return;
    
    if(key.name == 'up' && forgeIndex > 0)
        
        forgeIndex-=1;
    else if(key.name == 'down' && forgeIndex < availableCards.length -1)
        forgeIndex+=1;
    else if(key.name=='right'&& onPage + 10 < length)
        onPage+=10;
    else if(key.name == 'right' && onPage + 10 > length)
        onPage= length - (onPage + 10);
    else if(key.name == 'left' && onPage - 10 >= 0)
        onPage-= 10;
    else if(key.name == 'i'){
        ctx.point(0, 1, isShowingInfo + 'mama');
        if(isShowingInfo){
            isInformationDrawn = false;
            isShowingInfo = false;
        }
        
        else{
            isShowingInfo = true;
            playGame.showInfoOnCard(availableCards[forgeIndex]);
        }
    }
    
    else if(key.name == 'return' && playerDecks[playerDecks.length- 1].deck.length < 30){
        playerDecks[indexOnDeck].deck.push(availableCards[forgeIndex]);
    
        if(forgeChosenOption == 'Change a card')
            forgeChosenOption = 'Rebuild a deck';
    }
}

function deckHasCard(card, index){
    var i,
        deck = playerDecks[index].deck,
        length = deck.length,
        cardMatch = 0;
    
    for(i = 0; i < length; i+=1){
        if(deck[i] == card)
            cardMatch+=1;
        
        if(cardMatch == 2)
            return true;
    }
}

function printCard(y, card, index){
    ctx.bg(255, 0, 255);
    ctx.point(0, y, index + ')' + 'Name: ' + card.name + '| Attack: ' + 
                  card.attack + '| Defence: ' + card.defence);
    ctx.cursor.restore();
}