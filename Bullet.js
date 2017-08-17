/**************************************************
*** BULLET CLASSes
**************************************************/
var Bullet = function(x, y, derecha, juego, jugador) {
    this.x    = x;
    this.y    = y + jugador.alto_/2;
    var negativo = 1;
    var x_disparo = this.x + jugador.ancho_ + 15;
    if(!derecha){
        negativo = -1;
        x_disparo = this.x - jugador.ancho_ + 15;
    }
    
    this.x = x_disparo;
    
    this.size = 1;
    this.xv   = negativo * 35;
    this.yv   = (Math.random() - 0.5) * 8;


};

