// importing variables
var variables = require('../GameFunds/variables'),
    coreActions = require('../GameFunds/coreActions'),
    gameMenu = require('./gameMenu'),
    cardVariables =require('../CardComponent/cardVariables'),
    cardMaking = require('../CardComponent/cardMaking'),
    setCardSpecialities = require('../CardComponent/setCardSpecialities'),
    boons = require('../Character/boons'),
    elementalistCasting = require('../ClassSkillTrees/elementalistCasting'),
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
            
            if(currentModeState == 'Training')
     /*2)*/      mainLogic.initilizeBot();
    /*3)*/ cardMaking.shuffleDecks();
    /*4)*/ drawBoard();
    /*5)*/ drawInitialCards();
    /*5)*/ determineFirstPlayer();
    /*6)*/ cardMaking.defineUniq_Cards();
}

exports.vsAIEachFrame = function(){
    isBoardDrawn = true;
    // draw the cards and update the field
    drawCardInHand();
    drawCardOnField();   
    
    // draw Player Info
    ctx.point(0, cardFieldInitY + cardHeight + 1, 'Your mana: ' + playerMana+ '| Name: ' + 
              chosenCharacter.name + '| Health: ' + playerHealth + '| Armor: ' + 
              playerArmor + '| Traps: ' + playerTrapsCasted.length); 

    this.onTurnOrder();  
}
    
exports.vsPlayerEachFrame = function(){
    isBoardDrawn = true;
    
    // draw the cards and update the field
    drawCardInHand();
    drawCardOnField();   
    
    if(hasPlayerTurnEnded){
        onTurnStart();
        enemySentData();
    }

    else{
        socket.emit('checkUniqActions', {gameOrder:gameOrder, playerIndex:playerIndex});
        
        socket.on('recieveUniqActions', function(data){
            ctx.point(width-20, 2, data.uniqActions.length + " " + updateUniqCounter + " C " + data.updateCounter);

            if(data.uniqActions.length <= 0 || updateUniqCounter >= data.updateCounter || data.updateCounter == null)
                return;

            ctx.point(width-20, 3, data.uniqActions.length + ' LENGTH');
            
            boons.activateRecievedUniqCards(data.uniqActions);
            updateUniqCounter = data.updateCounter;
        });
    }
    
    //ctx.point(width-20, 3, playerTaunts + " EP " + enemyTaunts);
    // draw Player Info
    ctx.point(5, cardFieldInitY + cardHeight + 1, 'Your mana: ' + playerMana + '| ' +
              '| '+'Name: ' + chosenCharacter.name + '|' + 'Health: ' + playerHealth + '| '); 

    socket.on('enemySurrendered', function(data){
        playerWon();
        variables.resetPlayGameVariables();
        socket.emit('recievedSurrender', {gameOrder:gameOrder, playerIndex: oldPlayerIndex});
    });

}

function enemySentData(){
    
    socket.emit('playerRequestData', {gameOrder:gameOrder,playerIndex:playerIndex});

    socket.on('battleReport'+profileUsername+userID, function(data, fn){                
           // 1)-> enemy has spawned card
         //  ctx.point(width-20, 2, data.cursorPosition + ' CP');
         if(data.updateCounter <= serverUpdateCounter)
            return;
        serverUpdateCounter = data.updateCounter;
           
            if(data.fieldIndex != null && data.fieldIndex>=0 ){
                for(var i = 0; i < data.enemyFields.length; i++){
                    if(data.enemyFields[i] == '' || 
                        (enemyFields[i].card && data.enemyFields[i] == enemyFields[i].card.name))
                        continue;

                    var cardIndex = findCard(data.enemyFields[i]);

                    enemyFields[data.fieldIndex].card= JSON.parse(JSON.stringify(cardMaking.allCards[cardIndex]));
                    coreActions.isCardUniq(enemyFields[data.fieldIndex].card, data.fieldIndex, 'enemy');
                    setCardSpecialities.setCardSpecials(enemyFields[data.fieldIndex].card, 'enemy');

                    enemySpawnedCards++;
                }
            }

            // 1.5) -> enemy card has speciality (knock/swap/change
            if(data.cardCan != ''){
                changingFieldIndex = data.changingFieldIndex;
                if(data.cardCan == 'knock')
                    isKnockingCard = true;
                else if(data.cardCan == 'swap')
                    isSwappingMinionStats = true;
                else if(data.cardCan == 'changeStats')
                    isChangingMobStats = true;
                else if(data.cardCan == 'shatter')
                    isShatteringField = true;
                var onField;
                // the enemy enemy is user
                if(data.onField == 'enemyField')
                    onField = 'playerField';
                else if(data.onField == 'playerField')
                    onField = 'enemyField';
                boons.gameActions(onField, data.onIndex);
            }
            
           // socket.emit('updateBattlefield', {gameOrder:gameOrder});

        // enemy has casted a spell
        if(data.cursorPosition != null && data.cursorPosition>=0 && data.markedCursor != ''){
            enemyCharacter = data.character;
            //ctx.positions(width - 20, 4, data.character.spells[0].name + ' NM');
            elementalistCasting.castChosenSpell(data.spellIndex,enemyCharacter,
                    data.markedCursor,data.cursorPosition);
        }

        // 2)-> enemy has attacked
        // if the fields are empty there is nothing to report
       // ctx.point(width - 20, 2, data.defenderField + ' DF');
        
        if(data.defenderIndex == NaN || data.attackerIndex == NaN)
            return;

        // the character is attacking
        if(data.attackerIndex == -1 && data.defenderField == 'enemyField'){
            var defender = playerFields[data.defenderIndex];

            if(!defender || !defender.card || enemyCharacter.hasAttacked)
                return;

            coreActions.chiefAttacksCard(enemyCharacter, defender, false);
        }

        else if(data.attackerIndex == -1 && data.defenderField == 'enemyCharacter'){
            if(enemyCharacter.hasAttacked)
                return;

            coreActions.chiefsBattle(enemyCharacter);
        }

            // the opponent desires to attack his hero(userPlayer) 
            // so here he attacks the enemy opponent(himself) :D
        else if(data.defenderField == 'userCharacter'){
            var attacker = enemyFields[data.attackerIndex];
            if(!attacker || !attacker.card || coreActions.hasAttacked(attacker))
                return;
            enemyBattleInfo.health = playerHealth;
            coreActions.attackEnemyChief(attacker, enemyCharacter, 
                                         enemyPlayerHealth, 'enemyCharacter');
            
           // ctx.point(width - 20, 2, 'Attacking enemyPlayer');
        }
        // desires to attack the other playerCharacter
        else if(data.defenderField == 'enemyCharacter'){
            var attacker = enemyFields[data.attackerIndex];
            if(!attacker || !attacker.card || 
               coreActions.hasAttacked(attacker))
                return;
            
            coreActions.attackEnemyChief(attacker, chosenCharacter,playerHealth, 'userPlayer');
        }
        //battle between two minions/cards//
        else if(data.defenderField == 'enemyField'){
            var attacker = enemyFields[data.attackerIndex],
                defender = playerFields[data.defenderIndex];
          //  ctx.point(width - 20, 2, 'Attacking between minions');
                
            if(!attacker || !defender ||
               !attacker.card || !defender.card || coreActions.hasAttacked(attacker))
                return;
            
            coreActions.cardsBattle(attacker,defender, false, data.defenderIndex);
          //  ctx.point(width - 20, 2, 'Attacking between minions');
        }
        // attack the field to the already attacked

        fn(true);
    });
}

function onTurnStart(){
    // send data to server
    
    socket.emit('requestStartTurn', {gameOrder:gameOrder,playerIndex:playerIndex});
    
    socket.on('startTurn'+profileUsername+userID, function(data){
        uniqCardsActions = [];

        hasPlayerTurnEnded = false;
        attackFromFields=data.attackedFromFields;
        enemyHand=data.playerHand;
        enemyCharacter.hasAttacked = false;
        if(enemyCharacter.weapon == 'Thor"s hammer')
            enemyCharacter.hasWindfury = 1;
        if(chosenCharacter.weapon == 'Thor"s hammer')
            chosenCharacter.hasWindfury = 1;

        if(playerIndex == 0)
            attackedFromFields = [];
    });
}

exports.onTurnEnd = function(){
    // send data to server
    
    turnCount+=1;
    battleDone += 'Turn ' + turnCount + '\n';
    mana+=1;
    playerMana=mana;
    enemyMana=mana;
    boons.activateBoons();
    
    if(playerIndex == 1)
        attackedFromFields = [];
    
    socket.emit('endTurn', {username:profileUsername,userID:userID,
                            gameOrder:gameOrder,playerIndex:playerIndex,
                            playerHand: playerHand.concat(playerBonusHand)});
    drawCards(1, 1);
}

// if a minion is down
exports.removeField = function(removeAt){
    var index;
    
    if(showingPlayerHand == 'main')
        index = playerHand.length - removeAt;
    else
        index = playerBonusHand.length - removeAt;
    
    var fieldX = cardFieldInitX + index * width*0.167 + 1;
    ctx.box(fieldX, cardHandInitY + cardHeight + (height* 0.03), cardWidth, cardHeight);
}

exports.updateHand = function(){
    var firstBonusEl;
    
    if(playerBonusHand.length == 0 || playerHand.length < 6)
        return;
    
    firstBonusEl = playerBonusHand[0];
    
    var i,
        length = playerBonusHand.length;
    
    for(i = 0; i < length; i+=1)
        playerBonusHand[i] = playerBonusHand[i + 1];
    
    playerBonusHand.splice(length - 1, 1);
    
    playerHand.push(firstBonusEl);
}

exports.updateOwnMana = function(by){
    playerMana += by;
}

exports.loadAfterGame = function(key){
    if(key.name == 'return'){
        currentModeIndex = 0;
        currentModeState = 'Game Menu';
        gameMenu.loadMenu();
        isGameFinished = false;
    }
}

function playerWon(){
    var currentCharacter = createdCharacters[indexAtCharacter];
        
    ctx.clear();
    currentCharacter.exp += 1350; // %0.125 from foe's level
    experience.checkLevel();
    userGold += 60;
    wonRowGames +=1;

    ctx.point(0, 1, 'You have won, Game won in a row: ' + wonRowGames);
    ctx.point(0, 2, 'Current exp: ' + currentCharacter.exp);
   // ctx.point(0, 3, 'Needed for next level: ' + (experience.levels[currentCharacter.level - 1].maxExp -                                  currentCharacter.exp));
    ctx.point(0, 5, 'Money owned: ' + userGold);
    ctx.point(0, 4, 'Press enter to go back to the Game Menu');
            
    isBoardDrawn = false;
    isGameFinished = true;
}

function enemyWon(){
    var currentCharacter = createdCharacters[indexAtCharacter];
        
    ctx.clear();
    currentCharacter.exp += 335;
    experience.checkLevel();
    userGold += 15;
    wonRowGames = 0;
    
    ctx.point(0, 1, 'You have lost');
    ctx.point(0, 2, 'Current exp: ' + currentCharacter.exp);
  //  ctx.point(0, 3, 'Needed for next level: ' + (experience.levels[currentCharacter.level - 1].maxExp -                                  currentCharacter.exp));
    ctx.point(0, 5, 'Money owned: ' + userGold);
    ctx.point(0, 4, 'Press enter to go back to the Game Menu');
            
    isBoardDrawn = false;
    isGameFinished = true;
}

exports.isGameOver = function(){
    if(!isGameFinished && enemyPlayerHealth <= 0){ // enemy health has been depleted
        playerWon();
        return true;
    }
    
    // if player's health is zero you have lost;
    if(!isGameFinished && playerHealth <= 0){
        enemyWon();
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
        if(currentModeState == 'Training')
            this.vsAIEachFrame();
        else if(currentModeState == 'Play Game')
            this.vsPlayerEachFrame();
        
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
   var ySpellPosition = 0;
    // same as the information on the card
    // 1)
    var i,
        length = chosenCharacter.spells.length;
    
    if(!isChoosingSpell){
        isInformationDrawn = false;
        ctx.clear();
        // clear the information and callback to its predecessor
        drawBoard();
        if(currentModeState == 'Training')
            this.vsAIEachFrame();
        else if(currentModeState == 'Play Game')
            this.vsPlayerEachFrame();
        
        return;
    }  
    
    if(key.name == 'up' && indexOnSpell > 0)
        indexOnSpell -= 1;
    
    else if(key.name == 'down' && indexOnSpell < length - 1)
        indexOnSpell +=1; 
    
    coreActions.writeText(0,ySpellPosition+ 2,chosenCharacter.spells[indexOnSpell].name);
    
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
        
        isBoardDrawn = true;
        // draw the cards and update the field
    
        if(hasEnemyTurnEnded){
            
            if(hasPlayerTurnEnded){
                endTurn();
                this.isGameOver();
            }
        }
    }
    
    if(firstPlayer == 'userPlayer'){
        if(hasPlayerTurnEnded){
            mainLogic.summonEnemyCreature();   
            
            if(hasEnemyTurnEnded){
                endTurn();
                this.isGameOver();
            }
        }
    }     
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
        enemyFields
            .push({x:currentX,y:enemyFieldY,card:undefined,isDisabled: false, 
                   isBurning:false});
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
        playerFields
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
        
        if(userChosenDeck.length == 0)
            return;
        var randomCard = JSON.parse(JSON.stringify(userChosenDeck[0]));
        
       // randomCard.defence += 1000;
        if(playerHand.length < 6)
            playerHand.push(randomCard);
        
        // if the main vector is full transfer the cards to the bonus
        else if(playerBonusHand.length < 4)
            playerBonusHand.push(randomCard);

        // decrease player's cards
        userChosenDeck.splice(0, 1);        
    }
    
    while(botIndex++ < amountOfEnemyCards){
        if(botDeck.length == 0){
            return;
        }
        
        var randomCard = botDeck[0];
        //delete the card from the deck
        botDeck.splice(0, 1);
        
        if(enemyHand.length < 10)
            enemyHand.push(randomCard);
    }
} 

function drawInitialCards(){
    playerHand.push(cardMaking.allCards[findCard('Priest of Dwayna')]);
    playerHand.push(cardMaking.allCards[findCard('Kamikazeto99')]);
    playerHand.push(cardMaking.allCards[findCard('Shaman of Caledon')]);
    playerHand.push(cardMaking.allCards[findCard('Arcanist Dremus')]);
    
   /* playerHand.push(cardMaking.allCards[findCard('Captain Tervelan')]);
    playerHand.push(cardMaking.allCards[findCard('Champion Harathi Warrior')]);
    playerHand.push(cardMaking.allCards[findCard('Zommoros')]);
    playerHand.push(cardMaking.allCards[findCard('Carrion Sculpture')]);

    playerHand.push(cardMaking.allCards[findCard('Zommoros')]);
    playerHand.push(cardMaking.allCards[findCard('Ert and Burt')]);
    playerHand.push(cardMaking.allCards[findCard('Mama')]); // knockback
    playerHand.push(cardMaking.allCards[findCard('Mama')]); // knockback
    playerHand.push(cardMaking.allCards[findCard('Karamoleoff')]); // buffing effect 
    playerHand.push(cardMaking.allCards[findCard('Fen')]); // swapping effect
    playerHand.push(cardMaking.allCards[findCard('Pickpocket Master')]); // shattering effect
   */ 
  drawCards(6, 6);
} // stupid enough but draw is taking a card

function drawCardInHand(){ 
    
    if(showingPlayerHand == 'main')
        drawPlayerCards(playerHand);
    
    else
        drawPlayerCards(playerBonusHand);
}

function drawPlayerCards(vector){
    for(i = 0; i < vector.length; i+=1){
        var currentCard = vector[i];
 
        if(!currentCard)
            continue;
        
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
        var currentField = enemyFields[i];
        
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
        var currentField = playerFields[i];
        
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
        // 1) and write it in the gameReport hasPlayerTurnEnded & hasEnemyTurnEnded = 1
        // 2) Increase mana
        // 3) Increase the turn count
        // 4) allow the attackers to strike once more
        // 5) activate boons
        // 6) botPriority card is reset to undefined
        // 7) reset characters windfury

        //1)
        battleDone += 'Turn ' + turnCount +  '\n';
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
        handPriority = [];

        // 7
        if(enemyCharacter.weapon == 'Thor"s hammer')
            enemyCharacter.hasWindfury = 1;
        if(chosenCharacter.weapon == 'Thor"s hammer')
            chosenCharacter.hasWindfury = 1;
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

function findCard(cardName){
    var i,
        length = cardMaking.allCards.length;
    
    for(i = 0; i < length; i+=1){
        if(cardName == cardMaking.allCards[i].name)
            return i;
    }
    
    Error('find card in play game has undefined argument');
}