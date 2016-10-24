//imporing
var variables = require('../GameFunds/variables');

exports.chooseCharacter = function(key){
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
        ctx.point(0, 3 + (i + cycleSpinned) * 2, createdCharacters[i].class);
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
        hasChosenCharacter = true;
        isCharacterSelectDrawn = false; 
        return;
    }
    
    isCharacterSelectDrawn = true;
}