// import...
var variables = require('./variables'),
    cardMaking = require('./cardMaking'),
    cardVariables = require('./cardVariables'),
    playGame = require('../GameMenu/playGame'),
    spellsPriority = require('./spellsPriority');;

// exporting...
exports.cardsPlayable = function(){
    var i,
        length = enemyCardsVectors.length,
        playableCards = [];
    
    for(i = 0; i < length; i+=1){
        var currentCard = enemyCardsVectors[i];
        
        var priority = determineCardPriority(currentCard);
        handPriority.push(
            {cardIndex: i, cardPriority: priority, card: currentCard});    
    }
    spellsPriority.spellsPlayable();
    
    // then sort the cards
    bubbleSort(handPriority, 0, handPriority.length);    
}


exports.cardsAttackableWith = function(cardToAttack){
    if(!cardToAttack)
        return;
    
    var i,
        length = playerFieldVectors.length;
    
    for(i = 0; i < length; i+=1){
        var currentField = playerFieldVectors[i];
        
        if(!currentField.card)
            continue;
        
        if(playerTauntsOnField > 0 &&
            currentField.card.isTaunt){
            var priorityResult = determineAttackPriority(currentField.card);
                attackPriority.push({field: currentField, cardPriority: priorityResult});
        }
        
         if(playerTauntsOnField == 0){
            var priorityResult = determineAttackPriority(currentField.card);
             
            attackPriority.push({field: currentField, cardPriority: priorityResult});
        }           
    }
    bubbleSort(attackPriority,0, attackPriority.length);
}

exports.aggroCardLogic = function(cardToAttack){
    if(!cardToAttack)
        return;
    
     var i,
        length = playerFieldVectors.length;
    
    for(i = 0; i < length; i+=1){
        var currentField = playerFieldVectors[i];
        
        if(!currentField.card)
            continue;
        
        if(playerTauntsOnField > 0 &&
            currentField.card.isTaunt){
            var priorityResult = determineAttackPriority(currentField.card);
                attackPriority.push({field: currentField, cardPriority: priorityResult});
        }
        
        else if(playerTauntsOnField == 0){
            var result = defineEnemyCard(currentField.card);
            
            if(result == 0)
                continue;
            
            attackPriority.push({field:currentField, cardPriority: result});
        }
        
    }
    bubbleSort(attackPriority,0, attackPriority.length);
}

// for aggro deck: cards that must be priorities instead going straight to the face
function defineEnemyCard(card){
    if(card.name == 'Veteran Fleshreaver')
        return 3;
    
    return 0;
}

function determineAttackPriority(possibleVictim){
    if(possibleVictim.attack == 0){
        return 0.7;
    }
    
    if(possibleVictim.attack == 1){
        if(turnCount <= 3)
            return 2;
        
        return 1;
    }
    
    if(possibleVictim.attack == 2){
        if(turnCount <= 4)
            return 2;
        
        return 1.7
    }
    
    if(possibleVictim.attack == 3){
        if(turnCount <= 5)
            return 2.4;
        
        return 2.2;
    }
    
    if(possibleVictim.attack == 4){
        if(turnCount <= 6)
            return 2.7;
        
        return 2.5;
    }
    
    if(possibleVictim.attack == 5)
        return 3;
    
    if(possibleVictim.attack == 6)
        return 3.6;
    
    if(possibleVictim.attack == 7)
        return 4;
    
    if(possibleVictim.attack == 8)
        return 4.4;
    
    if(possibleVictim.attack == 9)
        return 4.8;
    
    Error('Priority attack error');
}

function bubbleSort(handCards, start, end){
    var isSorted = false;
    
    while(!isSorted){
        isSorted = true;
        var i,
            lastElement = end - 1;
        
        for(i = start; i < lastElement; i+=1){
            if(handCards[i].cardPriority > handCards[i + 1].cardPriority){
                var tempCard = handCards[i];
                handCards[i] = handCards[i + 1];
                handCards[i + 1] = tempCard;
                isSorted = false;
            }
        }
    }    
}

// Priority goes from 0 to 6
function determineCardPriority(card){
    
    if(card.name == 'Centaur Emissary')
       return priority_CentaurEmissary();
    if(card.name == 'Stone Dwarf')
        return priority_StoneDwarf();
    if(card.name == 'Ettin')
        return priority_Ettin();
    if(card.name == 'Veteran Fleshreaver')
        return priority_VetFleshreaver();
    
    if(card.name == 'Badazar"s Champion')
        return priority_BadazarChamption();
    
    if(card.name == 'Champion Harathi Warrior')
        return priority_ChampionHarathiWarrior();
    
    if(card.name == 'Captain Tervelan')
        return priority_CaptainTervelan();
    
    if(card.name == 'Gort')
        return priority_Gort();
    
    if(card.name == 'Modinir High Sage')
        return priority_ModinirHighSage();
    
    if(card.name == 'Kamikaze')
        return priority_Kamikaze();
    
    if(card.nane == 'Rebel Alexsei')
        return priority_RebelAlexsei();
    
    if(card.name == 'Vyacheslav')
        return priority_Vyacheslav();
    
    if(card.name == 'Karamoleoff')
        return priority_Karamoleoff();
    
    if(card.name == 'Pickpocket Master')
        return priority_PickpocketMaster();
    
    if(card.name == 'Fen')
        return priority_Fen();
    
    if(card.name == 'Modiniir Beastmater')
        return priority_ModiniirBeastmater();
    
    if(card.name == 'Dredge Siege Engineer')
        return priority_DredgeSiegeEngineer();
    
    if(card.name == 'Champion Ettin')
        return priority_ChampionEttin();
    
    if(card.name == 'Brutish Ettin Chieftain')
        return priority_BrutishEttinChieftain();
    
    if(card.name == 'Ert and Burt')
        return priority_ErtBurt();
    
    if(card.name == 'Veteran Dragon Tribe Graw Berserker')
        return priority_VDTGB();
    
    if(card.name == 'Graw Trapper')
        return priority_GrawTrapper();
    
    if(card.name == 'Tomtom')
        return priority_Tomtom();
    
    if(card.name == 'Tamini Mogul')
        return priority_TaminiMogul();
    
    if(card.name == 'Carrion Sculpture')
        return priority_CarrionSculpture();
    
    if(card.name == 'Giant Ettin')
        return priority_GiantEttin();
    
    if(card.name == 'Arcanist Dremus')
        return priority_ArcanistDremus();
    
    if(card.name == 'Veteran Dragon Tribe Grawl Shaman')
        return priority_VDTGS();
    
    if(card.name == 'Graw Rider')
        return priority_GrawRider();
    
    if(card.name == 'Champion Kol Skullsmasher')
        return priority_ChampionKolSkull();
    
    if(card.name == 'Muttanjeff Marrowmash')
        return priority_MuttanjeffMarrowmash();
    
    if(card.name == 'Ettin Leader')
        return priority_EttinLeader();
    
    if(card.name == 'Tamini Warrior')
        return priority_TaminiWarrior();
    
    if(card.name == 'Zommoros')
        return priority_Zomoros();
    
    if(card.name == 'Crazed Ettin')
        return priority_CrazedEttin();
    
    if(card.name == 'Ogden Stonehealer')
        return priority_OgdenStonehealer();
    
    if(card.name == 'General Zadorojny')
        return priority_GeneralZadorojny();
    
    if(card.name == 'War Minister Shokov')
        return priority_WMShokov();
    
    if(card.name == 'Wall Segment')
        return priority_WallSegment();
    
    if(card.name == 'FalconOutlaw')
        return priority_FalconOutlaw();
    
    if(card.name == 'Dredge Builder')
        return priority_DredgeBuilder();
    
    if(card.name == 'Raptor Pets')
        return priority_RaptorPet();
    
    if(card.name == 'War Beast')
        return priority_WarBeast();
    
    if(card.name == 'Vempa')
        return priority_Vempa();
    
    if(card.name == 'FatHands')
        return priority_FatHands();
    
    if(card.name == 'Beaker')
        return priority_Beaker();
    
    if(card.name == 'Ancient Creature')
        return priority_AncientCreature();
    
    if(card.name == 'Carrion Weaver')
        return priority_CarrionWeaver();
    
    if(card.name == 'Kudu"s Monster')
        return priority_KuduMaster();
    
    if(card.name == 'The Destroyer of Worlds')
        return priority_Destroyer();
}

// For each priority function; Vet = Veteran;
function priority_CentaurEmissary(){
    if(turnCount == 1)
        return 6;
    
    if(enemyCardsOnField > 1 &&
       hasCardDefence(playerFieldVectors, 3)) // in order to bring down this card
        return 4;
    
    return 1.7;
}

function priority_StoneDwarf(){
    if(turnCount == 2 &&
       enemyCardsOnField == 0)
        return 3.1;
    
    if(turnCount == 2 &&
            enemyCardsOnField >= 1 &&
           hasCardDefence(enemyFieldVectors, 1))
        return 4.2;  //UNIVERSE LIFE, AND EVRETIN ULSE / 10
    
    if(enemyCardsOnField > 1 &&
       hasCardDefence(playerFieldVectors, 3))
        return 4.8;
    
    if(enemyCardsOnField > 1)
        return 3.7;
}
    
function priority_Ettin(){
    if(turnCount == 2)
        return 6;
    
    return 2.7;
}

function priority_VetFleshreaver(){
    if(turnCount <= 3 &&
      playerCardsOnField == 0)
        return 6;
    
    if(turnCount <= 5 &&
       playerCardsOnField == 0)
        return 4.6;
    
    if(enemyTauntsOnField >= 1)
        return 3.7;
    
    return 2.1;
}

function priority_BadazarChamption(){
    if(turnCount <= 3)
        return 6;
    
    return 2.7;
}

function priority_ChampionHarathiWarrior(){
    if(enemyTauntsOnField >= 1 &&
       hasCardAttack(playerFieldVectors, 4))
        return 4;
    
    if(enemyTauntsOnField >= 1)
        return 3.1;
    
    if(turnCount <= 4)
        return 3.8;
    
    return 2.7;
}

function priority_CaptainTervelan(){
    if(turnCount <= 4)
        return 6;
    
    if(enemyTauntsOnField >= 1)
        return 3.7;
    
    return 3;
}

function priority_Gort(){
    if(hasCardAttack(playerFieldVectors, 1, 3)){
        return 3.7;
    }
    
    if(hasBotCardInHand('Kamikazeto99'))
        return 4.2;
    
    return 2.2;
}

// Veteran Dragon Trbire Graw Hunter
function priority_VDTGH(){ 
    if(turnCount <= 5)
        return 4.7;
    
    return 2.5;
}

function priority_ModinirHighSage(){
    if(playerCardsOnField > 1 &&
       hasCardDefence(playerFieldVectors, 3))
        return 4;
    
    return 3;
}

function priority_Kamikaze(){
    if(playerCardsOnField >= 3)
        return 5;
    
    if(turnCount <= 6 &&
       enemyCardsOnField <= 2)
        return 3.4;
    
    return 2.1;
}

function priority_RebelAlexsei(){
    //if has enemy dredges on field increase to 4.8
    
    if(turnCount <= 5)
        return 3.3;
    
    return 2.6;
}

function priority_Vyacheslav(){
    // if ogden stonehealer is dead return 6 and turn is lesser equal to 6;
    
    return 2.5;
}

function priority_Karamoleoff(){
    if(turnCount <= 5 && 
       enemyCardsOnField >= 1)
        return 4.7;
    
    return 3.7;
}

function priority_PickpocketMaster(){
    // if enemycharacter has a condition and health under 12 raise to 5.2
    // if enemycharacter has a condition return 4.5
    
    return 2;
}

function priority_Fen(){
    if(enemyCardsOnField >= 1 &&
       hasCardWithDefenceGreater(enemyFieldVectors) ||
       hasCardWithDefenceGreater(playerFieldVectors))
        return 4.2;    
    
    return 3.6;
}

function priority_ModiniirBeastmater(){
    if(turnCount <= 7)
        return 5.01;
    
    return 4.58;
}

function priority_DredgeSiegeEngineer(){
    if(enemyTauntsOnField <= 1)
        return 6;
    
    return 5;
}

function priority_ChampionEttin(){
    if(hasCardAttack(playerFieldVectors, 6))
        return 5.5;
    
    return 4.7;
}

function priority_BrutishEttinChieftain(){
    if(hasCardAttack(playerFieldVectors, 1, 5))
        return 5.5;
    
    return 3;
}

function priority_ErtBurt(){
    if(enemyTauntsOnField >= 1)
        return 3;
    
    return 4.1;
}

function priority_VDTGB(){
    if(turnCount <= 7)
        return 5.03;
    
    return 4.87;
}

function priority_GrawTrapper(){
    if(enemyCardsVectors.length >= 2)
        return 5.09;
    
    return 3.4;
}

function priority_Tomtom(){
    return 6;
}

function priority_TaminiMogul(){
    return 5.5;
}

function priority_CarrionSculpture(){
    return 4.5;
}

function priority_GiantEttin(){
    return 5.08;
}

function priority_ArcanistDremus(){
    return 6;
}

function priority_VDTGS(){
    return 5;
}

function priority_GrawRider(){
    return 5.6;
}

function priority_ChampionKolSkull(){
    return 5.1;
}

function priority_MuttanjeffMarrowmash(){
    return 5.6;
}

function priority_EttinLeader(){    
    return 5.9;
}

function priority_TaminiWarrior(){
    return 5.7;
}

function priority_Zomoros(){
    return 6;
}

function priority_CrazedEttin(){
    return 5.89;
}

function priority_Krug(){
    return 6;
}

function priority_OgdenStonehealer(){
    return 5.2;
}

function priority_GeneralZadorojny(){
    return 6;
}

function priority_WMShokov(){
    return 5.9;
}

// Cards played from another card's battlecry. If they are returned in the hand calculate    their priority
function priority_WallSegment(){
    
    return 2;
}

function priority_FalconOutlaw(){
    if(turnCount <= 4)
        return 2.9;
    
    return 2;
}

function priority_DredgeBuilder(){
    if(playerCardsOnField <= 1 ||
      enemyTauntsOnField >= 1)
        return 4;
    
    return 2;
        
}

function priority_RaptorPet(){
    if(turnCount <= 4)
        return 2.7;
    
    return 2.5;
}

function priority_WarBeast(){
    if(turnCount <= 3)
        return 3.1;
    
    return 2.51;
}

function priority_Vempa(){
    if(turnCount <= 3)
        return 3.1;
}

function priority_FatHands(){
    if(turnCount <= 3)
        return 3.6;
    
    return 3.1;
}

function priority_Beaker(){
    return 3;
}

function priority_AncientCreature(){
    return 5.9;
}

function priority_CarrionWeaver(){
    return 5.09;
}

function priority_KuduMaster(){
    return 4.8;
}

function priority_Destroyer(){ // Abbadon
    return 6;
}

// Searching for equal or greater defence/attack
function hasCardDefence(vector, defence){
   var i,
        length = vector.length;
    
    for(i = 0; i < length; i +=1){
        var currentField = vector[i];
        
        if(currentField.card &&
           defence >= currentField.card.defence)
            return true;
    }
    return false;
}
    
function hasCardAttack(vector, minAttack, maxAttack){
    var i,
        length = vector.length;
    
    for(i = 0; i < length; i+=1){
        var currentField = vector[i];
        
        if(currentField.card &&
           currentField.card.attack >= minAttack &&
           (!maxAttack || 
            currentField.card.attack <= maxAttack))
            return true;
    }
    return false;
}
    
function hasBotCardInHand(cardName){
    var i,
        length = enemyCardsVectors.length;
    
    for(i = 0; i < length; i+=1){
        var currentCard = enemyCardsVectors[i];
        
        if(currentCard.card &&
           currentCard.name == cardName)
            return true;
    }
}
    
function hasCardWithDefenceGreater(vector){
    var i,
        length = vector.length;
    
    for(i = 0; i < length; i+=1){
        var currentField = vector[i]; 
        
        if(currentField.card &&
           currentField.card.defence > currentField.card.attack)
            return true;
    }
    
    return false;
}