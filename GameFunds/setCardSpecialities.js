// set boons and for each card initilize specialites
/*immobile(freeze), stealth, inspire, blind, knockdown, Deathrattle, freeze, widnfury,
block(divine shield)
*/

// importing 
var variables = require('./variables'),
    cardMaking = require('./cardMaking'),
    cardVariables = require('./cardVariables'),
    boons = require('../Character/boons');
    
function addToBoonArray(boonArrray,defendingCursorField, defendingCursorIndex, 
                         health, inflictPower){
    if(!health)
        return;
    
    boonArrray.push({name: defendingCursorField, position: defendingCursorIndex, 
                power: inflictPower, turnCount: 2,      
                   cardHealth: JSON.parse(JSON.stringify(health))});
}

function boonArrayContains(boonArray, attackingField, defendingField, 
                            defendingCursorField, defendingCursorIndex){
    var i,
        length = boonArray.length;
    
    for(i = 0; i < length; i+=1){
        var currentBoon = boonArray[i];
        
        if(currentBoon.name == defendingCursorField &&
           currentBoon.positions == defendingCursorIndex &&
           currentBoon.power == attackingField.card.vulnerableValue &&
            currentBoon.cardHealth >
          (defendingField - attackingField.card.vulnerableValue) * 2)
            return true;
    }
}

function findCard(cardName){
    var i,
        length = cardMaking.allCards.length;
    
    for(i = 0; i < length; i+=1){
        var currentCard = cardMaking.allCards[i];
        
        if(currentCard.name == cardName)
            return i;
    }
            
    Error('Coud not find a card matching the specified name');
}

function giveCard(card, attack, defence){
    card.attack += attack;
    card.defence += defence;
}

exports.isCardImmobiled = function(card){
    var i,
        length = immobileTargets.length;
    
    for(i = 0; i < length; i+=1){
        var currentTarget = immobileTargets[i];
        
        if(currentTarget.card == card)
            return true;
    }
}

exports.activateCardBoons = function(attackingField,defendingField,defendingCursorField,  
                                      defendingCursorIndex, defenderBlock){
    if(!attackingField.card)
        return;
        
    if(!defenderBlock && attackingField.card.isVulnerable){
        var doesBoonContains =  
            boonArrayContains(vulnerableTargets, attackingField, defendingField, 
                              defendingCursorField, defendingCursorIndex);
        
        // if it it hasn't been still cursed 
        if(!doesBoonContains){
            addToBoonArray(vulnerableTargets, attackingField, 
                           defendingCursorField, defendingCursorIndex, 
                           defendingField, attackingField.card.vulnerableValue);
        }
    }
    
    if(!defenderBlock && attackingField.card.canBleed){
        
        var doesBoonContains =  
                boonArrayContains(bleedingTargets, attackingField, 
                defendingField, defendingCursorField, defendingCursorIndex);
        
        if(!doesBoonContains){
            addToBoonArray(bleedingTargets, attackingField, defendingCursorField,                           defendingCursorIndex, defendingField, attackingField.card.bleedValue);
        }
    }
    
    if(!defenderBlock && attackingField.card.canStealth)
        attackingField.card.canStealth = undefined;
    
    if(!attackingField.card.canWindfury ||
       attackingField.card.canWindfury == 0)
        attackedFromFields.push(attackingField);
    
    else{
        attackingField.card.canWindfury-=1;
        if(attackingField.card.canWindfury == 0)
            attackedFromFields.push(attackingField);
    }
}

exports.setCardSpecials = function(card, summonFrom){
   
    if(card.name == 'Mama')
        setMama(card, summonFrom);
    
    if(card.name == 'Centaur Emissary')
        setCentaurEmissary(card);
    else if(card.name == 'Stone Dwarf')
        setStoneDwarf(card);
    else if(card.name == 'Ettin')
        setEttin(card);
    else if(card.name == 'Veteran Fleshreaver')
        setVeteranFleshreaver(card, summonFrom);
    else if(card.name == 'Badazar"s Champion')
        setBadazarChampion(card, summonFrom);
    else if(card.name == 'Champion Harathi Warrior')
        setChampionHarathiWarrior(card);
    else if(card.name == 'Captain Tervelan')
        setCaptainTervelan(card, summonFrom);
    else if(card.name == 'Gort')
        setGort(card);
    else if(card.name == 'Veteran Dragon Tribe Grawl Hunter')
        setVDTGH(card, summonFrom);
    else if(card.name == 'Modniir High Sage')
        setModniirHighSage(card);
    else if(card.name == 'Kamikazeto99')
        setKamikazeto(card);
    else if(card.name == 'Rebel Alexsei')
        setRebelAlexei(card, summonFrom);
    else if(card.name == 'Vyacheslav')
        setVyacheslav(card);
    else if(card.name == 'Karamoleoff')
        setKarameoloff(card, summonFrom);
    else if(card.name == 'Pickpocket Master')
        setPickpocketMaster(card, summonFrom);
    else if(card.name == 'Fen')
        setFen(card, summonFrom);
    else if(card.name == 'Modiniir Beastmater')
        setModiniirBeastmaster(card, summonFrom);
    else if(card.name == 'Dredge Siege Engineer')
        setDredgeEngineer(card, summonFrom);
    else if(card.name == 'Champion Ettin')
        setChampionEttin(card, summonFrom);
    else if(card.name == 'Brutish Ettin Chieftain')
        setBEC(card, summonFrom);
    else if(card.name == 'Ert and Burt')
        setErt_Burt(card);
    else if(card.name == 'Graw Trapper')
        setGrawTrapper(card, summonFrom);
    else if(card.name == 'Tomtom')
        setTomTom(card, summonFrom);
    else if(card.name == 'Carrion Sculpture')
        setCarrionSculpture(card);
    else if(card.name == 'Giant Ettin')
        setGiantEttin(card, summonFrom);
    else if(card.name == 'Arcanist Dremus')
        setArcanistDremus(card, summonFrom);
    else if(card.name == 'Veteran Dragon Tribe Grawl Shaman')
        setVDTGS(card);
    else if(card.name == 'Graw Raider')
        setGrawRaider(card);    
    else if(card.name == 'Muttanjeff Marrowmash')
        setMuttanjeffMarrowmash(card, summonFrom);
    else if(card.name == 'Ettin Leader')
        setEttinLeader(card, summonFrom);
    else if(card.name == 'Tamini Warrior')
        setTaminiWarrior(card);
    else if(card.name == 'Zommoros')
        setZommoros(card, summonFrom);
    else if(card.name == 'Crazed Ettin')
        setCrazedEttin(card, summonFrom);
    else if(card.name == 'Krug')
        setKrug(card, summonFrom);
    else if(card.name == 'Ogden Stonehealer')
        setOgdenStonehealer(card);
    else if(card.name == 'General Zadorojny')
        setGeneralZadorojny(card, summonFrom);
    else if(card.name == 'War Minister Shokov')
        setWarMinister(card, summonFrom);
    else if(card.name == 'Wall Segment')
        setWallSegment(card);
    else if(card.name == 'Dredge Builder')
        setDredgeBuilder(card);
    else if(card.name == 'Ancient Creature')
        setAncientCreature(card, summonFrom);
    else if(card.name == 'Carrion Weaver')
        setCarrionWeaver(card, summonFrom);
    else if(card.name == 'The Destroyer of Worlds')
        setDestroyer_Worlds(card, summonFrom);
}

function setMama(card, summonFrom){
    if(!card.isInitialized){
        card.isInitialized = true;
        
        card.canBlock = true;

        if(card.canKnockdown && 
            summonFrom == 'enemy'){
             boons.botKnockdownsCard();
             card.isInitialized = true;
        }
        
        else if(card.canKnockdown && summonFrom == 'player' &&
           (playerCardsOnField > 1|| enemyCardsOnField > 0)){
            isKnockingCard = true; 
            changingFieldIndex = cursorIndex;       
        }
    }
}

// for each card initilize its unique qualities
function setCentaurEmissary(card){
    if(!card.isInitialized){
        card.isInitialized = true;

        card.isVulnerable = true;
        card.vulnerableValue = 1;
    }
}

function setStoneDwarf(card){
   if(!card.isInitialized){
        card.isInitialized = true;
       
        card.canBleed = true;
        card.bleedValue = 1;
        card.isVulnerable = true;
        card.vulnerableValue = 1;
   }
}

function setEttin(card){
    if(!card.isInitialized){
        card.isInitialized = true;
        
        card.canEnrage = 1;
        card.enrageAttackValue = 3;
    }
    
    else if(card.defence < card.initialHealth)
        card.attack += card.enrageAttackValue;
}
    
function setVeteranFleshreaver(card, summonFrom){
  
    if(turnCount - card.turnSpawn >= 4){
        var i,
            length = enemyFieldVectors.length,
            cardIndex = findCard('Veteran Fleshreaver');
            
            boons.spawningCard(cardIndex, summonFrom);
    }
}

function setBadazarChampion(card, summonFrom){
    // do 
}

function setChampionHarathiWarrior(card){
    if(!card.IsInitialized){
        card.IsInitialized = true;
        card.canImmobile = 1;
    }
}

function setCaptainTervelan(card, summonFrom){
    if(!card.isInitialized){
        card.isInitialized = true;
        card.canStealth = 1;
    }
    
    else if(turnCount != card.turnSpawn){
        var i,
            length = enemyFieldVectors.length,
            cardIndex = findCard('Bandit');
        
            boons.spawningCard(cardIndex, summonFrom);
    }
}

function setGort(card){
    if(!card.isInitialized){
        card.isInitialized = true;
        
        card.canEnrage = 1;
    }
    
    else if(card.defence <= 2){
        card.attack = 5;
        card.defence = 5;
    }
}
    
function setVDTGH(card, summonFrom){
    if(!card.isInitialized){
        card.isInitialized = true;
        card.canInspire = true;
    }
    
    if(card.canInspire){
        var birdIndex = findCard('Bird');
        
        boons.spawningCard(birdIndex, summonFrom);
    }
    
    // do
}
function setModniirHighSage(card){
    if(!card.isInitialized){
        card.isInitialized = true;
        card.canBleed = true;
        card.bleedValue = 2;
    }
}

function setKamikazeto(card){
    if(!card.isInitialized){
        card.isInitialized = true;
        card.isVulnerable = 1;
        card.vulnerableValue = 2;
        card.canBlind = 1;
    }
    
    else if(turnCount != card.turnSpawn){
        var i,
            length = enemyFieldVectors.length,
            cardsOnField = [];
        
        for(i = 0; i < length; i+=1){
            var currentField = enemyFieldVectors[i]; 
            if(currentField.card)
                cardsOnField.push(currentField);
        }
        
        for(i = 0; i < length; i+=1){
            var currentField = playerFieldVectors[i];
            if(currentField.card)
                cardsOnField.push(currentField);
        }
        
        // the length is + 2 for the userCharacter and the enemyCharacter
        // cardsOnField[itsLength] = chosenCharacter 
        // cardsOnField[itsLength+ 1] = enemyCharacter 
        var randomIndex = Math.round(Math.random() * (cardsOnField.length + 1));
        if(randomIndex < cardsOnField.length){
            cardsOnField[randomIndex].card.defence -= 2;
            checkCardState(cardsOnField[randomIndex].card);
        }
        else if(randomIndex == cardsOnField.length)
            playerHealth -= 2;
        else if(randomIndex == cardsOnField.length + 1)
            enemyCharacter -= 2;
    }
}

function setRebelAlexei(card, summonFrom){
    // do
    if(!card.isInitialized){
        card.isInitialized = true;
        card.isDredge = true;
    }
}

function setVyacheslav(card){
    if(isOgdenDead){
        card.attack = 6;
        card.defence = 7;
    }
}

function setKarameoloff(card, summonFrom){
    if(summonFrom == 'enemy'){
        var i,
            length = enemyFieldVectors.length;
        
        for(i = 0 ; i<length; i+=1){
            var currentField = enemyFieldVectors[i];
            
            if(currentField.card){
                currentField.card.defence += 2;
                currentField.card.attack += 2;
                return;
            }
        }
        
        for(i = 0; i < length; i+=1){
            var currentField = playerFieldVectors.length;
            
            if(currentField.card){
                currentField.card.defence += 2;
                currentField.card.attack += 2;
            }
        }
    }
    
    else{
        isChangingMobStats = true;
        changingFieldIndex = cursorIndex;
    }
}

function setPickpocketMaster(card, summonFrom){
    var i,
        length = enemyFieldVectors.length,
        disabledFieldIndex = Math.round(Math.random() * (enemyFieldVectors.length - 1));
    
    if(summonFrom = 'enemy')
        playerFieldVectors[disabledFieldIndex].isDisabled = true;
    
    else
        enemyFieldVectors[disabledFieldIndex].isDisabled = true;
}

function setFen(card, summonFrom){
    var i,
        length = playerFieldVectors.length;
    
    if(summonFrom == 'enemy'){
        for(i = 0; i < length; i+=1){
            var currentField = playerFieldVectors[i];
            
            if(!currentField.isDisabled && currentField.card){
                var defence = currentField.card.defence;
                currentField.card.defence = currentField.card.attack;
                currentField.card.attack = defence;
                return;
            }
        }
        
        for(i = 0; i < length; i+=1){
            var currentField = enemyFieldVectors[i];
            
            if(!currentField.isDisabled && currentField.card){
                var defence = currentField.card.defence;
                currentField.card.defence = currentField.card.attack;
                currentField.card.attack = defence;
                return;
            }
        }
    }
    
    else{
        isSwappingMinionStats = true;
        changingFieldIndex = cursorIndex;
    }
}

function setModiniirBeastmaster(card, summonFrom){
    var cardIndex = findCard('War Beast');
    
    boons.spawningCard(cardIndex, summonFrom);
}

function setDredgeEngineer(card, summonFrom){
    if(!card.isInitialized){
        card.isInitialized = true;
        card.isDredge = true;
        
        //battlecry...
        
        var cardIndex = findCard('Dredge Turret');
        boons.spawningCard(cardIndex, summonFrom);
    }
}

function setChampionEttin(card, summonFrom){
    if(!card.isInitialized){
        card.isInitialized = true;
        card.canKnockdown = 1;
        
        if(summonFrom == 'enemy')
            boons.botKnockdownsCard();
        
        else if(playerCardsOnField > 1 || enemyCardsOnField > 0){
                isKnockingCard = true; 
                changingFieldIndex = cursorIndex;
        }
    }
}

function setBEC(card, summonFrom){
    card.canKnockdown = 1;
    //do
    
    if(summonFrom == 'enemy'){
        boons.botKnockdownsCard();
    }
    
    else if(playerCardsOnField > 1 || enemyCardsOnField > 0){
            isKnockingCard = true; 
            changingFieldIndex = cursorIndex;
    }   
}

function setErt_Burt(card){
    if(!card.isInitialized){
        card.isInitialized = true;
        card.isTaunt = 1;
    }
}

function setGrawTrapper(card, summonFrom){
    var randomCardIndex,
        fromDeck;
    
    // draw card from hand
    if(summonFrom == 'enemy')
        randomCardIndex = Math.round(Math.random() * (enemyCardsVectors.length - 1));
    else // only the main vector because from the bonus array the cards go to the main
        randomCardIndex = Math.round(Math.random() * (playerCardsVectors.length - 1));
    
    boons.spawningCard(randomCardIndex, summonFrom, true);
}

function setTomTom(card, summonFrom){
    var cardIndex = findCard('Beaker');
    boons.spawningCard(cardIndex, summonFrom);
}

function setCarrionSculpture(card, summonFrom){
    if(!card.isInitialized){
       card.isInitialized = true;
       card.isTaunt = 1;
       card.hasDeathrattle = true;
    }
    
    else if(card.hasDeathrattle){
        // do deathrattle
        ctx.point(width- 20, 3, 'Deathrattle');
        var cardIndex = findCard('Carrion Weaver'),
            onFieldIndex = boons.spawningCard(cardIndex, summonFrom);

        if(summonFrom == 'enemy')
            setCarrionWeaver(enemyFieldVectors[onFieldIndex].card);
        else
            setCarrionWeaver(playerFieldVectors[onFieldIndex].card);
    }
}

function setGiantEttin(card, summonFrom){
    
    if(!card.isInitialized){
        card.isInitialized = true;
        card.hasDeathrattle = true;
    }
    
    else if(card.hasDeathrattle){
        // do deathrattle
        ctx.point(width- 20, 3, 'Deathrattle');
        var cardIndex = findCard('Vempa');

        
        if(summonFrom == 'enemy')
            boons.spawningCard(cardIndex, 'player');
        
        else
            boons.spawningCard(cardIndex, 'enemy');
    }
}

function setArcanistDremus(card, summonFrom){
    
    if(!card.isInitialized){
        card.isInitialized = true;
        card.hasDeathrattle = true;
    }
    
    else if(card.hasDeathrattle){
        var cardIndex = findCard('Ancient Creature'),
            atIndex = boons.spawningCard(cardIndex, summonFrom);
        
        if(summonFrom == 'enemy' && atIndex)
            setAncientCreature(enemyFieldVectors[atIndex].card, 'enemy');
        else if(atIndex)
            setAncientCreature(playerFieldVectors[atIndex].card, 'player');
    }
}

function setVDTGS(card){
    if(!card.isInitialized){
        card.isInitialized = true;
        card.canImmobile = 1;
    }
}


function setGrawRaider(card){
    if(!card.isInitialized){
        card.isInitialized = true;
        card.canEnrage = 1;
        card.canBlock = 1;
    }
}

function setMuttanjeffMarrowmash(card, summonFrom){
    
    if(!card.hasDeathrattle && !card.isInitialized){
        card.isInitialized = true;
        card.hasDeathrattle = true;
    }
    
    else if(card.hasDeathrattle){
            var cardIndex = findCard('Muttanjeff Marrowmash');
            boons.spawningCard(cardIndex, summonFrom)
    }
}

function setEttinLeader(card, summonFrom){
    var cardIndex = findCard('Ettin Body Guard'),
        i, 
        length = playerFieldVectors.length;
   
    for(i = 0; i <length - 1; i+=1)
        boons.spawningCard(cardIndex, summonFrom);
}

function setTaminiWarrior(card){
    if(card.isInitialized){
        card.isInitialized = true;
        card.isTaunt = 1;
    }
}

function setZommoros(card, summonFrom){
    if(!card.isInitialized){
        card.isInitialized = true;
        card.isTaunt = 1;
        card.canWindfury = 2;
        card.canBlock = 1;
        
        var cardIndex = findCard('Myami');
        boons.spawningCard(cardIndex, summonFrom);
        // do add myamy set
    }
}

function setCrazedEttin(card, summonFrom){
    
    if(!card.isInitialized){
        card.isInitialized = true;
        card.hasDeathrattle = true;
    }
    
    else if(card.hasDeathrattle){
     // do deathrattle  
        ctx.point(width- 20, 2, 'Deathrattle');
        
        if(summonFrom == 'enemy'){
            var i,
                length = 2,
                cardIndex = findCard('Raptor Pet');
            
            for(i =0; i < length; i+=1)
                boons.spawningCard(cardIndex, summonFrom);
        }
    }
}

function setKrug(card, summonFrom){
    var cardIndex = findCard('Fat Hands');
    boons.spawningCard(cardIndex, summonFrom);
}

function setOgdenStonehealer(card){
    // do
}

function setGeneralZadorojny(card, summonFrom){
    if(!card.isInitialized){
        card.isInitialized = true;
        card.hasDeathrattle = true;
    }
    
    else if(card.hasDeathrattle){
        var cardIndex = findCard('The Destroyer of Worlds'),
            onFieldIndex = boons.spawningCard(cardIndex, summonFrom);
        
        if(summonFrom == 'enemy' && onFieldIndex)
            setDestroyer_Worlds(card, summonFrom);
        else if(onFieldIndex)
            setDestroyer_Worlds(card, summonFrom);
    }
}

function setWarMinister(card, summonFrom){
    if(!card.isInitialized){
        card.isInitialized = true;
        
        var cardIndex = findCard('Dredge Builder'),
            i,
            length = playerFieldVectors.length;
        
        for(i = 0; i < length; i+=1)
            boons.spawningCard(cardIndex, summonFrom);
    }
}

function setWallSegment(card){
    if(!card.isInitialized){
        card.isInitialized = true;
        card.isTaunt = true;
    }
}

function setDredgeBuilder(card){
    // do
}

function setAncientCreature(card, summonFrom){
    
    if(!card.isInitialized){
        card.isInitialized = true;
        card.hasDeathrattle = true;
    }
    
    else if(card.hasDeathrattle){
        // do deathrattle
        ctx.point(width- 20, 3, 'Deathrattle');
        
        var resummonHim = false,
            dredgeBuilders = 0,
            ancientCreatureIndex = findCard('Ancient Creature'),
            dredgeBuilderIndex = findCard('Dredge Builder');
            
         while(dredgeBuilders != 4){
             if(!resummonHim){
                var onFieldIndex = boons.spawningCard(ancientCreatureIndex, summonFrom);
                
                 if(onFieldIndex)
                    resummonHim = true;
             }
             
             else{
                var onFieldIndex = boons.spawningCard(dredgeBuilderIndex, summonFrom);
                 
                 if(onFieldIndex)
                     dredgeBuilderIndex+=1;
                 else
                     break;
             }
         }
    }
}
function setCarrionWeaver(card){
    if(!card.isInitialized){
        card.isInitialized = true;
        card.isTaunt = 1;
    }
}  

function setDestroyer_Worlds(card, summonFrom){
    // choosing random target to immobile
    if(!card.isInitialized){
        card.isInitialized = true;
        card.bleedValue = 4;
    }
    
    hp_Destroyer_Worlds(card);
    // bleed the enemy character
    
    if(summonFrom == 'enemy')
        bleedingTargets.push({name:'enemyCharacter', positions: 0,
                              power: card.bleedValue, forTurns: 3});
    
    else(summonFrom == 'player')
        bleedingTargets.push({name:'userCharacter', positions: 0,
                              power: card.bleedValue, forTurns:3});
}

function hp_Destroyer_Worlds(card){
    var i,
        length = enemyFieldVectors.length,
        summonedCards = [];
    
    for(i = 0; i < length; i+=1){
        var en_currentField = enemyFieldVectors[i],
            pl_currentField = playerFieldVectors[i];
        
        if(en_currentField.card)
            summonedCards.push(en_currentField);
        if(pl_currentField.card)
            summonedCards.push(pl_currentField);
    }
    
    // randomIndex = length -> userCharacter
    // randomIndex = length + 1 -> enemyCharacter
    
    var randomIndex = Math.round(Math.random() * (summonedCards.length + 1));
    if(randomIndex == summonedCards.length)
        immobileTargets.push({card:chosenCharacter, onTurn: turnCount});
    else if(randomIndex == summonedCards.length + 1)
        immobileTargets.push({card:enemyCharacter, onTurn: turnCount});
    else
        immobileTargets.push({card:summonedCards[randomIndex].card, onTurn: turnCount});
}

function checkCardState(card, from){
    if(card.defence > 0)
        return;
    
    if(card.isTaunt && from == 'enemy'){
        enemyTauntsOnField-=1;
        enemyCardsOnField -= 1;
    }
    else if(card.isTaunt && from == 'player'){
        playerTauntsOnField-=1;
        playerCardsOnField-=1;
    }
        
    card.card = undefined;
    
    ctx.fg(255, 0, 0);
    ctx.box(card.x, card.y, cardWidth, cardHeight);
    ctx.cursor.restore();    
}