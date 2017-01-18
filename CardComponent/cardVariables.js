// importing
var cardMaking = require('./cardMaking');


// all functions in line with the field and the card

exports. 
    // size variables
    cardHandInitX = width * 0.1,
    cardHandInitY = height - height*0.43,
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
    infoCardX = width*0.23,
    infoCardY = height*0.1,
    infoCardWidth = width*0.45,
    infoCardHeight = height*0.9,
    fieldLength = 6,
    //cards' locations
    playerFields = [], 
    playerSpawnedCards = 0,
    enemyFields = [], 
    enemySpawnedCards = 0,
    enemyTaunts = 0,
    playerTaunts = 0,
    attackedFromFields = [], /* save the attacking places and forbid them to attack again                                  if they do not have any spell that allows them*/
    playerHand = [], //x, y, card hand
    playerBonusHand = [], // hand
    enemyHand = [], // enemy hand
    showingPlayerHand = 'main', /* the player hand is divided in 2 playerHand(main) and playerBonusHand(bonus) if the cursorIndex is on last of main go to playerBonusHand and if the index is on zero of bonus go to main*/
    //-----input variables--------
    cursorField = 'hand', 
    // default on hand, otherwhise: playerField, enemyField, enemyHero
    cursorIndex = 0, // default navigation 
    attackingFieldIndex = 0, // the index from which the attack comes from
    markedCardCursor = 0,  // the index from which the card has been spawned
    spawningCard = undefined,
    infoOnCard = undefined, // desired card's description  
     // boons arrays
    bleedingTargets = [],
    vulnerableTargets = [],
    immobileTargets = [],
    burningTargers = [],
    uniqCards = [], // cards that demand special action for 'em
    summonnedUniqCards = [],
    changingFieldIndex = undefined, 
    // index that represent the card from which the activation has come from
    isKnockingCard = false,
    isChangingMobStats = false, // for giving damage, health, or taking
    isSwappingMinionStats = false,
    isShatteringField = false,
    isOgdenDead =  false;