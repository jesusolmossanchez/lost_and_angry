

/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(juego, x, y, gravedad, impulso) {

    this.que_pie                = 0;
    this.angulo                 = 0;
    this.size_player_pixel      = 4;
    this.x                      = x;
    this.y                      = y;
    this.alto_                  = this.size_player_pixel * 12;
    this.ancho_                 = this.size_player_pixel * 6 + 5;
    this.dx                     = 0;
    this.dy                     = 0;

    this.friction               = 700;
    this.accel                  = 500;
    this.shoot_back             = 1500;

    this.last_left              = false;
    

    this.gravity_               = gravedad;

    this.tiempo_saltando_       = juego.timestamp_();
    this.tiempo_atacado_       = juego.timestamp_();

    this.maxdx_                 = 170;
    this.maxdy_                 = 500;

    this.impulse_               = 30000;   

    this.limite_derecha_        = juego.ancho_total_ + this.ancho_;
    this.limite_izquierda_      = - this.ancho_;

    this.no_dispares_counter_   = 0;

    this.salud_inicial_         = 250;
    this.salud_                 = this.salud_inicial_;



 

    this.update = function(dt) {

        

        if(this.salud_ < 0){
            juego.ganador_ = "cpu";
            juego.game_over_();
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


        if (this.left){
          this.ddx = this.ddx - accel;
          this.last_left = true;
        }
        else if (this.wasleft){
          this.ddx = this.ddx + friction;
        }
      
        if (this.right){
          this.ddx = this.ddx + accel;
          this.last_left = false;
        }
        else if (this.wasright){
          this.ddx = this.ddx - friction;
        }

        //Salto
        if (this.jump && !this.jumping && this.tiempo_saltando_ < juego.timestamp_()){
            this.ddy = this.ddy - this.impulse_; 
            this.jumping = true;
            this.falling = true;
            this.tiempo_saltando_ = juego.timestamp_() + 300;
        }


        //Si se pulsa acción
        if(this.accion && juego.counter > this.no_dispares_counter_){
            this.suena_dispara_();
            this.no_dispares_counter_ = juego.counter + 3;
            juego.tiempo_shacke_ = juego.timestamp_() + 20;
            var derecha = true;
            if(this.last_left){
                derecha = false;
                this.ddx = this.ddx + this.shoot_back;
            }
            else{
                this.ddx = this.ddx - this.shoot_back;

            }
            var seft = this;
            setTimeout(function () { 
                juego.bullets_.push(
                    new Bullet(seft.x, seft.y - 10, -10, -3, derecha, juego, seft)
                );
            },dt/3);
            
            setTimeout(function () {
                juego.bullets_.push(
                    new Bullet(seft.x, seft.y + 10, 10, 3, derecha, juego, seft)
                );
            },2*dt/3);

            juego.bullets_.push(
                new Bullet(this.x, this.y, 0, 0, derecha, juego, this)
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
            }

            if(tiene_right){
                this.dx = 0;
            }
        }
        //Si va a la izquierda
        else if (this.dx < 0) {

            if(this.x <= this.limite_izquierda_){
                this.x = juego.ancho_total_ - this.ancho_;
                this.y = this.y - 20;
            }

            if(tiene_left){
                this.dx = 0;
            }
        }
    };

    this.pinta_player_ = function(dt, ctx, counter) {
        if(juego.wait_start_ > juego.timestamp_()){
            this.pinta_home_();
        }

        //Posición
        var x_player = this.x + (this.dx * dt);
        var y_player = this.y + (this.dy * dt);


        var player =  [
                        [  , 1,  ,  ,  ,  ],
                        [  , 1, 1, 1, 1, 1],
                        [  , 1, 1, 1, 1, 1],
                        [  , 1, 1, 1,  ,  ],
                        [  , 1, 1, 1, 1, 1],
                        [  , 1, 1, 1, 1, 1],
                        [  , 1, 1, 1, 1, 1],
                        [  , 1, 1, 1, 1, 1],
                        [  , 1, 1, 1, 1, 1],
                        [  , 1, 1, 1, 1, 1],
                        [ 1, 1, 1, 1, 1, 1],
                        [  ,  ,  ,  ,  ,  ],
                ];

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
        pieses[0] = [[  ,  , 1,  ,  , 1,  ]];
        pieses[1] = [[  ,  , 1,  , 1,  ,  ]];
        pieses[2] = [[ 1,  ,  , 1,  ,  ,  ]];
        pieses[3] = [[  , 1,  , 1,  ,  ,  ]];
       
        if(this.jumping){
            this.que_pie = 1;
            this.angulo = 0;
        }
        else if(this.left || this.right){
            if(juego.tween_frames_(counter, 40) < 0.5 ){
                if(this.left){
                    this.que_pie = 2;
                }
                else{
                    this.que_pie = 0;
                }
                this.angulo = -2;
            }
            else if(this.left){
                this.que_pie = 3;
                this.angulo = 2;
            }
            else{
                this.que_pie = 1;
                this.angulo = 2;
            }

        }
        else{
            this.angulo = 0;
        }
        
        ctx.save();
        ctx.translate(x_player, y_player);

        //Pinto el halo ese chungo
        
        radius = juego.ancho_total_/3;
        ctx.beginPath();
        ctx.arc(this.ancho_ / 2, this.alto_/2, 300, 0, Math.PI * 2, false);

        var gradient = ctx.createRadialGradient(this.ancho_ / 2, this.alto_/2, radius*0.9, this.ancho_ / 2, this.alto_/2, 0);
        if((this.tiempo_atacado_ - juego.timestamp_())>1700){
            var random_halo = Math.random()/2;
            gradient.addColorStop(0,"rgba(255, 11, 11, 0)");
            gradient.addColorStop(1,"rgba(255, 11, 11, "+random_halo+")");
        }
        else{
            gradient.addColorStop(0,"rgba(251, 255, 243, 0)");
            gradient.addColorStop(1,"rgba(251, 255, 243, 0.6)");
        }
        ctx.fillStyle = gradient;
        ctx.fill();
        
        //Fin del halo chungo

        //efecto de saltitos
        ctx.rotate(this.angulo*Math.PI/180);
        //Pinta jugador
        var que_jugador = player;
        var que_pistola = pistola;
        var x_pistola = -5;

        if(this.last_left){
            que_jugador = player_izq;
            que_pistola = pistola_izq;
            x_pistola = -this.ancho_ + 5;
        }
        juego.pinta_filas_columnas_(ctx, 0, 0, que_jugador, this.size_player_pixel, "#D2E4F1");
        //Pinta pies
        juego.pinta_filas_columnas_(ctx, 0, this.alto_ - this.size_player_pixel, pieses[this.que_pie], this.size_player_pixel, "#D2E4F1");
  

        //Pinta pistola
        //cambio el angulo de la pistola?
        this.angulo = 0;
        ctx.translate(this.ancho_/2.5,  this.alto_/2);
        ctx.rotate(this.angulo*Math.PI/180);
        juego.pinta_filas_columnas_(ctx, x_pistola, 0, que_pistola, size_pistola_pixel, "#8FACC0");
        ctx.restore();


        if(this.tiempo_atacado_ > juego.timestamp_()){

            var diff_atacado = this.tiempo_atacado_ - juego.timestamp_();
            
            var opacidad = diff_atacado/2000;

            var ancho_cargador = this.ancho_*2;
            var alto_cargador = 5;
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

            ctx.fillRect(x_player - this.ancho_/2, y_player - 10, percent * ancho_cargador, alto_cargador);

            ctx.strokeStyle="#ffffff";
            ctx.lineWidth=1;
            ctx.strokeRect(x_player - this.ancho_/2, y_player - 10, ancho_cargador, alto_cargador);

        }


    };

    //var A;
    //var cuantos_a = 0;
    this.suena_dispara_ = function(){
        /*
        cuantos_a++;
        if(cuantos_a>3){
            A.close();
        }
        with(A = new AudioContext)for(i in D=[1,24,1,24,1,24,1,18,6,18,6,18,6,18,6,18,6,24,1,24,1,24,1,24,1,24,1,24,1,24])with(createOscillator())if(D[i])connect(destination),frequency.value=70*1.06**(13-D[i]),start(i*.03),stop(i*.03+.03);
        */
    }

    this.pinta_home_ = function(){
        
        var home =  [
                        [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1,  ,  , 1, 1,  , 1,  , 1, 1, 1, 1,  , 1, 1,  ,  ,  , 1,  , 1, 1, 1, 1,  ,  , 1, 1, 1, 1, 1,  ,  , 1],
                        [ 1,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1, 1,  , 1, 1,  , 1, 1,  ,  ,  ,  , 1,  ,  , 1, 1,  ,  , 1],
                        [ 1,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  , 1, 1, 1, 1,  ,  , 1, 1,  , 1, 1,  ,  , 1], 
                        [ 1,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  ,  ,  , 1,  , 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1], 
                        [ 1,  ,  , 1, 1,  , 1,  , 1, 1, 1, 1,  , 1, 1,  ,  ,  , 1,  , 1, 1, 1, 1,  ,  ,  ,  ,  , 1, 1,  ,  , 1], 
                        [ 1,  ,  , 1, 1,  , 1,  , 1, 1, 1, 1,  , 1, 1,  ,  ,  , 1,  , 1, 1, 1, 1,  ,  ,  ,  ,  , 1, 1,  ,  , 1], 
                        [ 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1,  , 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                        [ 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                        [ 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                ];

        var size_home = 3;
        var x_home = this.x + this.ancho_ + 20;
        var y_home = this.y - 60;

        juego.pinta_filas_columnas_(juego.ctx, x_home, y_home, home, size_home, "#ffffff");
    }

    this.pinta_no_ = function(){
        
        var home =  [
                        [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1,  ,  , 1, 1,  ,  , 1,  , 1, 1, 1, 1,  , 1, 1,  ,  , 1],
                        [ 1,  ,  , 1, 1,  ,  , 1,  , 1, 1,  , 1,  , 1, 1,  ,  , 1],
                        [ 1,  ,  , 1, 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  ,  , 1],
                        [ 1,  ,  , 1, 1,  , 1, 1,  , 1, 1,  , 1,  , 1, 1,  ,  , 1],
                        [ 1,  ,  , 1, 1,  ,  , 1,  , 1, 1, 1, 1,  ,  ,  ,  ,  , 1],
                        [ 1,  ,  , 1, 1,  ,  , 1,  , 1, 1, 1, 1,  , 1, 1,  ,  , 1],
                        [ 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1,  , 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                        [ 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                        [ 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                ];

        var size_home = 3;
        var x_home = this.x + this.ancho_ + 20;
        var y_home = this.y - 60;

        juego.pinta_filas_columnas_(juego.ctx, x_home, y_home, home, size_home, "#ffffff");
    }


};
