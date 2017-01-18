// import
var variables = require('./variables.js'),
    cardVariables = require('../CardComponent/cardVariables'),
    setCardSpecialities = require('../CardComponent/setCardSpecialities'),
    elementalistCasting = require('../ClassSkillTrees/elementalistCasting'),
    lastWrittenText = '';

exports.writeText = function(x,y,text){
    
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

exports.findCard = function(cardName){
    for(var i = 0; cardMaking.allCards.length;i+=1){
        if(cardMaking.allCards[i].name == cardName)
            return i;
    }
}

exports.isCardUniq = function(card, index, summondFrom){
    if(!card)
        Error('While checking isCardUniq the argument (card) was undefined');
    
    var i,
        length = uniqCards.length;
    
    for(i = 0; i < length; i+=1){
        if(card.name == uniqCards[i]){
            summonnedUniqCards.push({card:card, from:summondFrom, onIndex:index});
            return;
        }
    }
}
 
exports.hasAttacked = function(field){
    var i,
        length = attackedFromFields.length;
    
    for(i = 0; i < length; i+=1){
        var currentField = attackedFromFields[i];
        
        if(currentField &&
           currentField.x == field.x &&
           currentField.y == field.y)
            return true;
    }
}

exports.cardsBattle = function(attacker, defender,fromPlayer, defenderIndex){
    if(!attacker.card ||
       !defender.card ||
       attacker.card.turnSpawn == turnCount ||
       setCardSpecialities.isCardImmobiled(attacker.card) ||
       defender.card.canStealth ||
       attacker.isDisabled){
        return;
    }
    
    // write the report
    writeBattle(attacker, defender);        

    var toFields,
        defenderIs,
        attackerIs;
    if(fromPlayer){
        toFields = 'enemyField';
        defenderIs= 'enemy';
        attackerIs='player';
    }
    else{
        toFields = 'playerField';
        defenderIs = 'player';
        attackerIs = 'enemy';
    }
    setCardSpecialities.activateCardBoons(attacker, defender.card.defence,
                        toFields, defenderIndex,defender.card.canBlock);
    
    // attack each other
    if(attacker.card.canBlock)
        attacker.card.canBlock = false;
    else{
        attacker.card.defence -= defender.card.attack;
        
        if(attacker.card.canEnrage ||
            (attacker.card.hasDeathrattle && attacker.card.defence <= 0))
            setCardSpecialities.setCardSpecials(attacker.card, attackerIs);
    }
    
    if(defender.card.canBlock)
        defender.card.canBlock = false;
    else{
        defender.card.defence -= attacker.card.attack;
        
        if(defender.card.canEnrage ||
          (defender.card.hasDeathrattle && defender.card.defence <= 0))
            setCardSpecialities.setCardSpecials(defender.card, defenderIs);
    }
    
    // if the card is dead destroy the card
    isBattlerDead(attacker, fromPlayer);
    isBattlerDead(defender, !fromPlayer);
    
    if(attacker.card &&
       defender.card &&
       attacker.card.canImmobile) 
        immobileTargets.push({card: defender.card, onTurn: turnCount});     
    
    if(defender.card &&
       attacker.card &&
       defender.card.canImmobile)
        immobileTargets.push({card:attacker.card, onTurn: turnCount});
}

exports.chiefsBattle = function(attacker){
    var userAttack = chosenCharacter.attack + chosenCharacter.tempAttack,
            enemyAttack = enemyCharacter.attack + enemyCharacter.tempAttack;
        variables.attackEnemyChar(userAttack);
        variables.attackUserChar(enemyAttack);
    
    var defenderHealth,
        defender;
    if(attacker == chosenCharacter){
        defenderHealth = enemyPlayerHealth;
        defender = enemyCharacter;
    }
    else{
        defenderHealth= playerHealth;
        defender = chosenCharacter;
    }
    
    // write battle
    var writeStream = 
        fs.createWriteStream('battle_results.txt');
    battleDone += attacker.name + ' VS ' + '\n'+ 
       defender.name+  ' Remaining Stamina: ' + defenderHealth + '\n';
    
    writeStream.write(battleDone);
    writeStream.end();   
    
    
    postChiefAttack(attacker);
}

exports.attackEnemyChief = function(attacker, chief, chiefHealth, chiefOn){
    if(setCardSpecialities.isCardImmobiled(attacker.card) ||
       attacker.isDisabled)
       return;
    
    // write battle
    var writeStream = 
        fs.createWriteStream('battle_results.txt');
    battleDone += attacker.card.name + ' ( ' + attacker.card.attack + ' ' + 
                  attacker.card.defence + ' x: ' + attacker.x + ' ) VS ' + '\n'+ 
                  chief.name + ' Remaining Stamina: ' + chiefHealth + '\n';
    
    writeStream.write(battleDone);
    writeStream.end();   
    
    var cardOn;
    if(chiefOn == 'userPlayer')
        cardOn = 'player';
    else
        cardOn = 'enemy';
    
    setCardSpecialities.activateCardBoons(attacker, chiefHealth, chiefOn, 
                                          0, chief.canBlock);
    
    // check in advance if jim is dead
    if(attacker.card.defence - chief.damage <= 0 && attacker.card.hasDeathrattle)
        setCardSpecialities.setCardSpecials(attacker.card, cardOn);
        
    if(attacker.card && attacker.card.canImmobile){
        immobileTargets.push({card:chief, onTurn:turnCount});
        ctx.point(width - 20, 3, 'Yur hero is immobiled');
    }
    
    if(chief.canBlock)
        chief.canBlock = 0;
    else{
        if(chief == chosenCharacter){
            variables.attackUserChar(attacker.card.attack);
            
            if(playerTrapsCasted.length > 0)
                elementalistCasting.activatePlayerTraps('enemyField',attacker.card.name);
        }
        else{
            variables.attackEnemyChar(attacker.card.attack);
            //enemyTraps
            if(enemyTrapsCasted.length > 0)
               elementalistCasting.activateEnemyTraps('playerField', attacker.card.name);
        }
        
        if(chief.damage){
            attacker.card.defence -= chief.damage;
            
            if(attacker.card.canEnrage)
                setCardSpecialities.setCardSpecials(attacker.card, 'enemy');
        }
    }
}

function postChiefAttack(character){
   //decrease windfury/duration these thingies
    if(!character.hasWindfury){
            character.hasAttacked = true;
            
             if(character.duration){
                 character.duration-=1;
                 
                 if(!character.duration){
                     character.attack = 0;
                     earthShieldOn ='';
                     flameAxeOn = '';
                     frostBowOn = '';
                     character.hasWindfury=0;
                 }
             }
             else
                 character.tempAttack = 0;  
        }
        else
            character.hasWindfury--;
}

exports.chiefAttacksCard = function(character, defender, isPlayer){
    if(!defender.card)
        return;
    
    if(defender.card.canBlock)
        defender.card.canBlock = 0;
    
    else{
        var fields,
            summonFrom;
        if(isPlayer){
            fields = 'enemyField';
            summonFrom = 'enemy';
        }
        else{
            fields = 'playerField';
            summonFrom = 'player';
        }
        
        var attack = character.attack + character.tempAttack;
        defender.card.defence -= attack;
    
        if(defender.card.defence - attack <= 0 &&
               defender.card.hasDeathrattle)
                setCardSpecialities.setCardSpecials(defender.card, summonFrom);
        
        setCardSpecialities
            .activateCardBoons(character,defender.card.defence,
                                    fields, cursorIndex, defender.card.canBlock);
        
        if(defender.card.canEnrage)
            setCardSpecialities.setCardSpecials(defender.card, summonFrom); 
        
        // decrease the ability to attack
        if(character.attack)
            character.duration-=1;
    }
    
    if(character.canBlock)
        character.canBlock = 0;
    else if(isPlayer)
        variables.attackUserChar(defender.card.attack);
    else 
        variables.attackEnemyChar(defender.card.attack);
    
    // if the card is dead destroy the card
    isBattlerDead(defender, !isPlayer); 
    /* if the enemy and player card are alive and the attacker(playerCreature) has the power  
     to immobile than the attacker is immobiled*/
    if(defender.card &&
       defender.card.canImmobile)
        immobileTargets.push({card:character, onTurn: turnCount});
    
    postChiefAttack(character);
}

function isBattlerDead(creature, fromPlayer){
    if(!creature)
        return;
    
    if(creature.card.defence <= 0 && fromPlayer){
        if(creature.card.isTaunt)
            enemyTaunts-=1;
        
        creature.card = undefined;
        
        ctx.fg(255, 0, 0);
        ctx.box(creature.x, creature.y, cardWidth, cardHeight);
        ctx.cursor.restore();
        
        enemySpawnedCards -= 1;
    }
    
    else if(creature.card.defence <= 0){
        if(creature.card.isTaunt)
            playerTaunts -= 1;
        
        creature.card = undefined;
        
        ctx.fg(255, 0, 0);
        ctx.box(creature.x, creature.y, cardWidth, cardHeight);
        ctx.cursor.restore();
        
        playerSpawnedCards -=1;
    }
}

function writeBattle(attacker, defender){
        // 1) write the report into a file
    battleDone += 
        ( '\t' + attacker.card.name + '( ' + 
        attacker.card.attack + ' '      +      
        attacker.card.defence + ' x: ' + 
        attacker.x + ' )' + ' VS' + '\n' + 
        defender.card.name + '( ' + 
        defender.card.attack + ' ' + 
         defender.card.defence + ' x: ' + defender.x +  '|' + '\n');
          
    var writeStream = fs.createWriteStream('battle_results.txt');
        writeStream.write(battleDone);
        writeStream.end();        
}