 exports. 
    // load my scripts
    keypress = require('keypress'),
    ctx = require('axel'),
    request = require('request'),
    http = require('http'),
    fs= require('fs'),
    io= require('socket.io-client'),
    socket = io.connect('http://localhost:1234', {reconnect: true});
    readline = require('readline'),
    // variables...
    rl = undefined,
    isLogged = false,
    isUserWriting = false,
    escapeClicksCounter = 0,
    width = process.stdout.columns,
    height = process.stdout.rows,
    boxX = width * 0.5 - (width * 0.5 *0.42),
    boxY = height * 0.2 - height*0.03, // without height *0.03 check
    boxWidth = width * 0.5,
    boxHeight = height * 0.1,
    // login variables
    pleaseWork = undefined,
    isDataLoaded = false,
    isQueued = false,
    isBattleReportRecieved = false,
    loggedUsername = '',
    profileUsername = '',
    userProfile= [],
    userID = undefined,
    currentLoginState = 'LoginMenu',
    logInOptions = ['Log In', 'Register'],
    currentLoginIndex = 0,
    lastLetter = 'return',
    email = '',
    username = '',
    password = '',
    isEmailSet = false,
    isUsernameSet = false,
    isPasswordSet = false,
    differentOptions=['Play Game','Alter of Heroes',
                      'Forge','Training','Friends','Options' ],
    currentModeState = 'Login Screen',
    currentModeIndex = 0,
    isShowingGuide = false,
    isBoardDrawn = false,
    isShowingInfo = false, // showing the information of the card
    isInformationDrawn = false, // if it is true do not redraw the board
     // for choosing spells and it is the same as the two variables above 
    isChoosingSpell = false,
    isCastingSpell = false, 
    indexOnSpell = 0,
    hasPlayerTurnEnded = false,
    hasEnemyTurnEnded = false,
    markedField = undefined, // same as chosen card but for the field
    removeFieldAt = NaN,
    initialHealth = 42,
    enemyPlayerHealth = initialHealth,
    playerHealth = initialHealth,
    playerArmor = 0,
    enemyArmor = 0,
    playerAttacked = false,
    enemyAttacked = false,
    earthShieldOn = '',
    flameAxeOn = '',
    frostBowOn = '',
    mana = 10,
    turnCount = 1,
    playerMana = mana,
    enemyMana = mana, // by default
    // heroes variables
    areCharactersDrawn = false, // you cannot see his/her skills
    createdCharacters = [],
    indexAtCharacter = 0,//when the player is starting the game he is choosing a character
    enemyCharacter = {name:'Stamat', exp:undefined, class: undefined, 
                      level: undefined, spells:[], canCast: true, canBlock: false},
    chosenCharacter = undefined,
    playerTrapsCasted = [],
    enemyTrapsCasted = [],
    firstPlayer = undefined,
    lastKeyEntered = ' ',
    userInput = ' ',
    enterPressed = 0, // at which state the user is at creating a Character
    isCreatingCharacter = false,
    isCharacterSelectDrawn = false,
    // masteries
    indexOnSkillTree = 0,
    elementalistSkillTrees = [],
    // after-game things
    userGold = 0,
    wonRowGames = 0,
    isGameFound = false,
    gameOrder = undefined,
    playerIndex = undefined,
    oldPlayerIndex = undefined,
    isGameFinished = false,
    //AI variables
     // choose difficulty
    hasChosenDifficulty = false,
    difficultyOptions = ['easy', 'normal', 'hard', 'random'],
    indexOnDifficulty = 0,
    // choose bot deck
    hasChosenOpponentDeck = false,
    botDeckOptions = ['aggro', 'control', 'random'],
    indexOnBotDeck = 0,
    // choose bot Hero
    hasChosenBotClass = false,
    botClassOptions = ['elementalist', 'thief', 'hunter', 'random'],
    indexOnBotClass = 0,
    // array with card priorities
    handPriority = [],
    attackPriority = [],
    // bot Deck
    botDeck = [],
    // forge menus and variables
    forgeChosenOption = 'Forge Menu',
    deckName = '',
    isChoosingDeckCards = false,
    forgeMenu = ['Created decks', 'Create a deck'],  
    forgeIndex = 0,
    playerDecks = [],
    userIndexOnDeck = 0,
    indexOnDeck = 0,
    userChosenDeck = undefined,
    onPage = 0,
    rebuildingDeck = undefined,
    //friendsVariables
    friendsOptions = ['Chat with a friend', 'Show friends', 'Send friend request', 
                      'Accept friend requests', 'Choose state'],
    userState = '',
    stateOptions = ['Online', 'Offline', 'Do not disturb', 'Away'],
    friendIndex = 0,
    friendChosenOption = 'Friends Menu',
    friendProfile = [],
    chatHistory = [],
    allChats = [],
    chatFriend = '',
    inputFriendRequest = '',
    inputFriendID = undefined,
    isInputWritten = false, 
    inputMessage = '',
    serverUpdateCounter = 0,
    updateUniqCounter = 0,  
    hasChanged = false,
    battleDone = [];

exports.resetPlayGameVariables = function(){
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

        // play mode variables
        playerIndex = undefined;
        isQueued = false;
        isGameFound = false;
        serverUpdateCounter = 0;
        updateUniqCounter = 0; 

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

exports.attackEnemyChar = function(damage){
    if(!damage)
        return;

    enemyArmor-=damage;
    if(enemyArmor < 0){
        enemyPlayerHealth+= enemyArmor;
        enemyArmor = 0;
    }
}

exports.attackUserChar = function(damage){
    if(!damage)
        return;

    playerArmor-=damage;    
    if(playerArmor < 0){
        playerHealth+= playerArmor;
        playerArmor = 0;
    }
}

exports.encodeDeck = function(deck){
    var cardsNames = [];
    
    for(var c = 0; c < deck.length; c+=1)
       cardsNames.push(deck[c].name);
    
    return cardsNames;
}

exports.searchArray = function(array, element){
    var i,
        length = array.length;
    
    for(i= 0 ; i <length; i +=1){
        if(array[i] == element)
            return i;
    }
}

exports.enterEmail =  function(){
    isUserWriting = true;
         
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
         
    rl.question('Enter your email?', function(answer){
        email = JSON.parse(JSON.stringify(answer));
        isUserWriting = false;
        isEmailSet = true;
        rl = undefined;
        
        if(!validateEmail(email)){
            ctx.point(20, 4, 'Entered email is wrong');
            isEmailSet = false;
        }
    });
}

function validateEmail(email){
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

exports.enterUsername = function(){
    isUserWriting = true;
      
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
      
    rl.question('Enter a username?', function(answer){
        username = JSON.parse(JSON.stringify(answer));
        isUserWriting = false;
        isUsernameSet = true;
        rl = undefined;
    });
}

exports.enterPassword = function(){
    isUserWriting = true;
      
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
      
    rl.question('Enter a password?', function(answer){
        password = JSON.parse(JSON.stringify(answer));
        isUserWriting = false;
        isPasswordSet = true;
        rl = undefined;
    });
}

exports.enterText = function(question, showTerminal){
    isUserWriting = true;
      
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: showTerminal
    });
      
    rl.question(question, function(answer){
        inputFriendRequest = JSON.parse(JSON.stringify(answer));
        isUserWriting = false;
        rl = undefined;
    });
}

// the body is parsed
exports.getRequest = function(){
    isDataLoaded = false;
    
    var options = {
        hostname: 'localhost',
        port: '1234',
        path: '/',
        agent: false,
    }; 
    
    http.get(options, function(res){
        body = [];
        res.on('data', function(chunk){
            body.push(chunk);
            body = Buffer.concat(body);
          //  pleaseWork = this.clone(JSON.parse(body));
        });
        res.on('end', function(){
            isDataLoaded = true;
            console.log(new Date().getTime());
            return;
        });
    });
}

exports.getCharactersRequest = function(){
    
    var options = {
        hostname: 'localhost',
        port: '1234',
        path: '/character',
        agent: false,
    };
    
    http.get(options, function(res){
        body = [];
        res.on('data', function(chunk){
            body.push(chunk);
            body = Buffer.concat(body);
           // createdCharacters = this.clone(JSON.parse(body)[profileUsername + userID]);
        });
    });
}

exports.getDeckRequest = function(){
    
    var options = {
        hostname: 'localhost',
        port: '1234',
        path: '/decks',
        agent: false,
    };
    
    http.get(options, function(res){
        body = [];
        res.on('data', function(chunk){
            body.push(chunk);
            body = Buffer.concat(body);
        });
    });
}
function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr))
                copy[attr] = clone(obj[attr]);
        }
        return copy;
    }
}
