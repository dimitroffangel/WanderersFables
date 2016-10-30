 exports. 
    // load my scripts
    keypress = require('keypress'),
    ctx = require('axel'),
    // variables...
    escapeClicksCounter = 0;
    width = process.stdout.columns,
    height = process.stdout.rows,
    boxX = width * 0.5 - (width * 0.5 *0.42),
    boxY = height * 0.2 - height*0.03, // without height *0.03 check
    boxWidth = width * 0.5,
    boxHeight = height * 0.1,
    currentModeState = 'Game Menu',
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
    indexAtCharacter = 0, // when the player is starting the game he is choosing a Character
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
    rebuildingDeck = undefined;
    chosenDeck = [],
    battleDone = [];