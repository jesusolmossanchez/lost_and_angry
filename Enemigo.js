

/**************************************************
** GAME Enemigo CLASS
**************************************************/
var Enemigo = function(juego, x, y, tipo) {

    this.que_pie_                = 0;
    this.angulo_                 = 0;
    this.size_enemigo_pixel_     = 4;
    this.x                      = x;
    this.y                      = y;
    this.alto_                  = this.size_enemigo_pixel_ * 12;
    this.ancho_                 = this.size_enemigo_pixel_ * 6 + 5;
    this.dx                     = 0;
    this.dy                     = 0;

    //TODO: Cambiar esto
    this.friction_               = 7000000000000;
    this.accel_                  = 500;
    this.shoot_back             = 1500;
    this.impulse_               = 30000;   

    this.last_left              = false;
    
    this.gravity_               = 800;

    this.tiempo_saltando_       = juego.timestamp_();

    this.maxdx_                 = 140;
    this.maxdy_                 = 500;

    this.limite_derecha_        = juego.ancho_total_ + this.ancho_;
    this.limite_izquierda_      = - this.ancho_;

    this.no_dispares_counter_   = 0;

    this.izquierdo_             = (Math.random()>0.5)?true:false;
    this.tiempo_parado_         = juego.timestamp_();
    this.muriendo_               = juego.timestamp_();

    this.tipo_enemigo_          =  tipo;

    this.enemigo_ = [];
    this.enemigo_left_ = [];

    this.enemigo_[0] =  [
                    [  ,  ,  , 1, 1, 1,],
                    [  ,  , 1, 1, 1, 1,],
                    [  , 1, 1, 1, 1, 1,],
                    [ 1, 1, 1, 1,  ,  ,],
                    [  , 1, 1, 1, 1, 1,],
                    [  , 1, 1, 1, 1, 1,],
                    [  , 1, 1, 1,  ,  ,],
                    [  ,  , 1, 1,  ,  ,],
                    [ 1,  , 1, 1, 1,  ,],
                    [ 1, 1, 1, 1, 1,  ,],
                    [ 1, 1, 1, 1, 1,  ,],
                    [  ,  ,  ,  ,  ,  ,],
            ];

    this.enemigo_left_[0] =  [
                    [  ,  ,  , 1, 1, 1,],
                    [  ,  , 1, 1, 1, 1,],
                    [  , 1, 1, 1, 1, 1,],
                    [ 1, 1, 1, 1,  ,  ,],
                    [  , 1, 1, 1, 1, 1,],
                    [  , 1, 1, 1, 1, 1,],
                    [  , 1, 1, 1,  ,  ,],
                    [  ,  , 1, 1,  ,  ,],
                    [ 1,  , 1, 1, 1,  ,],
                    [ 1, 1, 1, 1, 1,  ,],
                    [ 1, 1, 1, 1, 1,  ,],
                    [  ,  ,  ,  ,  ,  ,],
            ];

    for (var i = 0; i < this.enemigo_left_[0].length; i++) {
        this.enemigo_left_[0][i].reverse();
    }       

    this.enemigo_[1] =  [
                    [ 1,  ,  , 1,  , 1,],
                    [ 1, 1, 1, 1,  , 1,],
                    [ 1, 1, 1, 1, 1, 1,],
                    [  , 1, 1, 1,  ,  ,],
                    [  ,  , 1, 1, 1, 1,],
                    [  ,  , 1, 1, 1, 1,],
                    [  ,  , 1, 1,  ,  ,],
                    [  ,  , 1, 1,  ,  ,],
                    [ 1,  , 1, 1,  , 1,],
                    [ 1, 1, 1, 1, 1, 1,],
                    [ 1, 1, 1, 1, 1, 1,],
                    [  ,  ,  ,  ,  ,  ,],
            ];

    this.enemigo_left_[1] =  [
                    [ 1,  ,  , 1,  , 1,],
                    [ 1, 1, 1, 1,  , 1,],
                    [ 1, 1, 1, 1, 1, 1,],
                    [  , 1, 1, 1,  ,  ,],
                    [  ,  , 1, 1, 1, 1,],
                    [  ,  , 1, 1, 1, 1,],
                    [  ,  , 1, 1,  ,  ,],
                    [  ,  , 1, 1,  ,  ,],
                    [ 1,  , 1, 1,  , 1,],
                    [ 1, 1, 1, 1, 1, 1,],
                    [ 1, 1, 1, 1, 1, 1,],
                    [  ,  ,  ,  ,  ,  ,],
            ];

    for (var i = 0; i < this.enemigo_left_[1].length; i++) {
        this.enemigo_left_[1][i].reverse();
    }  

    this.enemigo_[2] =  [
                    [ 1,  ,  ,  , 1, 1,],
                    [ 1, 1,  ,  , 1, 1,],
                    [ 1, 1, 1, 1, 1, 1,],
                    [  , 1, 1, 1,  ,  ,],
                    [  ,  , 1, 1, 1, 1,],
                    [  ,  , 1, 1, 1, 1,],
                    [  ,  , 1, 1, 1, 1,],
                    [ 1,  , 1, 1,  , 1,],
                    [ 1, 1, 1, 1,  , 1,],
                    [ 1, 1, 1, 1, 1, 1,],
                    [  , 1, 1, 1, 1,  ,],
                    [  ,  ,  ,  ,  ,  ,],
            ];

    this.enemigo_left_[2] =  [
                    [ 1,  ,  ,  , 1, 1,],
                    [ 1, 1,  ,  , 1, 1,],
                    [ 1, 1, 1, 1, 1, 1,],
                    [  , 1, 1, 1,  ,  ,],
                    [  ,  , 1, 1, 1, 1,],
                    [  ,  , 1, 1, 1, 1,],
                    [  ,  , 1, 1, 1, 1,],
                    [ 1,  , 1, 1,  , 1,],
                    [ 1, 1, 1, 1,  , 1,],
                    [ 1, 1, 1, 1, 1, 1,],
                    [  , 1, 1, 1, 1,  ,],
                    [  ,  ,  ,  ,  ,  ,],
            ];

    for (var i = 0; i < this.enemigo_left_[2].length; i++) {
        this.enemigo_left_[2][i].reverse();
    }  

    this.enemigo_[3] =  [
                    [ 1, 1, 1,  ,  ,  ,],
                    [ 1, 1, 1, 1, 1, 1,],
                    [ 1, 1, 1, 1, 1, 1,],
                    [  , 1, 1, 1,  ,  ,],
                    [  ,  , 1, 1, 1, 1,],
                    [  ,  , 1, 1, 1, 1,],
                    [  ,  ,  , 1, 1,  ,],
                    [  , 1, 1, 1, 1,  ,],
                    [ 1, 1, 1, 1, 1,  ,],
                    [ 1, 1, 1, 1, 1,  ,],
                    [  , 1, 1, 1, 1,  ,],
                    [  ,  ,  ,  ,  ,  ,],
            ];

    this.enemigo_left_[3] =  [
                    [ 1, 1, 1,  ,  ,  ,],
                    [ 1, 1, 1, 1, 1, 1,],
                    [ 1, 1, 1, 1, 1, 1,],
                    [  , 1, 1, 1,  ,  ,],
                    [  ,  , 1, 1, 1, 1,],
                    [  ,  , 1, 1, 1, 1,],
                    [  ,  ,  , 1, 1,  ,],
                    [  , 1, 1, 1, 1,  ,],
                    [ 1, 1, 1, 1, 1,  ,],
                    [ 1, 1, 1, 1, 1,  ,],
                    [  , 1, 1, 1, 1,  ,],
                    [  ,  ,  ,  ,  ,  ,],
            ];

    for (var i = 0; i < this.enemigo_left_[3].length; i++) {
        this.enemigo_left_[3][i].reverse();
    }  

    this.enemigo_[4] =  [
                    [  , 1,  , 1,  , 1,],
                    [ 1, 1, 1, 1, 1, 1,],
                    [ 1, 1, 1, 1, 1, 1,],
                    [ 1, 1, 1, 1,  ,  ,],
                    [ 1, 1,  , 1, 1, 1,],
                    [ 1,  ,  , 1, 1, 1,],
                    [  ,  ,  , 1, 1, 1,],
                    [  ,  , 1, 1, 1,  ,],
                    [  , 1, 1, 1, 1,  ,],
                    [  , 1, 1, 1, 1,  ,],
                    [  , 1, 1, 1, 1,  ,],
                    [  ,  ,  ,  ,  ,  ,],
            ];

    this.enemigo_left_[4] =  [
                    [  , 1,  , 1,  , 1,],
                    [ 1, 1, 1, 1, 1, 1,],
                    [ 1, 1, 1, 1, 1, 1,],
                    [ 1, 1, 1, 1,  ,  ,],
                    [ 1, 1,  , 1, 1, 1,],
                    [ 1,  ,  , 1, 1, 1,],
                    [  ,  ,  , 1, 1, 1,],
                    [  ,  , 1, 1, 1,  ,],
                    [  , 1, 1, 1, 1,  ,],
                    [  , 1, 1, 1, 1,  ,],
                    [  , 1, 1, 1, 1,  ,],
                    [  ,  ,  ,  ,  ,  ,],
            ];

    for (var i = 0; i < this.enemigo_left_[4].length; i++) {
        this.enemigo_left_[4][i].reverse();
    }


    this.que_jugador_ = this.enemigo_[this.tipo_enemigo_ ];
    this.que_jugador_left_ = this.enemigo_left_[this.tipo_enemigo_ ];
    

    this.update = function(dt) {

        if(juego.player_.tiempo_portal_ > juego.timestamp_()){
            return;
        }

        if(juego.wait_start_ > juego.timestamp_()){
            return;
        }
        var distancia_al_jugador = 0;
        var a = 0;
        var b = 0;
        a = Math.abs(this.x - juego.player_.centro_x_);
        b = Math.abs(this.y - juego.player_.centro_y_);
        distancia_al_jugador = Math.sqrt( a*a + b*b );

        if(distancia_al_jugador > juego.alto_total_/2){
            return;
        }
        
        if(b < 60 && a < juego.ancho_total_/2){
            this.rapido = true;
            if(juego.player_.x < this.x){
                this.izquierdo_ = true;
            }
            else{
                this.izquierdo_ = false;
            }
        }
        else{
            this.rapido = false;
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
        if(this.colisiona_player_() && !this.muerto && !juego.is_game_over){
            colisiona = true;
            juego.player_.salud_--;
            juego.player_.suena_herida_();
        }

        if(!this.muerto && !colisiona){

            var random_alcanzable = (Math.random()>0.9)?true:false;
            var random_saltable = (Math.random()>0.9)?true:false;

            var hay_borde = this.hay_borde_();
            if(hay_borde && !this.jumping){
                var random_decision = Math.random();
                var random_parado = (random_decision<0.1)?true:false;
                var random_vuelta = (random_decision<0.6)?true:false;
                var random_jump = (random_decision>0.8)?true:false;
                
                if(random_jump){
                    this.jump = true;
                }
                else if(this.hay_alcanzable_() && random_alcanzable){
                    this.jump = true;
                }
                else if(random_parado){
                    this.tiempo_parado_ = juego.timestamp_() + 1000;
                    this.jump = false;
                }
                else if(random_vuelta){
                    //this.izquierdo_ = !this.izquierdo_;
                    this.jump = false;
                }
                else{
                    this.jump = false;
                }
                
            }
            else if(this.borde_saltable_() && random_saltable){
                this.jump = true;
            }
            else if(this.hay_alcanzable_() && random_alcanzable){
                this.jump = true;
            }
            else{
                this.jump = false;
            }

            
           
            if (this.izquierdo_ && juego.timestamp_() > this.tiempo_parado_){
              this.ddx = this.ddx - accel_;
              this.last_left = true;
            }
            else if (this.wasleft_){
              this.ddx = this.ddx + friction_;
            }
          
            if (!this.izquierdo_ && juego.timestamp_() > this.tiempo_parado_){
              this.ddx = this.ddx + accel_;
              this.last_left = false;
            }
            else if (this.wasright_){
              this.ddx = this.ddx - friction_;
            }

            

            //Salto
            if (this.jump && !this.jumping && this.tiempo_saltando_ < juego.timestamp_()){
                this.ddy = this.ddy - this.impulse_; 
                this.jumping = true;
                this.falling = true;
                this.tiempo_saltando_ = juego.timestamp_() + 1000;
            }


            //Si se pulsa acción
            if(this.accion && juego.counter > this.no_dispares_counter_){


            }


    
        }
    
        this.x  = this.x  + (dt * this.dx);
        this.y  = this.y  + (dt * this.dy);

        var max_dx = this.maxdx_;
        var acelera = this.ddx;
        if(!this.rapido && !this.jumping){
            max_dx = this.maxdx_ * 0.5;
            acelera = this.ddx * 0.5;
        }


        if(!this.muerto && !colisiona){
            this.dx = juego.bound_(this.dx + (dt * this.ddx), -max_dx, max_dx);
            this.dy = juego.bound_(this.dy + (dt * this.ddy), -this.maxdy_, this.maxdy_);
        }
        else{
            this.dx = 0;
            this.dy = juego.bound_(this.dy + (dt * this.ddy), -this.maxdy_, this.maxdy_);    
        }
        
      
        if ((this.wasleft_  && (this.dx > 0)) ||
            (this.wasright_ && (this.dx < 0))) {
          this.dx = 0;
        }
        

        var abajo_exacto        = (this.y + this.alto_) % juego.MAP_.ancho_bloques_;
        var arriba_exacto       = this.y % juego.MAP_.ancho_bloques_;


        var tiene_up = false;
        for (var i = this.x + 5; i <= this.x + this.ancho_ - 5; i++) {
            if(juego.cell_(i, this.y - 2)){
                tiene_up = true;
            }
        }
        var tiene_down = false;
        for (var j = this.x + 5; j <= this.x + this.ancho_ - 5; j++) {
            if(juego.cell_(j, this.y + this.alto_)){
                tiene_down = true;
            }
        }
        var tiene_left = false;
        for (var k = this.y + 5 ; k <= this.y + this.alto_ - 5; k++) {
            if(juego.cell_(this.x - 6, k)){
                tiene_left = true;
            }
        }
        var tiene_right = false;
        for (var l = this.y + 5; l <= this.y + this.alto_ - 5; l++) {
            if(juego.cell_(this.x + this.ancho_ + 2, l)){
                tiene_right = true;
            }
        }

        //SI va pabajo
        if (this.dy >= 0) {
            if(this.y + this.alto_ > juego.alto_total_){
                this.y = juego.alto_total_ - this.alto_;
                this.dy = 0;
                this.jumping = false;
                this.falling = false;
            }
            if(tiene_down){
                this.dy = 0;
                this.jumping = false;
                this.falling = false;
                if(abajo_exacto){
                    this.y = Math.floor((this.y + this.alto_)/ 20) * 20 - this.alto_;
                }
            }
        }

        //Si va parriba
        /* Lo comento, porque nunca debería tocar el techo, no? ... lo dejo por si hago algo al saltar */
        else if (this.dy < 0) {
            if(tiene_up && arriba_exacto){
                this.dy = 0;
            }
        }
        
        //Si va a la derecha
        if (this.dx > 0) {

            if(this.x + this.ancho_ >= this.limite_derecha_){
                this.x = 10;
                this.dx = -this.dx;
            }
            else if(tiene_right){
                this.dx = 0;
                this.izquierdo_ = !this.izquierdo_;
            }
        }
        //Si va a la izquierda
        else if (this.dx < 0) {

            if(this.x <= this.limite_izquierda_){
                this.x = juego.ancho_total_ - this.ancho_;
                this.dx = -this.dx;
            }
            else if(tiene_left){
                this.dx = 0;
                this.izquierdo_ = !this.izquierdo_;
            }
        }
    };

    this.pinta_enemigo_ = function(dt, ctx, counter) {

        //Posición
        var x_enemigo = this.x + (this.dx * dt);
        var y_enemigo = this.y + (this.dy * dt);

              //Posición
        var x_player = juego.player_.x + (juego.player_.dx * dt);
        var y_player = juego.player_.y + (juego.player_.dy * dt);

        if(this.colisiona_player_() && !this.muerto){
            juego.player_.tiempo_atacado_ = juego.timestamp_() + 2000;
            var x_explosion = this.x + this.ancho_/2;
            var y_explosion = this.y + this.alto_/2;
            juego.explosions_.push(
                new Explosion(x_explosion, y_explosion, true)
            );
        }


        var pistola =  [
                        [  ,  , 1,  ,  ,  , 1, 1,  ,  ,  ],
                        [  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  ,  , 1,  ,  ,  ,  ,  ,  ,  ],
                        [  ,  ,  , 1,  ,  ,  ,  ,  ,  ,  ],
                        [  ,  , 1, 1,  ,  ,  ,  ,  ,  ,  ]
                ];

        var pistola_izq =  [
                        [  ,  ,  , 1, 1,  ,  ,  , 1,  ,  ],
                        [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ],
                        [ 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ],
                        [  ,  ,  ,  ,  ,  ,  , 1,  ,  ,  ],
                        [  ,  ,  ,  ,  ,  ,  , 1,  ,  ,  ],
                        [  ,  ,  ,  ,  ,  ,  , 1, 1,  ,  ]
                ];

        var size_pistola_pixel = 3;

        var pieses = [];
        pieses[0] = [[  , 1,  ,  , 1,  ,  ]];
        pieses[1] = [[  ,  , 1,  , 1,  ,  ]];
       

        if(this.muerto){
            if(this.muriendo_ > juego.timestamp_()){
                
                if(this.last_left){
                    this.angulo_ = this.angulo_+1;
                }
                else{
                    this.angulo_ = this.angulo_-1;
                }
            }

            else if(this.last_left){
                this.angulo_ = 90;
            }
            else{
                this.angulo_ = -90;
            }
        }
        else if(this.jumping){
            this.que_pie_ = 1;
            this.angulo_ = 0;
        }
        else if(Math.abs(this.dx) > 0){
            if(juego.tween_frames_(counter, 40) < 0.5 ){
                this.que_pie_ = 0;
                this.angulo_ = -2;
            }
            else{
                this.que_pie_ = 1;
                this.angulo_ = 2;
            }

        }
        else{
            this.angulo_ = 0;
        }
        
        ctx.save();
        ctx.translate(x_enemigo, y_enemigo);


        ctx.rotate(this.angulo_*Math.PI/180);



        //Pinta jugador
        var que_jugador = this.que_jugador_;
        var que_pistola = pistola;
        var x_pistola = -10;

        var new_y = 0;
        var new_x = 0;


        if(this.last_left){

            que_jugador = this.que_jugador_left_
            que_pistola = pistola_izq;
            x_pistola = -this.ancho_ + 10;
        }


        var distancia_al_jugador = 0;
        var a = 0;
        var b = 0;
        a = Math.abs(this.x - juego.player_.centro_x_);
        b = Math.abs(this.y - juego.player_.centro_y_);
        distancia_al_jugador = Math.sqrt( a*a + b*b );

        var opacidad = (1 - distancia_al_jugador/250);


        var color_enemigo = "rgba(255, 153, 153, "+opacidad+")";
        if(this.muerto){
            if(this.muriendo_ > juego.timestamp_()){


                var ancho_explo = this.muriendo_ - juego.timestamp_();
                ancho_explo = (410 - ancho_explo)/3;

                color_enemigo = "rgba(255, 255, 255, 1)";
                var rand_exp1 = (Math.random() - 0.5) * 10;
                var rand_exp2 = (Math.random() - 0.5) * 10;
                var rand_exp3 = (Math.random() - 0.5) * 10;

                var rand_size1 = Math.random() * ancho_explo + this.alto_/2;
                var rand_size2 = Math.random() * ancho_explo + this.alto_/2;
                var rand_size3 = Math.random() * ancho_explo + this.alto_/2;

         
                var blue = Math.floor(Math.random() * 155) + 100;

                ctx.beginPath();
                ctx.fillStyle = 'rgba(155,155,'+blue+',0.1)';
                ctx.arc(rand_exp1, rand_exp2, rand_size1, Math.PI * 2, 0, false);
                ctx.closePath();
                ctx.fill();

                ctx.beginPath();
                ctx.fillStyle = 'rgba(155,155,'+blue+',0.2)';
                ctx.arc(rand_exp2, rand_exp3, rand_size2, Math.PI * 2, 0, false);
                ctx.closePath();
                ctx.fill();
                ctx.beginPath();

                ctx.fillStyle = 'rgba(155,155,'+blue+',0.3)';
                ctx.arc(rand_exp3, rand_exp1, rand_size3, Math.PI * 2, 0, false);
                ctx.closePath();
                ctx.fill();
                new_y = 0;
                new_x = 0;


            }

            else if(this.last_left){
                
                que_pistola = pistola_izq;
                new_y = -50;
                new_x = 20;
                color_enemigo = "rgba(200, 193, 255, "+opacidad/4+")";
            }
            else{

                que_pistola = pistola;
                new_y = -30;
                new_x = -50;
                color_enemigo = "rgba(200, 193, 255, "+opacidad/4+")";
            }
        }


        juego.pinta_filas_columnas_(ctx, new_x, new_y, que_jugador, this.size_enemigo_pixel_, color_enemigo);
        //Pinta pies
        if(!this.muerto){
            juego.pinta_filas_columnas_(ctx, 0, this.alto_ - this.size_enemigo_pixel_, pieses[this.que_pie_], this.size_enemigo_pixel_, color_enemigo);
        }

        //Pinta pistola
        //cambio el angulo_ de la pistola?
        /*
        this.angulo_ = 0;
        ctx.translate(this.ancho_/2.5,  this.alto_/2);
        ctx.rotate(this.angulo_*Math.PI/180);
        juego.pinta_filas_columnas_(ctx, x_pistola, 0, que_pistola, size_pistola_pixel, "#8FACC0");
        */
        ctx.restore();
       

    };

    this.mal_situado_ = function() {
   
        //Si está situado en una celda ocupado devuelvo true
        for (var i = this.x; i < this.x + this.ancho_; i++) {
            for (var j = this.y - 5; j < this.y + this.alto_; j++) {
                if(juego.cell_(i, j)){
                    return true;
                }
            }
        }
        return false;
    };

    this.resitua_ = function() {
        this.x = juego.randInt_ (200, juego.ancho_total_ - 200);
        this.y = juego.randInt_ (0, juego.alto_total_ / 2);
    };



    this.hay_borde_ = function() {
        var borde = false;
        if(this.y + this.alto_ > juego.alto_total_ - 15){
            borde = false;
        }
        else if(this.last_left){
            if(!juego.cell_(this.x - 5, this.y + this.alto_ + 15) && juego.cell_(this.x, this.y + this.alto_ + 15)){
                borde = true;
            }

        }
        else if(!juego.cell_(this.x + this.ancho_ + 5, this.y + this.alto_ + 15) && juego.cell_(this.x + this.ancho_, this.y + this.alto_ + 15)){
            borde = true;
        }
        return borde;
    };

    this.hay_alcanzable_ = function() {
        var borde = false;
        if(this.last_left){
            for (var i = this.y - this.alto_*2; i <= this.y + this.alto_/2; i++) {
                if(juego.cell_(this.x + this.ancho_ + 20, i) && !juego.cell_(this.x + this.ancho_, i)){
                    borde = true;
                }
            }

        }
        else{

            for (var i = this.y - this.alto_*2; i <= this.y + this.alto_/2; i++) {
                if(juego.cell_(this.x - 20, i) && !juego.cell_(this.x, i)){
                    borde = true;
                }
            }
        }
        return borde;
    };

    this.borde_saltable_ = function() {
        var saltable = false;
        var hay_izquierda = false;
        var hay_derecha = false;
        if(this.last_left){
            for (var k = this.y - this.alto_ ; k <= this.y + this.alto_ - 5; k++) {
                if(juego.cell_(this.x - 5, k)){
                    hay_izquierda = true;
                }
                if(!juego.cell_(this.x - 5, k)){
                    saltable = true;
                }
            }

        }
        else{
            for (var l = this.y - this.alto_ ; l <= this.y + this.alto_ - 5; l++) {
                if(juego.cell_(this.x + this.ancho_ + 5, l)){
                    hay_derecha = true;
                }
                if(!juego.cell_(this.x + this.ancho_ + 5, l)){
                    saltable = true;
                }
            }
        }
        return saltable && (hay_izquierda || hay_derecha);
    };

    this.colisiona_player_ = function() {
        return juego.overlap_(this.x, this.y, this.ancho_, this.alto_, juego.player_.x, juego.player_.y, juego.player_.ancho_, juego.player_.alto_);
    };

};
