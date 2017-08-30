/**************************************************
*** Zapatilla CLASSes
**************************************************/
var Zapatilla = function(x, y, dx, dy, juego, boss) {



    x_disparo = 

    this.x = x - boss.ancho_/4;
    var alto_boss = Math.floor(boss.alto_/5);
    this.y    = y + boss.alto_/2 + juego.randInt_(-alto_boss,alto_boss);
    this.y    = y + boss.alto_/2 + juego.randInt_(-alto_boss,alto_boss);

    
    
    
    
    this.size = 1;
    var negativo = -1;
    this.angulo   = 90;
    this.xv   = negativo * 15 + dx;
    this.yv   = (Math.random() - 0.5) * 15 + dy;


};

