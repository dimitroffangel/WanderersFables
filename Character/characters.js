//imporing
var variables = require('../GameFunds/variables'),
    elementalist = require('../ClassSkillTrees/elementalist');

// load created Characters 
// create a character

exports.loadCreatedCharacters = function(key){
    ctx.clear();
    ctx.point(0, 0, 'You have ' + createdCharacters.length + ' characters');    
    
    // print created characters and make the user to create a new if he doesn't have any
    if(createdCharacters.length == 0 || isCreatingCharacter){
        isCreatingCharacter = true;
        ctx.point(0, 2, 'You must create a Character in order to play');
        this.createCharacter(key);
        lastKeyEntered = key.name;
    }
    
    else{
        
        var i,
            length = createdCharacters.length;
        
        for(i = 0; i < length; i+=1){
            ctx.point(0, 2 + i *2, 'Class: ' +  createdCharacters[i].class);
            ctx.point(0, 3 + i *2, 'Champion"name: ' + createdCharacters[i].name);
        }
        
        if(key.name == 'q')
            ctx.point(0, 10, createdCharacters[indexAtCharacter].class);
            
        if(key.name == 'e')
            return;
        
        if(key.name == 'up' && indexAtCharacter > 0)
            indexAtCharacter--;
        
        if(key.name == 'down' && indexAtCharacter < createdCharacters.length -1)
            indexAtCharacter++;
    }
    
    if(key.name == 'backspace' ){
        isCreatingCharacter = true;
    }
    
}

exports.createCharacter = function(key){

    if(key.name == 'return' && userInput != ' '){
        enterPressed +=1;
        userInput.trimLeft();
        
        if(enterPressed == 1)
            createdCharacters.push({class: userInput});
        
        else if(enterPressed == 2){
            // the Character has: name, class, array of spells and a level counter
            createdCharacters[createdCharacters.length - 1].name = userInput;
            enterPressed = 0;
            isCreatingCharacter = false;
            ctx.point(0, 15, 'Press any key to continueue');
            createdCharacters[createdCharacters.length - 1].exp = 0;
            createdCharacters[createdCharacters.length - 1].level = 10;
            createdCharacters[createdCharacters.length - 1].spells = [];
            
            // in order to bind him to its class script
            this.determineChampionClass
            (createdCharacters[createdCharacters.length - 1]);
        }
    
        userInput = ' ';
        return;
    }
    
    // cancel the inputed input
    else if(key.name == 'backspace'){
        if(enterPressed > 0 && lastKeyEntered == 'backspace'){
            if(enterPressed == 1)
                createdCharacters.splice(createdCharacters.length - 1, 1);
            
            enterPressed -= 1;
        }
        
        userInput = ' ';
        return;
    }
    
    if(key.name == 'return' || key.name == 'backspace')
        return;
    
    if(key.name == 'space'){
        userInput += ' ';
        return;
    }
    
    userInput += key.name;
    
    if(enterPressed == 0){
        ctx.point(0, 3, 'Class: ' + userInput);
        ctx.point(0, 4, 'Name: ');
    }
    else if(enterPressed == 1){
        ctx.point(0, 3, 'Class: ' + 
                  createdCharacters[createdCharacters.length - 1].class);
        ctx.point(0, 4, 'Name: ' + userInput);
    }
    
}

exports.getMaxCharacterLevel = function(){
    var i,
        length = createdCharacters.length,
        maxCharacterLevel = 0;
    
    for(i = 0; i < length; i+=1){
        var currentCharacter = createdCharacters[i];
        
        if(currentCharacter.level > maxCharacterLevel)
            maxCharacterLevel = currentCharacter.level;
    }
    
    return maxCharacterLevel;
}

exports.determineChampionClass = function(character){
    var characterClass = character.class.trimLeft();
     
    // elementalist
    if(characterClass == 'e' || characterClass == 'elementalist'){
        // set up the skills
      elementalist.initilizeElementalistSkills();
        
        // add this property to the champion
      character.skillsTrees = 
                JSON.parse(JSON.stringify(elementalistSkillTrees));  
        
        // implement the first skill
      elementalist.upgradeSkills(character);
    }
}