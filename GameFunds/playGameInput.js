// importing
var
    variables = require('../GameFunds/variables'),
    coreActions = require('../GameFunds/coreActions'),
    cardVariables = require('../CardComponent/cardVariables'),
    setCardSpecialities = require('../CardComponent/setCardSpecialities'),
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
    var currentUsedVector;
    if(showingPlayerHand == 'main')
        currentUsedVector = playerHand;
    else
        currentUsedVector = playerBonusHand;

    this.playGameLogic(key, currentUsedVector);

    if(playGame.isGameOver())
        return;

    if(isChoosingSpell){
        playGame.showSpells(key);  
        return;
    } 
    
    if(currentModeState == 'Training')
        playGame.vsAIEachFrame();
    else if(currentModeState == 'Play Game')
        playGame.vsPlayerEachFrame();
    
    if(infoOnCard)
            playGame.showInfoOnCard(infoOnCard);
                    
    
    var playerIs = ' You are ';
    if(isKnockingCard)
        playerIs = 'knocking a card';
    else if(isSwappingMinionStats)
        playerIs = 'swapping minion stats';
    else if(isChangingMobStats)
        playerIs = 'changing mobs stats';
    else if(isShatteringField)
        playerIs = 'shattering a field';
    else
        playerIs = '';
    
    
    coreActions.writeText(0, 2 , 'Mana: ' + playerMana + 
                          ' Turn: ' + turnCount + playerIs);
} 

exports.playGameLogic = function(key, vector){
    var turnOn;
    if(hasPlayerTurnEnded)
        turnOn = ' Opponent turn';
    else
        turnOn=' Yer" turn';

   coreActions.writeText(0, 1, 'Cursor on: ' + cursorField + 
                         ' marked: ' + (cursorIndex + 1)+ turnOn);  
    
    // 1) Enter
    //  a) the marked card is chosen
    // 2) Second enter
    //   if(cursor is on field)
    //   a) the last place of the card is deleted
    //   b) writing the card's description on the console
    //   c) setting the cursor position to zero
    //  if(backspace is clicked) go to 2).c)
    
    // player ready to end the turn
    if(key.name == 'm' && !hasPlayerTurnEnded){
        hasPlayerTurnEnded = true;
        if(currentModeState == 'Play Game')
            playGame.onTurnEnd();
    }
    
    // choose spell
    if(key.name == 'j'){
        if(isChoosingSpell){
            isChoosingSpell = false;
            playGame.showSpells(key);
            return;
            //call the function to clear everything
        }
        else
            isChoosingSpell = true;
    }
    
    // cast spell
    if(key.name == 'q' && !hasPlayerTurnEnded){
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
            infoOnCard = playerFields[cursorIndex].card;
        
        else if(cursorField == 'enemyField')
            infoOnCard = enemyFields[cursorIndex].card;
        
        else if(cursorField == 'playerChampion')
            infoOnCard = 'player';
    }
    
    //enter pressed
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
        
        // the card with the ability to either knock/change/swap other minion stats is back 
        // in the initial spawner hand
        else if((isKnockingCard || isChangingMobStats || 
                 isSwappingMinionStats ||  isShatteringField) && 
                !hasPlayerTurnEnded){
            
            if(playerHand.length < 6)
                playerHand.push(playerFields[changingFieldIndex].card);
            else if(playerBonusHand.length < 4)
                playerHand.push(playerFields[changingFieldIndex].card);
            
            playerFields[changingFieldIndex].card = undefined;
            ctx.fg(255, 0, 0);
            ctx.box(playerFields[changingFieldIndex].x, 
                    playerFields[changingFieldIndex].y, 
                    cardWidth, cardHeight);
            ctx.cursor.restore();
            
            isKnockingCard = false;
            isChangingMobStats = false;
            isSwappingMinionStats = false;
            isShatteringField = false;
        }
    }
    
    //left/right, up/down
    if(key.name == 'left' && cursorIndex >= 0){
            
            if(cursorIndex > 0)
                cursorIndex--;
        
            else if(cursorIndex == 0 &&
                    showingPlayerHand == 'bonus'){
                
                 if(playerHand.length < playerBonusHand.length){
                    var removeAt = 0;
                    while(removeAt++ <= vector.length)
                        playGame.removeField(removeAt);
                 }
                    showingPlayerHand = 'main';
                    cursorIndex = playerHand.length - 1;  
            }
    }
        
    else if(key.name == 'right'){
        
        if((cursorField == 'playerField' || cursorField == 'enemyField') && 
           cursorIndex < fieldLength - 1)
            cursorIndex+=1;
        
        else if(cursorField == 'hand' && cursorIndex < vector.length){
            
            if(showingPlayerHand == 'main' &&
               cursorIndex == vector.length - 1){
                // 1) change the vector card
                // 2) delete the card/s in the previous vector
                var removeAt = 0;
                
                while(removeAt <= vector.length)
                    playGame.removeField(removeAt++);
                
                showingPlayerHand = 'bonus';
                cursorIndex= 0;
            }
            
            else if(cursorIndex < vector.length - 1){
                cursorIndex+=1;
            }
        }
    }
    
    else if(key.name == 'up' && cursorField != 'playerField' && 
            cursorField != 'enemyField' && cursorField != 'enemyCharacter' &&
            !isChoosingSpell){
        cursorField = 'playerField';
        cursorIndex = 0;
    }
    
    else if(key.name == 'up' &&
            cursorField == 'enemyField')
        cursorField = 'enemyCharacter';
    
    else if(key.name == 'up' && !isChoosingSpell && cursorField == 'playerField' && 
            (markedField == chosenCharacter || isCastingSpell || isKnockingCard ||
            isChangingMobStats || isSwappingMinionStats || isShatteringField))
        cursorField = 'enemyField';
    
    else if(key.name == 'down' && 
            cursorField != 'hand' &&
            cursorField != 'enemyField' &&
            cursorField != 'enemyCharacter' &&
            !isCastingSpell){
        cursorField = 'hand';
        cursorIndex = 0;
    }
    
    else if(key.name == 'down' && cursorField == 'hand')
        cursorField = 'character';
    
    else if(key.name == 'down' &&
           cursorField == 'enemyCharacter')
        cursorField = 'enemyField';
    
   coreActions.writeText(0, 1, 'Cursor on: ' + cursorField + 
                         ' marked: ' + (cursorIndex + 1) + turnOn);  
}

function returnPressed(key, vector){
    if(key.name != 'return' || !isBoardDrawn || hasPlayerTurnEnded)
        return; // Harley Quin wuz 'ere
    
    if((isKnockingCard || isSwappingMinionStats || isChangingMobStats || isShatteringField) &&
       (currentModeState == 'Play Game' || currentModeState == 'Arena')){
        var cardCan;
        if(isKnockingCard)
            cardCan = 'knock';
        if(isSwappingMinionStats)
            cardCan = 'swap';
        if(isChangingMobStats)
            cardCan = 'changeStats';
        if(isShatteringField)
            cardCan = 'shatterField';
        
        socket.emit('cardCan', {gameOrder:gameOrder, onField:cursorField,
            onIndex: cursorIndex, cardCan:cardCan, changingFieldIndex: changingFieldIndex});
    }
    boons.gameActions(cursorField, cursorIndex);
    
    // if the user wants to attack with the character he can if he has duration with a weapon           or an attack for only the current turn
    if(cursorField == 'character' && 
       (chosenCharacter.duration || chosenCharacter.tempAttack)){
        markedField = chosenCharacter;
    }
    
    else if(cursorField == 'hand'){
        if(!spawningCard){
            spawningCard = vector[cursorIndex];
            markedCardCursor = cursorIndex;
        }
    }
    
    else if(cursorField == 'playerField'){
        markedField = playerFields[cursorIndex];
        
        if(spawningCard){
            
            if(markedField.card && !hasPlayerTurnEnded)
                spawningCard = null;
            
            else{
                // summon the card
                if(!playerFields[cursorIndex].card && 
                    playerMana >= spawningCard.mana &&
                    !playerFields[cursorIndex].isDisabled){
                    // 1) delete the card from the hand array
                    // 2) update the hand
                    // 3) initilize the card and summon the card
                    // 4) update the mana tauntsCount...                    
                    // 5) add to already attacked cards
                    
                    // 1)
                    vector.splice(markedCardCursor, 1);
                    
                    // 2)
                    playGame.updateHand();
                    
                    // 3)           
                    var playerField = playerFields[cursorIndex];
                    playerField.card =
                        JSON.parse(JSON.stringify(spawningCard));
                    
                    setCardSpecialities
                        .setCardSpecials(playerField.card, 'player');
                    
                    // 4)
                    playGame.updateOwnMana(-spawningCard.mana);
                    playerSpawnedCards +=1; 
                    
                    if(playerField.card.isTaunt)
                        playerTaunts+= 1;
                    
                    coreActions.isCardUniq(playerField.card, cursorIndex, 'player');
                    attackedFromFields.push(markedField);
                  
                    if(currentModeState == 'Play Game') // send spawnCard
                        socket.emit('spawnCard',
                                    {gameOrder:gameOrder,playerIndex:playerIndex,
                                    fieldIndex:cursorIndex,cardName:spawningCard.name});
                }
                
                // demark the chosen one
                spawningCard = undefined;
                cursorIndex = 0; 
            }
        }
        
        else{
            // choose an enemy to strike at // 42life
            if(markedField.card && 
                !coreActions.hasAttacked(markedField) &&
                !setCardSpecialities.isCardImmobiled(markedField.card)){
                cursorField = 'enemyField';
                attackingFieldIndex = cursorIndex;
                cursorIndex = 0;
            }
        }
    }
    
    else if(cursorField == 'enemyField'){
        // the only way to get through here is by !markedField
        var targettedEnemy = enemyFields[cursorIndex];
        
        if(markedField == chosenCharacter &&
          targettedEnemy.card && !chosenCharacter.hasAttacked)
            coreActions.chiefAttacksCard(chosenCharacter, targettedEnemy,true);
        
        if(!targettedEnemy.card || !markedField.card)
            return;
        
        // if the field has not attacked yet, attack!!!
        // and mark the field as attacked
        if(markedField.card &&
            !coreActions.hasAttacked(markedField) &&
            !setCardSpecialities.isCardImmobiled(markedField.card)){
            
            coreActions.cardsBattle(markedField, targettedEnemy, true, cursorIndex);
            
            if(currentModeState == 'Play Game')
                socket.emit('battle',{gameOrder:gameOrder,
                            defenderField:cursorIndex,defenderFieldName:'enemyField',
                                      attackerField:attackingFieldIndex});
        }
    }
    
    else if(cursorField == 'enemyCharacter' &&
            markedField == chosenCharacter && !chosenCharacter.hasAttacked){
            coreActions.chiefsBattle(chosenCharacter);
    }
    
    else if(cursorField == 'enemyCharacter' &&
            markedField.card &&
            !coreActions.hasAttacked(markedField) && 
            !setCardSpecialities.isCardImmobiled(markedField.card)){
        // check for enemy weapon, spell, shield, stealth, kungala whatever thing
        
        var playerCard = markedField.card;
        
        coreActions.attackEnemyChief(markedField, enemyCharacter, 
                                 enemyPlayerHealth, 'enemyCharacter');
        
        if(currentModeState == 'Play Game'){
            socket.emit('battle',{gameOrder:gameOrder, defenderField:NaN,                                           defenderFieldName:'enemyCharacter',
                                  attackerField:attackingFieldIndex});
        }
    }
}