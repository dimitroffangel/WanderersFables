//importing variables
var variables = require('../GameFunds/variables');

exports.upgradeSkills = function(character){
    
    // basic skills
    if(character.level >= 1)
        character.spells.push({name: 'Fireball', cost: 2, 
                               description: 'DES', type: 'fire',
                             lastTimeCast: 0, cooldown: 0});
    
    if(character.level >= 3)
        character.spells.push({name:'Water Blast', cost: 2,
                               description: 'DES', type: 'water', 
                               lastTimeCast: 0, cooldown: 0});
    
    if(character.level >= 5)
        character.spells.push({name: 'Chain Lightning', cost: 2,
                          description: 'DES', type: 'air',
                               lastTimeCast: -2, cooldown: 2});
    
    if(character.level >= 7)
        character.spells.push({name: 'Stoning', cost: 2,
                               description: 'DES', type: 'earth',
                               lastTimeCast: -2, cooldown: 2});
    
    
    this.showSkillTree(undefined, character);
}

exports.showSkillTree = function(key, character){
    ctx.clear();
    var skills  = character.skillsTrees[indexOnSkillTree].skills,
        i,
        length = skills.length;
    
    for(i = 0; i < length; i+=1){
        if(skills[i].learned)
            ctx.point(0, i + 1, skills[i].name + ' V ');
    }
}

exports.initilizeElementalistSkills = function (){
    // fire
    initilizeFireSkills();
}

// Fire
function initilizeFireSkills(){
    elementalistSkillTrees[0] = {name:'Fire', skills:[]};
    var fireSkills = elementalistSkillTrees[0];
    
    // adding the fire skills
    fireSkills.skills[0] = 
        {name: 'Empowering Flame', detail: 'Gain power in fire attunement', 
         learned: true};
    fireSkills.skills[1] = 
        {name: 'Burning Fire', detail: 'Clear a condition', learned: true};
    fireSkills.skills[2] = 
        {name: 'Burning Precisions', detail: 'Critical hits have a chance to cause burning and burning last longer', learned: false};
    fireSkills.skills[3] = 
        {name: 'Pyromancer"s Training', detail: 'Deal more damage while attuned to fire. Reduce recharge on all fire skills', learned: false};
    fireSkills.skills[4] = 
        {name: 'Power Overwhelming', detail: 'Gain condition damage  based on your power', learned: false};
    fireSkills.skills[5] = 
        {name: 'Burning Rage', detail: 'Deal more damage to burning  foes', 
         learned: false};
    fireSkills.skills[6] = 
        {name: 'Blinding Ashes', detail: 'Blind foes you burn', learned: false};
    fireSkills.skills[7] = 
        {name: 'Pyromancer"s Puissance', detail: 'Each skill you use  while attuned to fire grants you might', learned: false};
    
}