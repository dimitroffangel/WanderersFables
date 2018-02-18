//importing variables
var variables = require('../GameFunds/variables');

exports.upgradeSkills = function(character){
    
    // basic skills
    if(character.level >= 1){
        
        character.spells.push({name: 'Repair a field', cost: 2,
                               description:'', lastTimeCast:0, cooldown: 2});
        character.spells.push({name: 'Fireball', cost: 0, 
                               description: 'DES', type: 'fire',
                             lastTimeCast: 0, cooldown: 2});
        character.spells.push({name:'Blinding Ashes', cost:3,
                               description: 'DES', lastTimeCast: 0, cooldown:0});
        
        character.spells.push({name:'Burning Rage', cost:5, lastTimeCast:0, cooldown: 0,
                               description:'Deal more damage to burning foes'});
        /*
        character.spells.push({name:'Burning Fire', cost:3, lastTimeCast: 0, cooldown:0,
                    description:'Gain 3 damage with your hero if you have condition on you'});
        
        character.spells.push({name:'Zephyr"s Speed', cost: 1, lastTimeCast: 0, cooldown: 0,
                              description:'Give windfury to a minion or a character'});
        
        character.spells.push({name:'Zephyr"s Boon', cost:2, lastTimeCast: 0, cooldown: 0,
                              description: 'Give a shield'});
        
        character.spells.push({name:'Tempest Defence', cost: 8, lastTimeCast: 0, cooldown:0,
                            description: 'Unleash a storm for every card on field'});
        character.spells.push({name:'Bolt to the hearth', cost:0, lastTimeCast:0, cooldown:0,
                                desription: 'Deal 3 to the enemy Hero if your he is less than'
                                +'15 health deal 6'});
        character.spells.push({name:'Lightning Rod', cost:0, lastTimeCast:0, cooldown:0,
                              description:'If a the targetted field is disabled deal 5 damage' 
                               +'to the minion on it (if there is)'});
        character.spells.push({name:'Earth"s embrace', cost:0, lastTimeCast:0, cooldown:0,
                           description:'If your character is bellow half give him 10 armor'});
        character.spells.push({name:'Elemental shielding', cost:0, lastTimeCast:0, cooldown:0,
                               description:'Gain two armor'});
        character.spells.push({name:'Strength of stone', cost:0,lastTimeCast:0,cooldown:0,
                               description:'Strength of stone'});
        character.spells.push({name:'Diamond Skin', cost:0,lastTimeCast:0,cooldown:0,
                               description:'If you have curse remove it if you are above the'+
                               'threshold'});
        character.spells.push({name:'Piercing Shards', cost:0,lastTimeCast:0,cooldown:0,
                               description:'Deal 1 damage to all enemy minions, if they are' +
                               'already vulnerable raise damage to 2'});
        character.spells.push({name:'Earth shield',cost:0,lastTimeCast:0,cooldown:0,
                              description:'Recieve 3/5 weapon while it equiped you gain armor' 
                               +'each turn'});
        character.spells.push({name:'Flame axe',cost:0,lastTimeCast:0,cooldown:0,
                    description:'Recieve 3/5 weapon which grants +2 power to burning spells'});
        character.spells.push({name:'Frost Bow',cost:0,lastTimeCast:0,cooldown:0,
                            description:'Recieve 3/5 weapon which grants +2 healing power'});
                            */
        character.spells.push({name:'Thor"s hammer',cost:0,lastTimeCast:0,cooldown:0,
                               description:'Recieve 3/5 weapon which grants windfury'});
        
        /* when traps are casted they are pushed in to a vector, when the user character is             
        attacked they are unleashed MUHHAHHAH AND ALL WILL SUFFFFFFFFFFFFFFFFFFFFFFER
        */
        character.spells.push({name:'Medussa"s trap',cost:0, lastTimeCast:0,cooldown:0,
                               description:'If your hero is attacked disable the field from'+                                   'which the enemy has attacked', isTrap:true});
        character.spells.push({name:'Flame cage',cost:0,lastTimeCast:0,cooldown:0, isTrap:true,
                               description:'If your hero is attacked set the field on fire'});
        character.spells.push({name:'Burning Step',cost:0,lastTimeCast:0,cooldown:0,
                               description:'If your hero is attacked a fire wave damages your'+ 
                               'enemies for 2 damage', isTrap:true});
        character.spells.push({name:'Companion fortification',cost:0,lastTimeCast:0,cooldown:0,
                               description:'Summon Arx', isTrap:true});
    }
        
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