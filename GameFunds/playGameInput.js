// importing
var
    variables = require('../GameFunds/variables'),
    cardVariables = require('./cardVariables'),
    setCardSpecialities = require('./setCardSpecialities'),
    boons = require('../Character/boons'),
    playGame = require('../GameMenu/playGame'),
    elementalistCasting = require('../ClassSkillTrees/elementalistCasting');

exports.initializeGameInput = function(key){
    if(isGameFinished){
        playGame.loadAfterGame(key);
        return;
    }
    
    if(!isBoardDrawn)
        playGame.beginGame();
    
    // if the the main cardVector is full switch to the bonus
    var currentUsedVector = undefined;
    if(showingPlayerVector == 'main')
        currentUsedVector = playerCardsVectors;
    else
        currentUsedVector = playerBonusCards;

    this.playGameLogic(key, currentUsedVector);

    if(playGame.isGameOver())
        return;

    if(isChoosingSpell){
        playGame.showSpells(key);  
        return;
    } 
    
    playGame.eachFrame();

    if(infoOnCard)
            playGame.showInfoOnCard(infoOnCard);
                                 
    writeText(0, 2 , 'Mana: ' + playerMana + ' Turn: ' + turnCount);
}

exports.playGameLogic = function(key, vector){
   writeText(0, 1, 'Cursor on: ' + cursorField + ' marked: ' + (cursorIndex + 1));  
    
    // 1) Enter
    //  a) the marked card is chosen
    // 2) Second enter
    //   if(cursor is on field)
    //   a) the last place of the card is deleted
    //   b) writing the card's description on the console
    //   c) setting the cursor position to zero
    //  if(backspace is clicked) go to 2).c)
    
    // player ready to end the turn
    if(key.name == 'm'){
        hasPlayerTurnEnded = true;
        activatePlayerUniqCards();
    }
    
    // choose spell
    if(key.name == 'j'){
        if(isChoosingSpell){
            isChoosingSpell = false;
            playGame.showSpells(key);
            //call the function to clear everything
        }
        else
            isChoosingSpell = true;
    }
    
    // cast spell
    if(key.name == 'q'){
        if(isCastingSpell){
            isCastingSpell = false;
            elementalistCasting.castChosenSpell(indexOnSpell, chosenCharacter, 
                                                cursorField, cursorIndex);
        }
        // do the spell description
        else
            isCastingSpell = true;
    }
    
    // turn down the cast
    if(key.name == 'tab'){
        isCastingSpell = false;
    }
    
    // close the info
    if(key.name == 'i'){
        
        if(infoOnCard){
            isShowingInfo = false;
            return;
        }
        
        isShowingInfo = true;
        
        if(cursorField == 'hand')
            infoOnCard = vector[cursorIndex];     
        
        else if(cursorField == 'playerField')
            infoOnCard = playerFieldVectors[cursorIndex].card;
        
        else if(cursorField == 'enemyField')
            infoOnCard = enemyFieldVectors[cursorIndex].card;
        
        else if(cursorField == 'playerChampion')
            infoOnCard = 'player';
    }
    
    //enter
    returnPressed(key, vector);
    
    if(key.name == 'backspace'){
        spawningCard = undefined;
        
        // 1) see if the cursor is at the enemy character
        // 2) else it is in the enemy field
        
        if(cursorField == 'enemyCharacter'){
            cursorField = 'enemyField';
        }
        
        else if(cursorField == 'enemyField'){
            markedField = null;
            cursorField = 'playerField';
            cursorIndex = 0;
        }
        
        else if(isKnockingCard || isChangingMobStats || isSwappingMinionStats){
            
            if(playerCardsVectors.length < 6)
                playerCardsVectors.push(playerFieldVectors[changingFieldIndex].card);
            else if(playerBonusCards.length < 4)
                playerCardsVectors.push(playerFieldVectors[changingFieldIndex].card);
            
            playerFieldVectors[changingFieldIndex].card = undefined;
            ctx.fg(255, 0, 0);
            ctx.box(playerFieldVectors[changingFieldIndex].x, 
                    playerFieldVectors[changingFieldIndex].y, 
                    cardWidth, cardHeight);
            ctx.cursor.restore();
            
            isKnockingCard = false;
            isChangingMobStats = false;
            isSwappingMinionStats = false;
        }
    }
    
    //left/right, up/down
    if(key.name == 'left' && cursorIndex >= 0){
            
            if(cursorIndex > 0)
                cursorIndex--;
        
            else if(cursorIndex == 0 &&
                    showingPlayerVector == 'bonus'){
                
                 if(playerCardsVectors.length < playerBonusCards.length){
                    var removeAt = 0;
                    while(removeAt++ <= vector.length)
                        playGame.removeField(removeAt);
                 }
                    showingPlayerVector = 'main';
                    cursorIndex = playerCardsVectors.length - 1;  
            }
    }
        
    else if(key.name == 'right'){
        
        if((cursorField == 'playerField' || cursorField == 'enemyField') && 
           cursorIndex < fieldLength - 1)
            cursorIndex+=1;
        
        else if(cursorField == 'hand' && cursorIndex < vector.length){
            
            if(showingPlayerVector == 'main' &&
               cursorIndex == vector.length - 1){
                // 1) change the vector card
                // 2) delete the card/s in the previous vector
                var removeAt = 0;
                
                while(removeAt <= vector.length)
                    playGame.removeField(removeAt++);
                
                showingPlayerVector = 'bonus';
                cursorIndex= 0;
            }
            
            else if(cursorIndex < vector.length - 1){
                cursorIndex+=1;
            }
        }
    }
    
    else if(key.name == 'up' && 
            cursorField != 'playerField' &&
            cursorField != 'enemyField' &&
            cursorField != 'enemyCharacter'){
        cursorField = 'playerField';
        cursorIndex = 0;
    }
    
    else if(key.name == 'up' &&
            cursorField == 'enemyField')
        cursorField = 'enemyCharacter';
    
    else if(key.name == 'up' &&
            cursorField == 'playerField' && 
            (isCastingSpell ||
            isKnockingCard ||
            isChangingMobStats ||
            isSwappingMinionStats))
        cursorField = 'enemyField';
    
    else if(key.name == 'down' && 
            cursorField != 'hand' &&
            cursorField != 'enemyField' &&
            cursorField != 'enemyCharacter' &&
            !isCastingSpell){
        cursorField = 'hand';
        cursorIndex = 0;
    }
    
    else if(key.name == 'down' &&
           cursorField == 'enemyCharacter')
        cursorField = 'enemyField';
    
        writeText(0, 0, 'Cursor on: ' + cursorField + ' marked: ' + (cursorIndex + 1));  
}

function returnPressed(key, vector){
    if(key.name != 'return')
        return; // Harley Quin wuz 'ere
    
    if(isBoardDrawn){
        if(cursorField == 'hand'){
            if(!spawningCard){
                spawningCard = vector[cursorIndex];    
                markedCardCursor = cursorIndex;
            }
        }
     
        else if(cursorField == 'playerField'){
            markedField = playerFieldVectors[cursorIndex];
            
            if(spawningCard){
                
                if(markedField.card)
                    spawningCard = null;
                
                else{
                    // summon the card
                    if(!playerFieldVectors[cursorIndex].card && 
                        playerMana >= spawningCard.mana &&
                       !playerFieldVectors[cursorIndex].isDisabled){
                        // 1) delete the card from the hand array
                        // 2) update the hand
                        // 3) initilize the card and summon the card
                        // 4) update the mana tauntsCount...
                        
                        // 1)
                        vector.splice(markedCardCursor, 1);
                        
                        // 2)
                        playGame.updateHand();
                        
                        // 3)           
                        var playerField = playerFieldVectors[cursorIndex];
                         playerField.card =
                            JSON.parse(JSON.stringify(spawningCard));
                        
                        setCardSpecialities
                            .setCardSpecials(playerField.card, 'player');
                        
                        // 4)
                        playGame.updateOwnMana(-spawningCard.mana);
                        playerCardsOnField +=1;
                        
                        if(spawningCard.isTaunt)
                            playerTauntsOnField+= 1;
                        
                        isCardUniq(playerField.card, cursorIndex);
                      //  attackedFromFields.push(markedField);
                    }
                    
                    // demark the chosen one
                    spawningCard = undefined;
                    cursorIndex = 0; 
                }
            }
            
            else{
                // choose an enemy to strike at // 42life
                if(markedField.card && 
                   !hasFieldAttacked(markedField) &&
                   !setCardSpecialities.isCardImmobiled(markedField.card)){
                    cursorField = 'enemyField';
                    cursorIndex = 0;
                }
            }
        }
        
        else if(cursorField == 'enemyField'){
            // the only way to get through here is by !markedField
            
            var targettedEnemy = enemyFieldVectors[cursorIndex];
            
            if(!targettedEnemy.card)
                return;
            
            // if the field has not attacked yet, attack!!!
            // and mark the field as attacked
            if(markedField.card &&
               !hasFieldAttacked(markedField) &&
               !setCardSpecialities.isCardImmobiled(markedField.card)){
                
                var playerCard = markedField.card,
                    enemyCard = markedField.card;
                
                if(playerCard.defence - enemyCard.attack <= 0 && 
                    playerCard.hasDeathrattle)
                    setCardSpecialities.setCardSpecials(playerCard, 'player');
                else if(playerCard.defence - enemyCard.attack <= 0 &&
                        playerCard.name == 'Ogden Stonehealer')
                    isOgdenDead = true;
                
                if(enemyCard.defence - playerCard.attack <= 0 &&
                    enemyCard.hasDeathrattle)
                    setCardSpecialities.setCardSpecials(enemyCard, 'enemy');
                else if(enemyCard.defence - playerCard.attack <= 0 &&
                        enemyCard.name == 'Ogden Stonehealer')
                    isOgdenDead = true;
                
                setCardSpecialities
                    .activateCardBoons(markedField,targettedEnemy.card.defence,
                                       'enemyField', cursorIndex, enemyCard.canBlock);
                
                playGame.attackBetweenMinions(markedField, targettedEnemy);
            }
        }
        
        else if(cursorField == 'enemyCharacter' &&
                markedField.card &&
                !hasFieldAttacked(markedField) && 
               !setCardSpecialities.isCardImmobiled(markedField.card)){
            // check for enemy weapon, spell, shield, stealth, kungala whatever thing
            
            var playerCard = markedField.card;
            
            setCardSpecialities
                .activateCardBoons(markedField, enemyPlayerHealth, 
                                   'enemyCharacter', 0, playerCard.canBlock);
            
            playGame.attackEnemyPlayer(markedField);
            
            if((!markedField.card || markedField.card.defence <= 0) &&
              playerCard.hasDeathrattle)
                setCardSpecialities.setCardSpecials(playerCard, enemy);
            
            ctx.point(width - 29, 2, 'Enemy character health: ' + enemyPlayerHealth);
        }
    }
}


function hasFieldAttacked(field){
    var i,
        length = attackedFromFields.length;
    
    for(i = 0; i < length; i+=1){
        var currentField = attackedFromFields[i];
        
        if(currentField.x == field.x &&
           currentField.y == field.y)
            return true;
    }
    
    return false;
}

function isCardUniq(card, index){
    if(!card)
        Error('While checking isCardUniq the argument (card) was undefined');
    
    var i,
        length = uniqCards.length;
    
    for(i = 0; i < length; i+=1){
        if(card.name == uniqCards[i]){
            summonnedUniqCards.push({card:card, from: 'player', onIndex:index});
            return;
        }
    }
}

function activatePlayerUniqCards(){
    var i = 0;
    
    while(i < summonnedUniqCards.length){
        var currentCard = summonnedUniqCards[i],
            cardIndex = currentCard.onIndex;
        
        if(!currentCard.card ||
          (currentCard.from == 'player' &&
           playerFieldVectors[cardIndex].card &&
          playerFieldVectors[cardIndex].card != currentCard.card)){
            summonnedUniqCards.splice(i, 1);
            continue;
        }
    
        if(currentCard.from == 'player')
            setCardSpecialities.setCardSpecials(currentCard.card, 'player');
            
        i+=1;   
    }
}

var lastWrittenText = '';

function writeText(x,y,text){
    
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