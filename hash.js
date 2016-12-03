const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.emitKeypressEvents(process.stdin);
if(process.stdin.isTTY)
    process.stdin.setRawMode(true);

function main(){
    rl.question('wtf', function(answer){
        console.log(answer);
        rl.close();
    });
}

main();