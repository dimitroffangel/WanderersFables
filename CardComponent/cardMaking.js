// importing

// OOP for the card

exports.Card = function(mana, attack, defence, special, name){
    this.mana = mana;
    this.attack = attack;
    this.defence = defence;
    this.initialHealth = defence;
    this.name = name;
    this.special = special;
    
    this.isDredge = false;
    
    this.turnSpawn = turnCount;
    this.isInitialized = false;
    
    // boons
    this.canAttack = true;
    this.recieveSpell = true;
    this.isVulnerable = undefined;
    this.canBleed = undefined;
    this.canImmobile = undefined;
    this.canStealth = undefined;
    this.canInspire = undefined;
    this.canKnockdown = undefined;
    this.hasDeathrattle = undefined;
    this.canWindfury = undefined;
    this.canBlock = undefined;
    this.canEnrage = undefined;
    
    // boons values
    this.cardEnrageAttackValue = undefined;
    this.cardEnrageDefenceValue = undefined;
    this.bleedValue = undefined;
    this.vulnerableValue = undefined;
    
    this.isOwned = true;
};

// creating the cards
// with every new line the mana cost raises

exports.allCards = [
        new this.Card(0, 2, 101, '', 'Mama'), 
        new this.Card(1, 1, 2, 'Vulnerable', 'Centaur Emissary'),
    
        new this.Card(2, 2, 2, 'Bleeding and Vulnerable', 'Stone Dwarf'),
        new this.Card(2, 2,3,'Enrage: Ettin has damage gaint + 3 attack', 'Ettin'),
        new this.Card(2, 2, 2, 'If it is not killed by 2 turns summon a copy of it',                           'Veteran Fleshreaver'),
        new this.Card(2, 2, 2, 'If you cast fire spell increase attack and defence',
                      'Pyromancer"s apprentice'), 
        new this.Card(2, 3, 2, 'Battlecry: Summon a random totem', 'Badazar"s Champion'),
        new this.Card(3, 2, 3, 'Immobile', 'Champion Harathi Warrior'),
        new this.Card(3, 2, 3, 'Stealth, While he is in stealth, Tervelan summons a 1/1'  
                     +  'bandit', 'Captain Tervelan'),    
        new this.Card(3, 2, 2, 'Inspire: Summon a 1/1 bird', 
                      'Veteran Dragon Tribe Grawl Hunter'),
         
        new this.Card(4, 4, 4, 'Taunt', 'Arx'),
        new this.Card(4, 1, 4, 'If Gort drops bellow 2 He becomes 5/5', 'Gort'),
        new this.Card(4, 4, 4, 'Bleeding', 'Modniir High Sage'),
        new this.Card(4, 2, 5, 'Blind, Vulnerable, At the end of your turn throw                       a bomb, dealing 2 damage, on random target', 'Kamikazeto99'),
        new this.Card(4, 4, 3, 'Battlecry: Each enemy dredge submits to your command',
                      'Rebel Alexsei'),
        new this.Card(4,2,4,'At the end of your turn heal randomly a card or your character', 
                      'Shaman of Caledon'),
        new this.Card(4, 3, 3, 'If Ogden Stonehealer is killed Vyacheslav                                 becomes 6/7', 'Vyacheslav'), 
        new this.Card(4, 3, 3, 'Battlecry: Give a minion +2/+2', 'Karamoleoff'),
        new this.Card(4, 2, 3, 'Battlecry: Shadowstep a random enemy field;',
                      'Pickpocket Master'),
        new this.Card(4, 5, 3, 'Battlecry: Swap a minions health with its damage', 'Fen'),
    
        new this.Card(5, 3, 5, 'Battlecry: Summon a War Beast','Modiniir Beastmater'),
        new this.Card(5, 2, 3, 'Battlecry: Summon a Turret', 'Dredge Siege Engineer'),
        new this.Card(5, 4, 6, 'Knockdown', 'Champion Ettin'),
        new this.Card(5, 2, 6, 'Knockdown, Berserk: +3', 'Brutish Ettin Chieftain'), 
        new this.Card(5, 5, 4, 'Taunt', 'Ert and Burt'),
        new this.Card(5, 4, 7, '', 'Veteran Dragon Tribe Graw Berserker'),
        new this.Card(5, 4, 4,'Battlecry: Summon a card from your hand', 'Graw Trapper'),
        new this.Card(5, 5, 5, 'Battlecry: Summon Beaker', 'Tomtom'),
    
        new this.Card(6, 6, 7, '', 'Tamini Mogul'),
        new this.Card(6, 0, 5, 'Deathrattle: Summon Carrion Weaver', 
                      'Carrion Sculpture'),
        new this.Card(6, 9, 6, 'Deathrattle: Summon Vempa for the enemy', 
                      'Giant Ettin'), 
        new this.Card(6,4,5, 'Deathrattle: Summon Ancient Creature', 'Arcanist Dremus'),
        new this.Card(6, 5, 5, 'Immobiles attacked enemy', 
                      'Veteran Dragon Tribe Grawl Shaman'),
        new this.Card(6, 3, 3, 'While attacking cannot be hit', 'Graw Raider'),
        new this.Card(6, 5, 7, '', 'Champion Kol Skullsmasher'),
    
        new this.Card(7, 3, 5, 'Deathrattle: Resummon him', 'Muttanjeff Marrowmash'),
        new this.Card(7,5,4, 'Battlecry: Fill the board with ettin body guards',
                      'Ettin Leader'),
   
        new this.Card(8, 6, 8, 'Taunt', 'Tamini Warrior'),
        // myami can be like ysera
        new this.Card(8, 5, 9, 
                'Taunt, Windfury, Block;Battlecry: Put Myami in your hand', 'Zommoros'), 
        new this.Card(8, 5,5, 'Deathrattle: Summon two raptors', 'Crazed Ettin'), 
        new this.Card(8, 6, 7,'Battlecry: Summon Fat Hands', 'Krug'),
        new this.Card(8,6,6,'Battlecry: All dwarves are transformed','Ogden Stonehealer'),
        new this.Card(9,7,5, 'Deathrattle: Summon The Destroyer of Worlds', 
                      'General Zadorojny'),
        new this.Card(9, 5, 5, 'Battlecry: Fill the board with Builders', 
                      'War Minister Shokov'),
        new this.Card(10, 10 ,10,'Taunt, Cannot be targeted from spells, cannot attack',
                      'Viggo'),
        new this.Card(10, 7, 7, 'Enemy cannot cast a spell, at the end of each turn inflict bleeding to the enemy hero and random vulnerable to enemy minion', 'Vassar'),
        new this.Card(10,7,7,'When a enemy card is summons a minion steal his speciality',
                      'Kasha Blackblood'),

    
        //dispersable cards (cards that are summoned but not by a players)
        new this.Card(0, 0, 3, 'Taunt', 'Wall Segment'),
        new this.Card(1, 2, 1, '', 'Falcon Outlaw'),
        new this.Card(1, 1, 1, 'After two turns summon a wall', 'Dredge Builder'),
        new this.Card(1, 1, 1, '', 'Bandit'),
        new this.Card(1, 1, 1, '', 'Bird'),
        new this.Card(1, 2, 1, '', 'Ettin Body Guard'),
        new this.Card(2, 2, 2, '', 'Raptor Pet'),
        new this.Card(2, 2, 2, '', 'War Beast'),
        new this.Card(2, 3, 2, 'Attack random Enemy', 'Dredge Turret'),
        new this.Card(2, 2, 3, '', 'Vempa'),
        new this.Card(3, 3, 4, '', 'Fat Hands'),
        new this.Card(3, 4, 4, '', 'Beaker'),
        new this.Card(6, 2, 4, 
        'Deathrattle: Resummon the minion with 2/2 and 4 Dredge Builders', 
                      'Ancient Creature'), 
        new this.Card(7, 6, 6, 'Double the healing amount', 'Priest of Dwayna'),
        new this.Card(8, 8, 8, 'Taunt', 'Carrion Weaver'),
        new this.Card(8, 6, 7, '', 'Kudu"s Monster'),
        new this.Card(9, 4, 6, 'Your hero gains random card', 'Myami'),
        new this.Card(9, 8, 8, 
        'At the end of your turn immobiles a random enemy and bleed the enemy hero', 
                      'The Destroyer of Worlds')];

exports.shuffleDecks = function(){
    // enemy deck
    var i,
        length = botDeck.length;
    for(i = 0; i < length; i+=1){
        var randomIndex = Math.round(Math.random() * (length - 1));
        var temp = botDeck[i];
        botDeck[i] = botDeck[randomIndex];
        botDeck[randomIndex] = temp;
    }
}

// to be sure I will not forget the uniq cards add the at the start of the game
exports.defineUniq_Cards = function(){
    uniqCards.push('Veteran Fleshreaver','Captain Tervelan','Kamikazeto99',
                   'Shaman of Caledon', 'Vyacheslav','The Destroyer of Worlds', 'Vassar');
}   