// importing...
var variables = require('../GameFunds/variables');

//exporting...
exports.
    levels = [ new Exp(1350),
               new Exp(2760),
               new Exp(4200),
               new Exp(7650)
             ];
              
exports.checkLevel = function(){
    var selectedCharacter = createdCharacters[indexAtCharacter],
        currentLevel = this.levels[selectedCharacter.level - 1];
    
    if(selectedCharacter.level >= 10)
        return;
    
    if(selectedCharacter.exp >= currentLevel.maxExp){
        selectedCharacter.exp -= currentLevel.maxExp;
        selectedCharacter.level +=1;
        ctx.point(0, 10, selectedCharacter.level + ' 42');
    }
}
              

function Exp(maxExp){
    this.currentExp = 0;
    this.maxExp = maxExp;
}
              
