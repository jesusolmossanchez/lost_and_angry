/**************************************************
*** BULLET CLASSes
**************************************************/
var Bullet = function(x, y, derecha, juego, jugador) {
    this.x    = x;
    this.y    = y + jugador.alto_/2;
    var negativo = 1;
    if(!derecha){
        negativo = -1;
    }
    
    this.x = this.x + negativo * jugador.ancho_ * 1.8;
    
    this.size = 1;
    this.xv   = negativo * 15;
    this.yv   = (Math.random() - 0.5) * 4;


};

