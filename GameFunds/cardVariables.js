// importing
var cardMaking = require('./cardMaking');


// all functions in line with the field and the card

exports. 
    // size variables
    cardHandInitX = width * 0.1,
    cardHandInitY = height - 13,
    cardFieldInitX = 0,
    cardFieldInitY = height * 0.43;
    cardWidth = width * 0.15, // 9
    cardHeight = height * 0.2, // 6
    // field Vector
    enemyFieldY = height * 0.12,
    // text on the cards
    // hand
    handManaPlace =  cardHandInitY + cardHeight + 1,
    handAttackPlace = cardHandInitY + cardHeight + 3,
    handDefencePlace = cardHandInitY + cardHeight + 4,
    // enemy field
    enemyFieldAttackPlace = enemyFieldY + 2,
    enemyFieldDefencePlace = enemyFieldY + 3,
    // player field
    playerFieldAttackPlace = cardFieldInitY + 2,
    playerFieldDefencePlace = cardFieldInitY + 3,
    //info card vector + width/height
    infoCardX = width % 23,
    infoCardY = height % 27,
    infoCardWidth = 27,
    infoCardHeight = 27,
    fieldLength = 6,
    //cards' locations
    playerFieldVectors = [], // main -> value for showingPlayerVector
    playerCardsOnField = 0,
    enemyFieldVectors = [],
    enemyCardsOnField = 0,
    enemyTauntsOnField = 0,
    playerTauntsOnField = 0,
    attackedFromFields = [], // save the attacking places and forbade them to attack again if they do not have any spell that allows them
    playerCardsVectors = [], //x, y, card
    playerBonusCards = [],  // bonus -> value for showingPlayerVector
    enemyCardsVectors = [],
    showingPlayerVector = 'main',
    playerCardsInDeck = 30,
    botCardsInDeck = 30,
    //input- variables
    cursorField = 'hand', 
    // default on hand, otherwhise: playerField, enemyField, enemyHero
    cursorIndex = 0,
    markedCardCursor = 0,
    spawningCard = undefined,
    infoOnCard = undefined, // desired card's description  
     // boons arrays
    bleedingTargets = [],
    vulnerableTargets = [],
    immobileTargets = [],
    //stealthTargets = [],  -> done
    //inspireTargets = [],  
    //knockdownTargets = [], 
    isKnockingCard = false,
    changingFieldIndex = undefined, 
    isChangingMobStats = false, // for giving damage, health, or taking
    isSwappingMinionStats = false,
    //deathrattleTargets = []
    //windfuryTargets = []
    blockTargets = [],
    uniqCards = [],
    summonnedUniqCards = [],
    isOgdenDead =  false;