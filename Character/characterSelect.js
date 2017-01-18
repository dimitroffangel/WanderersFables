//imporing
var variables = require('../GameFunds/variables');

exports.chooseMenu = function(key){
    
    if(!chosenCharacter)
        chooseCharacter(key);
    
    else if(chosenCharacter)
        chooseDeck(key);
}

function chooseCharacter(key){
    ctx.clear();
    
    var i,
        cycleSpinned = 0; // in order to write everything on a personal line 
        length = createdCharacters.length;
    
    // urge the user to create a Character
    if(length == 0){
        ctx.point(0, 0, 
        'You have no characters, go to the \n"Alter of Characteres" and create one...');
        return;
    }
    
    ctx.point(width-40,2,'Currently chosen: '+ createdCharacters[indexAtCharacter].name);
    
    // print the Characteres' information
    for(i = 0; i < length; i+=1) {
        ctx.point(0, 1 + (i + cycleSpinned) * 2, (i +1) + ')');
        ctx.point(0, 2 + (i + cycleSpinned) * 2, createdCharacters[i].name);
        cycleSpinned+=1;
    }
    
    // move the cursor
    if(key.name == 'down' && indexAtCharacter< createdCharacters.length - 1)
        indexAtCharacter +=1;
    else if(key.name == 'up' && indexAtCharacter > 0)
        indexAtCharacter -=1;
    
    // Character chosen
    else if(key.name == 'return' && isCharacterSelectDrawn){
        chosenCharacter = createdCharacters[indexAtCharacter];
        isCharacterSelectDrawn = false; 
        return;
    }
    
    isCharacterSelectDrawn = true;
}

function chooseDeck(key){
    ctx.clear();
    
    var i= 0,
        length = playerDecks.length;
    
    if(length == 0){
        ctx.point(0, 3, 'Create a deck at the forge, first...');
        return;
    }
    
    ctx.point(width-40,2,'Currently chosen: '+ playerDecks[userIndexOnDeck].name);

    for(i = 0; i < length; i+=1){
    
        if(playerDecks[i].deck.length == 30)
            ctx.point(0, 2,'Name: ' + playerDecks[i].name);
        else
            ctx.point(0, 2, 'Name: ' + playerDecks[i].name +  '| Not usable');
    }

    // move the cursor
    if(key.name == 'down' && userIndexOnDeck< length - 1)
        userIndexOnDeck +=1;
    else if(key.name == 'up' && userIndexOnDeck > 0)
        userIndexOnDeck -=1;
    
    // Character chosen
    else if(key.name == 'return' && isCharacterSelectDrawn){
        userChosenDeck = JSON.parse(JSON.stringify(playerDecks[userIndexOnDeck].deck));
        isCharacterSelectDrawn = false; 
        return;
    }
    
    isCharacterSelectDrawn = true;
}