

/**************************************************
** GAME Boss CLASS
**************************************************/
var Boss = function(juego, x, y, gravedad, impulso) {

    this.que_pie_                = 0;
    this.angulo_                 = 0;
    this.size_boss_pixel_        = 30;
    this.x                      = x;
    this.y                      = y;
    this.alto_                  = this.size_boss_pixel_ * 12;
    this.ancho_                 = this.size_boss_pixel_ * 6 + 5;
    this.dx                     = 0;
    this.dy                     = 0;


    //TODO: Cambiar esto
    this.friction_               = 7000000000000;
    this.accel_                  = 500;
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
    this.muriendo_               = juego.timestamp_();


    this.tiempo_herido_         = juego.timestamp_();

    this.salud_inicial_         = 2500;
    this.salud_                 = this.salud_inicial_;

    this.tiempo_terremoto_       = juego.timestamp_();




 

    this.update_ = function(dt) {

        if(juego.wait_start_ + 1500 > juego.timestamp_()){
            return;
        }

        if(this.salud_ < 0  && !this.pre_game_over_){
            this.salud_ = 2000;
            juego.game_over_(true);
            return;
        }

        if(this.tiempo_herido_ > juego.timestamp_()){
            --this.salud_;
        }

        this.centro_x_ = this.x + this.ancho_/2;
        this.centro_y_ = this.y + this.alto_/2;

        this.wasleft_    = this.dx  < 0;
        this.wasright_   = this.dx  > 0;

        var friction_   = this.friction_ * (this.falling ? 0.2 : 1);
        var accel_      = this.accel_;

        //reseteo las velocidades
        this.ddx = 0;
        this.ddy = this.gravity_;


        var colisiona = false;
        if(this.colisiona_player_() && !this.muerto && !juego.is_game_over_){
            juego.player_.salud_--;
            juego.player_.suena_herida_();

            juego.explosions_.push(
                new Explosion(juego.player_.centro_x_, juego.player_.centro_y_, true)
            );
            juego.player_.tiempo_atacado_ = juego.timestamp_() + 2000;
        }

        if(juego.timestamp_() > this.tiempo_movimiento_){
            this.controla_der_izq_();
            this.tiempo_movimiento_ = juego.timestamp_() + Math.random()*5000;
        }
           
        if (this.left_){
          this.ddx = this.ddx - accel_;
          this.last_left_ = true;
        }
        else if (this.wasleft_){
          this.ddx = this.ddx + friction_;
        }
      
        else if (this.right_){
          this.ddx = this.ddx + accel_;
          this.last_left_ = false;
        }
        else if (this.wasright_){
          this.ddx = this.ddx - friction_;
        }


        //Salto
        if (this.controla_salta_() && !this.jumping && this.tiempo_saltando_ < juego.timestamp_() && !juego.is_game_over_){
            this.ddy = this.ddy - this.impulse_; 
            this.jumping = true;
            this.falling = true;
            this.tiempo_saltando_ = juego.timestamp_() + 300;
        }


        if(this.controla_dispara_() && !juego.is_game_over_){

            juego.zapatillas_.push(
                new Zapatilla(this.x, this.y, 0, 0, juego, this)
            );

        }

  
        this.x  = this.x  + (dt * this.dx);
        this.y  = this.y  + (dt * this.dy);

        this.dx = juego.bound_(this.dx + (dt * this.ddx), -this.maxdx_, this.maxdx_);
        this.dy = juego.bound_(this.dy + (dt * this.ddy), -this.maxdy_, this.maxdy_);

        if ((this.wasleft_  && (this.dx > 0)) ||
            (this.wasright_ && (this.dx < 0))) {
          this.dx = 0; // clamp at zero to prevent friction_ from making us jiggle side to side
        }

        //SI va pabajo
        if (this.dy >= 0) {
            if(this.y + this.alto_ > juego.alto_total_){
                this.y = juego.alto_total_ - this.alto_;
                this.dy = 0;
                if(this.jumping ){
                    this.tiempo_terremoto_ = juego.timestamp_() + juego.tiempo_terremoto_fix_;
                    juego.tiempo_shacke_ = juego.timestamp_() + juego.tiempo_terremoto_fix_;
                }
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


        if(juego.wait_start_ + 3000 > juego.timestamp_()){
            juego.radio_vision_ = 400;
            this.pinta_where_();
        }
        else{
            juego.radio_vision_ = 300;
        }

        if(juego.is_game_over_ && !juego.you_win_){
            this.pinta_go_bed_();
        }


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
       
        this.que_pie_ = 3;
        

        if(juego.you_win_){
            ctx.save();

            ctx.translate(x_boss + this.ancho_/2, y_boss + this.alto_/2);
            x_boss = 50;
            y_boss = -200;
            ctx.rotate(90*Math.PI/180);
        }
       
        que_jugador = boss_pinta;

        //var color_rosa = "#fb6e8f";
        var color_rosa = "#ffcad6";
        
        //Pinta cuerpo
        juego.pinta_filas_columnas_(ctx, x_boss, y_boss, que_jugador, this.size_boss_pixel_, color_boss, true);

        //Pinta bata
        juego.pinta_filas_columnas_(ctx, x_boss - 10, y_boss - 10, bata, this.size_boss_pixel_*1.1, color_rosa, true);

        //Pinta pies
        juego.pinta_filas_columnas_(ctx, x_boss, y_boss + this.alto_ - this.size_boss_pixel_, pieses[this.que_pie_], this.size_boss_pixel_, color_boss, true);

        var zapa_size = 8;
        //Pinta zapatillas
        juego.pinta_filas_columnas_(ctx, x_boss, y_boss + this.alto_ - this.size_boss_pixel_ - 15, zapatilla, zapa_size, color_rosa, true);
        juego.pinta_filas_columnas_(ctx, x_boss + (this.size_boss_pixel_*2), y_boss + this.alto_ - this.size_boss_pixel_ - 15, zapatilla, zapa_size, color_rosa, true);

        
        if(juego.you_win_){
            ctx.restore();
        }

    };


    this.colisiona_player_ = function() {
        return juego.overlap_(this.x, this.y, this.ancho_, this.alto_, juego.player_.x, juego.player_.y, juego.player_.ancho_, juego.player_.alto_);
    };


    this.controla_salta_ = function() {
        var salta = (Math.random()>0.998)?true:false;
        return salta;
    };


    this.controla_dispara_ = function() {
        var dispara = (Math.random()>0.965)?true:false;
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



    this.pinta_where_ = function(){
        
        var where =  [
                        [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,1],
                        [ 1,  ,  , 1, 1,  ,  ,  ,  ,  , 1, 1,  , 1, 1,  , 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  ,  , 1, 1, 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1, 1, 1,  ,  , 1],
                        [ 1,  ,  , 1, 1,  ,  , 1,  ,  , 1, 1,  , 1, 1,  , 1,  , 1, 1,  ,  ,  , 1, 1,  , 1,  ,  , 1, 1,  ,  ,  ,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  ,  ,  ,  , 1],
                        [ 1,  ,  ,  , 1,  ,  , 1,  ,  , 1, 1,  , 1, 1, 1, 1,  , 1, 1, 1,  ,  , 1, 1,  , 1,  ,  , 1, 1, 1,  ,  ,  ,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1, 1,  ,  ,  , 1],
                        [ 1,  ,  ,  ,  , 1,  , 1,  , 1, 1,  ,  , 1, 1,  , 1,  , 1, 1,  ,  ,  , 1, 1, 1, 1,  ,  , 1, 1,  ,  ,  ,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  ,  , 1, 1, 1,  , 1, 1,  ,  ,  ,  , 1],
                        [ 1,  ,  ,  ,  ,  , 1,  , 1,  ,  ,  ,  , 1, 1,  , 1,  , 1, 1, 1, 1,  , 1, 1,  ,  , 1,  , 1, 1, 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  ,  ,  , 1,  ,  , 1, 1, 1, 1,  ,  , 1],
                        [ 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],                       
                        [ 1,  ,  , 1,  ,  ,  , 1,  , 1, 1, 1, 1,  , 1, 1,  , 1,  ,  , 1, 1, 1,  ,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  ,  , 1,  , 1, 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  ,  ,  ,  , 1],
                        [ 1,  ,  ,  , 1, 1, 1,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  ,  , 1, 1,  , 1,  , 1, 1,  ,  ,  , 1, 1,  ,  ,  , 1, 1, 1,  , 1,  , 1, 1,  ,  ,  ,  , 1,  ,  ,  ,  , 1,  ,  ,  ,  , 1],
                        [ 1,  ,  ,  ,  , 1, 1,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  ,  , 1, 1, 1, 1,  , 1, 1, 1,  ,  , 1, 1, 1,  ,  , 1, 1, 1, 1, 1,  , 1, 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  ,  ,  ,  , 1],
                        [ 1,  ,  ,  ,  , 1, 1,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  ,  , 1, 1,  , 1,  , 1, 1,  ,  ,  , 1, 1,  ,  ,  , 1, 1,  , 1, 1,  , 1, 1,  , 1, 1,  ,  ,  , 1, 1,  ,  ,  ,  ,  ,  , 1],
                        [ 1,  ,  ,  ,  , 1, 1,  ,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  ,  , 1, 1, 1,  ,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  ,  , 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1, 1,  , 1, 1,  ,  ,  , 1, 1,  ,  ,  ,  ,  ,  , 1],
                        [ 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  , 1],
                        [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1,  , 1],
                        [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1, 1],
                        [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                ];

        var size_where = 3;
        var x_where = this.x - 200;
        var y_where = this.y - 50;

        juego.pinta_filas_columnas_(juego.ctx, x_where, y_where, where, size_where, "#ffffff");
    }



    this.pinta_go_bed_ = function(){
        
        var where =  [
                        [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1,  ,  , 1, 1, 1, 1, 1,  , 1, 1, 1, 1,  ,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  ,  , 1, 1, 1,  ,  , 1, 1, 1, 1,  , 1, 1, 1,  ,  , 1, 1,  , 1, 1,  , 1, 1,  , 1],
                        [ 1,  ,  , 1, 1,  ,  ,  ,  , 1, 1,  , 1,  ,  ,  , 1, 1,  ,  , 1, 1,  , 1,  ,  , 1, 1,  , 1,  , 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1,  , 1, 1,  , 1, 1,  , 1],
                        [ 1,  ,  , 1, 1,  , 1, 1,  , 1, 1,  , 1,  ,  ,  , 1, 1,  ,  , 1, 1,  , 1,  ,  , 1, 1, 1, 1,  , 1, 1, 1,  ,  , 1, 1,  , 1,  , 1, 1,  , 1, 1,  , 1, 1,  , 1],
                        [ 1,  ,  , 1, 1,  ,  , 1,  , 1, 1,  , 1,  ,  ,  , 1, 1,  ,  , 1, 1,  , 1,  ,  , 1, 1,  , 1,  , 1, 1,  ,  ,  , 1, 1,  , 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1,  ,  , 1, 1, 1, 1, 1,  , 1, 1, 1, 1,  ,  ,  , 1, 1,  ,  , 1, 1, 1, 1,  ,  , 1, 1, 1,  ,  , 1, 1, 1, 1,  , 1, 1, 1,  ,  , 1, 1,  , 1, 1,  , 1, 1,  , 1],
                        [ 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],                       
                        [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  , 1],
                        [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1,  , 1],
                        [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1, 1],
                        [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                ];

        var size_where = 7;
        var x_where = this.x - 350;
        var y_where = this.y - 100;

        juego.pinta_filas_columnas_(juego.ctx, x_where, y_where, where, size_where, "#ffffff");
    }

};
