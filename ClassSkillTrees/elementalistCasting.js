// importing variables
var variables = require('../GameFunds/variables.js'),
    coreActions = require('../GameFunds/coreActions'),
    cardVariables = require('../CardComponent/cardVariables'),
    cardMaking = require('../CardComponent/cardMaking.js'),
    setCardSpecialities = require('../CardComponent/setCardSpecialities'),
    fs = require('fs');
// I want to pinpoint that this is the actions that I had 4 ideas and this was the one I could manage to accomplish. I know it is barbaric for which I apoligize.

function writeBattle(character, spellIndex, markedCursor, cursorPosition){    
    battleDone += character.name + ' casted ' +
                  character.spells[spellIndex].name +
                  ' on ' + markedCursor + ' Position: ' + cursorPosition + '\n';
    
    var writeStream = fs.createWriteStream('battle_results.txt');
    writeStream.write(battleDone);
    writeStream.end();  
} 

exports.activatePlayerTraps = function(markedCursor, cardName){
    var i,
        length = playerTrapsCasted.length;
    
    var cardIndex = cardField(cardName, enemyFields);
    for(i = 0; i < length; i+=1)
        trapsSpeciality(playerTrapsCasted[i], chosenCharacter, markedCursor, cardIndex);
    
    // cuz pandora is unleashed
    playerTrapsCasted = [];
}

exports.activateEnemyTraps = function(markedCursor, cardName){
    var i,
        length = enemyTrapsCasted.length;
    
    var cardIndex = cardField(cardName, playerFields);
    for(i = 0; i < length; i+=1)
        trapsSpeciality(enemyTrapsCasted[i], enemyCharacter, markedCursor, cardIndex);
    
    // cuz pandora is unleashed
    enemyTrapsCasted = [];

}

function trapsSpeciality(trapName, character, markedCursor, cursorPosition){
    if(trapName == 'Medussa"s trap'){
        if(character == chosenCharacter && 
           markedCursor != 'playerField' && markedCursor != 'enemyCharacter'){
            enemyFields[cursorPosition].isDisabled = true;
        }
    }
    else if(trapName == 'Flame cage'){
        if(character == chosenCharacter && markedCursor != 'playerField')
            enemyFields[cursorPosition].isBurning = true;
    }
    
    else if(trapName == 'Burning Step'){
        if(character == chosenCharacter && markedCursor != 'playerField'){
            var damage = 2;
            // damage the enemy fields
            damageFields(enemyFields, damage);
        }
        else if(character == enemyCharacter && markedCursor != 'enemyField'){
            var damage = 2;
            damageFields(playerFields, damage);
        }
    }
    
    else if(trapName == 'Companion fortification'){
        if(character == chosenCharacter && markedCursor != 'playerField'){
            spawnCard(playerFields, 'Arx');
        }
    }
    
    else if(trapName == 'Purification'){
        var damage = 3;
        if(character == chosenCharacter && markedCursor != 'playerField'){
            var firedAt = enemyFields[cursorPosition];
            firedAt.defence-=damage;
            
            checkCardDefence(firedAt);
            if(firedAt.card)
                immobileTargets.push({card:firedAt.card,onTurn:turnCount});
            
            playerHealth+=damage;
            if(playerHealth > initialHealth)
                playerHealth = initialHealth;
        }
    }
    
    else if(trapName == 'Fragments of Faith'){
        var damage = 4;
        
        // deal damage to the enemy fields and evaluate two random indexes to have 
        if(character == chosenCharacter && markedCursor != 'playerField'){
            damageFields(enemyFields, damage);
            
            // on field
            var availableCards;
            
            for(var i = 0; i < playerFields.length; i+=1){
                var currentField = playerFields[i];
                if(currentField.card)
                    availableCards.push(currentField.card);
            }
            
            var firstFragment = Math.round(Math.random() * (availableCards.length-1)),
                secondFragment = firstFragment;
            
            while(secondFragment == firstFragment && availableCards.length > 1)
                secondFragment = Math.round(Math.random() * (availableCards.length-1));
            
            availableCards[firstFragment].canBlock = true;
            availableCards[secondFragment].canBlock = true;
        }
    }
    
    else if(trapName == 'Light"s Judgment'){
        // take a random enemy card index, for cycle the player fields add the card there,
        // reap her, and remove it from the enemy card vectors
        var randomEnemyCard;
        if(character == chosenCharacter && markedCursor != 'playerField'){
            randomEnemyIndex = Math.round(Math.random() * (enemyHand.length - 1));
            for(var i = 0; i< playerFields.length;i+=1){
                if(!playerFields[i].card){
                    enemyHand[randomEnemyIndex].attack /= 2;
                    enemyHand[randomEnemyIndex].defence /= 2;
                    playerFields[i].card = enemyHand[randomEnemyIndex];
                    enemyHand.splice(randomEnemyIndex, 1);
                    break;
                }
            }
        }
    }
    
    // drain player mana and health(half)
    // random varialbe to choose which minion to spawn
    else if(trapName == 'Test of Faith'){
        if(character == chosenCharacter){
            playerHealth/=2;
            playerMana/=2;
            var randomIndex = Math.round(Math.random() * 2),
                cardName;
            if(randomIndex == 0)
                cardName = 'Viggo';
            else if(randomIndex == 1)
                cardName = 'Vassar';
            else if(randomIndex == 2)
                cardName = 'Kasha Blackblood';
            spawnCard(playerFields, cardName);
        }
    }
}
            
exports.castChosenSpell = function(spellIndex, character, markedCursor, cursorPosition){
    var spellOptions = character.spells;
    var chainnedSpell = spellOptions[spellIndex];
    
    if(turnCount - chainnedSpell.lastTimeCast < chainnedSpell.cooldown){
       if(character == chosenCharacter)
            ctx.point(width- 20, 2, 'The cooldown of this spell has not expired');
        return;
    }
    
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
    
    // send information to server 
    if((currentModeState == 'Play Game' || currentModeState == 'Arena') &&
       !hasPlayerTurnEnded){
        var attackedCursor;
        if(markedCursor == 'enemyField')
            attackedCursor='playerField';
        else if(markedCursor =='playerField')
            attackedCursor='enemyField';
        else if(markedCursor =='enemyCharacter')
            attackedCursor='userPlayer';
        else if(markedCursor =='userPlayer')
            attackedCursor='enemyCharacter';
        socket.emit('spellCasted', {markedCursor:attackedCursor,
                                    character:chosenCharacter,
                                    cursorPosition:cursorPosition,
                                    gameOrder:gameOrder,spellIndex:spellIndex});
    }
     
    chainnedSpell.lastTimeCast = turnCount;
    
    if(chainnedSpell.isTrap){
        if(character == chosenCharacter)
            playerTrapsCasted.push(chainnedSpell.name);
        else
            enemyTrapsCasted.push(chainnedSpell.name);
        return;
    }
        
    if(chainnedSpell.name == 'Repair a field'){
        var damagedField;
        if(markedCursor == 'playerField')
            damagedField = playerFields[cursorPosition];
        else if(markedCursor == 'enemyField')
            damagedField = enemyFields[cursorPosition];
        else if(markedCursor == 'enemyCharacter')
            enemyCharacter.canCast = true;
        else if(markedCursor == 'userPlayer')
            chosenCharacter.canCast = true;
        
        if(damagedField)
            damagedField.isDisabled = false;
    }
    
    else if(chainnedSpell.name == 'Fireball'){
        var damage = 1,
            firedAt;
        
        if((character == chosenCharacter && flameAxeOn == 'player') ||
           (character == enemyCharacter && flameAxeOn == 'enemy'))
            damage*=2;
        
        if(markedCursor == 'playerField'){
            firedAt = playerFields[cursorPosition];
        }
        else if(markedCursor == 'enemyField')
            firedAt = enemyFields[cursorPosition];
        
        else if(markedCursor == 'enemyCharacter') // implement later
            variables.attackEnemyChar(damage);
        else if(markedCursor == 'userPlayer' ||
               markedCursor == 'hand')
            variables.attackUserChar(damage);
        
        if(firedAt && firedAt.card){
            firedAt.card.defence -= damage;
            
            checkCardDefence(firedAt);
            if(firedAt.card){
                burningTargers.push({onTurn:turnCount, fromField:markedCursor,
                                     index:cursorPosition});
                firedAt.isBurning = true;
            }
        }
        tryIncreaseFireServants(character);
    }
    
    else if(chainnedSpell.name == 'Blinding Ashes'){
        if(markedCursor == 'playerField'){
            var playerField = playerFields[cursorPosition];
            
            if(playerField.isBurning)
                playerField.isDisabled = true;
        }
        
        else if(markedCursor == 'enemyField'){
            var enemyField = enemyFields[cursorPosition];
            
            if(enemyField.isBurning)
                enemyField.isDisabled = true;
        }
        tryIncreaseFireServants(character);
    }
    
    else if(chainnedSpell.name == 'Burning Rage'){
        var damage = 4,
            firedAt;
        
        if((character == chosenCharacter && flameAxeOn == 'player') ||
           (character == enemyCharacter && flameAxeOn == 'enemy'))
            damage*=2;
        
        if(markedCursor == 'playerField'){
            var playerField = playerFields[cursorPosition];
            
            if(playerField.isBurning)
                firedAt = playerField;
        }
        
        else if(markedCursor == 'enemyField'){
            var enemyField = enemyFields[cursorPosition];
         
            if(enemyField.isBurning)
                firedAt = enemyField;
               
        }
        // deal damage than see if the card is alive
        if(firedAt && firedAt.card){
            firedAt.card.defence -= damage;
            checkCardDefence(firedAt);
        }
        tryIncreaseFireServants(character);
    }
    
    else if(chainnedSpell.name == 'Burning Fire' && isCharacterCursed()){
        chosenCharacter.tempAttack += 3;
        tryIncreaseFireServants(character);
    }
    
    else if(chainnedSpell.name == 'Zephyr"s Speed'){
        var firedAt;
        
        if(markedCursor == 'playerField')
            firedAt = playerFields[cursorPosition];
        else if(markedCursor == 'enemyField')
            firedAt = enemyFields[cursorPosition];
        else if(markedCursor == 'enemyCharacter')
            enemyCharacter.windfury = 2;
        else if(markedCursor == 'userPlayer')
            chosenCharacter.windfury = 2;
        
        if(firedAt && firedAt.card)
            firedAt.card.canWindfury = 2;
    }
    
    else if(chainnedSpell.name == 'Zephyr"s Boon'){
        var firedAt;
        
        if(markedCursor == 'playerField')
            firedAt = playerFields[cursorPosition];
        else if(markedCursor == 'enemyField')
            firedAt = enemyFields[cursorPosition];
        else if(markedCursor == 'enemyCharacter')
            enemyCharacter.canBlock = true;
        else if(markedCursor == 'userPlayer')
            chosenCharacter.canBlock = true;
        
        if(firedAt && firedAt.card)
            firedAt.card.canBlock = 1;
    }
    
    else if(chainnedSpell.name == 'Tempest Defence'){
        var cardCanBe = ['immobile', 'knockback'],
            playerFields = [],
            enemyFields = [],
            length = playerFields.length;
        
        for(var i = 0; i < length;i+=1){
            if(playerFields[i].card)
                tempestSends(playerFields[i], 'userPlayer');
            if(enemyFields[i].card)
                tempestSends(enemyFields[i], 'enemyPlayer');
        }
    }
    
    else if(chainnedSpell.name == 'Bolt to the hearth'){
        var damage = 3;
        
        if(character == chosenCharacter){
            if(initialHealth / 2 >= enemyPlayerHealth)
                variables.attackEnemyChar(damage * 2);
            else
                variables.attackEnemyChar(damage);
        }
        else{
            if(initialHealth / 2 >= playerHealth)
                variables.attackUserChar(damage * 2);
            else
                variables.attackUserChar(damage);
        }
    }
    
    else if(chainnedSpell.name == 'Lightning Rod'){
        var damage = 5,
            firedAt;
        
        if(markedCursor == 'playerField')
            firedAt = playerFields[cursorPosition];
        else if(markedCursor == 'enemyField')
            firedAt = enemyFields[cursorPosition];
        
        if(firedAt && firedAt.isDisabled && firedAt.card){
            firedAt.card.defence-=damage;
            checkCardDefence(firedAt);
        }
    }
    
    else if(chainnedSpell.name == 'Earth"s embrace'){
        if(character == chosenCharacter && playerHealth < initialHealth / 2)
            playerArmor+=10;
        else if(character == enemyCharacter && enemyPlayerHealth < initialHealth / 2)
            enemyArmor+=10;
    }
    
    else if(chainnedSpell.name == 'Strength of stone'){
        if(character == chosenCharacter)
            chosenCharacter.tempAttack = playerArmor;
    }
    
    else if(chainnedSpell.name == 'Elemental shielding'){
        if(character == chosenCharacter)
            playerArmor+=2;
        else
            enemyArmor+=2;
    }
    
    else if(chainnedSpell.name == 'Diamond skin'){
        var character;
        if(character == chosenCharacter)
            character = 'userCharacter';
        else if(character == enemyCharacter)
            character = 'enemyCharacter';
        // -1 because the function returns +1 because 0 1 are false true
        var characterCurses = isCharacterCursed(character);
        if(character == chosenCharacter && 
           playerHealth <= initialHealth / 2 && characterCurses){
            if(bleedingTargets[characterCurses-1].name == character)
                bleedingTargets.splice(characterCurses-1, 1);
            else if(vulnerableTargets[characterCurses-1].name == character)
                vulnerableTargets.splice(characterCurses-1,1);
        }
        
        else if(character == enemyCharacter &&
                enemyPlayerHealth < initialHealth / 2 && characterCurses){
            if(bleedingTargets[characterCurses-1].name == character)
                bleedingTargets.splice(characterCurses-1, 1);
            else if(vulnerableTargets[characterCurses-1].name == character)
                vulnerableTargets.splice(characterCurses-1,1);
        }
    }
    
    else if(chainnedSpell.name == 'Piercing Shards'){
        var fields;
        if(character == chosenCharacter){
            fields = enemyFields;
        }
        else
            fields = playerFields;
        
        for(var i =0;i<fields.length;i+=1){
            if(fields[i].card){
                var attack = 1;
                
                if(isFieldCursed(fields, cursorPosition))
                    attack = 2;
                   
                fields[i].card.defence-=attack;
                checkCardDefence(fields[i]);
            }
        }
    }
    
    else if(chainnedSpell.name == 'Earth shield'){
        character.duration = 5;
        character.attack = 3;
        if(character == chosenCharacter)
            earthShieldOn = 'player';
        else 
            earthShieldOn = 'enemy';
    }
    
    else if(chainnedSpell.name == 'Flame axe'){
        character.duration = 5;
        character.attack = 3;
        if(character == chosenCharacter)
            flameAxeOn = 'player';
        else
            flameAxeOn = 'enemy';
    }
    
    else if(chainnedSpell.name == 'Frost Bow'){
        character.duration = 5;
        character.attack = 3;
        
        if(character == chosenCharacter)
            frostBowOn = 'player';
        else
            frostBowOn = 'enemy';
    }
    
    else if(chainnedSpell.name == 'Thor"s hammer'){
        character.duration = 5;
        character.attack = 3;
        character.hasWindfury = 1;
    }
    
    else if(chainnedSpell.name == 'Water Blast'){
        var healAmount = 2,
            firedAt;
        
        if((character == chosenCharacter && frostBowOn == 'player') ||
          (character == enemyCharacter && frostBowOn == 'enemy'))
            healAmount*=2;
        if((character == chosenCharacter && 
            cardField('Priest of Dwayna',playerFields)) ||
          (character== enemyCharacter && cardField('Priest of Dwayna', enemyFields)))
            healAmount*=2;
            
        if(markedCursor == 'playerField')
            firedAt = playerFields[cursorPosition];
        
        else if(markedCursor == 'enemyField')
            firedAt = enemyFields[cursorPosition];
        
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
            
        else if(markedCursor == 'userPlayer' || markedCursor == 'hand'){
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
    
    else if(chainnedSpell.name == 'Chain Lightning'){  
            var damage = 2,
                   firedAt,
                   leftNeighbour,
                   rightNeighbour;
            
            if(markedCursor == 'playerField'){
                firedAt = playerFields[cursorPosition];
                
                if(cursorPosition == 0)
                    rightNeighbour = playerFields[cursorPosition+1];
                else if(cursorPosition == 5)
                    leftNeighbour = playerFields[cursorPosition - 1];
                else if(cursorPosition > 0 && cursorPosition < 5){
                    leftNeighbour = playerFields[cursorPosition - 1];
                    rightNeighbour = playerFields[cursorPosition + 1];
                }
            }
    
            else if(markedCursor == 'enemyField'){
                firedAt = enemyFields[cursorPosition];
                
                if(cursorPosition == 0)
                    rightNeighbour = enemyFields[cursorPosition + 1];
                    
                else if(cursorPosition == 5)
                    leftNeighbour = enemyFields[cursorPosition - 1];
                
                else if(cursorPosition > 0 && cursorPosition < 5){
                    leftNeighbour = enemyFields[cursorPosition - 1];
                    rightNeighbour = enemyFields[cursorPosition + 1];
                }
            }
        
            else if(markedCursor == 'enemyCharacter' || markedCursor == 'userPlayer') 
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
    
    if(chainnedSpell.name == 'Stoning'){
            var bleedAmount = 1,
                turnsCount = 2,
                decreaseEffect = 'defence',
                firedAt;
            
            if(markedCursor == 'playerField')
                firedAt = playerFields[cursorPosition];
            
            else if(markedCursor == 'enemyField')
                firedAt = enemyFields[cursorPosition];
            
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
    
    activateInspire(character);
}

function activateInspire(caster){
    var i,
        length;
    
    if(caster == enemyCharacter){
        length = enemyFields.length;
        
        for(i = 0; i < length; i+=1){
            var currentField = enemyFields[i];
            
            if(currentField.card &&
               currentField.card.canInspire)
                setCardSpecialities.setCardSpecials(currentField.card, 'enemy');
        }
    }
    
    else{
        length = playerFields.length;
        
        for(i = 0; i < length; i+=1){
            var currentField = playerFields[i];
            
            if(currentField.card &&
               currentField.card.canInspire)
                setCardSpecialities.setCardSpecials(currentField.card, 'player');
        }
    }
}

function attackEnemyChar(damage){ // attackEnemyChar
    enemyArmor-=damage;
    if(enemyArmor < 0)
        enemyPlayerHealth+= enemyArmor;
}

function checkCardDefence(firedAt){ // checkCardDefence
     if(firedAt.card.defence > 0)
         return;
     
     // throw the body in the river
     firedAt.card = undefined;
     ctx.fg(255, 0, 0);
     ctx.box(firedAt.x, firedAt.y, cardWidth, cardHeight);
     ctx.cursor.restore();
}

function isCharacterCursed(character){
    var i;
    for(i = 0; i < bleedingTargets.length; i+=1){
        if(bleedingTargets[i].name == character)
            return i+1;
    }
    
    for(i = 0; i < vulnerableTargets.length; i+=1){
        if(vulnerableTargets[i].name == character)
            return i+1;
    }
}

function cardField(cardName, fields){
    var i,
        length = fields.length;
    
    for(i = 0; i < length;i+=1){
        if(fields[i].card && fields[i].card.name == cardName)
            return i;
    }
} // cardField

function spawnCard(fields, cardName){
    var summonFrom,
        taunts;
    if(fields == playerFields){
        summonFrom = 'player';
        taunts = playerTaunts;
    }
    else{
        summonFrom = 'enemy';
        taunts = enemyTaunts;
    }
    
    for(var i = 0; i < fields.length; i+=1){
        var currentField = fields[i];
        
        if(!currentField.card){
            var card =cardMaking.allCards[coreActions.findCard(cardName)];
            setCardSpecialities.setCardSpecials(card, summonFrom);
            currentField.card = cardMaking.allCards[coreActions.findCard(cardName)];
            taunts+=1;
            return;
        }
    }
}

function damageFields(fields, damage){ // damageFields
    for(var i = 0; i < fields.length;i+=1){
        var currentField = fields[i];
       
        if(currentField.card){
            currentField.card.defence-=damage;
            checkCardDefence(currentField);
        }
    }
}    

function isFieldCursed(fieldName, fieldIndex){
    var i;
    for(i = 0; i < vulnerableTargets.length; i+=1){
        var currentTarget = vulnerableTargets[i];
        
        if(currentTarget.name==fieldName && currentTarget.position ==fieldIndex)
            return i+1;
    }
}

function tryIncreaseFireServants(character){
    var fields,
        cardIndices = [];
    
    if(character == chosenCharacter)
        fields = playerFields;
    else if(character == enemyCharacter)
        fields = enemyFields;
    
    for(var i = 0; i < fields.length; i+=1){
        if(fields[i].card && fields[i].card.name == 'Pyromancer"s apprentice'){
            fields[i].card.attack+=1;
            fields[i].card.defence+=1;
        }
    }
}

// this is linked to the spell Tempest Defence
function tempestSends(field, character){
    var random = Math.round(Math.random() * 1);
    
    // immobile
    if(random == 0)
        field.isDisabled = true;
    
    // knockout
    else{
        if(character == 'userPlayer'){
            if(playerHand.length < 6)
                playerHand.push(field.card);
            else if(playerBonusHand.length < 4)
                playerBonusHand.push(field.card);
        }
        else{
            if(enemyFields.length < 10)
                enemyFields.push(field.card);
        }
        field.card = undefined;
    }
}