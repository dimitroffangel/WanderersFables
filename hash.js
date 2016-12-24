const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.emitKeypressEvents(process.stdin);
if(process.stdin.isTTY)
    process.stdin.setRawMode(true);

function main(){
    var reg = new RegExp('[0-9]+$');
    var text = 'mama#1234';
    var substrinText = text.substr(text.length - 5);
    console.log(substrinText + ' pattern of text');
    console.log(text);
    
        var output = reg.test(substrinText);
        console.log(output && substrinText.length == 5 && substrinText[0] == '#');
}

main();