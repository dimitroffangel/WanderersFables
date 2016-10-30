// importing variables
var variables = require('../GameFunds/variables'),
    cardVariables =require('../GameFunds/cardVariables'),
    cardMaking = require('../GameFunds/cardMaking'),
    setCardSpecialities = require('../GameFunds/setCardSpecialities'),
    boons = require('../Character/boons'),
    experience = require('../Character/updateExp'),
    mainLogic = require('../AI/mainLogic.js');


exports.beginGame = function(){
    // 1) clera the board
    // 2) set the bot difficulty, deckType and class
    // 3) shuffle the decks
    // 4) draw the board, and the inital cards in hand
    // 5) determine the first player
    // 6) add the uniq cards to know who to mark and the battle cry cards
    
    
/*1)*/ ctx.clear();
/*2)*/ mainLogic.initilizeBot();
/*3)*/ cardMaking.shuffleDecks();
/*4)*/ drawBoard();
/*5)*/ drawInitialCards();
/*5)*/ determineFirstPlayer();
/*6)*/ cardMaking.defineUniq_Cards();
}

exports.eachFrame = function(){
    isBoardDrawn = true;
    // draw the cards and update the field
     drawCardInHand();
     drawCardOnField();
    
    // draw Player Info
    ctx.point(5, cardFieldInitY + cardHeight + 1, 'Your mana: ' + playerMana + '| ' + 
    'Class: ' + chosenCharacter.class + '| ' + 'Name: ' + chosenCharacter.name + '|' + 
    'Health: ' + playerHealth + '| '); 
    
    this.onTurnOrder();   
    drawCardInHand();
    drawCardOnField();
}
 
// if a minion is down
exports.removeField = function(removeAt){
    var index;
    
    if(showingPlayerVector == 'main')
        index = playerCardsVectors.length - removeAt;
    else
        index = playerBonusCards.length - removeAt;
    
    var fieldX = cardFieldInitX + index * width*0.167 + 1;
    ctx.box(fieldX, cardHandInitY + cardHeight + (height* 0.03), cardWidth, cardHeight);
}

exports.updateHand = function(){
    var firstBonusEl;
    
    if(playerBonusCards.length == 0 || playerCardsVectors.length < 6)
        return;
    
    firstBonusEl = playerBonusCards[0];
    
    var i,
        length = playerBonusCards.length;
    
    for(i = 0; i < length; i+=1)
        playerBonusCards[i] = playerBonusCards[i + 1];
    
    playerBonusCards.splice(length - 1, 1);
    
    playerCardsVectors.push(firstBonusEl);
}

exports.updateOwnMana = function(by){
    playerMana += by;
}

exports.attackBetweenMinions = function(playerCreature, enemyCreature){
    if(!playerCreature.card ||
       !enemyCreature.card ||
        playerCreature.card.turnSpawn == turnCount ||
        playerCreature.isDisabled)
        return;
    
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
    
    // if the card is dead destroy the card
    
    areBattlersDead(playerCreature, enemyCreature);
    
    if(enemyCreature.card &&
       playerCreature.card &&
       playerCreature.card.canImmobile)
        immobileTargets.push({card:enemyCreature.card, onTurn: turnCount}); 
}

exports.attackEnemyPlayer = function(playerCreature){
    if(!playerCreature.card ||
       playerCreature.card.defence <= 0 ||
       playerCreature.isDisabled)
        return;
    
    if(enemyCharacter.canBlock)
        enemyCharacter.canBlock = 0;
    
    else{    
        enemyPlayerHealth -= playerCreature.card.attack;  
        
        if(enemyCharacter.damage){
            playerCreature.card.defence -= enemyCharacter.damage;
            
            if(playerCreature.card.canEnrage)
                setCardSpecialities.setCardSpecials(playerCreature.card, 'player');
        }
    }
    
    if(enemyPlayerHealth > 0 && 
       playerCreature.card &&
       playerCreature.card.canImmobile)
        immobileTargets.push({card:enemyCharacter, onTurn: turnCount});
}

exports.loadAfterGame = function(key){
    if(key.name == 'return'){
        currentModeIndex = 0;
        currentModeState = 'Game Menu';
        gameMenu.loadMenu();
        hasChosenCharacter = false;
        isGameFinished = false;
    }
}

exports.isGameOver = function(){
    
    if(!isGameFinished && enemyPlayerHealth <= 0){
        var currentCharacter = createdCharacters[indexAtCharacter];
        
        ctx.clear();
        currentCharacter.exp += 1350; // %0.125 from foe's level
        experience.checkLevel();
        userGold += 60;
        wonRowGames +=1;

        ctx.point(0, 1, 'You have won, Game won in a row: ' + wonRowGames);
        ctx.point(0, 2, 'Current exp: ' + currentCharacter.exp);
       // ctx.point(0, 3, 'Needed for next level: ' +                                                       (experience.levels[currentCharacter.level - 1].maxExp -                                  currentCharacter.exp));
        ctx.point(0, 5, 'Money owned: ' + userGold);
        ctx.point(0, 4, 'Press enter to go back to the Game Menu');
                
        isBoardDrawn = false;
        isGameFinished = true;
        return true;
    }
    
    // if player's health is zero you have lost;
    if(!isGameFinished && playerHealth <= 0){
        var currentCharacter = createdCharacters[indexAtCharacter];
        
        ctx.clear();
        currentCharacter.exp += 335;
        experience.checkLevel();
        userGold += 15;
        wonRowGames = 0;
        
        ctx.point(0, 1, 'You have lost');
        ctx.point(0, 2, 'Current exp: ' + currentCharacter.exp);
      //  ctx.point(0, 3, 'Needed for next level: ' +                                                       (experience.levels[currentCharacter.level - 1].maxExp -                                  currentCharacter.exp));
        ctx.point(0, 5, 'Money owned: ' + userGold);
        ctx.point(0, 4, 'Press enter to go back to the Game Menu');
                
        isBoardDrawn = false;
        isGameFinished = true;
        return true;
    }
    
    
    return false;
}

exports.showInfoOnCard = function(card){
    
    // 1) if ctrl + s pressed again return to the game
    // 2) clear the board
    // 3) draw a screen with only this card
    
    // 1)
    if(!isShowingInfo && isBoardDrawn){
        isInformationDrawn = false;
        infoOnCard = undefined;
        ctx.clear();
        // clear the information and callback to its predecessor
        drawBoard();
        this.eachFrame();
        return;
    }
    
    // 2)
    ctx.clear();
    if(!isBoardDrawn)
        ctx.point(0, 2, 'Press any key to return');
    
    if(isInformationDrawn)
        return;
    
    // 3) 
    ctx.bg(255, 0, 0);
    ctx.box(infoCardX, infoCardY, infoCardWidth, infoCardHeight);
    ctx.cursor.restore();
    
    // cardInfo.name
    ctx.point(infoCardX, infoCardY + infoCardY % 5, card.name);
    
    // border(line) between the heading and the body
    ctx.line(infoCardX, infoCardY + infoCardY % 5 + 1, 
                infoCardX + infoCardWidth, infoCardY + infoCardY % 5 + 1);
    
    // cardInfo.speciality
    ctx.point(infoCardX, infoCardY + infoCardY % 5 + 5, card.special);
    
    // border(line) between the one above and the one down
    ctx.line(infoCardX, infoCardY + infoCardHeight - 5, 
             infoCardX + infoCardWidth, infoCardY + infoCardHeight - 5);
    
    
    // cardInfo.attack
    ctx.point(infoCardX + 1, infoCardY + infoCardHeight - 2, card.attack + ' ');
    
    // border(line) between attack and defence
    ctx.line(infoCardX + infoCardWidth / 2, infoCardY + infoCardHeight - 5,
             infoCardX + infoCardWidth / 2, infoCardY + infoCardHeight)
    
    // cardInfo.defence
    ctx.point(infoCardX + infoCardWidth - 10, infoCardY + infoCardHeight - 2, 
              card.defence + ' '); 
    
    isInformationDrawn = true;
}

exports.showSpells = function(key){
   
    // same as the information on the card
    // 1)
    var i,
        length = chosenCharacter.spells.length;
    
    
    if(!isChoosingSpell){
        isInformationDrawn = false;
        ctx.clear();
        // clear the information and callback to its predecessor
        drawBoard();
        this.eachFrame();
        return;
    }  
    
    if(key.name == 'up' && indexOnSpell > 0)
        indexOnSpell -= 1;
    
    else if(key.name == 'down' && indexOnSpell < length - 1)
        indexOnSpell +=1; 
    
    writeText(0, ySpellPosition + 1, chosenCharacter.spells[indexOnSpell].name);
    
    if(isInformationDrawn)
        return;
        
    // 2)
    ctx.clear();
    
    for(i = 0; i < length; i+=1){
        ySpellPosition = 3 + i * 2;
        var currentSpell = chosenCharacter.spells[i];
        ctx.point(0, 2 + i *2, 
                  chosenCharacter.spells[i].name + ' -> ' + currentSpell.description);
        ctx.bg(255, 0, 0);
        ctx.line(0, ySpellPosition ,width, ySpellPosition);
        ctx.cursor.restore();
    }

    isInformationDrawn = true;
}

// turn order
exports.onTurnOrder = function(){
    if(firstPlayer == 'enemyPlayer'){
        mainLogic.summonEnemyCreature();
        drawCardInHand();
        drawCardOnField();
        
        isBoardDrawn = true;
        // draw the cards and update the field
    
        if(hasEnemyTurnEnded){       
             drawCardInHand();
             drawCardOnField();
            
            if(hasPlayerTurnEnded){
                endTurn();
                this.isGameOver();
                drawCardInHand();
                drawCardOnField();
            }
        }
    }
    
    if(firstPlayer == 'userPlayer'){
        if(hasPlayerTurnEnded){
            mainLogic.summonEnemyCreature();   
            drawCardInHand();
            drawCardOnField();
            
            if(hasEnemyTurnEnded){
                endTurn();
                this.isGameOver();
                drawCardInHand();
                drawCardOnField();
            }
        }
    }     
    
    drawCardInHand();
    drawCardOnField();
}

function drawBoard(){
    var i,
        length = fieldLength;
    
    // enemy board
    for(i = 0; i < length; i +=1){
        ctx.bg(255,0,0);
        var currentX = i*width*0.167 + 1;
        //var currentY =  cardFieldInitY - 10;
        ctx.box(currentX, enemyFieldY, cardWidth, cardHeight);
        enemyFieldVectors
            .push({x:currentX,y:enemyFieldY,card:undefined,isDisabled: false});
        ctx.cursor.restore();
    }
    
    //border
    ctx.bg(128,128,0)
    ctx.line(0, cardFieldInitY - height*0.1, width, cardFieldInitY - height*0.1);
    ctx.cursor.restore();
    
    // player board
    for(i = 0; i < length; i+=1){
        ctx.bg(255, 0 ,0);
        var currentX = i*width*0.167 + 1;
        
        ctx.box(currentX, cardFieldInitY, cardWidth, cardHeight);
        playerFieldVectors
            .push({x:currentX, y:cardFieldInitY, card:undefined, isDisabled: false});
        ctx.cursor.restore();
    }
    
    ctx.bg(255, 0, 0);
    ctx.line(0, cardFieldInitY + height*0.26, width, cardFieldInitY + height*0.26);
    ctx.cursor.restore();
}

function drawCards(amountOfPlayerCards, amountOfEnemyCards){
    var playerIndex = 0,
        botIndex = 0;
    
    while(playerIndex++ < amountOfPlayerCards){
        
        var index = Math.round(Math.random() * (userChosenDeck.deck.length -1));
        var randomCard = JSON.parse(JSON.stringify(userChosenDeck.deck[index]));
        
       // randomCard.defence += 1000;
        if(playerCardsVectors.length < 6)
            playerCardsVectors.push(randomCard);
        
        // if the main vector is full transfer the cards to the bonus
        else if(playerBonusCards.length < 4)
            playerBonusCards.push(randomCard);
        
        playerDecks.splice(index, 1);
        
        // decrease player's cards
        cardVariables.playerCardsInDeck--;
    }
    
    while(botIndex++ < amountOfEnemyCards){
        if(botDeck.length == 0){
            return;
        }
        
        var randomIndex = Math.round(Math.random() * (botDeck.length - 1));
        var randomCard = botDeck[randomIndex];
        ctx.point(botDeck[0].name);
        //delete the card from the deck
        botDeck.splice(randomIndex, 1);
        
        if(enemyCardsVectors.length < 10)
            enemyCardsVectors.push(randomCard);
    }
} 

function drawInitialCards(){
    playerCardsVectors.push(JSON.parse(JSON.stringify(cardMaking.allCards[0])));
    playerCardsVectors[0].attack = 100;
    playerCardsVectors[0].canImmobile = 1;
    playerCardsVectors[0].canKnockdown = 1;
    playerCardsVectors[0].canWindfury = 2;
    var indexCard = findCard('War Minister Shokov');
    playerCardsVectors
        .push(JSON.parse(JSON.stringify(
        cardMaking.allCards[indexCard])));
    playerCardsVectors[1].defence = 100;
    
    ctx.point(playerCardsVectors[0].name);
    drawCards(6, 6);
} // stupid enough but draw is taking a card

function drawCardInHand(){ 
    
    if(showingPlayerVector == 'main')
        drawPlayerCards(playerCardsVectors);
    
    else
        drawPlayerCards(playerBonusCards);
}

function drawPlayerCards(vector){
    for(i = 0; i < vector.length; i+=1){
        var currentCard = vector[i];
        
        var currentX =  i*width*0.167 + 1,
            currentY =  cardHandInitY;
        
        ctx.bg(255, 0, 0);    
        ctx.box(currentX, currentY + cardHeight + 1, cardWidth, cardHeight); 
        ctx.cursor.restore();
        
        // card.name 
        ctx.point(currentX, handManaPlace, 
                  'Costs:' + currentCard.mana);
        
        // card.attack 
        ctx.point(currentX, handAttackPlace, 'Attack:' + currentCard.attack);
        
        //card.defence
        ctx.point(currentX, 
                  handDefencePlace, 'Defence:' + currentCard.defence);
        }
}

function drawCardOnField(){
    var i,
        length = fieldLength;
    
    //enemy
    for(i = 0; i < fieldLength; i+=1){
        var currentField = enemyFieldVectors[i];
        
        if(!currentField.card)
            continue;
            
        ctx.point(currentField.x, currentField.y,
                  'Costs:' + currentField.card.mana);
        // card.attack 
        ctx.point(currentField.x, enemyFieldAttackPlace, 
                  'Attack:' + currentField.card.attack);
        
        //card.defence
        ctx.point(currentField.x, enemyFieldDefencePlace, 
                  'Defence:' + currentField.card.defence);
    }
    
    
    //player
    for(i = 0; i < fieldLength; i+=1){
        var currentField = playerFieldVectors[i];
        
        if(!currentField.card)
            continue;
        
        ctx.point(currentField.x, currentField.y,
                  'Costs:' + currentField.card.mana);
        // card.attack 
        ctx.point(currentField.x, playerFieldAttackPlace, 
                  'Attack:' + currentField.card.attack);
        
        //card.defence
        ctx.point(currentField.x, playerFieldDefencePlace, 
                  'Defence:' + currentField.card.defence);
    }
}

function endTurn(){
    if(hasPlayerTurnEnded && hasEnemyTurnEnded){
        // 1) hasPlayerTurnEnded & hasEnemyTurnEnded = 1
        // 2) Increase mana
        // 3) Increase the turn count
        // 4) allow the attackers to strike once more
        // 5) activate boons
        // 6) botPriority card is reset to undefined

        //1)
        hasPlayerTurnEnded = false;
        hasEnemyTurnEnded = false;
        
        //2)
        drawCards(1, 1);
        
        // 3)
        if(mana < 10)
            mana+=1;
        playerMana = mana;
        enemyMana = mana;
        turnCount+=1;
        
        // 4)
        attackedFromFields = [];
        
        // 5)
        boons.activateBoons();
        
        // 6)
       // ctx.point(width - 20, 3, '424242424242424242424242');
        handPriority = [];
    }
}

// coin 42 to decide who first
function determineFirstPlayer(){
    var coinFlip = Math.random() * 100;
    
    if(coinFlip <= 42) // enemy
        firstPlayer = 'enemyPlayer';
    else
        firstPlayer = 'userPlayer';
}

function areBattlersDead(playerCreature, enemyCreature){
    if(!enemyCreature || !playerCreature)
        return;
    
    if(enemyCreature.card.defence <= 0){
        if(enemyCreature.card.isTaunt)
            enemyTauntsOnField-=1;
        
        
        enemyCreature.card = undefined;
        
        ctx.fg(255, 0, 0);
        ctx.box(enemyCreature.x, enemyCreature.y, cardWidth, cardHeight);
        ctx.cursor.restore();
        
        enemyCardsOnField -= 1;
    }
    
    if(playerCreature.card.defence <= 0){
        if(playerCreature.card.isTaunt)
            playerTauntsOnField -= 1;
        
        playerCreature.card = undefined;
        
        ctx.fg(255, 0, 0);
        ctx.box(playerCreature.x, playerCreature.y, cardWidth, cardHeight);
        ctx.cursor.restore();
        
        playerCardsOnField -=1;
    }
}

function findCard(cardName){
    var i,
        length = cardMaking.allCards.length;
    
    for(i = 0; i < length; i+=1){
        if(cardName == cardMaking.allCards[i].name)
            return i;
    }
    
    Error('find card in play game has undefined argument');
}

var lastWrittenText ='',
    ySpellPosition;

function writeText(x,y,text){
    
    if(lastWrittenText != ''){
        var i,
            length = lastWrittenText.length;
        for(i = text.length - 1; i <= length; i++){
            ctx.point(x + i,y, ' ');
        }
    }
    ctx.point(x,y, text);
    lastWrittenText = text;
}