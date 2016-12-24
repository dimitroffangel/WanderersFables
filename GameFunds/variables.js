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
     countera99 =  0,
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
    loggedUsername = '',
    profileUsername = '',
    userProfile= [],
    userID = undefined,
    hasFoundGame = false,
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
    isGameFound = false,
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
    battleDone = [];

exports.searchArray = function(array, element){
    var i,
        length = array.length;
    
    for(i= 0 ; i <length; i +=1){
        if(array[i] == element)
            return i;
    }
}

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
        countera99++;
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
           // playerDecks = clone(JSON.parse(body)[profileUsername + userID]);
        });
    });
}

exports.getQueueState = function(){
    
    var options  ={
        hostname: 'localhost',
        port: '1234',
        path: '/' + currentModeState,
        agent: false
    };
    
    http.get(options, function(res){
        body = [];
        res.on('data', function(chunk){
            body.push(chunk);
            body = buffer.concat(body); 
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

exports.postRequestFriendRequest = function(requester, requesterID, reciever, recieverID){
    var options = {
        uri: 'http://localhost:1234/',
        method: 'POST',
        json:{
            "requester":requester,
            "requesterID": requesterID,
            "reciever": reciever,
            "recieverID": recieverID
        }
    };
    console.log(options.method);

    request(options, function(error, response, body){
        if(error)
            console.error(error);
    });
}

exports.postRequestAcceptFriend = function(concordant,requester){
    var options = {
        uri: 'http://localhost:1234/',
        method: 'POST',
        json:{
            "concordant":concordant,
            "requester": requester
        }
    };
    
    console.log(options.method);

    request(options, function(error, response, body){
        if(error)
            console.error(error);
    });
}

exports.postRequestChangeState = function(stateValue){
    var options = {
        uri: 'http://localhost:1234/',
        method: 'POST',
        json:{
            "stateValue": stateValue,
            "user": profileUsername,
            "userID": userID
        }
    };
    
    console.log(options.method);
    
    request(options, function(error, response, body){
        if(error)
            console.error(error);
    });
}

exports.postRequestSendMessage=  function(sender, senderID, deliverTo){
    var options = {
        uri: 'http://localhost:1234/',
        method: 'POST',
        json: {
            "sender": sender,
            "senderID":senderID,
            "message": inputMessage,
            "deliverTo": deliverTo
        }
    };
    
    console.log(options.method);
    
    request(options, function(error, response, body){
        if(error)
            console.error(error);
    });
}

exports.postDeck = function(deck){
    var options = {
        uri:'http://localhost:1234/',
        method: 'POST',
        json: {
            "owner": profileUsername,
            "ownerID": userID,
            "deck": deck
        }
    };
    
    request(options, function(error, response, body){
        if(error)
            console.error(error);
    });
}

exports.postCharacter = function(charName, charClass, exp, level, spells){
    var options = {
        uri: 'http://localhost:1234/',
        method: 'POST',
        json: {
            "owner": profileUsername,
            "ownerID": userID,
            "character": charName,
            "class": charClass,
            "exp": exp,
            "level": level,
            "spells": spells
        }
    };
    
    request(options, function(error, response, body){
        if(error)
            console.error(error);
    });
}

// signed for Play Game or Arena
exports.postQueue = function(signedFor){
    var options = {
        uri: 'http://localhost:1234/',
        method: 'POST',
        json: {
            "user": profileUsername,
            "userID": userID,
            "signedFor": signedFor
        }
    };
    
    request(options, function(error, response, body){
        if(error)
            console.error(error);
        
        else
            isQueued = true;
    });
}