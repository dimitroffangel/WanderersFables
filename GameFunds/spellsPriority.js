// importing
var variables = require('./variables');

exports.spellsPlayable = function(){
    var botSpells = enemyCharacter.spells;
    
    if(enemyCharacter.class == 'elementalist')
        botElementalist();
}
       
function botElementalist(){
    var fireballPriority,
        fireballTarget,
        waterBlastPriority,
        waterBlastTarget,
        chainLightPriority,
        chainLightTarget,
        stoningPriority,
        stoningTarget;
    
    fireballTarget = hasCardDefence(playerFieldVectors, 1);
    if(fireballTarget){
        fireballPriority = 5;
        handPriority.push({cardIndex:0, cardPriority: fireballPriority, 
                       spell: 'Fireball',
                           onField: 'playerField', onCard: fireballTarget});
    }
    
    else
        fireballPriority = 1.5;
    
    
    waterBlastTarget = hasCardInitialHealth(2, waterBlastTarget) 
    if(enemyCharacter.level >=3 && waterBlastTarget){        
        waterBlastPriority = 4;
        handPriority.push({cardIndex:1, cardPriority: waterBlastPriority, 
                       spell: 'Water Blast', 
                           onField: 'enemyField', onCard: waterBlastTarget});
    }
    
    else
        waterBlastPriority = 1;
    
    chainLightTarget = hasCardDefence(playerFieldVectors, 2, chainLightTarget);
    
    if(enemyCharacter.level >=5 && chainLightTarget){
        chainLightPriority = 5;
        handPriority
            .push({cardIndex:2, cardPriority: chainLightPriority, 
                    spell: 'Chain Lightning', onField: 'playerField', 
                   onCard: chainLightTarget});
    }
    
    else
        chainLightPriority = 1.51;
    
    stoningTarget = hasCardDefence(playerFieldVectors, 2, stoningTarget);
    if(enemyCharacter.level >= 7 && stoningTarget){
        stoningPriority = 5;
        handPriority
            .push({cardIndex:3, cardPriority: stoningPriority, spell: 'Stoning',
                           onField: 'playerField', onCard: stoningTarget});
    }
    else
       stoningPriority = 1.9;
    
    
    if(!fireballPriority)
     handPriority.push({cardIndex:0, cardPriority: fireballPriority, 
                        spell: 'Fireball', onField: 'userPlayer'});
    if(!waterBlastPriority)
     handPriority.push({cardIndex:1, cardPriority: waterBlastPriority, 
                        spell: 'Water Blast', onField: 'enemyCharacter'});
    if(!chainLightPriority)
     handPriority.push({cardIndex:2, cardPriority: chainLightPriority, 
                        spell: 'Chain Lightning', onField: 'userPlayer'});
    if(!stoningPriority)
     handPriority.push({cardIndex:3, cardPriority: stoningPriority, 
                        spell: 'Stoning', onField: 'userPlayer'});
}
        
// Searching for equal or greater defence/attack
function hasCardDefence(vector, defence, cardIndex){
   var i,
        length = vector.length;
    
    for(i = 0; i < length; i +=1){
        var currentField = vector[i];
        
        if(currentField.card &&
           defence >= currentField.card.defence){
            cardIndex = i;
            return i;
        }
    }
    return false;
}
    
function hasCardInitialHealth(minusBy, cardIndex){
    var i,
        length = enemyFieldVectors.length;
    
    for(i = 0; i < length; i+=1){
        var currentField = enemyFieldVectors[i];
        
        if(!currentField.card)
            continue;
        
        if(currentField.card.defence + minusBy <= currentField.card.initialHealth){
            cardIndex = i;
            return i;
        }
    }
    
    return false;
}
    