 exports. 
    // load my scripts
    keypress = require('keypress'),
    ctx = require('axel'),
    request = require('request'),
    fs= require('fs'),
    // variables...
    countera = 0,
    escapeClicksCounter = 0,
    width = process.stdout.columns,
    height = process.stdout.rows,
    boxX = width * 0.5 - (width * 0.5 *0.42),
    boxY = height * 0.2 - height*0.03, // without height *0.03 check
    boxWidth = width * 0.5,
    boxHeight = height * 0.1,
    // login variables
    loggedUsername = '',
    profileUsername = '',
    userProfile= [],
    userFriends = [],
    userRequests = [],
    currentLoginState = 'LoginMenu',
    logInOptions = ['Log In', 'Register'],
    currentLoginIndex = 0,
    lastLetter = 'return',
    username = '',
    password = '',
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
    hasTurnEnded = false, // else turn the function is rollin all day....
    markedField = undefined, // same as chosen card but for the field
    removeFieldAt = NaN,
    initialHealth = 42,
    enemyPlayerHealth = 42,
    playerHealth = initialHealth + 1000,
    mana = 1,
    turnCount = 1,
    playerMana = 10,
    enemyMana = mana, // by default
    // heroes variables
    areCharactersDrawn = false, // you cannot see his/her skills
    createdCharacters = [],
    indexAtCharacter = 0,//when the player is starting the game he is choosing a character
     enemyCharacter = {name:'Stamat', exp:undefined, class: undefined, level: undefined, spells:[]},
    hasChosenCharacter = false,
    chosenCharacter = undefined,
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
    chosenDeck = [],
    //friendsVariables
    friendsOptions = ['Chat with a friend', 'Show friends', 'Send friend request', 
                      'Accept friend requests'],
    friendIndex = 0,
    friendChosenOption = 'Friends Menu',
    friendProfile = [],
    inputFriendRequest = '',
    battleDone = [];


exports.searchPattern = function(text, pattern){
    
    const R = 256;
    var right = [];
    
    for(var c = 0; c < R; c+=1)
        right.push(-1);
    
    for(var i = 0; i < pattern.length; i+=1)
        right[pattern[i]] = i;
    
    var foundAt = search(text, pattern, right);
    
    return foundAt;
}

function search(text, pattern, right){
    var textLength = text.length,
        patternLength = pattern.length,
        skip;
    
    for(var i = 0; i< textLength - patternLength; i+=1){
        skip = 0;
        
        for(var j = 0; j < patternLength; j+=1){
            if(pattern[j] != text[i+j]){
                skip = j - right[text[i+j]];
                
                if(skip < 1)
                    skip = 1;
                
                break;
            }
        }
        
        if(skip == 0)
            return i;
    }
    
    return -1;
}

var lastKey = 'return';

exports.enterUsername = function(key){
    if(isUsernameSet || key.name == 'up' || key.name == 'down' ||
         key.name == 'right' || key.name == 'left' || key.name == 'space')
        return;

    if(key.name != 'return')
        username += key.name;
    else if(key.name == 'return' && lastKey != 'return')
        isUsernameSet = true;

    lastKey = key.name;
}

// the body is parsed
exports.getRequest = function(){
    request.get('http://localhost:1234/', function(error, response, body){
         if(!error && response.statusCode == 200)
            fs.writeFileSync('alphaDummy.json', body);
         else if(error)
             console.error(error);
     });
}
               
exports.postRequestUserData = function(){
    var options = {
        uri: 'http://localhost:1234/',
        method: 'POST',
        json: {
            "username": username,
            "password": password
        }
    };
        
    console.log(options.method);
    
    request(options, function (error, response, body) {
        /*if (!error && response.statusCode == 200)
            console.log(body) // Print the shortened url.*/
        if(error)
            console.log(error);
    });
}

exports.postRequestFriendRequest = function(requester, reciever){
    var options = {
        uri: 'http://localhost:1234/',
        method: 'POST',
        json:{
            "requester":requester,
            "reciever": reciever
        }
    };
    console.log(options.method);

    request(options, function(error, response, body){
        if(error)
            console.error(error);
    });
}

exports.enterPassword = function(key){
    
    if(isPasswordSet || key.name == 'up' || key.name == 'down' ||
         key.name == 'right' || key.name == 'left' || key.name == 'space')
        return;

    if(key.name != 'return')
        password += key.name;

    else if(key.name == 'return' && lastKey != 'return')
        isPasswordSet = true;

    lastKey = key.name;
}
