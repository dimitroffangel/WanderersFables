// importing
var variables = require('../GameFunds/variables'),
    cardVariables = require('../CardComponent/cardVariables'),
    cardMaking = require('../CardComponent/cardMaking'),
    setCardSpecialities = require('../CardComponent/setCardSpecialities');

// exporting
exports.activateBoons = function(){
    activeBleeding();
    activeVulnerable(); // !playerIndex means the player is againts AI 
    if(playerIndex == 1 || !playerIndex){
        activeImmobile();
        activeBurningFire();
    }
    activeWindfury();
    
    // if there are special weapon activate their abilities too
    if(earthShieldOn == 'player')
        playerArmor+=1;
    else if(earthShieldOn == 'enemy')
        enemyArmor+=1;
    chosenCharacter.hasAttacked = false;
    enemyAttacked = false;
    
    // activate uniq player and enemy cards
    activatePlayerUniqCards();  
    socket.emit('uniqActions', {gameOrder:gameOrder, playerIndex:playerIndex, uniqActions: uniqCardsActions});
    if(currentModeState == 'Training')
        activateEnemyUniqCards();
}

exports.activateRecievedUniqCards = function(enemyUniqCards){
    var curAction;
    for(var i = 0; i < enemyUniqCards.length; i++){
        curAction = enemyUniqCards[i];

        if(curAction.name == 'Veteran Fleshreaver'){
            var cardIndex = findCard('Veteran Fleshreaver');
            hp_SpawningCard(cardIndex, 'enemy', false);
        }
        else if(curAction.name == 'Captain Tervelan'){
            var cardIndex = findCard('Bandit');
            hp_SpawningCard(cardIndex, 'enemy', false);
        }
        else if(curAction.name == 'Kamikazeto99'){
            var j,
                length = enemyFields.length,
                cardsOnField = [];
        
            for(j = 0; j < length; j+=1){
                var currentField = playerFields[j]; 
                if(currentField.card)
                    cardsOnField.push(currentField);
            }
            
            for(j = 0; j < length; j+=1){
                var currentField = enemyFields[j];
                if(currentField.card)
                    cardsOnField.push(currentField);
            }

            var damage = 2;

            var randomIndex = curAction.attackedIndex;
            if(randomIndex < cardsOnField.length){
                cardsOnField[randomIndex].card.defence -= damage;
                ctx.point(width-20, 3, cardsOnField[randomIndex].card.defence + ' BOMB');
                checkCardDefence(cardsOnField[randomIndex]);
            }
            else if(randomIndex == cardsOnField.length)
                variables.attackEnemyChar(damage);
            else if(randomIndex == cardsOnField.length + 1)
                variables.attackUserChar(damage);
        }

        else if(curAction.name == 'Shaman of Caledon'){
            var i,
                length = enemyFields.length,
                healableFields = enemyFields,
                fieldsWithCards = [],
                healAmount = 2;
                
            for(i= 0; i < length;i+=1){
                if(healableFields[i].card)
                    fieldsWithCards.push(i);
            }

            var fieldIndex = curAction.healedIndex;
            // card to be healed
            var healingCard = healableFields[fieldsWithCards[fieldIndex]].card; 

            healingCard.defence+= healAmount;
            if(healingCard.defence > healingCard.initialHealth)
                healingCard.defence = healingCard.initialHealth;
        }
    }
}

function activatePlayerUniqCards(){
    var i = 0;
    
    while(i < summonnedUniqCards.length){
        var currentCard = summonnedUniqCards[i],
            cardIndex = currentCard.onIndex;
        
        // if there is no card or the card, on the field is not the memorised one remove her from the list  
        if(!currentCard.card ||
          (currentCard.from == 'player' &&
           playerFields[cardIndex].card &&
          playerFields[cardIndex].card != currentCard.card)){
            summonnedUniqCards.splice(i, 1);
            continue;
        }
    
        if(currentCard.from == 'player')
            setCardSpecialities.setCardSpecials(currentCard.card, 'player');
            
        i+=1;   
    }
}

function activateEnemyUniqCards(){
    var i = 0;
    
    while(i < summonnedUniqCards.length){
        var currentCard = summonnedUniqCards[i],
            cardIndex = currentCard.onIndex;
        
        if(!currentCard.card ||
          (currentCard.from == 'enemy' &&
           enemyFields[cardIndex].card &&
           enemyFields[cardIndex].card != currentCard.card)){ // because he is dead
            summonnedUniqCards.splice(i, 1);
            continue;
        }
        
        if(currentCard.from == 'enemy')
            setCardSpecialities.setCardSpecials(currentCard.card, 'enemy');
        
        i+=1;
    }
}

function returnPlayerCard(field){
     
    if(playerHand.length < 6)
        playerHand.push(field.card);
    
    else if(playerBonusHand.length < 4)
        playerBonusHand.push(field.card);
    
   // destroyCardOn(field);
    field.card = undefined;
     ctx.fg(255, 0, 0);
     ctx.box(field.x, field.y, cardWidth, cardHeight);
     ctx.cursor.restore();
}

function returnEnemyCard(field){
    if(!field.card)
        return;
    
    if(enemyHand && enemyHand.length < 10)
         enemyHand.push(field.card);
     
     field.card = undefined;
     ctx.fg(255, 0, 0);
     ctx.box(field.x, field.y, cardWidth, cardHeight);
     ctx.cursor.restore();
}

exports.botKnockdownsCard = function(){

    var i,
        length = playerFields.length,
        mobsOnField = [];
    
    for(i = 0; i < length; i+=1){
        var currentField = playerFields[i];
        
        if(currentField.card)
            mobsOnField.push(currentField);
    }
    
    if(mobsOnField.length > 0){
        var chosenField = 
            mobsOnField[Math.round(Math.random() * (mobsOnField.length - 1))];
        
        returnPlayerCard(chosenField);
    }
    
    else{
        length = enemyFields.length;
        
        for(i = 0; i < length; i+=1){
            var currentField = enemyFields[i];
            
            if(currentField.card)
                mobsOnField.push(currentField);
        }
        
        if(mobsOnField.length > 0){
            var chosenField =
                mobsOnField[Math.round(Math.random() * (mobsOnField.length - 1))];
            
            returnEnemyCard(chosenField);
        }
     }
}

// when this is called the game must do what the card should do
exports.gameActions = function(onField, onIndex){
    if(onIndex < 0 || !onField)
        return;


    // check not only the user cards but his opponents too if he is on playGame
    if(isKnockingCard){
        if(((playerSpawnedCards == 1 &&
            enemySpawnedCards == 0) ||
            (enemySpawnedCards == 1 &&
             playerSpawnedCards == 0))){
            //Canceled knocking
            isKnockingCard = false;
            return;
        }
        
        //knockdown ally card
        if(onField == 'playerField' &&
          playerFields[onIndex].card){
            ctx.point(width-20, 3, 'Knocked player card');
            returnPlayerCard(playerFields[onIndex]);
        }
        
        // knockdown enemy card
        else if(onField == 'enemyField' &&
               enemyFields[onIndex].card){
            returnEnemyCard(enemyFields[onIndex]);
            ctx.point(width-20, 3, 'Knocked enemy card');
        }
        
        // has knocked himself
        else if(!hasPlayerTurnEnded){
            if(playerHand.length < 6)   
                playerHand.push(playerFields[changingFieldIndex].card);
            else if(playerBonusHand.length < 4)
                playerBonusHand.push(playerFields[changingFieldIndex].card);
            
            playerFields[changingFieldIndex].card = undefined;
        }
        
        else if(hasPlayerTurnEnded){
            if(enemyHand.length < 10)   
                enemyHand.push(enemyFields[changingFieldIndex].card);
            
            enemyFields[changingFieldIndex].card = undefined;
        }
        isKnockingCard = false;
    }
    
    // increase attack and defence
    if(isChangingMobStats){
        if((onIndex == changingFieldIndex &&
           (onField == 'playerField' || onField == 'enemyField')) || 
           ((playerSpawnedCards == 1 &&
            enemySpawnedCards == 0) ||
            (enemySpawnedCards == 1 &&
             playerSpawnedCards == 0))){
            isChangingMobStats = false;
            return;
        }
     
        // change player cards stats
        if(onField == 'playerField' &&
          playerFields[onIndex].card){
            playerFields[onIndex].card.defence += 2;
            playerFields[onIndex].card.attack += 2;
        }
        
        // change enemy card stats
        else if(onField == 'enemyField' &&
               enemyFields[onIndex].card){
            enemyFields[onIndex].card.defence += 2;
            enemyFields[onIndex].card.attack += 2;
        }
        
        // change spawned card stats
        else if(!hasPlayerTurnEnded){
            if(playerHand.length < 6)   
                playerHand.push(playerFields[changingFieldIndex].card);
            else if(playerBonusHand.length < 4)
                playerBonusHand.push(playerFields[changingFieldIndex].card);
            
            playerFields[changingFieldIndex].card = undefined;
        }
        
        else if(hasPlayerTurnEnded){
            if(enemyHand.length < 10)   
                enemyHand.push(enemyFields[changingFieldIndex].card);
            
            enemyFields[changingFieldIndex].card = undefined;
        }        
        
        isChangingMobStats = false;
    }
    
    // swapping attack with defence
    if(isSwappingMinionStats){
        // cancel swapping
     if((onIndex == changingFieldIndex &&
           (onField == 'playerField' || onField == 'enemyField')) || 
           ((playerSpawnedCards == 1 &&
            enemySpawnedCards == 0) ||
            (enemySpawnedCards == 1 &&
             playerSpawnedCards == 0))){
            isSwappingMinionStats = false;
            return;
        }
        // swap ally stats
        if(onField == 'playerField' &&
          playerFields[onIndex].card){
            var fieldToSwap =playerFields[onIndex].card,
                defence = fieldToSwap.defence;
            
            fieldToSwap.defence = fieldToSwap.attack;
            fieldToSwap.attack = defence;
        }
        
        // swap enemy stats
        else if(onField == 'enemyField' &&
               enemyFields[onIndex].card){
            
            var fieldToSwap = enemyFields[onIndex], 
                defence = fieldToSwap.card.defence;
            
            fieldToSwap.card.defence = fieldToSwap.card.attack;
            fieldToSwap.card.attack = defence;            
        }
        
        // swap card spawned stats
        else if(!hasPlayerTurnEnded){
            if(playerHand.length < 6)   
                playerHand.push(playerFields[changingFieldIndex].card);
            else if(playerBonusHand.length < 4)
                playerBonusHand.push(playerFields[changingFieldIndex].card);
            
            playerFields[changingFieldIndex].card = undefined;
        }
        
        else if(hasPlayerTurnEnded){
            if(enemyHand.length < 10 && enemyFields[changingFieldIndex].card)  
                enemyHand.push(enemyFields[changingFieldIndex].card);
            
            enemyFields[changingFieldIndex].card = undefined;
        }        
        isSwappingMinionStats = false;
    }
    ctx.point(width - 20, 5, isShatteringField + ' shatter');
    if(isShatteringField){
        // disable ally field
        if(onField == 'playerField')
            playerFields[onIndex].isDisabled = true;
        
        // disable enemy field
        else if(onField == 'enemyField')
            enemyFields[onIndex].isDisabled = true; 
        
        // swap card spawned stats
        else if(!hasPlayerTurnEnded){
            if(playerHand.length < 6)   
                playerHand.push(playerFields[changingFieldIndex].card);
            else if(playerBonusHand.length < 4)
                playerBonusHand.push(playerFields[changingFieldIndex].card);
            
            playerFields[changingFieldIndex].card = undefined;
        }
        
        // it is a data send from the enemy
        else if(hasPlayerTurnEnded){
            if(enemyHand.length < 10 && enemyFields[changingFieldIndex].card)  
                enemyHand.push(enemyFields[changingFieldIndex].card);
            
            enemyFields[changingFieldIndex].card = undefined;
        }        
        isShatteringField = false;
    }
}

// returns the index of the spawnned card

function hp_SpawningCard(cardIndex, summonFrom, fromHand){
    var deck;
    if(!fromHand)
        deck = cardMaking.allCards;
    else if(summonFrom == 'player')
        deck = playerHand;
    else
        deck = enemyHand;
    
    var i,
        length = playerFields.length;
    
    if(summonFrom == 'enemy'){
        for(i = 0; i < length; i+=1){
            var currentField = enemyFields[i];
            
            if(!currentField.card && !currentField.isDisabled){
                currentField.card =
                    JSON.parse(JSON.stringify(deck[cardIndex]));
                
                return i;
            }
        }
    }
    
    else{
        for(i = 0; i < length; i+=1){
            var currentField = playerFields[i];
            
            if(!currentField.card && !currentField.isDisabled){
                           
                currentField.card =
                    JSON.parse(JSON.stringify(deck[cardIndex]));
                return i;
            }
        }
    }
}

exports.spawningCard = function(cardIndex, summonFrom, fromHand){
    hp_SpawningCard(cardIndex, summonFrom, fromHand);
}

// bleeding: each elelement has: targetName, decrease defence or damage, power, '
function activeBleeding(){
    var i = 0;
    
    while(i < bleedingTargets.length){
        var currentTarget = bleedingTargets[i];
     
         if(currentTarget.name == 'userPlayer')
             variables.attackUserChar(currentTarget.power);
             
         else if(currentTarget.name == 'enemyCharacter')
             variables.attackEnemyChar(currentTarget.power);
         
         else{ // => it's a card
             var targetCard;
             
             if(currentTarget.name == 'playerField')
                 targetCard = playerFields[currentTarget.position];
             else if(currentTarget.name =='enemyField')
                 targetCard = enemyFields[currentTarget.position];
             else
                 Error('CurrentTarget.name is kungala thingy');
 
             if(!targetCard ||
                !targetCard.card)
                 return;
             
             targetCard.card.defence -= currentTarget.power;
             
             checkCardDefence(targetCard);
        }
        
        if(turnCount - currentTarget.forTurns >= currentTarget.startedOn){
            bleedingTargets.splice(i, 1);
            continue;
        }
        
        i+= 1;
    }
}

function activeVulnerable(){
    var i = 0;
    
    while(i < vulnerableTargets.length){
        var currentTarget = vulnerableTargets[i];
        
        if(currentTarget.name == 'enemyCharacter')
            variables.attackEnemyChar(currentTarget.power);
        else if(currentTarget.name == 'userPlayer')
            variables.attackUserChar(currentTarget.power);
        
        else{ // => it is a card
            if(currentTarget.name == 'enemyField' && 
              enemyFields[currentTarget.position].card){
                enemyFields[currentTarget.position].card.defence -= currentTarget.power;
                ctx.point(width-20, 2, 
                          enemyFields[currentTarget.position].card.defence + 'DA');
            }
            
            else if(currentTarget.name == 'playerField' &&
                   playerFields[currentTarget.position].card){
                playerFields[currentTarget.position].card.defence -=currentTarget.power;
            }
            
            else Error('Vulnerabilty cannot be done');
        }
        ctx.point(width-20, 2, (-currentTarget.startedOn +turnCount - currentTarget.forTurns) + ' SUm');
        ctx.point(width-20, 3, currentTarget.name + ' ' + currentTarget.cardHealth);
        if(turnCount - currentTarget.forTurns >= currentTarget.startedOn){
            if(currentTarget.name == 'enemyCharacter')
                enemyPlayerHealth = currentTarget.cardHealth;
            else if(currentTarget.name == 'userPlayer')
                playerHealth = currentTarget.cardHealth;
            else if(currentTarget.name == 'enemyField' &&
                   enemyFields[currentTarget.position].card){
                ctx.point(width-20, 3, currentTarget.cardHealth + ' cardHealth');
                enemyFields[currentTarget.position].card.defence= currentTarget.cardHealth;
            }
            else if(currentTarget.name == 'playerField'){
               playerFields[currentTarget.position].card.defence= currentTarget.cardHealth;
            }

            vulnerableTargets.splice(i, 1);
            continue;
        }

        i+= 1;
    }
}

function activeImmobile(){
    var i = 0;
    
    while(i < immobileTargets.length){
        var currentTarget = immobileTargets[i];
        
        // each immobile is valid for 2 turns
        if(turnCount - currentTarget.onTurn >= 2){
            immobileTargets.splice(i, 1);
            continue;
        }
        
        i+=1;
    }
}

function activeBurningFire(){
    var i = 0;
    
    while(i < burningTargers.length){
        var currentTarget = burningTargers[i];
        
        if(turnCount - currentTarget.onTurn >= 2){
            burningTargers.splice(i, 1);
            continue;
        }
        i+=1;
    }
}

function activeWindfury(){
    var i,
        length = playerFields.length;
    
    for(i = 0; i < length; i+=1){
        var pl_currentField = playerFields[i],
            en_currentField = enemyFields[i];
        
        if(pl_currentField.card &&
           pl_currentField.card.canWindfury == 0)
            pl_currentField.card.canWindfury = 2;
         
        if(en_currentField.card &&
           en_currentField.card.canWindfury == 0)
            en_currentField.card.canWindfury = 2;
    }
}

function checkCardDefence(firedAt){
     if(firedAt.card.defence > 0)
         return;
     
    destroyCardOn(firedAt);
}

function destroyCardOn(field){
    // throw the body in the river
     field.card = undefined;
     ctx.fg(255, 0, 0);
     ctx.box(field.x, field.y, cardWidth, cardHeight);
     ctx.cursor.restore();
}