exports.loadMenu = function (){
    ctx.clear();
    drawMenuOptions();
    ctx.point(width - 20, 0, this.differentOptions[currentModeIndex]);
}

exports.differentOptions = ['Play Game', 'Alter of Heroes', 'Forge', 
                            'Training', 'Options', 'Exit'];


// print the variety the user has
function drawMenuOptions(){
    var i,
        length = gameMenu.differentOptions.length;
    
    for(i = 0; i < length; i+=1){
        ctx.bg(255, 0, 0);
        ctx.box(boxX,  boxY + (i + 1) * 4, boxWidth, boxHeight);
        
        ctx.text(boxX, boxY + (i + 1) * 4,'\t' +  gameMenu.differentOptions[i]);
        
        ctx.cursor.restore();
        console.log('\n');
    }
}