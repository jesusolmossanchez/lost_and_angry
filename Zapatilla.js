/**************************************************
*** Zapatilla CLASSes
**************************************************/
var Zapatilla = function(x, y, dx, dy, juego, boss) {

    this.x = x - boss.ancho_/4;
    var alto_boss = Math.floor(boss.alto_/3);
    this.y    = y + boss.alto_/2 + juego.randInt_(-alto_boss,alto_boss);

    this.size = 1;
    var negativo = -1;
    this.angulo   = 90;
    this.xv   = (0.5 + Math.random()) * negativo * 5 + dx;
    this.yv   = (Math.random() - 0.5) * 7 + dy;


};

