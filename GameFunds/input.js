// importing

var 
    variables = require('./variables'),
    coreActions = require('./coreActions'),
    cardVariables = require('../CardComponent/cardVariables'),
    cardMaking = require('../CardComponent/cardMaking'),
    loginScreen = require('../LogInScreen/loginScreen'),
    gameMenu = require('../GameMenu/gameMenu'),
    playGame = require('../GameMenu/playGame'),
    playGameInput = require('./playGameInput'),
    botLogic = require('../AI/mainLogic'),
    characters = require('../Character/characters'),
    characterSelect = require('../Character/characterSelect'),
    forge = require('../GameMenu/forge'),
    training = require('../GameMenu/training'),
    options  = require('../GameMenu/options'),// requirements
    friends = require('../GameMenu/friends'),
    lastWrittenText = '',
    nullKey = {name:undefined};

variables.keypress(process.stdin);

if(process.stdin.setRawMode)
    process.stdin.setRawMode(true);

//Keyboard input
process.stdin.on('keypress', function(c, key) {
    if(isUserWriting)
        return;
    
    if(key && key.ctrl && key.name == 'c'){
        if(isLogged)
            socket.emit('StateLoggedOut', {username:profileUsername, userID:userID,
                                        state:userState});
        clearInterval(eachFrame);   
        socket.disconnect();
        process.stdin.pause();
    }
    
    if(key)
        determineAfterAction(key);
});

var eachFrame = setInterval(function(){determineAfterAction(nullKey);}, 500);

function showGuide(){
    ctx.clear();
    
    if(currentModeState == 'Play Game' || currentModeState == 'Training'){
        ctx.point(0, 1, 'Left/right/up/down-> move the cursor');
        ctx.point(0, 2, 'Return-> marks a card and if marked attaks with it');
        ctx.point(0, 3,'J-> shows available spells');
        ctx.point(0, 4, 
    'Backspace-> cancels attacking a card by another or returns to a previous field');
        ctx.point(0, 5, 'Q-> casts the spell pointed by your cursor');
        ctx.point(0, 6, 'Tab-> cancels casting the chosen spell');
        ctx.point(0, 7, 'I-> shows info for the card at which is your cursor');
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
    
        if(currentModeState == 'Login Screen' || currentModeState == 'Friends'){
            socket.emit('updateUserData', {username:profileUsername, userID:userID});
            
            socket.on('newUserData', function(data){
                pleaseWork = data.profile;
                userState = pleaseWork['state'];
            });
        }
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
        if(currentModeState == 'Play Game' || currentModeState == 'Training' && 
            escapeClicksCounter == 2){
            afterPlayGame();
            gameMenu.loadMenu();
            
            currentModeState = 'Game Menu';
        }
        
        else if(currentModeState == 'Play Game' || currentModeState == 'Training'){
            escapeClicksCounter+=1;
            
            if(escapeClicksCounter == 1)
                ctx.point(width / 2, 2, '|Press again in order to leave');
        }
        
        else if(currentModeState != 'Play Game' || currentModeState == 'Training'){
            forgeChosenOption = 'Forge Menu';
            forgeIndex = 0;
            currentLoginState = 'LoginMenu';
            currentLoginIndex = 0;
            
            gameMenu.loadMenu();      
            currentModeState = 'Game Menu';
        }
    }
    
    gameMenuLogic(key);
    if(currentModeState == 'Friends')
        coreActions.writeText(width - 32, 1,'Hello ' + profileUsername+userID);
    else if(currentModeState != 'Login Screen' && currentModeState != 'Play Game' && 
       currentModeState != 'Arena' && currentModeState != 'Training')
        coreActions.writeText(width - 20,0, differentOptions[currentModeIndex]);
    else if(currentModeState == 'Login Screen')
        coreActions.writeText(width - 20,0, 'Login Screen');
}

function gameMenuLogic(key){
    if(isUserWriting)
        return;
    
    ctx.point(width - 20, 3, playerTaunts + 'PTOF');
    // moving the cursor to another mode
    if(currentModeState == 'Login Screen' && loggedUsername == '')
        loginScreen.loginMenu(key);
    
    else if(loggedUsername != '')
        currentModeState = 'Game Menu';
    
    if(currentModeState == 'Game Menu'){
        if(key &&key.name == 'up' && currentModeIndex >  0)
            currentModeIndex-=1;
        
        else if(key && key.name == 'down' && 
                currentModeIndex < differentOptions.length -1)
            currentModeIndex+=1;
    }
    
    else if(currentModeState == 'Play Game'){
        if(!chosenCharacter || !userChosenDeck)
            characterSelect.chooseMenu(key);
        
        else if(chosenCharacter && userChosenDeck && !isBoardDrawn){
            if(!isQueued){
                ctx.point(0, 12, 'Searching for a mess less than you'); 
                socket.emit('QueuePlayGame', {username:profileUsername,userID:userID});
                isQueued = true;
            }
            else if(isQueued){
                socket.on('matchFound', function(data){
                    isGameFound = data.isFound;  
                    
                    ctx.point(width - 20, 14, 'mama' + ' ' + isGameFound);
                    
                    if(!isGameFound){
                        isQueued = false;
                        currentModeState = 'Game Menu';
                        chosenCharacter = undefined;
                        userChosenDeck = undefined;
                        gameMenu.loadMenu();
                        ctx.point(0, 2, 'No Opponent found' + data.isFound);
                    }
                    
                    else{
                        socket.emit('initGame', 
                        {username:profileUsername,userID:userID
                         ,deck:variables.encodeDeck(userChosenDeck)});
                        
                        socket.on('placement', function(data){
                            gameOrder = data.gameOrder;
                            playerIndex = data.player;   
                            
                            if(playerIndex == 1)
                                hasPlayerTurnEnded = true;
                        });
                    }
                });
            }
        }
        
        if(chosenCharacter && userChosenDeck && isGameFound){
            ctx.point(width - 20, 16, 'gmaeFound');
            playGameInput.initializeGameInput(key);
        }
        
    }
    
    else if(currentModeState == 'Alter of Heroes')
        characters.loadCreatedCharacters(key);  
    
    else if(currentModeState == 'Forge')
            forge.forgeMenu(key);
    
    else if(currentModeState == 'Training'){
        if(!chosenCharacter || !userChosenDeck)
            characterSelect.chooseMenu(key);
        
        else if(chosenCharacter && userChosenDeck && !hasChosenOpponentDeck)
            botLogic.chooseBot(key);
        
        if(chosenCharacter && hasChosenOpponentDeck)
             playGameInput.initializeGameInput(key);   
    }
    
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
        markedField = undefined;
        removeFieldAt = NaN;
        initialHealth = 42;
        enemyPlayerHealth = initialHealth;
        playerHealth = initialHealth;
        mana = 1;
        turnCount = 1;
        playerMana = 10;
        enemyMana = mana; 
        areCharactersDrawn = false;
        indexAtCharacter = 0;
        chosenCharacter = undefined;
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
        userChosenDeck = undefined;
        battleDone = [];
        
        // card variables
        playerFields = []; 
        playerSpawnedCards = 0;
        enemyFields = [];
        enemySpawnedCards = 0;
        enemyTaunts = 0;
        playerTaunts = 0;
        attackedFromFields = []; 
        playerHand = [];
        playerBonusHand = [];  
        enemyHand = [];
        showingPlayerHand = 'main';
        cursorField = 'hand'; 
        cursorIndex = 0;
        markedCardCursor = 0;
        spawningCard = undefined;
        infoOnCard = undefined; 
        bleedingTargets = [];
        vulnerableTargets = [];
        immobileTargets = [];
        isShatteringField = false;
        isKnockingCard = false;
        changingFieldIndex = undefined; 
        isChangingMobStats = false;
        isSwappingMinionStats = false;
        blockTargets = [];
        uniqCards = [];
        summonnedUniqCards = [];
        isOgdenDead =  false;
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