// importing

var 
    variables = require('./variables'),
    cardVariables = require('./cardVariables'),
    cardMaking = require('./cardMaking'),
    gameMenu = require('../GameMenu/gameMenu'),
    playGame = require('../GameMenu/playGame'),
    playGameInput = require('./playGameInput'),
    botLogic = require('../AI/mainLogic'),
    characters = require('../Character/characters.js'),
    characterSelect = require('../Character/characterSelect.js');
    training = require('../GameMenu/training'),
    options  = require('../GameMenu/options'),// requirements
    lastWrittenText = '',

variables.keypress(process.stdin);

if(process.stdin.setRawMode)
    process.stdin.setRawMode(true);

//Keyboard input
process.stdin.on('keypress', function(c, key) {
    
    determineAfterAction(key);
    if(key && key.ctrl && key.name == 'c') 
        process.stdin.pause();
});


function determineAfterAction(key){
    
    // entering a mode in the game
    if(key.name == 'return')
        currentModeState = gameMenu.differentOptions[currentModeIndex];
    
    
    // return to the game menu
    if(currentModeState != 'Game Menu' &&
       key.name == 'escape'){
        gameMenu.loadMenu();
        currentModeState = 'Game Menu';
        
        if(isBoardDrawn){ // => the game has started and he the player has quit
            wonRowGames = 0;
            isBoardDrawn = false;
            hasChosenCharacter = false;
        }
    }
    
    gameMenuLogic(key);
    writeText(width - 20,0,gameMenu.differentOptions[currentModeIndex]);
}

function gameMenuLogic(key){
    // moving the cursor to another mode
    if(currentModeState == 'Game Menu'){
        if(key.name == 'up' && currentModeIndex >  0)
            currentModeIndex-=1;
        
        else if(key.name == 'down' && 
                currentModeIndex < gameMenu.differentOptions.length -1)
            currentModeIndex+=1;
        
        else
            return;
    }
    
    else if(currentModeState == 'Play Game'){
        
        if(!hasChosenCharacter){
            enemyPlayerHealth = 42;
            characterSelect.chooseCharacter(key);
        }
        
        if(hasChosenCharacter &&
           !hasChosenOpponentDeck){
            botLogic.chooseBot(key);
        }
        
        if(hasChosenCharacter && hasChosenOpponentDeck)
            playGameInput.initializeGameInput(key);
    }
    
    else if(currentModeState == 'Alter of Heroes')
        characters.loadCreatedCharacters(key);
    
    else if(currentModeState == 'Training')
        training.beginRoutine();
    
    else if(currentModeState == 'Options')
        options.loadOptions();
    
    else if(currentModeState == 'Exit'){
        ctx.clear();
        ctx.cursor.on();
        process.stdin.pause();
    }
    
}

function writeText(x,y,text){
    
    if(lastWrittenText != ''){
        var i,
            length = lastWrittenText.length;
        for(i = 0; i <= length; i++){
            ctx.point(x + i,y, ' ');
        }
    }
    ctx.point(x,y, text);
    lastWrittenText = text;

}

// Mouse input
process.stdin.on('mousepress', function(mouse) {
    console.log('Mouse erer' + mouse);
});

variables.keypress.enableMouse(process.stdout);
process.on('exit', function () {
    variables.keypress.disableMouse(process.stdout);
});

process.stdin.resume();