//importing 
var variables = require('../GameFunds/variables'),
    coreActions = require('../GameFunds/coreActions'),
    cardMaking = require('../CardComponent/cardMaking'),
    cardVariables = require('../CardComponent/cardVariables'),
    cardPriority = require('./cardPriority'),
    setCardSpecialities = require('../CardComponent/setCardSpecialities'),
    characters = require('../Character/characters'),
    //adding class variations...
    elementalist = require('../ClassSkillTrees/elementalist'),
    elementalistCasting = require('../ClassSkillTrees/elementalistCasting'),
    fs = require('fs');

var lastKeyName = 'return';

//exporting
exports.chooseBot = function(key){
    // 1) clear the console
    // 2) choose difficulty (if not chosen)
    // 3) choose deck type if the difficulty is greater than easy
    
    // 1)
    ctx.clear();
    ctx.point(0, 19, 'Press not ENTER to continue');
    // 2)
    
        if(lastKeyName != 'return' &&
           !hasChosenDifficulty)
            chooseDifficulty(key);
        
        if(lastKeyName != 'return' &&
           hasChosenDifficulty &&
           !hasChosenBotClass)
            chooseBotCharacter(key);
        
        
        // 3)
        if(lastKeyName != 'return' &&
           hasChosenDifficulty &&
           hasChosenBotClass &&
           indexOnDifficulty != 0) // => it is not easy (the difficulty)
            chooseBotDeck(key);
        
        else if(lastKeyName != 'return' &&
                hasChosenDifficulty &&
                hasChosenBotClass) // => it is on easy
            hasChosenOpponentDeck = true; // specially made basic deck
    
    lastKeyName = key.name;
}

exports.initilizeBot = function(){
    enemyCharacter.level = characters.getMaxCharacterLevel();
        
    characters.determineChampionClass(enemyCharacter);
        
    setBotDeck();
}

function determineSpellCursor(){
    var randomCursor = Math.round(Math.random() * 3);
    
    if(randomCursor == 0)
        return 'enemyField';
    if(randomCursor == 1)
        return 'playerField';
    if(randomCursor == 2)
        return 'userPlayer';
    if(randomCursor == 3)
        return 'enemyCharacter';
}

function botCastsSpell(){
    
    var indexSpell = Math.round(Math.random() * 3),
        markedCursorField = determineSpellCursor(),
        cursorPosition = Math.round(Math.random() * playerFields.length),
        fieldIndex;
    
    
    // choose a field where to cast the spell;
    if(markedCursorField != 'enemyCharacter' && markedCursorField != 'userPlayer')
        fieldIndex = Math.round(Math.random() * (playerFields.length - 1));
    
    // cast the spell
    elementalistCasting
        .castChosenSpell(indexSpell, enemyCharacter, markedCursorField, fieldIndex);
    
    var shouldCastAgain = Math.random() * 100;
    if(shouldCastAgain <= 42)
        botCastsSpell();
}
    
exports.summonEnemyCreature = function(){
    // 1) determineDifficulty
    // 2) summon minions
    // 3) attack with them
    // 4) try summonning minions if the board was full
    var difficultyChosen = difficultyOptions[indexOnDifficulty];
    
    if(hasEnemyTurnEnded)
        return;
    
    if(difficultyChosen == 'easy'){
        chooseMinion_OnEasyNormal();
        attackUserMinions_OnEasy();
        chooseMinion_OnEasyNormal();
        attackUserMinions_OnEasy();   
        hasEnemyTurnEnded = true;
    }
    
    else if(difficultyChosen == 'normal'){
        // on 3 turns cast a spell
     //   if(turnCount % 3 == 0)
       //     botCastsSpell();
        
      chooseMinion_OnEasyNormal();
      attackUserMinions_OnNormal();
      chooseMinion_OnEasyNormal();
      attackUserMinions_OnNormal();
       
        hasEnemyTurnEnded = true;
    }
    
    else if(difficultyChosen == 'hard'){
        chooseMinion_OnHard();
        attackUserMinions_OnHard_Control();
        
        hasEnemyTurnEnded = true;
    }
}

function botHasTaunt(){
    var i,
        length = enemyHand.length;
    
    for(i = 0; i < length; i+=1){
        var currentCard = enemyHand[i];
        
        if(currentCard.isTaunt)
            return true;
    }
    
    return false;
}

// for chooseBot helping functions
function chooseDifficulty(key){
    coreActions.writeText(0, 1, 'Choose difficulty...');
    coreActions.writeText(0, 2, 'Currently chosen: ' +
                          difficultyOptions[indexOnDifficulty]);

    if(key.name == 'up' && 
       indexOnDifficulty > 0)
        indexOnDifficulty-=1;
    
    else if(key.name == 'down' && 
            indexOnDifficulty < difficultyOptions.length - 1)
        indexOnDifficulty+=1;
    
    else if(key.name == 'return'){
        hasChosenDifficulty = true;
        lastKeyName = 'return';
    }
    
    coreActions.writeText(0, 2, 'Currently chosen: ' + difficultyOptions[indexOnDifficulty]);
}

function chooseBotCharacter(key){
    coreActions.writeText(0, 3, 'Choose bot character...');
    coreActions.writeText(0, 4, 'Currently chosen: ' + botClassOptions[indexOnBotClass]);
    
    if(key.name == 'up' && 
        indexOnBotClass > 0)
         indexOnBotClass -=1;
    
    else if(key.name == 'down' &&
             indexOnBotClass <  botClassOptions.length - 1)
         indexOnBotClass +=1;
    
    else if(key.name == 'return'){
        hasChosenBotClass = true;
        lastKeyName = 'return';
    }
    coreActions.writeText(0, 4, 'Currently chosen: ' + botClassOptions[indexOnBotClass]);
}

function chooseBotDeck(key){
    coreActions.writeText(0, 5, 'Choose bot deck...');
    coreActions.writeText(0, 6, 'Currently chosen: ' + botDeckOptions[indexOnBotDeck]);

    if(key.name == 'up' &&
        indexOnBotDeck > 0)
         indexOnBotDeck-=1;
    
    else if(key.name == 'down' &&
            indexOnBotDeck <  botDeckOptions.length - 1)
         indexOnBotDeck+=1;
    
    else if(key.name == 'return'){
         hasChosenOpponentDeck = true;
         lastKeyName = 'return';
    }
    coreActions.writeText(0, 6, 'Currently chosen: ' + botDeckOptions[indexOnBotDeck]);
}

// for initilizeBot helping functions
function setBotDeck(){
    var botDifficulty = difficultyOptions[indexOnDifficulty],
        botTypeDeck = chooseBotDeck[indexOnBotDeck];
    
    if(botDifficulty == 'easy' || 
       botDifficulty == 'normal' ||
       botDifficulty == 'hard')
        fillBasicDeck();
}

function fillBasicDeck(){
    botDeck.push(jsonStringify(cardMaking.allCards[1]));
    botDeck.push(jsonStringify(cardMaking.allCards[1]));
    botDeck.push(jsonStringify(cardMaking.allCards[3]));
    botDeck.push(jsonStringify(cardMaking.allCards[3]));
    botDeck.push(jsonStringify(cardMaking.allCards[5]));
    botDeck.push(jsonStringify(cardMaking.allCards[5]));
    botDeck.push(jsonStringify(cardMaking.allCards[6]));
    botDeck.push(jsonStringify(cardMaking.allCards[6]));
    botDeck.push(jsonStringify(cardMaking.allCards[2]));
    botDeck.push(jsonStringify(cardMaking.allCards[2]));
    botDeck.push(jsonStringify(cardMaking.allCards[4]));
    botDeck.push(jsonStringify(cardMaking.allCards[4]));
    botDeck.push(jsonStringify(cardMaking.allCards[4]));
    botDeck.push(jsonStringify(cardMaking.allCards[4]));
    botDeck.push(jsonStringify(cardMaking.allCards[17]));
    botDeck.push(jsonStringify(cardMaking.allCards[17]));
    botDeck.push(jsonStringify(cardMaking.allCards[17]));
    botDeck.push(jsonStringify(cardMaking.allCards[17]));
    botDeck.push(jsonStringify(cardMaking.allCards[21]));
    botDeck.push(jsonStringify(cardMaking.allCards[21]));
    botDeck.push(jsonStringify(cardMaking.allCards[21]));
    botDeck.push(jsonStringify(cardMaking.allCards[21]));
    botDeck.push(jsonStringify(cardMaking.allCards[21]));
    botDeck.push(jsonStringify(cardMaking.allCards[23]));
    botDeck.push(jsonStringify(cardMaking.allCards[23]));
    botDeck.push(jsonStringify(cardMaking.allCards[24]));
    botDeck.push(jsonStringify(cardMaking.allCards[30]));
    botDeck.push(jsonStringify(cardMaking.allCards[30]));
    botDeck.push(jsonStringify(cardMaking.allCards[36]));
    botDeck.push(jsonStringify(cardMaking.allCards[36])); 
}
  
// for spawning minion
function chooseMinion_OnEasyNormal(){
    
    var i = 0,
        length = enemyHand.length,
        minusBy = 0;
    // if minusBy == 6 then there is no playable card at this turn

    
    // Start searching from the highest cost mobs to lowest. Every frame increase the           minusBy and lower the cost search for a minion
    while(enemyMana >= 0 && minusBy <= enemyMana){
        var currentMinion = enemyHand[i];

        if(!currentMinion) // no cards in da hand
            return;

        if(currentMinion.mana <= enemyMana)
            spawningEnemyMinion_OnEasyNormal(currentMinion, i);
        
        i+=1;

        if(i == enemyHand.length - 1){
            i = 0;
            minusBy+=1;
        }       
    }
}

function chooseMinion_OnHard(){
    // determine card priority
    cardPriority.cardsPlayable();
    
    var i,
        length = handPriority.length;
        
    for(i = 0; i < length; i+=1){    
        var currentPriority = handPriority[i];
        
        // if spell's priority is higher than a card's
        if(!currentPriority.card){ // => it is a spell
            // cast on a card if it is defined 
            if(currentPriority.onCard){
                elementalistCasting
                    .castChosenSpell(currentPriority.cardIndex, 
                        enemyCharacter, currentPriority.onField, currentPriority.onCard);
            }
            // cast on the either hero
            else{
                elementalistCasting
                .castChosenSpell(currentPriority.cardIndex, enemyCharacter,                                     currentPriority.onField, 0)
            }
        }
        
        // spawn a card
        else if(currentPriority.card.mana <= enemyMana)
            spawningEnemyMinion_OnEasyNormal(
                currentPriority.card, currentPriority.cardIndex);
    }
}

function spawningEnemyMinion_OnEasyNormal(spawningCard, cardIndex){
    
    var i,
        length = enemyFields.length;
    
    for(i = 0; i < length; i+=1){
        var currentField = enemyFields[i];
        
        if(!currentField.card && !currentField.isDisabled){
            spawningCard.turnSpawn = turnCount;
            currentField.card = spawningCard;
            enemyMana -= spawningCard.mana; 
            
            // write the report
            var writeStream = fs.createWriteStream('battle_results.txt');
            battleDone+= 'Spawning: ' + spawningCard.name + ' on ' + currentField.x  + 
                ' Mana Left: ' + enemyMana + '\n';
            writeStream.write(battleDone);
            writeStream.end();
               
            setCardSpecialities.setCardSpecials(currentField.card, 'enemy');
            
            // has special that activates at the end of the turn
            coreActions.isCardUniq(spawningCard, i, 'enemy');
            
            enemyHand.splice(cardIndex, 1);
            enemySpawnedCards +=1;
            return;
        }
    }
}

function attackUserMinions_OnEasy(){ // picked kicked
    // 1) run through enemy battleground and pick a mob
    //  a) if there isn't a mob end the search for battle
    // 2) run through player battleground and choose a sheep to be eaten
    //  a) if there is no sheep attack the sheperd :D
    //  b) if sheperd is dead then admit that you suck at mass effect teeehee
    
    var indexEnemyMinions = 0,
        indexPlayerMinions = 0,
        enemyFieldLength = playerFields.length,
        playerFieldLength = playerFields.length;
    
    while(indexEnemyMinions < enemyFieldLength){
        // 1)
        var currentEnemyMinion = enemyFields[indexEnemyMinions];
        
        // a)
        if(!currentEnemyMinion.card){
            indexEnemyMinions+=1;
            continue;
        }
        
        // 2)
        while(indexPlayerMinions < playerFieldLength){
            var currentPlayerMinion = playerFields[indexPlayerMinions];
           
            if(!currentEnemyMinion.card ||
               coreActions.hasAttacked(currentEnemyMinion) ||
               currentEnemyMinion.card.turnSpawn == turnCount ||
               setCardSpecialities.isCardImmobiled(currentEnemyMinion.card))
                break;
            
            // if there is no card or the card has stealth or taunt
            if(!currentPlayerMinion.card || currentPlayerMinion.card.canStealth ||
            (playerTaunts > 0  && !currentPlayerMinion.card.isTaunt &&
             !currentPlayerMinion.card.canStealth)){
                indexPlayerMinions+=1;
                continue;
            }
            
            // increase the index
            indexPlayerMinions+=1;
            // let them fight and pin the attacker to the wall of no entry here 
            coreActions.cardsBattle(currentEnemyMinion, currentPlayerMinion,
                                    false, indexPlayerMinions);
        }
        indexPlayerMinions = 0;
            
        // a)
        if(currentEnemyMinion &&
            !coreActions.hasAttacked(currentEnemyMinion) &&
           currentEnemyMinion.card.turnSpawn != turnCount &&
           !setCardSpecialities.isCardImmobiled(currentEnemyMinion.card)){
            coreActions.attackEnemyChief(currentEnemyMinion, chosenCharacter, 
                                         playerHealth, 'userPlayer');
        }
        indexEnemyMinions+=1;
    }
}

function attackUserMinions_OnNormal(){
    // 1) take a random value
    //  a) if it is less then 42 play this turn for board control
    //  b) else play straight to the face
    
    var indexEnemyMinion = 0,
        enemyFieldLength = enemyFields.length;
    
    while(indexEnemyMinion < enemyFieldLength){
        var currentEnemyCreature = enemyFields[indexEnemyMinion];
        
        if(!currentEnemyCreature.card ||
           coreActions.hasAttacked(currentEnemyCreature) ||
           currentEnemyCreature.card.turnSpawn == turnCount ||
           setCardSpecialities.isCardImmobiled(currentEnemyCreature.card)){
            indexEnemyMinion+=1;
            continue;
        }
        
        // 1)
        var randomNumber = Math.round(Math.random() * 100);
        
        // a)
        if(randomNumber <= 92){
             enemyMinionAttacks_Normal(currentEnemyCreature);   
        }
             
        // b)
        else if(playerTaunts == 0)
            coreActions.attackEnemyChief(currentEnemyCreature, chosenCharacter, 
                                         playerHealth, 'userPlayer');
        
        else
            enemyMinionAttacks_Normal(currentEnemyCreature);
        
        indexEnemyMinion+=1;
    }
}

function attackUserMinions_OnHard_Control(){
    var i,
        length = enemyFields.length;
            
    for(i = 0; i < length; i+=1){
        var currentField = enemyFields[i];
        
        if(!currentField.card ||
           currentField.isDisabled || 
           coreActions.hasAttacked(currentField) ||
           currentField.card.turnSpawn == turnCount ||
           setCardSpecialities.isCardImmobiled(currentField.card))
            continue;
        
        if(botDeckOptions[indexOnBotDeck] == 'control')
            cardPriority.cardsAttackableWith(currentField.card);
        else if(botDeckOptions[indexOnBotDeck] == 'aggro')
            cardPriority.aggroCardLogic(currentField.card);
       
        for(var j = 0; j < attackPriority.length; j+=1){
            if(coreActions.hasAttacked(currentField))
                break;
            
                coreActions.cardsBattle(currentField, attackPriority[j].field,
                                        false, attackPriority[j].cardIndex);
                ctx.point(width - 20, 3, 'Attacking PL Mob');
        }
        
        if(attackPriority.length == 0){ 
                coreActions.attackEnemyChief(currentField, chosenCharacter, 
                                             playerHealth, 'userPlayer');
                ctx.point(width - 20, 3, 'Attacking PL');
        }
        
        attackPriority = [];
    }
}

function enemyMinionAttacks_Normal(currentEnemyCreature){
   var potentialVicitms = [],
         i,
         length = playerFields.length;
     
     for(i = 0; i < length; i+=1){
         var currentPlayerMob = playerFields[i];
         
         // check for taunts if there are search for the one and attack it
         if(currentPlayerMob.card){
             if(playerTaunts > 0){
                if(currentPlayerMob.card.isTaunt){
                    coreActions.cardsBattle(currentEnemyCreature, currentPlayerMob,
                                            false, i);
                    return;
                }
                 else
                     continue;
             }
             
             potentialVicitms.push(currentPlayerMob);
         }
     }
        // there are no user mobs
    if(potentialVicitms.length == 0){
        coreActions.attackEnemyChar(currentEnemyCreature, chosenCharacter, 
                                    playerHealth, 'userPlayer');
        return;
    }
    
    var randomVictimIndex = 
        Math.round(Math.random() * (potentialVicitms.length -1));
        
    coreActions.cardsBattle(currentEnemyCreature, playerFields[randomVictimIndex],
                            false, randomVictimIndex);     
}

// local helping functions

function jsonStringify(card){
    return JSON.parse(JSON.stringify(card));
}