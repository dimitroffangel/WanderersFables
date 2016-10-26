// importing
var variables = require('../GameFunds/variables'),
    cardVariables = require('../GameFunds/cardVariables'),
    cardMaking = require('../GameFunds/cardMaking');

// exporting
exports.activateBoons = function(){
    activeBleeding();
    activeVulnerable();
    activeImmobile();
    activeWindfury();
}

function returnPlayerCard(field){
     
    if(playerCardsVectors.length < 6)
        playerCardsVectors.push(field.card);
    
    else if(playerBonusCards.length < 4)
        playerBonusCards.push(field.card);
    
   // destroyCardOn(field);
    field.card = undefined;
     ctx.fg(255, 0, 0);
     ctx.box(field.x, field.y, cardWidth, cardHeight);
     ctx.cursor.restore();
}

function returnEnemyCard(field){
    
    if(enemyCardsVectors.length < 10)
         enemyCardsVectors.push(field.card);
     
     field.card = undefined;
     ctx.fg(255, 0, 0);
     ctx.box(field.x, field.y, cardWidth, cardHeight);
     ctx.cursor.restore();
}

exports.botKnockdownsCard = function(){

    var i,
        length = playerFieldVectors.length,
        mobsOnField = [];
    
    for(i = 0; i < length; i+=1){
        var currentField = playerFieldVectors[i];
        
        if(currentField.card)
            mobsOnField.push(currentField);
    }
    
    if(mobsOnField.length > 0){
        var chosenField = 
            mobsOnField[Math.round(Math.random() * (mobsOnField.length - 1))];
        
        returnPlayerCard(chosenField);
    }
    
    else{
        length = enemyFieldVectors.length;
        
        for(i = 0; i < length; i+=1){
            var currentField = enemyFieldVectors[i];
            
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

exports.gameActions = function(){
    
    if(isKnockingCard){
        if((cursorIndex == changingFieldIndex &&
           cursorField == 'playerField') || 
           (playerCardsOnField == 1 &&
          enemyCardsOnField == 0)){
            isKnockingCard = false;
            return;
        }
        
        if(cursorField == 'playerField' &&
          playerFieldVectors[cursorIndex].card){
            returnPlayerCard(playerFieldVectors[cursorIndex]);
            isKnockingCard = false;
        }
        
        else if(cursorField == 'enemyField' &&
               enemyFieldVectors[cursorIndex].card){
            returnEnemyCard(enemyFieldVectors[cursorIndex]);
            isKnockingCard = false;
        }
        
        else{
            if(playerCardsVectors.length < 6)   
                playerCardsVectors.push(playerFieldVectors[changingFieldIndex].card);
            else if(playerBonusCards.length < 4)
                playerCardsVectors.push(playerFieldVectors[changingFieldIndex].card);
            
            playerFieldVectors[changingFieldIndex].card = undefined;
            isKnockingCard = false;
        }
    }
    
    if(isChangingMobStats){
        if((cursorIndex == changingFieldIndex &&
            cursorField == 'playerField') || 
           (playerCardsOnField == 1 &&
          enemyCardsOnField == 0)){
            isChangingMobStats = false;
            return;
        }
        
        if(cursorField == 'playerField' &&
          playerFieldVectors[cursorIndex].card){
            playerFieldVectors[cursorIndex].card.defence += 2;
            playerFieldVectors[cursorIndex].card.attack += 2;
            isChangingMobStats = false;
        }
        
        else if(cursorField == 'enemyField' &&
               enemyFieldVectors[cursorIndex].card){
            playerFieldVectors[cursorIndex].card.defence += 2;
            playerFieldVectors[cursorIndex].card.attack += 2;
            isChangingMobStats = false;
        }
        
        else{
            if(playerCardsVectors.length < 6)   
                playerCardsVectors.push(playerFieldVectors[changingFieldIndex].card);
            else if(playerBonusCards.length < 4)
                playerCardsVectors.push(playerFieldVectors[changingFieldIndex].card);
            
            playerFieldVectors[changingFieldIndex].card = undefined;
            isChangingMobStats = false;
        }
    }
    
    if(isSwappingMinionStats){
     if((cursorIndex == changingFieldIndex && 
        cursorField == 'playerField') ||
           (playerCardsOnField == 1 &&
          enemyCardsOnField == 0)){
            isSwappingMinionStats = false;
            ctx.point(width - 20, 3, 'CI:' + cursorIndex + ' IC:'+ changingFieldIndex);
            return;
        }
        
        if(cursorField == 'playerField' &&
          playerFieldVectors[cursorIndex].card){
            var fieldToSwap =playerFieldVectors[cursorIndex].card,
                defence = fieldToSwap.defence;
            
            fieldToSwap.defence = fieldToSwap.attack;
            fieldToSwap.attack = defence;
            isSwappingMinionStats = false;
        }
        
        else if(cursorField == 'enemyField' &&
               enemyFieldVectors[cursorIndex].card){
            
            var fieldToSwap = enemyFieldVectors[cursorIndex], 
                defence = fieldToSwap.card.defence;
            
            fieldToSwap.card.defence = fieldToSwap.card.attack;
            fieldToSwap.card.attack = defence;
            
            isSwappingMinionStats = false;
        }
        
        else{
            if(playerCardsVectors.length < 6)   
                playerCardsVectors.push(playerFieldVectors[changingFieldIndex].card);
            else if(playerBonusCards.length < 4)
                playerCardsVectors.push(playerFieldVectors[changingFieldIndex].card);
            
            playerFieldVectors[changingFieldIndex].card = undefined;
            isSwappingMinionStats = false;
        }
    }
}

// returns the index of the spawnned card
exports.spawningCard = function(cardIndex, summonFrom, fromHand){
    
    var deck;
    if(!fromHand)
        deck = cardMaking.allCards;
    else if(summonFrom == 'player')
        deck = playerCardsVectors;
    else
        deck = enemyCardsVectors;
    
    var i,
        length = playerFieldVectors.length;
    
    if(summonFrom == 'enemy'){
        for(i = 0; i < length; i+=1){
            var currentField = enemyFieldVectors[i];
            
            if(!currentField.card && !currentField.isDisabled){
                currentField.card =
                    JSON.parse(JSON.stringify(deck[cardIndex]));
                
                return i;
            }
        }
    }
    
    else{
        for(i = 0; i < length; i+=1){
            var currentField = playerFieldVectors[i];
            
            if(!currentField.card && !currentField.isDisabled){
                           
                currentField.card =
                    JSON.parse(JSON.stringify(deck[cardIndex]));
                return i;
            }
        }
    }

}

// bleeding: each elelement has: targetName, decrease defence or damage, power, '
function activeBleeding(){
    var i = 0;
    
    while(i < bleedingTargets.length){
        var currentTarget = bleedingTargets[i];
     
         if(currentTarget.name == 'userPlayer')
             playerHealth -= currentTarget.power;
             
         else if(currentTarget.name == 'enemyCharacter')
             enemyPlayerHealth -= currentTarget.power;
         
         else{ // => it's a card
             var targetCard;
             
             if(currentTarget.name == 'playerField')
                 targetCard = playerFieldVectors[currentTarget.position];
             else if(currentTarget.name =='enemyField')
                 targetCard = enemyFieldVectors[currentTarget.position];
             else
                 Error('CurrentTarget.name is kungala thingy');
 
             if(!targetCard ||
                !targetCard.card)
                 return;
             
             targetCard.card.defence -= currentTarget.power;
             
             checkCardDefence(targetCard);
            
             currentTarget.forTurns -= 1;
        }
        
        if(currentTarget.forTurns <= 0){
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
            enemyPlayerHealth -= currentTarget.power;
        else if(currentTarget.name == 'userPlayer')
            playerHealth -= currentTarget.power;
        
        else{ // => it is a card
            if(currentTarget.name == 'enemyField' && 
              enemyFieldVectors[currentTarget.positions].card){
                enemyFieldVectors[currentTarget.positions].card.defence -=
                    currentTarget.power;
            }
            
            else if(currentTarget.name == 'playerField' &&
                   playerFieldVectors[currentTarget.positions].card){
                playerFieldVectors[currentTarget.positions].card.defence -=
                    currentTarget.power;
            }
            
            else Error('Vulnerabilty cannot be done');
        }
        
        currentTarget.forTurns -= 1;
        
        if(currentTarget.forTurns <= 0){
            vulnerableTargets.splice(i, 1);
            
            if(currentTarget.name == 'enemyCharacter')
                enemyPlayerHealth = currentTarget.cardHealth;
            else if(currentTarget.name == 'userPlayer')
                playerHealth = currentTarget.cardHealth;
            else if(currentTarget.name == 'enemyField'){
                enemyFieldVectors[currentTarget.positions].
                card.defence = currentTarget.cardHealth;
            }
            else if(currentTarget.name == 'playerField'){
                playerFieldVectors[currentTarget.positions].
                card.defence = currentTarget.cardHealth;
            }
            
            continue;
        }
        
        i+= 1;
    }
}

function activeImmobile(){
    var i = 0;
    
    while(i < immobileTargets.length){
        var currentTarget = immobileTargets[i];
        
        if(turnCount - currentTarget.onTurn >= 2){
            immobileTargets.splice(i, 1);
            continue;
        }
        
        i+=1;
    }
}

function activeWindfury(){
    var i,
        length = playerFieldVectors.length;
    
    for(i = 0; i < length; i+=1){
        var pl_currentField = playerFieldVectors[i],
            en_currentField = enemyFieldVectors[i];
        
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

function detroyCardOn(field){
    // throw the body in the river
     field.card = undefined;
     ctx.fg(255, 0, 0);
     ctx.box(field.x, field.y, cardWidth, cardHeight);
     ctx.cursor.restore();
}