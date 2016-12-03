var variables = require('./GameFunds/variables'),
   // gameMenu = require('./GameMenu/gameMenu'),
    input = require('./GameFunds/input');


// these funds are core actions in order the game to play smoothly

function loadFunds(){
    ctx.clear();
    ctx.cursor.off();
}


function main(){
    variables.getRequest();
    loadFunds();
    //gameMenu.loadMenu();
}

main();