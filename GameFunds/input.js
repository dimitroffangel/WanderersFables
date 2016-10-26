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
        
        // => the game has started and he the player has quit
        if(currentModeState == 'Play Game' && escapeClicksCounter == 2){
            afterPlayGame();
            gameMenu.loadMenu();
               
            currentModeState = 'Game Menu';
        }
        
        else if(currentModeState == 'Play Game'){
            escapeClicksCounter+=1;
            
            if(escapeClicksCounter == 1){
                ctx.point(width / 2, 2, 
                          '|Press again in order to leave');
            }

        }
        
        else if(currentModeState != 'Play Game'){
            gameMenu.loadMenu();      
            currentModeState = 'Game Menu';
        }
    }
    
    gameMenuLogic(key);
    writeText(width - 20,0, gameMenu.differentOptions[currentModeIndex]);
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
        
        if(!hasChosenCharacter)
            characterSelect.chooseCharacter(key);
        
        else if(hasChosenCharacter &&
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

function afterPlayGame(){
        wonRowGames = 0;
        isBoardDrawn = false;
        isBoardDrawn = false;
        isShowingInfo = false; 
        isInformationDrawn = false; 
        isChoosingSpell = false;
        isCastingSpell = false; 
        indexOnSpell = 0;
        hasPlayerTurnEnded = false;
        hasEnemyTurnEnded = false;
        hasTurnEnded = false;
        markedField = undefined;
        removeFieldAt = NaN;
        initialHealth = 42;
        enemyPlayerHealth = 42;
        playerHealth = initialHealth + 1000;
        mana = 1;
        turnCount = 1;
        playerMana = 10;
        enemyMana = mana; 
        areCharactersDrawn = false;
        indexAtCharacter = 0;
        hasChosenCharacter = false;
        firstPlayer = undefined;
        lastKeyEntered = ' ';
        userInput = ' ';
        enterPressed = 0; 
        isGameFinished = false;
        hasChosenDifficulty = false;
        indexOnDifficulty = 0;
        hasChosenOpponentDeck = false;
        indexOnBotDeck = 0;
        hasChosenBotClass = false;
        indexOnBotClass = 0;
        handPriority = [];
        attackPriority = [];
        botDeck = [];
        battleDone = [];
        
        // card variables
        playerFieldVectors = []; 
        playerCardsOnField = 0;
        enemyFieldVectors = [];
        enemyCardsOnField = 0;
        enemyTauntsOnField = 0;
        playerTauntsOnField = 0;
        attackedFromFields = []; 
        playerCardsVectors = [];
        playerBonusCards = [];  
        enemyCardsVectors = [];
        showingPlayerVector = 'main';
        playerCardsInDeck = 30;
        botCardsInDeck = 30;
        cursorField = 'hand'; 
        cursorIndex = 0;
        markedCardCursor = 0;
        spawningCard = undefined;
        infoOnCard = undefined; 
        bleedingTargets = [];
        vulnerableTargets = [];
        immobileTargets = [];
        isKnockingCard = false;
        changingFieldIndex = undefined; 
        isChangingMobStats = false;
        isSwappingMinionStats = false;
        blockTargets = [];
        uniqCards = [];
        summonnedUniqCards = [];
        isOgdenDead =  false;
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