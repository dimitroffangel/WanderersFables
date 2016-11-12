// importing

var 
    variables = require('./variables'),
    cardVariables = require('./cardVariables'),
    cardMaking = require('./cardMaking'),
    loginScreen = require('../loginScreen'),
    gameMenu = require('../GameMenu/gameMenu'),
    playGame = require('../GameMenu/playGame'),
    playGameInput = require('./playGameInput'),
    botLogic = require('../AI/mainLogic'),
    characters = require('../Character/characters'),
    characterSelect = require('../Character/characterSelect'),
    forge = require('../Character/forge'),
    training = require('../GameMenu/training'),
    options  = require('../GameMenu/options'),// requirements
    friends = require('../GameMenu/friends'),
    lastWrittenText = '';

variables.keypress(process.stdin);

if(process.stdin.setRawMode)
    process.stdin.setRawMode(true);

//Keyboard input
process.stdin.on('keypress', function(c, key) {
    
    determineAfterAction(key);
    if(key && key.ctrl && key.name == 'c') 
        process.stdin.pause();
});


function showGuide(){
    ctx.clear();
    
    if(currentModeState == 'Play Game'){
        ctx.point(0, 1, 'Left/right/up/down-> move the cursor');
        ctx.point(0, 2, 'Return-> marks a card and if marked attaks with it');
        ctx.point(0, 3,'J-> shows available spells');
        ctx.point(0, 4, 
    'Backspace-> cancels attacking a card by another or returns to a previous field');
        ctx.point(0, 5, 'Q-> casts the spell pointed by your cursor');
        ctx.point(0, 6, 'Tab-> cancels casting the chosen spell');
        ctx.point(0, 7, 'Ctrl + I-> shows info for the card at which is your cursor');
        ctx.point(0, 8, 'M-> ends your turn');
    }
    
    else if(currentModeState == 'Forge'){
        ctx.point(0, 1, 'Left/right/up/down-> move the cursor');
        ctx.point(0, 2, 'Return-> Change/Add a card or proceed through the option');
        ctx.point(0, 3, 'Ctrl + I-> shows info for the card at which is your cursor');
    }
    
    else{
        ctx.point(0, 1, 'Left/right/up/down-> move the cursor');
        ctx.point(0, 2, 'Return-> Proceeds through the available menues');
    }
}

function determineAfterAction(key){
    if(isShowingGuide){
        if(key.name == 'h'){
            isShowingGuide = false;
            if(currentModeState == 'Menu')
                gameMenu.loadMenu();
        }
        else{
            showGuide();
            return;
        }
    }
    
    // entering a mode in the game
    else if(key.name == 'return' && currentModeState != 'Login Screen'){
        currentModeState = differentOptions[currentModeIndex];
       // ctx.point(0, 15, currentModeState);
    }
    
    else if(key.name == 'h'){
        showGuide();
        isShowingGuide = true;
        return;
    }
    
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
            
            if(escapeClicksCounter == 1)
                ctx.point(width / 2, 2, '|Press again in order to leave');
        }
        
        else if(currentModeState != 'Play Game'){
            forgeChosenOption = 'Forge Menu';
            forgeIndex = 0;
            currentLoginState = 'LoginMenu';
            currentLoginIndex = 0;
            
            gameMenu.loadMenu();      
            currentModeState = 'Game Menu';
        }
    }
    
    gameMenuLogic(key);
    if(currentModeState != 'Login Screen')
        writeText(width - 20,0, differentOptions[currentModeIndex]);
    else
        writeText(width - 20,0, 'Login Screen');
}

function gameMenuLogic(key){
    
    // moving the cursor to another mode
    if(currentModeState == 'Login Screen' && loggedUsername == ''){
        countera+=1;
        loginScreen.loginMenu(key);
    }
    
    else if(loggedUsername != '')
        currentModeState = 'Game Menu';
    
    if(currentModeState == 'Game Menu'){
        if(key.name == 'up' && currentModeIndex >  0)
            currentModeIndex-=1;
        
        else if(key.name == 'down' && 
                currentModeIndex < differentOptions.length -1)
            currentModeIndex+=1;
    }
    
    else if(currentModeState == 'Play Game'){
        
        if(!chosenCharacter || !userChosenDeck)
            characterSelect.chooseMenu(key);
        
        else if(chosenCharacter && userChosenDeck && !hasChosenOpponentDeck)
            botLogic.chooseBot(key);
        
        if(chosenCharacter && hasChosenOpponentDeck)
            playGameInput.initializeGameInput(key);
    }
    
    else if(currentModeState == 'Alter of Heroes')
        characters.loadCreatedCharacters(key);  
    
    else if(currentModeState == 'Forge')
            forge.forgeMenu(key);
    
    else if(currentModeState == 'Training')
        training.beginRoutine();
    
    else if(currentModeState == 'Friends')
        friends.friendsMenu(key);
        
    
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
        chosenCharacter = undefined,
        chosenDeck = undefined,
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