//importing 
var variables = require('../GameFunds/variables'),
    cardMaking = require('../GameFunds/cardMaking'),
    cardVariables = require('../GameFunds/cardVariables'),
    cardPriority = require('../GameFunds/cardPriority'),
    setCardSpecialities = require('../GameFunds/setCardSpecialities'),
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
    enemyCharacter.class = botClassOptions[indexOnBotClass];
    enemyCharacter.level = characters.getMaxCharacterLevel();
    
    if(enemyCharacter.class == 'elementalist'){
        characters.determineChampionClass(enemyCharacter);
    }
        
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
        cursorPosition = Math.round(Math.random() * playerFieldVectors.length),
        fieldIndex;
    
    
    // choose a field where to cast the spell;
    if(markedCursorField != 'enemyCharacter' && markedCursorField != 'userPlayer')
        fieldIndex = Math.round(Math.random() * (playerFieldVectors.length - 1));
    
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
        if(turnCount % 3 == 0)
            botCastsSpell();
        
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
        length = enemyCardsVectors.length;
    
    for(i = 0; i < length; i+=1){
        var currentCard = enemyCardsVectors[i];
        
        if(currentCard.isTaunt)
            return true;
    }
    
    return false;
}

// for chooseBot helping functions
function chooseDifficulty(key){
    writeText(0, 1, 'Choose difficulty...');
    writeText(0, 2, 'Currently chosen: ' + difficultyOptions[indexOnDifficulty]);

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
    
    writeText(0, 2, 'Currently chosen: ' + difficultyOptions[indexOnDifficulty]);
}

function chooseBotCharacter(key){
    writeText(0, 3, 'Choose bot character...');
    writeText(0, 4, 'Currently chosen: ' + botClassOptions[indexOnBotClass]);
    
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
    writeText(0, 4, 'Currently chosen: ' + botClassOptions[indexOnBotClass]);
}

function chooseBotDeck(key){
    writeText(0, 5, 'Choose bot deck...');
    writeText(0, 6, 'Currently chosen: ' + botDeckOptions[indexOnBotDeck]);

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
    writeText(0, 6, 'Currently chosen: ' + botDeckOptions[indexOnBotDeck]);
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
        length = enemyCardsVectors.length,
        minusBy = 0;
    // if minusBy == 6 then there is no playable card at this turn

    
    // Start searching from the highest cost mobs to lowest. Every frame increase the           minusBy and lower the cost search for a minion
    while(enemyMana >= 0 && minusBy <= enemyMana){
        var currentMinion = enemyCardsVectors[i];

        if(!currentMinion) // no cards in da hand
            return;

        if(currentMinion.mana <= enemyMana)
            spawningEnemyMinion_OnEasyNormal(currentMinion, i);
        
        i+=1;

        if(i == enemyCardsVectors.length - 1){
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
        length = enemyFieldVectors.length;
    
    for(i = 0; i < length; i+=1){
        var currentField = enemyFieldVectors[i];
        
        if(!currentField.card && !currentField.isDisabled){
            spawningCard.turnSpawn = turnCount;
            currentField.card = spawningCard;
            enemyMana -= spawningCard.mana; 
            
            // write the report
            var writeStream = fs.createWriteStream('battle_results.txt');
            battleDone+= 'Spawning: ' + spawningCard.name + ' on ' + currentField.x + 
                ' Turn: ' + turnCount + ' Mana Left: ' + enemyMana + '\n';
            writeStream.write(battleDone);
            writeStream.end();
               
            setCardSpecialities.setCardSpecials(currentField.card, 'enemy');    

            
            // has special that activates at the end of the turn
            isCardUniq(spawningCard, i);
            
            enemyCardsVectors.splice(cardIndex, 1);
            enemyCardsOnField +=1;
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
        enemyFieldLength = fieldLength,
        playerFieldLength = fieldLength;
    
    while(indexEnemyMinions < enemyFieldLength){
        // 1)
        var currentEnemyMinion = enemyFieldVectors[indexEnemyMinions];
        
        // a)
        if(!currentEnemyMinion.card){
            indexEnemyMinions+=1;
            continue;
        }
        
        // 2)
        while(indexPlayerMinions < playerFieldLength){
            var currentPlayerMinion = playerFieldVectors[indexPlayerMinions];
           
            if(!currentEnemyMinion.card ||
               hasFieldAttacked(currentEnemyMinion) ||
               currentEnemyMinion.card.turnSpawn == turnCount ||
               setCardSpecialities.isCardImmobiled(currentEnemyMinion.card))
                break;
            
            if(!currentPlayerMinion.card ||
            (playerTauntsOnField > 0  && 
             !currentPlayerMinion.card.isTaunt &&
             !currentPlayerMinion.card.canStealth) ||
              currentEnemyMinion.card.canStealth){
                indexPlayerMinions+=1;
                continue;
            }
            
            // increase the index
            indexPlayerMinions+=1;
            // let them fight and pin the attacker to the wall of no entry here 
            enemyMinionAttacks(currentEnemyMinion, 
                               currentPlayerMinion, indexPlayerMinions);
        }
        indexPlayerMinions = 0;
        
        // a)
        if(currentEnemyMinion &&
            !hasFieldAttacked(currentEnemyMinion) &&
           currentEnemyMinion.card.turnSpawn != turnCount &&
           !setCardSpecialities.isCardImmobiled(currentEnemyMinion.card)){
            enemyMinionAttacksPlayerHero(currentEnemyMinion);
        }
        indexEnemyMinions+=1;
    }
}

function attackUserMinions_OnNormal(){
    // 1) take a random value
    //  a) if it is less then 42 play this turn for board control
    //  b) else play straight to the face
    
    var indexEnemyMinion = 0,
        enemyFieldLength = enemyFieldVectors.length;
    
    while(indexEnemyMinion < enemyFieldLength){
        var currentEnemyCreature = enemyFieldVectors[indexEnemyMinion];
        
        if(!currentEnemyCreature.card ||
           hasFieldAttacked(currentEnemyCreature) ||
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
        else if(playerTauntsOnField == 0)
            enemyMinionAttacksPlayerHero(currentEnemyCreature);
        
        else
            enemyMinionAttacks_Normal(currentEnemyCreature);
        
        indexEnemyMinion+=1;
    }
}

function attackUserMinions_OnHard_Control(){
    var i,
        length = enemyFieldVectors.length;
            
    for(i = 0; i < length; i+=1){
        var currentField = enemyFieldVectors[i];
        
        if(!currentField.card ||
           currentField.isDisabled || 
           hasFieldAttacked(currentField) ||
           currentField.card.turnSpawn == turnCount ||
           setCardSpecialities.isCardImmobiled(currentField.card))
            continue;
        
        if(botDeckOptions[indexOnBotDeck] == 'control')
            cardPriority.cardsAttackableWith(currentField.card);
        else if(botDeckOptions[indexOnBotDeck] == 'aggro')
            cardPriority.aggroCardLogic(currentField.card);
        
       // ctx.point(width - 20, 3, attackPriority.length + ' _42');
        for(var j = 0; j < attackPriority.length; j+=1){
            if(hasFieldAttacked(currentField))
                break;
            
                enemyMinionAttacks(currentField, attackPriority[j].field,             
                                   attackPriority[j].cardIndex);
                ctx.point(width - 20, 3, 'Attacking PL Mob');
        }
        
        if(attackPriority.length == 0){ 
                enemyMinionAttacksPlayerHero(currentField);
                ctx.point(width - 20, 3, 'Attacking PL');
        }
        
        attackPriority = [];
    }
}

function enemyMinionAttacks_Normal(currentEnemyCreature){
   var potentialVicitms = [],
         i,
         length = playerFieldVectors.length;
     
     for(i = 0; i < length; i+=1){
         var currentPlayerMob = playerFieldVectors[i];
         
         // check for taunts if there are search for the one and attack it
         if(currentPlayerMob.card){
             if(playerTauntsOnField > 0){
                if(currentPlayerMob.card.isTaunt){
                    enemyMinionAttacks(currentEnemyCreature, currentPlayerMob, i);
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
        enemyMinionAttacksPlayerHero(currentEnemyCreature);
        return;
    }
    
    var randomVictimIndex = 
        Math.round(Math.random() * (potentialVicitms.length -1));
        
    enemyMinionAttacks(currentEnemyCreature,                                                                  playerFieldVectors[randomVictimIndex], randomVictimIndex);     
}

// local helping functions
var lastWrittenText = '';
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
    
function enemyMinionAttacks(enemyCreature, playerCreature, playerCreatureIndex){
    if(!enemyCreature.card ||
       !playerCreature.card ||
       setCardSpecialities.isCardImmobiled(enemyCreature.card) ||
       playerCreature.card.canStealth ||
       enemyCreature.isDisabled){   
        return;
    }
    
    // write the report
    writeBattle(enemyCreature, playerCreature);        

    setCardSpecialities.activateCardBoons(enemyCreature, playerCreature.card.defence,
                        'playerField', playerCreatureIndex,playerCreature.card.canBlock);
    
    // attack each other
    if(enemyCreature.card.canBlock)
        enemyCreature.card.canBlock = 0;
    else{
        enemyCreature.card.defence -= playerCreature.card.attack;
        
        if(enemyCreature.card.canEnrage)
            setCardSpecialities.setCardSpecials(enemyCreature.card, 'enemy');
    }
    
    if(playerCreature.card.canBlock)
        playerCreature.card.canBlock = 0;
    else{
        playerCreature.card.defence -= enemyCreature.card.attack;
        
        if(playerCreature.card.canEnrage)
            setCardSpecialities.setCardSpecials(playerCreature.card, 'player');
    }
    
    if(enemyCreature.card.hasDeathrattle && enemyCreature.card.defence <= 0)
        setCardSpecialities.setCardSpecials(enemyCreature.card, 'enemy');
    
    if(playerCreature.card.hasDeathrattle && playerCreature.card.defence <= 0){
        setCardSpecialities.setCardSpecials(playerCreature.card, 'player');
        ctx.point(width - 20, 3, 'deathrattle');
    }
    
    // if the card is dead destroy the card
    if(enemyCreature.card.defence <= 0){
        if(enemyCreature.card.isTaunt)
            enemyTauntsOnField-=1;
        ctx.point(width - 20, 3, enemyCreature.x + ':x');
        enemyCreature.card = undefined;

        ctx.fg(255, 0, 0);
        ctx.box(enemyCreature.x, enemyCreature.y, cardWidth, cardHeight);
        ctx.cursor.restore();
        enemyCardsOnField -= 1;
    }
    
    if(playerCreature.card.defence <= 0){
        if(playerCreature.card.isTaunt)
            playerTauntsOnField-= 1;
        
        playerCreature.card = undefined;
        
        ctx.fg(255, 0, 0);
        ctx.box(playerCreature.x, playerCreature.y, cardWidth, cardHeight);
        ctx.cursor.restore();
        playerCardsOnField -=1;
    }
    
    if(enemyCreature.card &&
       playerCreature.card &&
       enemyCreature.card.canImmobile)
        immobileTargets.push({card: playerCreature.card, onTurn: turnCount});          
}

function enemyMinionAttacksPlayerHero(enemyCreature){
    if(setCardSpecialities.isCardImmobiled(enemyCreature.card) ||
       enemyCreature.isDisabled)
       return;
    
    // write battle
    var writeStream = 
        fs.createWriteStream('battle_results.txt');
    battleDone += enemyCreature.card.name + ' ( ' + enemyCreature.card.attack + ' ' + 
                  enemyCreature.card.defence + ' x: ' + enemyCreature.x + ' ) VS ' + 
                  createdCharacters[indexAtCharacter].name + ' Remaining Stamina: ' +                       playerHealth + ' Turn: ' + turnCount +  '\n';
    
    writeStream.write(battleDone);
    writeStream.end();   
    
    setCardSpecialities.activateCardBoons(enemyCreature, playerHealth, 
                                          'userPlayer', 0, chosenCharacter.canBlock);
    
    if(chosenCharacter.canBlock)
        chosenCharacter.canBlock = 0;
    else{
        playerHealth -= enemyCreature.card.attack;
        
        if(chosenCharacter.damage){
            enemyCreature.card.defence -= chosenCharacter.damage;
            
            if(enemyCreature.card.canEnrage)
                setCardSpecialities.setCardSpecials(enemyCreature.card, 'enemy');
        }
    }
    
    if(enemyCreature.card.hasDeathrattle && enemyCreature.card.hasDeathrattle)
        setCardSpecialities.setCardSpecials(enemyCreature.card, 'enemy');
    
    if(enemyCreature.card &&
       enemyCreature.card.canImmobile){
        immobileTargets.push({card:chosenCharacter, onTurn:turnCount});
        ctx.point(width - 20, 3, 'Yur hero is immobiled');
    }
}

function hasFieldAttacked(field){
    var i,
        length = attackedFromFields.length;
    
    for(i = 0; i < length; i+=1){
        var currentField = attackedFromFields[i];
        
        if(currentField === field)
            return true;
    }
    
    return false;
}

function writeBattle(currentEnemyMinion, currentPlayerMinion){
        // 1) write the report into a file
    battleDone += 
        (currentEnemyMinion.card.name + '( ' + 
        currentEnemyMinion.card.attack + ' '      +      
        currentEnemyMinion.card.defence + ' x: ' + 
        currentEnemyMinion.x + ' )' + ' VS ' + 
        currentPlayerMinion.card.name + '( ' + 
        currentPlayerMinion.card.attack + ' ' + 
         currentPlayerMinion.card.defence + ' x: ' + currentPlayerMinion.x +  ' ) '             + 'turn: ' + turnCount + '\n');
          
    var writeStream = fs.createWriteStream('battle_results.txt');
        writeStream.write(battleDone);
        writeStream.end();        
}

function isCardUniq(card, index){
    var i,
        length = uniqCards.length;
    
    for(i = 0; i <length; i +=1){
        if(card.name == uniqCards[i]){
            summonnedUniqCards.push({card:card, from:'enemy', onIndex: index});
            return;
        }
    }
}

function activateEnemyUniqCards(){
    var i = 0;
    
    while(i < summonnedUniqCards.length){
        var currentCard = summonnedUniqCards[i],
            cardIndex = currentCard.fromIndex;
        
        if(!currentCard.card ||
          (currentCard.from == 'enemy' &&
           enemyFieldVectors[cardIndex].card &&
           enemyFieldVectors[cardIndex].card != currentCard.card)){
            summonnedUniqCards.splice(i, 1);
            continue;
        }
        
        if(currentCard.from == 'enemy')
            setCardSpecialities.setCardSpecials(currentCard.card, 'enemy');
        
        i+=1;
    }
}
            
function jsonStringify(card){
    return JSON.parse(JSON.stringify(card));
}