var variables = require('./GameFunds/variables'),
   input = require('./GameFunds/input');


// these funds are core actions in order the game to play smoothly

function loadFunds(){
    ctx.clear();
    ctx.cursor.off();
}



function main(){
    socket.on('connect', function(data){});

    var startTime;
  //  variables.getRequest();
    loadFunds();
    
}

main();