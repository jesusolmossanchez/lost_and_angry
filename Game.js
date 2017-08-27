

/**************************************************
** GAME CLASS
**************************************************/
var Game = function() {

    //this.debug_ = true;



    //devuelve el tiempo en milisegundos
    this.timestamp_ = function() {
        return new Date().getTime();
    };

    this.randInt_ = function(min, max, positive) {

        var num;
        if (positive === false) {
            num = Math.floor(Math.random() * max) - min;
            num *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
        } else {
            num = Math.floor(Math.random() * max) + min;
        }

        return num;

    };


    this.crea_plataformas_ = function(final){

        //Cosas horizontales
        var cuantas_plataformas = Math.floor(Math.random()*10) + 60;
        if(final){
        	cuantas_plataformas =  cuantas_plataformas * 3;
        }
        var new_array = [];
        var espera_linea = 4;
        var largo_plataforma = 3;
        var pintando = false;
        var pintado = 0;
        var en_esta_linea = false;
        var espera_x = 0;

        var bloques_x = 42;
        var bloques_y = 30;

        var multiplaicador_ancho_plat = 15;

        var hasta_donde_x = bloques_x;
        if(final){
        	hasta_donde_x = 25;
        	multiplaicador_ancho_plat = 1;
        }

        for (var i = 0; i < bloques_y; i++) {
            for (var j = 0; j < bloques_x; j++) {
                var rand = Math.random();
                if( j > hasta_donde_x){
                	
                }
                else if(cuantas_plataformas > 0 && (i >= espera_linea && j >= espera_x && rand > 0.3) || pintando){
                    if(pintado <= largo_plataforma){
                        new_array.push(1);
                        pintando = true;
                        pintado++;
                        continue;
                    }
                    else{
                        pintando = false;
                        pintado = 0;
                        cuantas_plataformas--;
                        espera_x = (j + 5)%hasta_donde_x;
                        espera_linea = i + 3;

                    }
                }
                else{
                    en_esta_linea = false;
                    pintando = false;
                    pintado = 0;
                    largo_plataforma = Math.floor(Math.random()*multiplaicador_ancho_plat) + 5;
                }
                new_array.push(0);
            }
        }

        
        //Cosas verticales

        var cuantas_plataformas_vert = Math.floor(Math.random()*10) + 1;
        if(final){
        	cuantas_plataformas_vert =  cuantas_plataformas_vert * 3;
        }

        var alto_plataforma = 3;
        var espera_columna = bloques_x;
        var pintando_vert = false;
        var pintado_vert = 0;
        for (var j = 41; j >= 0; j--) {
            for (var i = 29; i >= 0; i--) {
                var rand = Math.random();
                var indice = j + i * bloques_x;
                if(cuantas_plataformas_vert > 0 && ((j < espera_columna  && rand > 0.4 && new_array[indice] === 1) || pintando_vert)){
                    if(pintado_vert <= alto_plataforma){
                        new_array[indice] = 1;
                        pintando_vert = true;
                        pintado_vert++;
                        continue;
                    }
                    else{
                        pintando_vert = false;
                        pintado_vert = 0;
                        cuantas_plataformas_vert--;
                        espera_columna = j - (Math.floor(Math.random()*10) + 4);
                    }
                }
                else{
                    pintando_vert = false;
                    pintado_vert = 0;
                    alto_plataforma = Math.floor(Math.random()*5) + 2;
                }
            }
        }
        
        
        //Dejo limpio el sitio del jugador
        for (var i = 0; i < 6; i++) {
            for (var j = 25; j < bloques_y; j++) {
                var indice = i + j * bloques_x;
                new_array[indice] = 0;
            }
        }    


        return new_array;
    };


    //Variables que uso por ahí

    this.empezado_ = false;
    this.pausa_ = false;
    this.is_game_over_ = false;
    this.wait_start_ = false;


    this.radio_vision_ = 220;
    if(this.debug_){
        this.radio_vision_ = 2200;
    }

    //Preparado para el mapa
    this.MAP_ = {};
    //this.MAP_.datos = this.crea_plataformas_();
    this.MAP_.datos;

    this.MAP_.size_bloques_ = 20;
    this.MAP_.ancho_bloques_ = 42;
    this.MAP_.alto_bloques_ = 30;




    this.cuantos_enemigos_ = 0;
    this.enemigos_ = [];

    this.ancho_total_ = 840,
    this.alto_total_  = 600,
    this.ancho_total_bloques_ = 840/this.MAP_.size_bloques_,
    this.alto_total_bloques_  = 600/this.MAP_.size_bloques_,

    //Gravedad por defecto
    this.GRAVITY_  = 800,   

    //Mapeo de teclas
    this.KEY      = { ENTER: 13, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, Z: 90},
      
    //Cosas del bucle del juego
    this.fps_            = 60,
    this.step_           = 1/this.fps_,
    this.canvas_         = document.getElementById('canvas'),
    this.ctx            = this.canvas_.getContext('2d'),
    this.canvas_.width  = this.ancho_total_,
    this.canvas_.height = this.alto_total_,

    //Explosiones
    this.explosions_     = [],
    this.bullets_     = [],

   	this.tiempo_muerte_ = this.timestamp_(),
   	this.tiempo_shacke_ = this.timestamp_(),




    //-------------------------------------------------------------------------
    // UTILITIES
    //-------------------------------------------------------------------------

    //Control si es un móvil o tablet
    this.is_touch_device_ = function() {
        return 'ontouchstart' in document.documentElement;
    };

    //Control de la teclas
    this.onkey_ = function(ev, key, down) {
        switch(key) {
            case this.KEY.LEFT:  
                ev.preventDefault(); 
                this.player_.left  = down;
                return false;
            case this.KEY.RIGHT: 
                ev.preventDefault(); 
                this.player_.right  = down; 
                return false;
            case this.KEY.UP: 
                ev.preventDefault(); 
                this.player_.jump  = down; 
                return false;
            case this.KEY.DOWN: 
                ev.preventDefault(); 
                this.player_.down  = down; 
                return false;
            case this.KEY.ENTER: 
                ev.preventDefault(); 
                this.player_.accion  = down; 
                return false;
            case this.KEY.Z: 
                ev.preventDefault(); 
                this.player_.accion  = down; 
                return false;
        }
    };

    //Limite entre dos máximos
    this.bound_ = function(x, min, max) {
        return Math.max(min, Math.min(max, x));
    };

    //comprueba si algo está dentro de algo
    this.overlap_ = function(x1, y1, w1, h1, x2, y2, w2, h2) {
        return !(((x1 + w1 - 1) < x2) ||
                ((x2 + w2 - 1) < x1) ||
                ((y1 + h1 - 1) < y2) ||
                ((y2 + h2 - 1) < y1));
    };


    //Esto es para hacer animaciones y cosas así... función auxiliar
    this.tween_frames_ = function(frame, duration) {
        var half  = duration/2,
            pulse = frame%duration;
        return pulse < half ? (pulse/half) : 1-(pulse-half)/half;
    };

    /* Función auxiliar para sacar celda del mapa... preparao para cuando tenga mapa
    */
    this.tcell_ = function(tx,ty){
        return this.MAP_.datos[tx + (ty*this.MAP_.ancho_bloques_)];
    };
    //TILE to pixel
    this.t2p_ = function(t){ 
        return t*this.MAP_.ancho_bloques_;                  
    };
    //pixel to TILE
    this.p2t_ = function(p){ 
        return Math.floor(p/this.MAP_.size_bloques_);                  
    };
    //pixel x/y 
    this.cell_ = function(x,y){ 
        return this.tcell_(this.p2t_(x),this.p2t_(y));                  
    };


    //Para pintar cosas
    this.pinta_filas_columnas_ = function(ctx, x, y, letra, size, color){
        if(!color){
            ctx.fillStyle = "#ffffff";
        }
        else{
            ctx.fillStyle = color;
        }
        var currX = x;
        var currY = y;
        var addX = 0;
        for (var i_y = 0; i_y < letra.length; i_y++) {
            var row = letra[i_y];
            for (var i_x = 0; i_x < row.length; i_x++) {
                if (row[i_x]) {
                    ctx.fillRect(currX + i_x * size, currY, size*1.1, size*1.1);
                }
            }
            addX = Math.max(addX, row.length * size);
            currY += size;
        }
        currX += size + addX;
    };

    //-------------------------------------------------------------------------
    // FIN UTILITIES
    //-------------------------------------------------------------------------





    //-------------------------------------------------------------------------
    // CONTROL DEL JUEGO
    //-------------------------------------------------------------------------

    //SET-UP de las cosas del juego... ahora mismo un jugador
    this.setup_ = function(final) {
    	this.cuantos_enemigos_ = 0;
    	this.enemigos_ = [];
    	this.explosions_ = [];
    	this.moustro_final_ = final;
    	//this.moustro_final_ = true;

    	this.MAP_.datos = this.crea_plataformas_(this.moustro_final_);

        this.wait_start_ = this.timestamp_() + 1500;

        this.player_ = new Player(this, 20, this.alto_total_ - 50, 800, 30000, 1);

        if(this.moustro_final_){
        	this.final_boss_ = new Boss(this, this.ancho_total_/1.5, 100, 800, 30000, 1);
        }
        else{
        	this.cuantos_enemigos_ = this.randInt_ (5, 10, true);
        	for (var i = 0; i < this.cuantos_enemigos_; i++) {
	            var x_enemigo = this.randInt_ (200, this.ancho_total_ - 200, true);
	            var y_enemigo = this.randInt_ (0, this.alto_total_ / 2, true);

	            var enemigo = new Enemigo(this, x_enemigo, y_enemigo, 800, 30000, 1);

	            while(enemigo.mal_situado_()){
	                enemigo.resitua_();
	            }


	            this.enemigos_.push(enemigo);
	        }
        }



    };



    this.empieza_ = function(){
        
        //Hacer cosas al empezar?

    };


    this.game_over_ = function() {
        //Preparado para el game over
        var game_over;
        if(this.ganador_ === "1_cpu"){
            game_over =  [
                            [ 1, 1,  , 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1,  ,  ,  , 1, 1,  , 1,  , 1,  , 1, 1,  , 1, 1,  ,  , 1,  ,  , 1,  , 1,  , 1,  ],
                            [  , 1, 1, 1,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  ,  ,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1,  ,  , 1,  ,  , 1,  , 1,  , 1,  ],
                            [  , 1, 1, 1,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  ,  ,  , 1, 1,  , 1,  , 1,  , 1, 1,  , 1, 1, 1,  , 1,  ,  , 1,  , 1,  , 1,  ],
                            [  , 1, 1, 1,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  ,  ,  ,  , 1,  , 1,  , 1,  , 1, 1,  , 1, 1,  , 1, 1,  ,  ,  ,  ,  ,  ,  ,  ],
                            [  , 1, 1, 1,  ,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  ,  ,  ,  ,  , 1,  , 1,  ,  , 1, 1,  , 1, 1,  ,  , 1,  ,  , 1,  , 1,  , 1,  ]
                        ];
        }
        else if(this.ganador_ === "cpu"){

            game_over =  [
                            [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1, 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1],
                            [ 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1, 1, 1,  , 1, 1,  ,  ,  ,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  ,  ,  , 1, 1,  , 1],
                            [ 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1, 1,  ,  ,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1],
                            [ 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  ,  ,  ,  ,  , 1, 1,  , 1,  ,  , 1,  , 1,  , 1, 1,  ,  ,  , 1, 1, 1,  ],
                            [ 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1, 1, 1,  ,  ,  , 1, 1, 1, 1,  ,  ,  , 1,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1]
                        ];
        }

        this.pinta_filas_columnas_(this.ctx, this.ancho_total_/2 - 330, 250, game_over, 16);
        this.is_game_over_ = true;

    };


    //-------------------------------------------------------------------------
    // FIN DEL CONTROL JUEGO
    //-------------------------------------------------------------------------


    
    //-------------------------------------------------------------------------
    // UPDATE
    //-------------------------------------------------------------------------

    //Actualizo entidades del juego
    this.update_ = function(dt) {
        this.player_.update(dt);

        var muertos = 0;
        for (var i = 0; i < this.enemigos_.length; i++) {
            this.enemigos_[i].update(dt);
            if(this.enemigos_[i].muerto){
            	muertos++;
            }
        }
        if(muertos >= this.enemigos_.length && !this.moustro_final_){
            this.setup_(true);

        }

    };

    //-------------------------------------------------------------------------
    // FIN UPDATE
    //-------------------------------------------------------------------------







    //-------------------------------------------------------------------------
    // RENDERING
    //-------------------------------------------------------------------------
  
    this.render = function(ctx, frame, dt) {

        if(this.is_game_over_){
            this.render_explosion_(ctx);
            return;
        }
        //borro lo que hay y vuelvo a renderizar cosas
        ctx.clearRect(0, 0, this.ancho_total_, this.alto_total_);

        //this.render_map_(ctx, dt, true);
        this.render_explosion_(ctx);
        this.render_enemigos_(ctx, dt);
        this.render_boss_(ctx, dt);
        this.render_map_(ctx, dt, true);
        this.render_bullets_(ctx);

        this.render_player_(ctx, dt);




    };



    this.pre_shake_ = function() {
        if(this.tiempo_shacke_ > this.timestamp_()){
        	var cuanto_shake = 3;
        	if(this.tiempo_muerte_ > this.timestamp_()){
        		cuanto_shake = cuanto_shake*8;
        	}
            this.ctx.save();
            if(!this.dx_shacke && !this.dy_shacke){
                this.dx_shacke = (Math.random() - 0.5) * cuanto_shake;
                this.dy_shacke = (Math.random() - 0.5) * cuanto_shake;

            }
            else{
            	if(this.tiempo_muerte_ > this.timestamp_()){
	        		this.dx_shacke = (Math.random() - 0.5) * cuanto_shake;
                	this.dy_shacke = (Math.random() - 0.5) * cuanto_shake;
	        	}
	        	else{
                	this.dy_shacke = this.dy_shacke * (-0.9);
                	this.dx_shacke = this.dx_shacke * (-0.9);
            	}
            }
            
            this.ctx.translate(this.dx_shacke, this.dy_shacke); 
        }
        else{
                this.dx_shacke = 0;
                this.dy_shacke = 0;

        }
    };

    this.post_shake_ = function() {
        this.ctx.restore();
    };

    this.render_map_ = function(ctx, dt, pre) {
        //Aqui para renderizar el mapa
        var x, y, cell;

        var empieza_y = 0;
        if((this.player_.centro_y - this.radio_vision_) > 0){
            empieza_y = Math.floor((this.player_.centro_y - this.radio_vision_) / this.MAP_.size_bloques_);
        }
        var fin_y = Math.floor((this.alto_total_) / this.MAP_.size_bloques_);
        if((this.player_.centro_y + this.radio_vision_) < this.alto_total_){
            fin_y = Math.floor((this.player_.centro_y + this.radio_vision_) / this.MAP_.size_bloques_);
        }

        var empieza_x = 0;
        if((this.player_.centro_x - this.radio_vision_) > 0){
            empieza_x = Math.floor((this.player_.centro_x - this.radio_vision_) / this.MAP_.size_bloques_);
        }
        var fin_x = Math.floor((this.ancho_total_) / this.MAP_.size_bloques_);
        if((this.player_.centro_x + this.radio_vision_) < this.ancho_total_){
            fin_x = Math.floor((this.player_.centro_x + this.radio_vision_) / this.MAP_.size_bloques_);
        }

        var distancia_centro = 0;
        var a = 0;
        var b = 0;
        for(y = empieza_y ; y <= fin_y ; y++) {
            for(x = empieza_x ; x <= fin_x ; x++) {
                cell = this.tcell_(x, y);
                if (cell) {
                    a = Math.abs(x - Math.floor(this.player_.centro_x/this.MAP_.size_bloques_));
                    b = Math.abs(y - Math.floor(this.player_.centro_y/this.MAP_.size_bloques_));
                    distancia_centro = Math.sqrt( a*a + b*b );
                    opacidad = 1/distancia_centro*2.5;
                    if(!pre){
                    	opacidad = opacidad/2;
                    }
                    ctx.fillStyle = "rgba(250,250,250,"+opacidad+")";
                    ctx.fillRect(x * this.MAP_.size_bloques_, y * this.MAP_.size_bloques_, this.MAP_.size_bloques_, this.MAP_.size_bloques_);
                }
            }
        }


    }


    //Llama a la funcion del objeto de jugador para pintarlo... lo pongo así, porque igual hay que pintar el jugador diferente según algo del juego
    this.render_player_ = function(ctx, dt) {
        this.player_.pinta_player_(dt, ctx, this.counter);
    };

    //Llama a la funcion del objeto de jugador para pintarlo... lo pongo así, porque igual hay que pintar el jugador diferente según algo del juego
    this.render_enemigos_ = function(ctx, dt) {
        var distancia_centro = 0;
        var a = 0;
        var b = 0;
        for (var i = 0; i < this.enemigos_.length; i++) {

            a = Math.abs(this.enemigos_[i].x - this.player_.centro_x);
            b = Math.abs(this.enemigos_[i].y - this.player_.centro_y);
            distancia_jugador = Math.sqrt( a*a + b*b );
            if(distancia_jugador<this.radio_vision_){
                this.enemigos_[i].pinta_enemigo_(dt, ctx, this.counter);
            }

        }

    };

    //Llama a la funcion del objeto de jugador para pintarlo... lo pongo así, porque igual hay que pintar el jugador diferente según algo del juego
    this.render_boss_ = function(ctx, dt) {
         if(this.moustro_final_){
        	this.final_boss_.pinta_boss_(dt, ctx, this.counter);
        }

    };


    //Pinta explosiones si las hay
    //Se llama siempre, pero de momento no creo explosiones en ningun sitio
    this.render_explosion_ = function(ctx) {

        if (this.explosions_.length === 0) {
            return;
        }

        for (var i = 0; i < this.explosions_.length; i++) {

            var explosion = this.explosions_[i];
            var particles = explosion.particles_;

            if (particles.length === 0) {
                this.explosions_.splice(i, 1);
                return;
            }

            var particlesAfterRemoval = particles.slice();
            for (var ii = 0; ii < particles.length; ii++) {
                var particle = particles[ii];

                var distancia_centro = 0;
            	var a = 0;
            	var b = 0;
				a = Math.abs(particle.x - this.player_.centro_x);
            	b = Math.abs(particle.y - this.player_.centro_y);
            	distancia_centro = Math.sqrt( a*a + b*b );


            	if(distancia_centro > 300){
            		continue;
            	}
				var opacidad = (1 - distancia_centro/150)*particle.opacidad;

                // Check particle size
                // If 0, remove
                

                



                var continuar = false;
                if(particle.xv > 0){
				    if((particle.max_x - particle.x) < 0){
				    	continuar = true;
				    }
			    }
			    else{
				    if((particle.x - particle.max_x) < 0){
				    	continuar = true;
				    }
			    }
                if(particle.yv > 0){
				    if((particle.max_y - particle.y) < 0){
				    	continuar = true;
				    }
			    }
			    else{
				    if((particle.y - particle.max_y) < 0){
				    	continuar = true;
				    }
			    }

                if(!continuar){
                    opacidad = opacidad*20;
                }

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, Math.PI * 2, 0, false);

                //ctx.closePath();
                ctx.fillStyle = 'rgba(' + particle.r + ',' + particle.g + ',' + particle.b + ','+opacidad+')';
                //ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
                ctx.fill();


                if (particle.size <= 2 ) {
                    //particlesAfterRemoval.splice(ii, 1);
                    continue;
                }

                if(continuar){

                    continue;
                }

                // Update
                particle.x += particle.xv;
                particle.y += particle.yv;
                particle.size -= 0.1;
            }

            explosion.particles_ = particlesAfterRemoval;

        }
    };


    this.render_bullets_ = function (ctx) {

        for (var i = 0; i < this.bullets_.length; i++) {
            var disparo = this.bullets_[i];
            var size_bala = disparo.size * 8;


            var distancia_centro = 0;
            var a = 0;
            var b = 0;
            a = Math.abs(disparo.x - this.player_.centro_x);
            b = Math.abs(disparo.y - this.player_.centro_y);
            distancia_centro = Math.sqrt( a*a + b*b );


            if(distancia_centro < 250){

                for (var j = 0; j < this.cuantos_enemigos_; j++) {
                    
                    if(!this.enemigos_[j].muerto && this.timestamp_()>this.enemigos_[j].muriendo){
                        if(this.overlap_(this.enemigos_[j].x, this.enemigos_[j].y, this.enemigos_[j].ancho_, this.enemigos_[j].alto_, disparo.x - size_bala/2, disparo.y - size_bala/2, size_bala, size_bala)){
                            this.tiempo_muerte_ = this.timestamp_()+200;

                            var rand_exp1 = (Math.random() - 0.5) * 10;
                            var rand_exp2 = (Math.random() - 0.5) * 10;
                            var rand_exp3 = (Math.random() - 0.5) * 10;

                            var rand_size1 = Math.random() * 45;
                            var rand_size2 = Math.random() * 45;
                            var rand_size3 = Math.random() * 45;

                     
                            var blue = Math.floor(Math.random() * 155) + 100;
                            
                            ctx.beginPath();
                            ctx.fillStyle = 'rgba(255,255,'+blue+',1)';
                            ctx.arc(disparo.x+rand_exp1, disparo.y+rand_exp2, rand_size1, Math.PI * 2, 0, false);
                            ctx.closePath();
                            ctx.fill();

                            ctx.beginPath();
                            ctx.fillStyle = 'rgba(255,255,'+blue+',1)';
                            ctx.arc(disparo.x+rand_exp2, disparo.y+rand_exp3, rand_size2, Math.PI * 2, 0, false);
                            ctx.closePath();
                            ctx.fill();
                            ctx.beginPath();

                            ctx.fillStyle = 'rgba(255,255,'+blue+',1)';
                            ctx.arc(disparo.x+rand_exp3, disparo.y+rand_exp1, rand_size3, Math.PI * 2, 0, false);
                            ctx.closePath();
                            ctx.fill();
            				
                            var x_explosion = this.enemigos_[j].x + this.enemigos_[j].ancho_/2;
            				var y_explosion = this.enemigos_[j].y + this.enemigos_[j].alto_/2;
                            this.explosions_.push(
			                    new Explosion(x_explosion, y_explosion, false)
			                );

                            this.bullets_.splice(i, 1);
                            this.enemigos_[j].muriendo = this.timestamp_() + 400;
                            this.enemigos_[j].muerto = true;
                            continue;


                        }
                    }
                    
                }



                if(this.cell_(disparo.x,disparo.y) || 
                    this.cell_(disparo.x - 5 ,disparo.y) || 
                    this.cell_(disparo.x + 5 ,disparo.y) || 
                    this.cell_(disparo.x - 10 ,disparo.y) || 
                    this.cell_(disparo.x + 10 ,disparo.y) ||
                    this.cell_(disparo.x - 15 ,disparo.y) || 
                    this.cell_(disparo.x + 15 ,disparo.y)
                    ){

                    var rand_exp1 = (Math.random() - 0.5) * 10;
                    var rand_exp2 = (Math.random() - 0.5) * 10;
                    var rand_exp3 = (Math.random() - 0.5) * 10;

                    var rand_size1 = Math.random() * 45;
                    var rand_size2 = Math.random() * 45;
                    var rand_size3 = Math.random() * 45;

             
                    var blue = Math.floor(Math.random() * 255);

                    ctx.beginPath();
                    ctx.fillStyle = 'rgba(255,'+blue+',0,0.1)';
                    ctx.arc(disparo.x+rand_exp1, disparo.y+rand_exp2, rand_size1, Math.PI * 2, 0, false);
                    ctx.closePath();
                    ctx.fill();

                    ctx.beginPath();
                    ctx.fillStyle = 'rgba(255,255,'+blue+',0.1)';
                    ctx.arc(disparo.x+rand_exp2, disparo.y+rand_exp3, rand_size2, Math.PI * 2, 0, false);
                    ctx.closePath();
                    ctx.fill();
                    ctx.beginPath();

                    ctx.fillStyle = 'rgba(255,255,'+blue+',0.1)';
                    ctx.arc(disparo.x+rand_exp3, disparo.y+rand_exp1, rand_size3, Math.PI * 2, 0, false);
                    ctx.closePath();
                    ctx.fill();

                    this.bullets_.splice(i, 1);
                    continue;
                }

                if(disparo.size === 1){
                    ctx.beginPath();

                    ctx.fillStyle = 'rgba(255,255,255,0.4)';
                    ctx.arc(disparo.x, disparo.y, size_bala * 5, Math.PI * 2, 0, false);
                    ctx.closePath();
                    ctx.fill();
        
                }


            
                var opacidad = 1 - distancia_centro/300;
                var new_size_bala = size_bala*1.14
                ctx.beginPath();

                var negativo = 1;
                if(disparo.xv < 0){
                    negativo = - 1;
                }

                ctx.fillStyle = 'rgba(255,255,0,'+opacidad/24+')';
                ctx.arc(disparo.x, disparo.y, new_size_bala*0.8, Math.PI * 2, 0, false);
                ctx.fillStyle = 'rgba(255,255,20,'+opacidad/20+')';
                ctx.arc(disparo.x + 2*negativo, disparo.y, new_size_bala*0.85, Math.PI * 2, 0, false);
                ctx.fillStyle = 'rgba(255,255,40,'+opacidad/16+')';
                ctx.arc(disparo.x + 4*negativo, disparo.y, new_size_bala*0.9, Math.PI * 2, 0, false);
                ctx.fillStyle = 'rgba(255,255,60,'+opacidad/12+')';
                ctx.arc(disparo.x + 6*negativo, disparo.y, new_size_bala*0.92, Math.PI * 2, 0, false);
                ctx.fillStyle = 'rgba(255,255,80,'+opacidad/8+')';
                ctx.arc(disparo.x + 8*negativo, disparo.y, new_size_bala*0.94, Math.PI * 2, 0, false);
                ctx.fillStyle = 'rgba(255,255,100,'+opacidad/4+')';
                ctx.arc(disparo.x + 10*negativo, disparo.y, new_size_bala*0.96, Math.PI * 2, 0, false);
                ctx.fillStyle = 'rgba(255,255,120,'+opacidad+')';
                ctx.arc(disparo.x + 12*negativo, disparo.y, new_size_bala*0.98, Math.PI * 2, 0, false);
                ctx.closePath();
                ctx.fill();
                

                ctx.beginPath();
                ctx.fillStyle = "rgba(250,250,250,"+opacidad/2+")";
                ctx.arc(disparo.x+12*negativo, disparo.y, new_size_bala, Math.PI * 2, 0, false);
                ctx.arc(disparo.x+14*negativo, disparo.y, new_size_bala, Math.PI * 2, 0, false);
                ctx.closePath();
                ctx.fill();
            }



            if (disparo.x > this.ancho_total_ || disparo.x < 0) {
                this.bullets_.splice(i, 1);
                continue;
            }

            disparo.x += disparo.xv;
            disparo.y += disparo.yv;
            disparo.size -= 0.004;
        }
    }


    //Pinta el logo
    this.muestra_logo_ = function(ctx) {
        var logo =  [
                        [ 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1, 1,  ,  , 1,  , 1, 1, 1,  ,  ,  ,  , 1, 1, 1, 1,  , 1, 1,  ,  , 1,  , 1, 1, 1, 1,  ,  , 1, 1, 1, 1,  ,  , 1, 1,  ,  , 1, 1,],
                        [ 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1,  ,  ,  ,  , 1, 1,  ,  ,  ,  , 1, 1,  , 1,  , 1, 1,  ,  , 1,  , 1, 1,  , 1,  ,  ,  , 1, 1,  , 1,  , 1, 1,  ,  , 1,  , 1, 1,  ,  ,  ,  , 1, 1,  , 1,  ,  ,  , 1, 1, 1, 1,  ,],
                        [ 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1, 1, 1,  ,  , 1, 1,  ,  ,  ,  , 1, 1,  , 1,  , 1, 1, 1,  , 1,  , 1, 1,  , 1,  ,  ,  , 1, 1,  , 1,  , 1, 1, 1,  , 1,  , 1, 1,  , 1, 1,  , 1, 1, 1,  ,  ,  ,  ,  , 1, 1,  ,  ,],
                        [ 1, 1,  ,  ,  , 1, 1,  , 1,  ,  ,  , 1, 1,  ,  , 1, 1,  ,  ,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1, 1,  , 1, 1,  , 1,  ,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1, 1,  , 1, 1,  ,  , 1,  , 1, 1,  , 1,  ,  ,  ,  , 1, 1,  ,  ,],
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  ,  , 1, 1,  ,  ,  ,  , 1, 1,  , 1,  , 1, 1,  ,  , 1,  , 1, 1, 1,  ,  ,  ,  , 1, 1,  , 1,  , 1, 1,  ,  , 1,  , 1, 1, 1, 1, 1,  , 1, 1,  ,  , 1,  ,  ,  , 1, 1,  ,  ,]
                ];

        var size_logo_px = 8;
        var x_logo = this.ancho_total_/2 - (size_logo_px * logo[0].length)/2;

        this.pinta_filas_columnas_(ctx, x_logo, 200, logo, size_logo_px);
        
    };


    //Pinta el cargador con un porcentaje
    this.pinta_cargador_ = function(percent, ctx) {
        var ancho_cargador = 200;
        var alto_cargador = 80;
        ctx.fillRect((this.ancho_total_ - ancho_cargador)/2, this.alto_total_/2 + 50, percent * ancho_cargador, alto_cargador);

        ctx.strokeStyle="#ffffff";
        ctx.lineWidth=10;
        ctx.strokeRect((this.ancho_total_ - ancho_cargador)/2, this.alto_total_/2 + 50, ancho_cargador - 5, alto_cargador);
    };




    //-------------------------------------------------------------------------
    // FIN RENDERING
    //-------------------------------------------------------------------------




    




    

    //-------------------------------------------------------------------------
    // MOBILE    //Esto es para controlar el giro del movil y eso... No hacer mucho caso
    //-------------------------------------------------------------------------

    this.pinta_cosas_mobile_gira_ = function() {

        document.getElementById('controles_mobile').style.display = "none";
        document.getElementById('canvas_mobile').style.display = "none";
        var ancho_window = window.innerWidth;
        var alto_window = window.innerHeight;


        canvas_mobile_gira   = document.getElementById('canvas_mobile_gira');
        canvas_mobile_gira.style.display = "block";
        ctx_mobile_gira      = canvas_mobile_gira.getContext('2d');
        canvas_mobile_gira.width  = ancho_window;
        canvas_mobile_gira.height = alto_window;


        var gira_mobile=  [
                    [  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ],
                    [  ,  , 1,  ,  ,  ,  , 1,  ,  ,  ],
                    [  , 1,  ,  ,  ,  ,  ,  , 1,  , 1],
                    [  , 1,  ,  ,  ,  ,  ,  ,  , 1, 1],
                    [ 1, 1, 1,  ,  ,  ,  ,  , 1, 1, 1],
                    [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                    [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                    [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [ 1,  ,  ,  ,  ,  ,  ,  , 1, 1, 1],
                    [ 1,  ,  ,  ,  ,  ,  ,  , 1, 1, 1],
                    [ 1,  ,  ,  ,  ,  ,  ,  , 1,  , 1],
                    [ 1,  ,  ,  ,  ,  ,  ,  , 1, 1, 1],
                    [ 1,  ,  ,  ,  ,  ,  ,  , 1, 1, 1],
                    [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            ];

        var size_gira_px = 12;
        var x_gira = ancho_window/2 - (size_gira_px * gira_mobile[0].length)/2;
        this.pinta_filas_columnas_(ctx_mobile_gira, x_gira, 200, gira_mobile, size_gira_px);
          
    }
  
    this.pinta_cosas_mobile_ = function() {
        document.getElementById('canvas_mobile_gira').style.display = "none";

        canvas_mobile   = document.getElementById('canvas_mobile');
        ctx_mobile      = canvas_mobile.getContext('2d');
        canvas_mobile.style.display = "block";
        var ancho_window = window.innerWidth
        canvas_mobile.width  = this.ancho_total_;
        canvas_mobile.height = 100;


        var flecha_der =  [
                    [  , 1,  ,  ],
                    [  , 1, 1,  ],
                    [ 1, 1, 1, 1],
                    [  , 1, 1,  ],
                    [  , 1,  ,  ]
            ];
        var flecha_izq =  [
                    [  ,  , 1,  ],
                    [  , 1, 1,  ],
                    [ 1, 1, 1, 1],
                    [  , 1, 1,  ],
                    [  ,  , 1,  ]
            ];
        var flecha_arr=  [
                    [  ,  , 1,  ,  ],
                    [  , 1, 1, 1,  ],
                    [ 1, 1, 1, 1, 1],
                    [  , 1, 1, 1,  ],
                    [  , 1, 1, 1,  ]
            ];
        var accion_boton=  [
                    [ 1,  , 1,  , 1],
                    [  , 1, 1, 1,  ],
                    [ 1, 1, 1, 1, 1],
                    [  , 1, 1, 1,  ],
                    [ 1,  , 1,  , 1]
            ];


        var size_flecha_px = 12;

        this.pinta_filas_columnas_(ctx_mobile, 20, 20, flecha_izq, size_flecha_px);
        this.pinta_filas_columnas_(ctx_mobile, 120, 20, flecha_der, size_flecha_px);
        this.pinta_filas_columnas_(ctx_mobile, ancho_window - 180, 20, flecha_arr, size_flecha_px);
        this.pinta_filas_columnas_(ctx_mobile, ancho_window - 80, 20, accion_boton, size_flecha_px);

        document.getElementById('controles_mobile').style.display = "block";


        var self = this

        document.getElementById('der_mobile').addEventListener('touchstart', function(e){
            self.player_.right = true;
            this.className = "tecla_mobile pulsada";
            e.preventDefault();
        });

        document.getElementById('izq_mobile').addEventListener('touchstart', function(e){ 
            self.player_.left = true;
            this.className = "tecla_mobile pulsada";
            e.preventDefault();
        });

        document.getElementById('arr_mobile').addEventListener('touchstart', function(e){ 
            self.player_.jump = true;
            this.className = "tecla_mobile pulsada";
            e.preventDefault();
        });

        document.getElementById('accion_mobile').addEventListener('touchstart', function(e){ 
            self.player_.accion = true;
            this.className = "tecla_mobile pulsada";
            e.preventDefault();
        });



        document.getElementById('der_mobile').addEventListener('touchend', function(e){
            self.player_.right = false;
            this.className = "tecla_mobile";
            e.preventDefault();
        });

        document.getElementById('izq_mobile').addEventListener('touchend', function(e){ 
            self.player_.left = false;
            this.className = "tecla_mobile";
            e.preventDefault();
        });

        document.getElementById('arr_mobile').addEventListener('touchend', function(e){ 
            self.player_.jump = false;
            this.className = "tecla_mobile";
            e.preventDefault();
        });

        document.getElementById('accion_mobile').addEventListener('touchend', function(e){ 
            self.player_.accion = false;
            this.className = "tecla_mobile";
            e.preventDefault();
        });
          
    }


    var canvas_mobile;
    var ctx_mobile;
    var self = this;
    this.controla_orientacion_ = function(){
        if(this.is_touch_device_()){
            if (window.innerHeight > window.innerWidth) {
                self.pinta_cosas_mobile_gira_();
                self.pausa_ = true;
            } else {
                self.pinta_cosas_mobile_();
                self.pausa_ = false;
            }
            window.addEventListener('orientationchange', function (argument) {
                window.setTimeout(function () {
                    if (window.innerHeight > window.innerWidth) {
                        self.pinta_cosas_mobile_gira_();
                        juego.pausa_ = true;
                    } else {
                        self.pinta_cosas_mobile_();
                        self.pausa_ = false;
                    }
                },300);
            });
        }
    };


    

    //-------------------------------------------------------------------------
    // MOBILE    //Esto es para controlar el giro del movil y eso... No hacer mucho caso
    //-------------------------------------------------------------------------


};





    /********************************************************************************************************************/
    /********************************************************************************************************************/
    /********************************************************************************************************************/
    /********************************************************************************************************************/
    /********************************* AQUI EMPIEZA TODO (funcion autoinvocada) *****************************************/
    /********************************************************************************************************************/
    /********************************************************************************************************************/
    /********************************************************************************************************************/
    /********************************************************************************************************************/

(function() { // module pattern

    //Creo una instacia del juego
    var juego = new Game();

    //Muestra el logo de buenas a primeras
    juego.muestra_logo_(juego.ctx);

    //Control de orientación en mobile
    juego.controla_orientacion_();

    //Contador de frames
    juego.counter = 0; 

    var dt = 0, 
        now,
        last = juego.timestamp_();
  
    
    var fps_muerte = 1000 / 30;

    var then = juego.timestamp_();
    function frame() {
        if(!juego.empezado_ || juego.pausa_){
            requestAnimationFrame(frame, canvas);
            return;
        }
        now = juego.timestamp_();
        dt = dt + Math.min(1, (now - last) / 1000);
        while(dt > juego.step_) {
            dt = dt - juego.step_;
            if(!juego.hay_punto_){
                juego.update_(juego.step_);
            }
        }
        //if(juego.tiempo_muerte_ > juego.timestamp_()){
        if(false){
            var elapsed = now - then;

            if (elapsed > fps_muerte) {
                juego.pre_shake_();
                juego.render(juego.ctx, juego.counter, dt);
                juego.post_shake_();
                juego.update_(juego.step_);
                then = now - (elapsed % fps_muerte);
            }
        }
        else{
            juego.pre_shake_();
            juego.render(juego.ctx, juego.counter, dt);
            juego.post_shake_();
        }

        last = now;
        juego.counter++;
        requestAnimationFrame(frame, canvas);
    }

    //Listeners de teclas
    document.addEventListener('keydown', function(ev) { return juego.onkey_(ev, ev.keyCode, true);  }, false);
    document.addEventListener('keyup',   function(ev) { return juego.onkey_(ev, ev.keyCode, false); }, false);


    //Control de visibilidad para poner el pausa cuando no se ve la pantalla
    function handleVisibilityChange() {
        if (document.hidden) {
            juego.pausa_ = true;
        } else  {
            juego.pausa_ = false;
            juego.controla_orientacion_();
        }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange, false);



    //Locurón que hay que hacer con la música
    var music_player = new CPlayer();
    var flag_song = false;
    music_player.init(song);

    var croqueta_player = new CPlayer();
    croqueta_player.init(croqueta);
    var flag_croqueta = false;
    window.croqueta_audio;

    var golpe_player = new CPlayer();
    golpe_player.init(golpe);
    var flag_golpe = false;
    window.golpe_audio;

    var golpe_player2 = new CPlayer();
    golpe_player2.init(golpe2);
    var flag_golpe2 = false;
    window.golpe_audio2;

    var punto_player = new CPlayer();
    punto_player.init(punto);
    var flag_punto = false;
    window.punto_audio;

    var levelup_player = new CPlayer();
    levelup_player.init(levelup);
    var flag_levelup = false;
    window.levelup_audio2;


    var done = false;
    var intervalo_cancion = setInterval(function () {
        //Al final cuando toda la música está cargada se lanza esto
        if (done) {
            //Se vuelve a controlar la orientación
            juego.controla_orientacion_();

            //Y básicamente se lanza el juego
            frame();
            juego.setup_(false);
            juego.empieza_();
            juego.empezado_ = true;

            //Ademas se limpia este intervalo que no de más el follón
            clearInterval(intervalo_cancion);
            return;
        }

        if(!flag_song){
            var music_percent = music_player.generate();
            juego.pinta_cargador_(music_percent, juego.ctx);
            if(music_percent >= 1){
                flag_song = true;
            }
        }

        if(!flag_croqueta){
            if(croqueta_player.generate() >= 1){
                flag_croqueta = true;
            }
        }
        
        if(!flag_golpe){
            if(golpe_player.generate() >= 1){
                flag_golpe = true;
            }
        }
        
        if(!flag_golpe2){
            if(golpe_player2.generate() >= 1){
                flag_golpe2 = true;
            }
        }
        
        if(!flag_levelup){
            if(levelup_player.generate() >= 1){
                flag_levelup = true;
            }
        }
        
        if(!flag_punto){
            if(punto_player.generate() >= 1){
                flag_punto = true;
            }
        }
        

        done = (flag_song && flag_croqueta && flag_golpe && flag_golpe2);

        if (done) {
          
            var wave = music_player.createWave();
            var audio = document.createElement("audio");
            audio.src = URL.createObjectURL(new Blob([wave], {type: "audio/wav"}));
            audio.loop=true;

            //Comento el play que no suene de momento
            //audio.play();
            audio.volume = 0.3;


            var wave2 = croqueta_player.createWave();
            window.croqueta_audio = document.createElement("audio");
            window.croqueta_audio.src = URL.createObjectURL(new Blob([wave2], {type: "audio/wav"}));
            window.croqueta_audio.volume = 0.7;

            var wave3 = golpe_player.createWave();
            window.golpe_audio = document.createElement("audio");
            window.golpe_audio.src = URL.createObjectURL(new Blob([wave3], {type: "audio/wav"}));

            var wave4 = golpe_player2.createWave();
            window.golpe_audio2 = document.createElement("audio");
            window.golpe_audio2.src = URL.createObjectURL(new Blob([wave4], {type: "audio/wav"}));

            var wave5 = levelup_player.createWave();
            window.levelup_audio2 = document.createElement("audio");
            window.levelup_audio2.src = URL.createObjectURL(new Blob([wave5], {type: "audio/wav"}));

            var wave6 = punto_player.createWave();
            window.punto_audio = document.createElement("audio");
            window.punto_audio.src = URL.createObjectURL(new Blob([wave6], {type: "audio/wav"}));
        
        }
    }, 10);


})();
