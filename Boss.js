

/**************************************************
** GAME Boss CLASS
**************************************************/
var Boss = function(juego, x, y, gravedad, impulso) {

    this.que_pie                = 0;
    this.angulo                 = 0;
    this.size_boss_pixel        = 30;
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

    this.last_left_              = false;
    
    this.gravity_               = gravedad;

    this.tiempo_saltando_       = juego.timestamp_();

    this.maxdx_                 = 140;
    this.maxdy_                 = 500;

    this.limite_derecha_        = juego.ancho_total_ + this.ancho_/2;
    this.limite_izquierda_      = juego.ancho_total_ * 0.65;

    this.no_dispares_counter_   = 0;

    this.tiempo_movimiento_         = juego.timestamp_();


    this.muerto                 = false;
    this.muriendo               = juego.timestamp_();


    this.tiempo_herido_         = juego.timestamp_();

    this.salud_inicial_         = 2000;
    this.salud_                 = this.salud_inicial_;




 

    this.update_ = function(dt) {

        if(this.salud_ < 0){
            juego.game_over_(true);
            return;
        }

        if(this.tiempo_herido_ > juego.timestamp_()){
            --this.salud_;
        }

        this.centro_x = this.x + this.ancho_/2;
        this.centro_y = this.y + this.alto_/2;

        this.wasleft    = this.dx  < 0;
        this.wasright   = this.dx  > 0;

        var friction   = this.friction * (this.falling ? 0.2 : 1);
        var accel      = this.accel;

        //reseteo las velocidades
        this.ddx = 0;
        this.ddy = this.gravity_;


        var colisiona = false;
        if(this.colisiona_player_() && !this.muerto){
            juego.player_.salud_--;
            juego.player_.tiempo_atacado_ = juego.timestamp_() + 2000;
        }

        if(juego.timestamp_() > this.tiempo_movimiento_){
            this.controla_der_izq_();
            this.tiempo_movimiento_ = juego.timestamp_() + Math.random()*5000;
        }
           
        if (this.left_){
          this.ddx = this.ddx - accel;
          this.last_left_ = true;
        }
        else if (this.wasleft){
          this.ddx = this.ddx + friction;
        }
      
        else if (this.right_){
          this.ddx = this.ddx + accel;
          this.last_left_ = false;
        }
        else if (this.wasright){
          this.ddx = this.ddx - friction;
        }


        //Salto
        if (this.controla_salta_() && !this.jumping && this.tiempo_saltando_ < juego.timestamp_()){
            this.ddy = this.ddy - this.impulse_; 
            this.jumping = true;
            this.falling = true;
            this.tiempo_saltando_ = juego.timestamp_() + 300;
        }


        if(this.controla_dispara_()){

            juego.zapatillas_.push(
                new Zapatilla(this.x, this.y, 0, 0, juego, this)
            );

        }

  
        this.x  = this.x  + (dt * this.dx);
        this.y  = this.y  + (dt * this.dy);

        this.dx = juego.bound_(this.dx + (dt * this.ddx), -this.maxdx_, this.maxdx_);
        this.dy = juego.bound_(this.dy + (dt * this.ddy), -this.maxdy_, this.maxdy_);

        if ((this.wasleft  && (this.dx > 0)) ||
            (this.wasright && (this.dx < 0))) {
          this.dx = 0; // clamp at zero to prevent friction from making us jiggle side to side
        }

        //SI va pabajo
        if (this.dy >= 0) {
            if(this.y + this.alto_ > juego.alto_total_){
                this.y = juego.alto_total_ - this.alto_;
                this.dy = 0;
                this.jumping = false;
                this.falling = false;
            }
        }
        
        //Si va a la derecha
        
        if (this.dx > 0) {

            if(this.x + this.ancho_ >= this.limite_derecha_){
                this.x = this.limite_derecha_ - this.ancho_;
            }
        }
        //Si va a la izquierda
        else if (this.dx < 0) {

            if(this.x <= this.limite_izquierda_){
                this.x = this.limite_izquierda_;
            }
        }
        
        
    };

    this.pinta_boss_ = function(dt, ctx, counter) {
        //Posición
        var x_boss = this.x + (this.dx * dt);
        var y_boss = this.y + (this.dy * dt);

        var color_boss = "#000000";

        if(this.tiempo_herido_ > juego.timestamp_()){
            color_boss = "#fff000";

            var diff_atacado = this.tiempo_herido_ - juego.timestamp_();
            
            var opacidad = diff_atacado/2000;

            var ancho_cargador = this.ancho_*1.2;
            var alto_cargador = 20;
            var percent = this.salud_/this.salud_inicial_;
            
            ctx.fillStyle="rgba(11, 204, 0, "+opacidad+")";
            if(percent < 0.8){
                ctx.fillStyle="rgba(224, 239, 20, "+opacidad+")";
            }
            if(percent < 0.6){
                ctx.fillStyle="rgba(204, 199, 0, "+opacidad+")";
            }
            if(percent < 0.4){
                ctx.fillStyle="rgba(239, 92, 20, "+opacidad+")";
            }
            if(percent < 0.2){
                ctx.fillStyle="rgba(255, 0, 0, "+opacidad+")";
            }

            ctx.fillRect(x_boss - this.ancho_*0.2, y_boss - 40, percent * ancho_cargador, alto_cargador);

            ctx.strokeStyle= "rgba(255,255,255,"+opacidad+")";
            ctx.lineWidth=2;

            ctx.strokeRect(x_boss - this.ancho_*0.2, y_boss - 40, ancho_cargador, alto_cargador);
        }


        var boss_pinta =  [
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
        var bata =  [
                        [  ,  ,  ,  ,  ,  ],
                        [  ,  ,  ,  ,  ,  ],
                        [  ,  ,  ,  ,  ,  ],
                        [  ,  ,  ,  ,  ,  ],
                        [  ,  ,  ,  , 1,  ],
                        [  ,  ,  , 1, 1,  ],
                        [ 1, 1, 1, 1, 1,  ],
                        [ 1, 1, 1, 1, 1,  ],
                        [ 1, 1, 1, 1, 1,  ],
                        [  , 1, 1, 1, 1,  ],
                        [  ,  ,  ,  ,  ,  ],
                        [  ,  ,  ,  ,  ,  ],
                ];


        var zapatilla = [
            [  ,  ,  ,  ,  ,  ,  ,  ],
            [  ,  ,  ,  ,  ,  ,  ,  ],
            [  ,  ,  , 1, 1,  ,  ,  ],
            [  , 1, 1, 1, 1,  ,  ,  ],
            [ 1, 1, 1, 1, 1,  ,  ,  ],
            [ 1, 1, 1, 1, 1, 1, 1, 1],
            [  ,  ,  ,  ,  ,  ,  ,  ],
            [  ,  ,  ,  ,  ,  ,  ,  ],
        ];



        var pieses = [];
        pieses[0] = [[  ,  , 1,  ,  , 1,  ]];
        pieses[1] = [[  ,  , 1,  , 1,  ,  ]];
        pieses[2] = [[ 1,  ,  , 1,  ,  ,  ]];
        pieses[3] = [[  , 1,  , 1,  ,  ,  ]];
       
        this.que_pie = 3;
        


       
        que_jugador = boss_pinta;

        //var color_rosa = "#fb6e8f";
        var color_rosa = "#ffcad6";
        
        //Pinta cuerpo
        juego.pinta_filas_columnas_(ctx, x_boss, y_boss, que_jugador, this.size_boss_pixel, color_boss, true);

        //Pinta bata
        juego.pinta_filas_columnas_(ctx, x_boss - 10, y_boss - 10, bata, this.size_boss_pixel*1.1, color_rosa, true);

        //Pinta pies
        juego.pinta_filas_columnas_(ctx, x_boss, y_boss + this.alto_ - this.size_boss_pixel, pieses[this.que_pie], this.size_boss_pixel, color_boss, true);

        var zapa_size = 8;
        //Pinta zapatillas
        juego.pinta_filas_columnas_(ctx, x_boss, y_boss + this.alto_ - this.size_boss_pixel - 15, zapatilla, zapa_size, color_rosa, true);
        juego.pinta_filas_columnas_(ctx, x_boss + (this.size_boss_pixel*2), y_boss + this.alto_ - this.size_boss_pixel - 15, zapatilla, zapa_size, color_rosa, true);

        //Pinta rulos
        /*
        ctx.beginPath();
        ctx.fillStyle = color_rosa;
        ctx.arc(x_boss + (this.size_boss_pixel*2), y_boss + (this.size_boss_pixel*1.5), this.size_boss_pixel, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
        */

    };


    this.colisiona_player_ = function() {
        return juego.overlap_(this.x, this.y, this.ancho_, this.alto_, juego.player_.x, juego.player_.y, juego.player_.ancho_, juego.player_.alto_);
    };


    this.controla_salta_ = function() {
        var salta = (Math.random()>0.99)?true:false;
        return salta;
    };


    this.controla_dispara_ = function() {
        var dispara = (Math.random()>0.97)?true:false;
        return dispara;
    };


    this.controla_der_izq_ = function() {
        this.left_ = false;
        this.right_ = false;
        var rando_mov = Math.random();

        if(rando_mov > 0.6){
            this.left_ = true;
        }
        else if(rando_mov > 0.3){
            this.right_ = true;
        }
    };

};
