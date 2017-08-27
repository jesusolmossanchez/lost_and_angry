

/**************************************************
** GAME Boss CLASS
**************************************************/
var Boss = function(juego, x, y, gravedad, impulso) {

    this.que_pie                = 0;
    this.angulo                 = 0;
    this.size_boss_pixel        = 40;
    this.x                      = x;
    this.y                      = y;
    this.alto_                  = this.size_boss_pixel * 12;
    this.ancho_                 = this.size_boss_pixel * 6 + 5;
    this.dx                     = 0;
    this.dy                     = 0;


    //TODO: Cambiar esto
    this.friction               = 7000000000000;
    this.accel                  = 500;
    this.shoot_back             = 1500;
    this.impulse_               = 30000;   

    this.last_left              = false;
    
    this.gravity_               = gravedad;

    this.tiempo_saltando_       = juego.timestamp_();

    this.maxdx_                 = 140;
    this.maxdy_                 = 500;

    this.limite_derecha_        = juego.ancho_total_ + this.ancho_;
    this.limite_izquierda_      = - this.ancho_;

    this.no_dispares_counter_   = 0;

    this.izquierdo_             = (Math.random()>0.5)?true:false;
    this.tiempo_parado_         = juego.timestamp_();
    this.muriendo               = juego.timestamp_();




 

    this.update = function(dt) {

        
    };

    this.pinta_boss_ = function(dt, ctx, counter) {
        //Posición
        var x_player = this.x + (this.dx * dt);
        var y_player = this.y + (this.dy * dt);


        var player_izq =  [
                        [  ,  ,  ,  , 1,  ],
                        [ 1, 1, 1, 1, 1,  ],
                        [ 1, 1, 1, 1, 1,  ],
                        [  ,  , 1, 1, 1,  ],
                        [ 1, 1, 1, 1, 1,  ],
                        [ 1, 1, 1, 1, 1,  ],
                        [ 1, 1, 1, 1, 1,  ],
                        [ 1, 1, 1, 1, 1,  ],
                        [ 1, 1, 1, 1, 1,  ],
                        [ 1, 1, 1, 1, 1,  ],
                        [ 1, 1, 1, 1, 1, 1],
                        [  ,  ,  ,  ,  ,  ],
                ];



        var pieses = [];
        pieses[0] = [[  ,  , 1,  ,  , 1,  ]];
        pieses[1] = [[  ,  , 1,  , 1,  ,  ]];
        pieses[2] = [[ 1,  ,  , 1,  ,  ,  ]];
        pieses[3] = [[  , 1,  , 1,  ,  ,  ]];
       
        this.que_pie = 3;
        


       
        que_jugador = player_izq;
        
        juego.pinta_filas_columnas_(ctx, x_player, y_player, que_jugador, this.size_boss_pixel, "#ff0000");
        //Pinta pies
        juego.pinta_filas_columnas_(ctx, x_player, y_player + this.alto_ - this.size_boss_pixel, pieses[this.que_pie], this.size_boss_pixel, "#ff0000");
  

       

    };


    this.colisiona_player_ = function() {
        return juego.overlap_(this.x, this.y, this.ancho_, this.alto_, juego.player_.x, juego.player_.y, juego.player_.ancho_, juego.player_.alto_);
    };

};
