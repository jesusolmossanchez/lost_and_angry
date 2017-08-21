

/**************************************************
** GAME Enemigo CLASS
**************************************************/
var Enemigo = function(juego, x, y, gravedad, impulso) {

    this.que_pie                = 0;
    this.angulo                 = 0;
    this.size_enemigo_pixel     = 4;
    this.x                      = x;
    this.y                      = y;
    this.alto_                  = this.size_enemigo_pixel * 12;
    this.ancho_                 = this.size_enemigo_pixel * 6 + 5;
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

    this.izquierdo_              = (Math.random()>0.5)?true:false;
    //this.izquierdo_              = true;



 

    this.update = function(dt) {

        var distancia_al_jugador = 0;
        var a = 0;
        var b = 0;
        a = Math.abs(this.x - juego.player_.centro_x);
        b = Math.abs(this.y - juego.player_.centro_y);
        distancia_al_jugador = Math.sqrt( a*a + b*b );

        if(distancia_al_jugador < 600){
            if(distancia_al_jugador > 250 || (b < 60 && distancia_al_jugador < juego.ancho_total_/2)){
                if(juego.player_.x < this.x){
                    this.izquierdo_ = true;
                }
                else{
                    this.izquierdo_ = false;
                }
            }
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


        if (this.izquierdo_){
          this.ddx = this.ddx - accel;
          this.last_left = true;
        }
        else if (this.wasleft){
          this.ddx = this.ddx + friction;
        }
      
        if (!this.izquierdo_){
          this.ddx = this.ddx + accel;
          this.last_left = false;
        }
        else if (this.wasright){
          this.ddx = this.ddx - friction;
        }

        var random_jump = (Math.random()>0.8)?true:false;

        if(this.hay_borde_() && random_jump){
            this.jump = true;
        }
        else if(this.hay_alcanzable_() && random_jump){
            this.jump = true;
        }
        else{
            this.jump = false;

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

            //TODO: ver que hago, si disparo o que...

            /*
            this.no_dispares_counter_ = juego.counter + 3;
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
            */

        }
  
        this.x  = this.x  + (dt * this.dx);
        this.y  = this.y  + (dt * this.dy);

        
        this.dx = juego.bound_(this.dx + (dt * this.ddx), -this.maxdx_, this.maxdx_);
        this.dy = juego.bound_(this.dy + (dt * this.ddy), -this.maxdy_, this.maxdy_);

        
      
        if ((this.wasleft  && (this.dx > 0)) ||
            (this.wasright && (this.dx < 0))) {
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

        var enemigo =  [
                        [  ,  ,  , 1, 1, 1],
                        [  ,  , 1, 1, 1, 1],
                        [  , 1, 1, 1, 1, 1],
                        [ 1, 1, 1, 1,  ,  ],
                        [ 1, 1, 1, 1, 1, 1],
                        [ 1, 1, 1, 1, 1, 1],
                        [  , 1, 1, 1,  ,  ],
                        [  , 1, 1, 1, 1,  ],
                        [  , 1, 1, 1, 1,  ],
                        [ 1, 1, 1, 1, 1,  ],
                        [ 1, 1, 1, 1, 1,  ],
                        [  ,  ,  ,  ,  ,  ],
                ];


        var enemigo_izq =  [
                        [ 1, 1, 1,  ,  ,  ],
                        [ 1, 1, 1, 1,  ,  ],
                        [ 1, 1, 1, 1, 1,  ],
                        [  ,  , 1, 1, 1, 1],
                        [ 1, 1, 1, 1, 1, 1],
                        [ 1, 1, 1, 1, 1, 1],
                        [  ,  , 1, 1, 1,  ],
                        [  , 1, 1, 1, 1,  ],
                        [  , 1, 1, 1, 1,  ],
                        [  , 1, 1, 1, 1, 1],
                        [  , 1, 1, 1, 1, 1],
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
       
        if(this.jumping){
            this.que_pie = 1;
            this.angulo = 0;
        }
        else if(this.left || this.right){
            if(juego.tween_frames_(counter, 40) < 0.5 ){
                this.que_pie = 0;
                this.angulo = -1;
            }
            else{
                this.angulo = 1;
                this.que_pie = 1;
            }

        }
        else{
            this.angulo = 0;
        }
        
        ctx.save();
        ctx.translate(x_enemigo, y_enemigo);

        //Pinto el halo ese chungo
        /*
        radius = juego.ancho_total_/3;
        ctx.beginPath();
        ctx.arc(this.ancho_ / 2, this.alto_/2, 300, 0, Math.PI * 2, false);

        var gradient = ctx.createRadialGradient(this.ancho_ / 2, this.alto_/2, radius*0.9, this.ancho_ / 2, this.alto_/2, 0);
        gradient.addColorStop(0,"rgba(251, 255, 223, 0)");
        gradient.addColorStop(1,"rgba(251, 255, 223, 0.6)");
        ctx.fillStyle = gradient;
        ctx.fill();
        */
        //Fin del halo chungo

        //efecto de saltitos
        ctx.rotate(this.angulo*Math.PI/180);
        //Pinta jugador
        var que_jugador = enemigo;
        var que_pistola = pistola;
        var x_pistola = -10;

        if(this.last_left){
            que_jugador = enemigo_izq;
            que_pistola = pistola_izq;
            x_pistola = -this.ancho_ + 10;
        }
        juego.pinta_filas_columnas_(ctx, 0, 0, que_jugador, this.size_enemigo_pixel, "#FF9999");
        //Pinta pies
        juego.pinta_filas_columnas_(ctx, 0, this.alto_ - this.size_enemigo_pixel, pieses[this.que_pie], this.size_enemigo_pixel, "#FF9999");
  

        //Pinta pistola
        //cambio el angulo de la pistola?
        /*
        this.angulo = 0;
        ctx.translate(this.ancho_/2.5,  this.alto_/2);
        ctx.rotate(this.angulo*Math.PI/180);
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
        this.x = juego.randInt_ (300, juego.ancho_total_ - 100, true);
        this.y = juego.randInt_ (0, juego.alto_total_ / 1.8, true);
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

};
