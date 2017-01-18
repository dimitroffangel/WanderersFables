var variables = require('../GameFunds/variables');

exports.loadMenu = function (){   
    ctx.clear();
    drawMenuOptions();
    
    ctx.point(width - 20, 0, differentOptions[currentModeIndex]);
}


// print the variety the user has
function drawMenuOptions(){
    var i,
        length = this.differentOptions.length;
    
    for(i = 0; i < length; i+=1){
        ctx.bg(255, 0, 0);
        ctx.box(boxX,  boxY + (i + 1) * height* 0.13, boxWidth, boxHeight);
    
        ctx.text(boxX, boxY + (i + 1) * height*0.13,'\t' + differentOptions[i]);
        
        ctx.cursor.restore();
        console.log('\n');
    }
}