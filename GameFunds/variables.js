 exports. 
    // load my scripts
    keypress = require('keypress'),
    ctx = require('axel'),
    // variables...
    width = process.stdout.columns,
    height = process.stdout.rows,
    boxX = width / 2 - 13,
    boxY = height / 5,
    boxWidth = width / 2,
    boxHeight = height / 8,
    currentModeState = 'Game Menu',
    currentModeIndex = 0,
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
    hasChosenBotCharacter = false,
    botCharacterOptions = ['elementalist', 'thief', 'hunter', 'random'],
    indexOnBotCharacter = 0,
    // array with card priorities 
    handPriority = [],
    attackPriority = [],
    // bot Deck
    botDeck = [],
    battleDone = [];