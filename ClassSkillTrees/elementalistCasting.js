// importing variables
var variables = require('../GameFunds/variables.js'),
    cardVariables = require('../GameFunds/cardVariables'),
    setCardSpecialities = require('../GameFunds/setCardSpecialities'),
    fs = require('fs');;
// I want to pinpoint that this is the actions that I had 4 ideas and this was the one I could manage to accomplish. I know it is barbaric for which I apoligize.

function writeBattle(character, spellIndex, markedCursor, cursorPosition){
    
    battleDone += character.name + ' casted ' +
                  character.spells[spellIndex].name +
                  ' on ' + markedCursor + ' Position: ' + cursorPosition + '\n';
    
    var writeStream = fs.createWriteStream('battle_results.txt');
    writeStream.write(battleDone);
    writeStream.end();  
}

exports.castChosenSpell = function(spellIndex, character, 
                                    markedCursor, cursorPosition){
    var spellOptions = character.spells;
    var chainnedSpell = spellOptions[spellIndex];
    
    if(character == chosenCharacter && playerMana >= chainnedSpell.cost)
        playerMana-= chainnedSpell.cost;
    
    else if(character == enemyCharacter && enemyMana >= chainnedSpell.cost)
        enemyMana -= chainnedSpell.cost;
    
    else{
        if(character == chosenCharacter)
            ctx.point(width - 20, 2, 'No mana');
        
        return;
    }
    
    writeBattle(character, spellIndex, markedCursor, cursorPosition);
    
    if(turnsCount - chainnedSpell.lastTimeCast < chainnedSpell.cooldown){
       if(character == chosenCharacter)
            ctx.point(width- 20, 2, 'The cooldown of this spell has not expired');
        return;
    }
    
    if(chainnedSpell.type == 'fire'){
        
        if(chainnedSpell.name == 'Fireball'){
            var damage = 1,
                firedAt;
            if(markedCursor == 'playerField'){
                firedAt = playerFieldVectors[cursorPosition];
            }
            else if(markedCursor == 'enemyField')
                firedAt = enemyFieldVectors[cursorPosition];
            
            else if(markedCursor == 'enemyCharacter') // implement later
                enemyPlayerHealth -= damage;
            else if(markedCursor == 'userPlayer' ||
                   markedCursor == 'hand')
                playerHealth -= damage;
            
            if(firedAt && firedAt.card){
                firedAt.card.defence -= damage;
                
                checkCardDefence(firedAt);
            }
        }
    }
    
    else if(chainnedSpell.type == 'water'){
        if(chainnedSpell.name == 'Water Blast'){
            var healAmount = 2,
                firedAt;
            
            if(markedCursor == 'playerField')
                firedAt = playerFieldVectors[cursorPosition];
            
            else if(markedCursor == 'enemyField')
                firedAt = enemyFieldVectors[cursorPosition];
            
            else if(markedCursor == 'enemyCharacter'){ 
                // use the healing spell fully
                if(initialHealth - healAmount >= enemyPlayerHealth) 
                    enemyPlayerHealth += healAmount;
                // use it to get to full health
                else if(initialHealth - enemyPlayerHealth > 0  &&
                        healAmount > initialHealth - enemyPlayerHealth){
                    healAmount = initialHealth - enemyPlayerHealth;
                    enemyPlayerHealth += healAmount;
                }   
            }
            
            else if(markedCursor == 'userPlayer' ||
                   markedCursor == 'hand'){
                // use the healing spell fully
                if(initialHealth - healAmount >= playerHealth) 
                    playerHealth += healAmount;
                // use it to get to full health no matter that heal 
                else if(initialHealth - playerHealth  > 0 &&
                        healAmount > initialHealth - playerHealth){
                    healAmount = initialHealth - playerHealth;
                    playerHealth += healAmount;
                }   
            }
            
            if(firedAt && firedAt.card){               
                // use the healing spell fully
                if(firedAt.card.initialHealth - healAmount >= firedAt.card.defence)
                    firedAt.card.defence += healAmount;
                else if(firedAt.card.initialHealth - firedAt.card.defence > 0 &&
                     healAmount > firedAt.card.initialHealth - firedAt.card.defence) 
                    firedAt.card.defence += healAmount;
            }
        }
    }
    
    else if(chainnedSpell.type == 'air'){
        if(chainnedSpell.name == 'Chain Lightning')     
            var damage = 2,
                   firedAt,
                   leftNeighbour,
                   rightNeighbour;
            
                if(markedCursor == 'playerField'){
                    firedAt = playerFieldVectors[cursorPosition];
                    
                    if(cursorPosition == 0)
                        rightNeighbour = playerFieldVectors[cursorPosition+1];
                    else if(cursorPosition == 5)
                        leftNeighbour = playerFieldVectors[cursorPosition - 1];
                    else if(cursorPosition > 0 && cursorPosition < 5){
                        leftNeighbour = playerFieldVectors[cursorPosition - 1];
                        rightNeighbour = playerFieldVectors[cursorPosition + 1];
                    }
                }
                else if(markedCursor == 'enemyField'){
                    firedAt = enemyFieldVectors[cursorPosition];
                    
                    if(cursorPosition == 0)
                        rightNeighbour = enemyFieldVectors[cursorPosition + 1];
                        
                    else if(cursorPosition == 5)
                        leftNeighbour = enemyFieldVectors[cursorPosition - 1];
                    
                    else if(cursorPosition > 0 && cursorPosition < 5){
                        leftNeighbour = enemyFieldVectors[cursorPosition - 1];
                        rightNeighbour = enemyFieldVectors[cursorPosition + 1];
                    }
                }
            
                else if(markedCursor == 'enemyCharacter' 
                        || markedCursor == 'userPlayer') 
                    return;
                    
                if(firedAt && firedAt.card){
                    firedAt.card.defence -= damage;
                    if(leftNeighbour && leftNeighbour.card)
                        leftNeighbour.card.defence -= (damage / 2);
                    if(rightNeighbour && rightNeighbour.card)
                        rightNeighbour.card.defence -= (damage / 2);
                    
                    checkCardDefence(firedAt);
                    if(leftNeighbour && leftNeighbour.card)
                        checkCardDefence(leftNeighbour);
                    
                    if(rightNeighbour && rightNeighbour.card)
                        checkCardDefence(rightNeighbour);
                }
        }
    
    else if(chainnedSpell.type == 'earth'){
        if(chainnedSpell.name == 'Stoning'){
            var bleedAmount = 1,
                turnsCount = 2,
                decreaseEffect = 'defence',
                firedAt;
            
            
            if(markedCursor == 'playerField')
                firedAt = playerFieldVectors[cursorPosition];
            
            else if(markedCursor == 'enemyField')
                firedAt = enemyFieldVectors[cursorPosition];
            
            else if(markedCursor == 'enemyCharacter'){ 
                bleedingTargets
                    .push({name: 'enemyCharacter', positions: undefined, 
                           power: bleedAmount, forTurns: turnsCount});
            }
            
            else if(markedCursor == 'userPlayer'){
                bleedingTargets
                    .push({name: 'userPlayer', position: undefined, 
                           power: bleedAmount, forTurns: turnsCount});
            }
            
            if(firedAt && firedAt.card){ 
                bleedingTargets.push({name:markedCursor, position: cursorPosition,
                                      power: bleedAmount, forTurns: turnsCount});
            }
        }
    }
    
    activateInspire(character);
}

function activateInspire(caster){
    var i,
        length;
    
    if(caster == enemyCharacter){
        length = enemyFieldVectors.length;
        
        for(i = 0; i < length; i+=1){
            var currentField = enemyFieldVectors[i];
            
            if(currentField.card &&
               currentField.card.canInspire)
                setCardSpecialities.setCardSpecials(currentField.card, 'enemy');
        }
    }
    
    else{
        length = playerFieldVectors.length;
        
        for(i = 0; i < length; i+=1){
            var currentField = playerFieldVectors[i];
            
            if(currentField.card &&
               currentField.card.canInspire)
                setCardSpecialities.setCardSpecials(currentField.card, 'player');
        }
    }
}

function checkCardDefence(firedAt){
     if(firedAt.card.defence > 0)
         return;
     
     // throw the body in the river
     firedAt.card = undefined;
     ctx.fg(255, 0, 0);
     ctx.box(firedAt.x, firedAt.y, cardWidth, cardHeight);
     ctx.cursor.restore();
}