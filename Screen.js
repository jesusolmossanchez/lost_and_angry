var air_console = new AirConsole();

/**************************************************
** GAME CLASS
**************************************************/
var Game = function() {

 
    //devuelve el tiempo en milisegundos
    this.timestamp_ = function() {
        return new Date().getTime();
    };

    this.randInt_ = function(min, max) {
        var num = Math.floor(Math.random()*(max-min+1)+min);
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

    //Preparado para el mapa
    this.MAP_ = {};
    //this.MAP_.datos = this.crea_plataformas_();
    this.MAP_.datos;

    this.MAP_.size_bloques_ = 20;
    this.MAP_.ancho_bloques_ = 42;
    this.MAP_.alto_bloques_ = 30;




    this.cuantos_enemigos_ = 0;
    this.enemigos_ = [];

    this.ancho_total_ = 840;
    this.alto_total_  = 600;
    this.ancho_total_bloques_ = 840/this.MAP_.size_bloques_;
    this.alto_total_bloques_  = 600/this.MAP_.size_bloques_;

    //Gravedad por defecto
    this.GRAVITY_  = 800;   

    //Mapeo de teclas
    this.KEY      = { ENTER: 13, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, X: 88};
      
    //Cosas del bucle del juego
    this.fps_            = 60;
    this.fps_interval    = 1000/this.fps_;
    this.step_           = 1/60;
    this.canvas_         = document.getElementById('canvas');
    this.ctx            = this.canvas_.getContext('2d');
    this.canvas_.width  = this.ancho_total_;
    this.canvas_.height = this.alto_total_;

    //Explosiones
    this.explosions_     = [];
    this.bullets_     = [];
    this.zapatillas_     = [];

    this.tiempo_muerte_ = this.timestamp_();
    this.tiempo_shacke_ = this.timestamp_();
    this.tiempo_portal_ = this.timestamp_();
    this.cambia_pantalla_completo = false;


    this.cambia_pantalla_ = false;
    this.cuantas_pantallas_ = 0;

    this.salud_inicial_ = 250;
    this.salud_actual_ = [];

    this.tiempo_slow_motion_ = this.timestamp_();

    this.nivel_ = 0;
    this.tiempo_terremoto_fix_ = 2500;

    this.playeralto_ = 48;
    this.playerancho_ = 29;

    this.playeres_ = [];




    //-------------------------------------------------------------------------
    // UTILITIES
    //-------------------------------------------------------------------------

   


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

    //comprueba si algo está dentro de algo
    this.dentro_circulo_ = function(x, y, cx, cy, radius) {
        var distance_squared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
        return distance_squared <= radius * radius;
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

    this.hex_to_rgb_ = function(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };


    //Para pintar cosas
    this.pinta_filas_columnas_ = function(ctx, x, y, letra, size, color, controla_distancia){
        if(!color){
            ctx.fillStyle = "#ffffff";
        }
        else{
            ctx.fillStyle = color;
        }

        if(controla_distancia){
            var new_color = this.hex_to_rgb_(color);
        }

        var currX = x;
        var currY = y;
        var addX = 0;
        for (var i_y = 0; i_y < letra.length; i_y++) {
            var row = letra[i_y];
            for (var i_x = 0; i_x < row.length; i_x++) {
                if (row[i_x]) {
                    if(controla_distancia){
                        var distancia_centro = 99999999;

                        for (var jugador in this.playeres_) {
                            
                            var a = 0;
                            var b = 0;
                            a = Math.abs(currX + i_x * size - this.playeres_[jugador].centro_x_);
                            b = Math.abs(currY - this.playeres_[jugador].centro_y_);
                            var new_distancia_centro = Math.sqrt( a*a + b*b );
                            if(new_distancia_centro < distancia_centro){
                                distancia_centro = new_distancia_centro;
                            }
                        }




                        var opacidad = (1 - distancia_centro/(this.radio_vision_ * 2.5));

                        if(distancia_centro > this.radio_vision_ * 2.5){
                            continue;
                        }

                        ctx.fillStyle = "rgba("+new_color.r+","+new_color.g+","+new_color.b+","+opacidad+")";
                        ctx.fillRect(currX + i_x * size, currY, size, size);
                    }
                    else{
                        ctx.fillRect(currX + i_x * size, currY, size*1.1, size*1.1);

                    }
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
    this.setup_ = function(final, wait) {

        this.cuantos_enemigos_ = 0;
        this.enemigos_ = [];
        this.explosions_ = [];
        
        this.moustro_final_ = final;
        //this.moustro_final_ = true;

        this.MAP_.datos = this.crea_plataformas_(this.moustro_final_);


        this.ctx.globalAlpha = 1;
        var nuevo_wait = 1500;
        if(wait){
            nuevo_wait = wait;
        }
        this.wait_start_ = this.timestamp_() + nuevo_wait;

        for (var i = 0; i < window.jugadores.length; i++) {
            this.playeres_[window.jugadores[i].id] = new Player(this, 60 * Math.random(), this.alto_total_ - 100, 1000, 30000, this.salud_actual_[window.jugadores[i].id]);
        }

        if(this.moustro_final_){

            this.final_boss_ = new Boss(this, this.ancho_total_/1.5, 240, 800, 30000, 1);
        }
        else{

            this.nivel_++;

            this.portal_ = {};
            this.portal_.ancho_ = this.playeralto_;
            this.portal_.alto_ = this.playeralto_;
            this.situa_portal_(this.portal_);

            while(this.portal_mal_situado_(this.portal_)){
                this.situa_portal_(this.portal_);
            }

            this.medical_kit_ = {};


            if(Math.random() > 0.6){
                this.medical_kit_.ancho_ = this.playeralto_/2;
                this.medical_kit_.alto_ = this.playeralto_/2;
                this.situa_medical_kit_(this.medical_kit_);

                while(this.medical_kit_mal_situado_(this.medical_kit_)){
                this.situa_medical_kit_(this.medical_kit_);
                }  
            }


            var min_enemigos = 1 + this.nivel_*2;
            var max_enemigos = 5 + this.nivel_*2;

            this.cuantos_enemigos_ = this.randInt_ (min_enemigos, max_enemigos);

            var tipo_enemigo = this.randInt_(0,4);            

            var r = this.randInt_ (150, 215);
            var g = this.randInt_ (90, 195);
            var b = this.randInt_ (90, 195);
            for (var i = 0; i < this.cuantos_enemigos_; i++) {
                var x_enemigo = this.randInt_ (200, this.ancho_total_ - 200);
                var y_enemigo = this.randInt_ (0, this.alto_total_ / 2);


                var enemigo = new Enemigo(this, x_enemigo, y_enemigo, tipo_enemigo, r, g, b);
                while(enemigo.mal_situado_()){
                    enemigo.resitua_();
                }


                this.enemigos_.push(enemigo);
            }


        }



    };



    this.portal_mal_situado_ = function(portal) {
        //Si está situado en una celda ocupado devuelvo true
        for (var i = portal.x; i < portal.x + portal.ancho_; i++) {
            for (var j = portal.y - 5; j < portal.y + portal.alto_; j++) {
                if(this.cell_(i, j)){
                    return true;
                }
            }
        }
        return false;
    };

    this.situa_portal_ = function(portal) {
        portal.x = this.randInt_ (this.playerancho_, this.ancho_total_ - this.playerancho_);
        portal.y = this.randInt_ (0, this.alto_total_ / 1.5);
    };

    this.medical_kit_mal_situado_ = function(medical_kit) {
        //Si está situado en una celda ocupado devuelvo true
        for (var i = medical_kit.x; i < medical_kit.x + medical_kit.ancho_; i++) {
            for (var j = medical_kit.y - 5; j < medical_kit.y + medical_kit.alto_; j++) {
                if(this.cell_(i, j)){
                    return true;
                }
            }
        }
        return false;
    };

    this.situa_medical_kit_ = function(medical_kit) {
        medical_kit.x = this.randInt_ (this.playerancho_, this.ancho_total_ - this.playerancho_);
        medical_kit.y = this.randInt_ (0, this.alto_total_ / 1.5);
    };


    this.render_game_over_ = function() {
        //Preparado para el game over
       var game_over;
        if(this.you_win_){
            game_over =  [
                            [ 1, 1,  , 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1,  ,  ,  , 1, 1,  , 1,  , 1,  , 1, 1,  , 1, 1,  ,  , 1,  ,  , 1,  , 1,  , 1,  ],
                            [  , 1, 1, 1,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  ,  ,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1,  ,  , 1,  ,  , 1,  , 1,  , 1,  ],
                            [  , 1, 1, 1,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  ,  ,  , 1, 1,  , 1,  , 1,  , 1, 1,  , 1, 1, 1,  , 1,  ,  , 1,  , 1,  , 1,  ],
                            [  , 1, 1, 1,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  ,  ,  ,  , 1,  , 1,  , 1,  , 1, 1,  , 1, 1,  , 1, 1,  ,  ,  ,  ,  ,  ,  ,  ],
                            [  , 1, 1, 1,  ,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  ,  ,  ,  ,  , 1,  , 1,  ,  , 1, 1,  , 1, 1,  ,  , 1,  ,  , 1,  , 1,  , 1,  ]
                        ];
        }
        else{

            game_over =  [
                            [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1, 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1],
                            [ 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1, 1, 1,  , 1, 1,  ,  ,  ,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  ,  ,  , 1, 1,  , 1],
                            [ 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1, 1,  ,  ,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1],
                            [ 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  ,  ,  ,  ,  , 1, 1,  , 1,  ,  , 1,  , 1,  , 1, 1,  ,  ,  , 1, 1, 1,  ],
                            [ 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1, 1, 1,  ,  ,  , 1, 1, 1, 1,  ,  ,  , 1,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1]
                        ];
        }

        var vplay_again =  [
                        [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1,  ,  , 1, 1, 1, 1,  , 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1,  ,  , 1,  ,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1, 1,  ,  , 1,  ,  , 1],
                        [ 1,  ,  , 1, 1,  , 1,  , 1, 1,  ,  ,  , 1, 1,  , 1,  ,  , 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1,  , 1, 1,  ,  , 1,  ,  , 1],
                        [ 1,  ,  , 1, 1, 1, 1,  , 1, 1,  ,  ,  , 1, 1, 1, 1,  ,  , 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1, 1, 1,  , 1,  ,  , 1],
                        [ 1,  ,  , 1, 1,  ,  ,  , 1, 1,  ,  ,  , 1, 1,  , 1,  ,  , 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  , 1, 1,  , 1, 1,  ,  , 1],
                        [ 1,  ,  , 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1,  ,  , 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1, 1,  ,  , 1,  ,  , 1],
                        [ 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
                    ];

        this.pinta_filas_columnas_(this.ctx, this.ancho_total_/2 - 330, 260, game_over, 16, "rgba(255,255,255,1)");
        this.pinta_filas_columnas_(this.ctx, this.ancho_total_/2 - 130, 380, play_again,  6, "rgba(255,255,255,1)");

        document.getElementById("play_again").style.display = "block";

    };
    this.game_over_ = function(ganador) {

        this.explosions_.push(
            new Explosion(this.ancho_total_/2, this.alto_total_/2, true, true, ganador)
        );
        this.pre_game_over_ = true;

        if(this.you_win_){
            window.audio.playbackRate = 3;
        }
        else{
            window.audio.playbackRate = 0.5;
        }


        var juego = this;
        window.setTimeout(function function_name(argument) {
            
            juego.pre_game_over_ = false;
            juego.is_game_over_ = true;
            juego.you_win_ = ganador;

            if(ganador){

                for (var i = 0; i < 20; i++) {
                    var x_enemigo = juego.randInt_ (200, juego.ancho_total_ - 200);
                    var y_enemigo = juego.randInt_ (0, juego.alto_total_ / 2);

                    var tipo_enemigo = juego.randInt_(0,4);  

                    var r = juego.randInt_ (150, 215);
                    var g = juego.randInt_ (90, 195);
                    var b = juego.randInt_ (90, 195);
                    var enemigo = new Enemigo(juego, x_enemigo, y_enemigo, tipo_enemigo, r, g, b);
                    while(enemigo.mal_situado_()){
                        enemigo.resitua_();
                    }


                    juego.enemigos_.push(enemigo);
                }

            }


        }, 2000)


    };


    //-------------------------------------------------------------------------
    // FIN DEL CONTROL JUEGO
    //-------------------------------------------------------------------------


    
    //-------------------------------------------------------------------------
    // UPDATE
    //-------------------------------------------------------------------------

    //Actualizo entidades del juego
    this.update_ = function(dt) {

        var salud = 9999999;
        var pasa_a_game_over = true;

        for (var jugador in this.playeres_) {
            if(this.playeres_[jugador].salud_ < salud){
                this.salud_actual_[jugador] = this.playeres_[jugador].salud_;
            }
            if(!this.playeres_[jugador].muerto_){
                pasa_a_game_over = false;
            }
        }

        if(pasa_a_game_over){
            juego.game_over_(true);
        }

        this.cambia_pantalla_ = true;
        for (var jugador in this.playeres_) {
            if (!this.playeres_[jugador].dentro_portal_){
                this.cambia_pantalla_ = false;
            }
        }

        if(this.cambia_pantalla_ && !this.cambia_pantalla_completo){
            this.tiempo_portal_ = this.timestamp_() + 3000;
            this.cambia_pantalla_completo = true;
        }

        //TODO: cambio de pantalla

        if((this.tiempo_portal_ < this.timestamp_()) && this.cambia_pantalla_completo){
            this.cambia_pantalla_ = false;
            this.ctx.globalAlpha = 1;
            this.cuantas_pantallas_++;

            var final = false;

            if(this.cuantas_pantallas_ > 5 && Math.random()>0.7){
                final = true;
            }

            //TODO: ver si llamo al setup o que hago
            this.setup_(final);
            this.cambia_pantalla_completo = false;
        }


        for (var jugador in this.playeres_) {
            this.playeres_[jugador].update_(dt);
        }
        



        if(this.moustro_final_){
            this.final_boss_.update_(dt);
        }
        if(!this.moustro_final_ || this.is_game_over_){
            for (var i = 0; i < this.enemigos_.length; i++) {
                this.enemigos_[i].update(dt);
            }
        }

      

    };

    //-------------------------------------------------------------------------
    // FIN UPDATE
    //-------------------------------------------------------------------------







    //-------------------------------------------------------------------------
    // RENDERING
    //-------------------------------------------------------------------------
  
    this.render_ = function(ctx, frame, dt) {

        ctx.clearRect(0, 0, this.ancho_total_, this.alto_total_);
        if(this.is_game_over_){
            this.radio_vision_ = this.ancho_total_;
            this.render_boss_(ctx, dt);
            this.render_player_(ctx, dt);
            this.render_explosion_(ctx);
            this.render_enemigos_(ctx, dt);

            ctx.fillStyle = "rgba(50,50,50,0.5)";
            ctx.fillRect(0,0,this.ancho_total_,this.alto_total_);
            this.render_game_over_(ctx);
            return;
        }
        //borro lo que hay y vuelvo a renderizar cosas

        //this.render_map_(ctx, dt, true);
        this.render_explosion_(ctx);
        this.render_enemigos_(ctx, dt);
        this.render_boss_(ctx, dt);

        if(!this.moustro_final_){
            this.render_portal_(ctx);
            this.render_medical_kit_(ctx);
        }

        this.render_map_(ctx, dt, true);
        this.render_bullets_(ctx);
        this.render_zapatillas_(ctx);

        if(this.moustro_final_){
            this.render_terremoto_(ctx);
        }
        this.render_player_(ctx, dt);




    };



    this.pre_shake_ = function() {
        if(this.tiempo_shacke_ > this.timestamp_()){
            var cuanto_shake = 4;
            if(this.tiempo_muerte_ > this.timestamp_()){
                cuanto_shake = cuanto_shake*10;
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
                if(this.final_boss_){
                    if(this.final_boss_.tiempo_terremoto_ > this.timestamp_()){
                        this.dx_shacke = (Math.random() - 0.5) * cuanto_shake * 2;
                        this.dy_shacke = (Math.random() - 0.5) * cuanto_shake * 2;
                    }
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



        for (var jugador in this.playeres_) {
            //Aqui para renderizar el mapa
            var x, y, cell;

            var empieza_y = 0;
            if((this.playeres_[jugador].centro_y_ - this.radio_vision_) > 0){
                empieza_y = Math.floor((this.playeres_[jugador].centro_y_ - this.radio_vision_) / this.MAP_.size_bloques_);
            }
            var fin_y = Math.floor((this.alto_total_) / this.MAP_.size_bloques_);
            if((this.playeres_[jugador].centro_y_ + this.radio_vision_) < this.alto_total_){
                fin_y = Math.floor((this.playeres_[jugador].centro_y_ + this.radio_vision_) / this.MAP_.size_bloques_);
            }

            var empieza_x = 0;
            if((this.playeres_[jugador].centro_x_ - this.radio_vision_) > 0){
                empieza_x = Math.floor((this.playeres_[jugador].centro_x_ - this.radio_vision_) / this.MAP_.size_bloques_);
            }
            var fin_x = Math.floor((this.ancho_total_) / this.MAP_.size_bloques_);
            if((this.playeres_[jugador].centro_x_ + this.radio_vision_) < this.ancho_total_){
                fin_x = Math.floor((this.playeres_[jugador].centro_x_ + this.radio_vision_) / this.MAP_.size_bloques_);
            }

            var distancia_centro = 0;
            var a = 0;
            var b = 0;
            for(y = empieza_y ; y <= fin_y ; y++) {
                for(x = empieza_x ; x <= fin_x ; x++) {
                    cell = this.tcell_(x, y);
                    if (cell) {
                        a = Math.abs(x - Math.floor(this.playeres_[jugador].centro_x_/this.MAP_.size_bloques_));
                        b = Math.abs(y - Math.floor(this.playeres_[jugador].centro_y_/this.MAP_.size_bloques_));
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
        


    }

    this.distancia_player_ = function(x,y){


        var distancia_centro = 99999999;

        for (var jugador in this.playeres_) {
            
            var a = 0;
            var b = 0;
            a = Math.abs(x - this.playeres_[jugador].centro_x_);
            b = Math.abs(y - this.playeres_[jugador].centro_y_);
            var new_distancia_centro = Math.sqrt( a*a + b*b );
            if(new_distancia_centro < distancia_centro){
                distancia_centro = new_distancia_centro;
            }
        }

        return distancia_centro;
    }


    this.render_portal_ = function(ctx) {

        radius = this.portal_.ancho_;
        var x_portal = this.portal_.x + this.portal_.ancho_ / 2;
        var y_portal = this.portal_.y + this.portal_.alto_ / 2;

        distancia_centro = this.distancia_player_(x_portal, y_portal);

        if(distancia_centro > this.radio_vision_ ){
            return;
        }

      
    

        var gradient = ctx.createRadialGradient(x_portal, y_portal, 0, x_portal, y_portal, radius);
        ctx.fillStyle = gradient;
        
        for (var i = -2; i < 2; i++) {
            var new_x_portal = x_portal + (0.5 - Math.random())*i*15;
            var new_y_portal = y_portal + (0.5 - Math.random())*i*15;
            var rand_int = this.randInt_ (110, 255);
            ctx.beginPath();
            ctx.arc(new_x_portal, new_y_portal, radius, 0, Math.PI * 2, false);
            gradient.addColorStop(0,"rgba("+Math.floor(rand_int/1.2)+", "+rand_int+", "+rand_int+", 0)");
            gradient.addColorStop(0.6,"rgba("+Math.floor(rand_int/1.2)+", "+rand_int+", "+rand_int+", 0)");
            gradient.addColorStop(0.8,"rgba("+Math.floor(rand_int/1.2)+", "+rand_int+", "+rand_int+", 0.2)");
            gradient.addColorStop(1,"rgba("+Math.floor(rand_int/1.2)+", "+rand_int+", "+rand_int+", 0.3)");
            ctx.fill();
        }
       
        ctx.beginPath();
        ctx.arc(x_portal, y_portal, radius*1.2, 0, Math.PI * 2, false);
        var gradient = ctx.createRadialGradient(x_portal, y_portal, 0, x_portal, y_portal, radius*1.2);

        gradient.addColorStop(0,"rgba(209,127,140, 0.2)");
        gradient.addColorStop(0.8,"rgba(209,127,140, 0.1)");
        gradient.addColorStop(1,"rgba(209,127,140, 0)");
        ctx.fillStyle = gradient;
        ctx.fill();

    };


    this.render_medical_kit_ = function(ctx) {

        
        var x_kit = this.medical_kit_.x + this.medical_kit_.ancho_ / 2;
        var y_kit = this.medical_kit_.y + this.medical_kit_.alto_ / 2;
        distancia_centro = this.distancia_player_(x_kit, y_kit);

        var tiempo_medical = this.timestamp_() - 10;
        for (var jugador in this.playeres_) {
            if(this.playeres_[jugador].tiempo_medical_ < tiempo_medical){
                tiempo_medical = this.playeres_[jugador].tiempo_medical_;
            }
        }


        var opacity_medical = tiempo_medical- this.timestamp_();
        if(opacity_medical < 0){
            opacity_medical = 1;
        }
        else{
            opacity_medical = opacity_medical / 1000;
            if (opacity_medical < 0.5){
                this.medical_kit_ = {};
            }
            else{
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth= opacity_medical * 20 + 10;
                lejos_quitar = (1 - opacity_medical) * 50;
                ctx.strokeRect(this.medical_kit_.x - lejos_quitar, this.medical_kit_.y - lejos_quitar, this.medical_kit_.alto_ + lejos_quitar*2, this.medical_kit_.alto_ + lejos_quitar*2);
            }
            return;
        }

        if(distancia_centro > this.radio_vision_ ){
            return;
        }

        var tween = this.tween_frames_(this.counter, 80);
        var tween2 = this.tween_frames_(this.counter, 60);
        var lejos_borde = tween * 5 + 2;
        var lejos_borde2 = tween2 * 10;

        ctx.fillStyle = 'rgba(255,110,110,'+(((1 - tween)/2) + 0.5 * opacity_medical/2)+')';
        var cruz_horizontal_x = this.medical_kit_.x;
        var cruz_horizontal_y = this.medical_kit_.y + this.medical_kit_.alto_/3;
        ctx.fillRect(cruz_horizontal_x, cruz_horizontal_y, this.medical_kit_.ancho_, this.medical_kit_.alto_/3);

        var cruz_vertical_x = this.medical_kit_.x + this.medical_kit_.alto_/3;
        var cruz_vertical_y = this.medical_kit_.y;
        ctx.fillRect(cruz_vertical_x, cruz_vertical_y, this.medical_kit_.ancho_/3, this.medical_kit_.alto_);



        ctx.strokeStyle = 'rgba(255,255,155,'+(tween/7 + 0.1 * opacity_medical/2)+')';
        ctx.lineWidth=8;
        ctx.strokeRect(this.medical_kit_.x - lejos_borde, this.medical_kit_.y - lejos_borde, this.medical_kit_.alto_ + lejos_borde*2, this.medical_kit_.alto_ + lejos_borde*2);

        ctx.strokeStyle = 'rgba(133,200,133,'+(tween/7 + 0.1 * opacity_medical/2)+')';
        ctx.lineWidth=15;
        ctx.strokeRect(this.medical_kit_.x - lejos_borde2, this.medical_kit_.y - lejos_borde2, this.medical_kit_.alto_ + lejos_borde2*2, this.medical_kit_.alto_ + lejos_borde2*2);



    };


    this.alto_ola_diff_ = 0;
    this.render_terremoto_ = function(ctx) {
        if(this.final_boss_.tiempo_terremoto_ > this.timestamp_()){

            var divisiones_pantalla = 40;

            var diff_time = this.final_boss_.tiempo_terremoto_ - this.timestamp_();
            var new_diff = Math.floor((diff_time / this.tiempo_terremoto_fix_)*divisiones_pantalla);

            new_diff = divisiones_pantalla - new_diff;

            var divisiones_alto_ola = 20;
            this.alto_ola_diff_ = new_diff%divisiones_alto_ola;

            if(this.alto_ola_diff_ > divisiones_alto_ola/2){
                this.alto_ola_diff_ = divisiones_alto_ola - this.alto_ola_diff_;
            }


            var alto_ola = (180/divisiones_alto_ola) * this.alto_ola_diff_;
            var ancho_ola = this.ancho_total_/divisiones_pantalla * 2;
            var distancia = this.ancho_total_/divisiones_pantalla * new_diff;

         
            //ctx.fillStyle = "rgba(150,120,120,1)";

            var grd=ctx.createLinearGradient(0,this.alto_total_ - 100 ,0,this.alto_total_);
            //grd.addColorStop(0,"rgba(250,40,40,0.1)");

            grd.addColorStop(0,"rgba(186,186,186,0.3)");
            grd.addColorStop(1,"rgba(0,0,0,1)");
            //grd.addColorStop(1,"rgba(0,0,0,1)");

            ctx.fillStyle=grd;

            var rand1 = (Math.random() - 0.5) * 10;
            var rand2 = (Math.random() - 0.5) * 10;
            var rand3 = (Math.random() - 0.5) * 10;
            var primera_distancia = distancia;
            ctx.fillRect(this.final_boss_.x - distancia + rand2, this.alto_total_ - alto_ola + 15 + rand1, ancho_ola, alto_ola + rand1);

            

            distancia = this.ancho_total_/divisiones_pantalla * (new_diff - 2);
            alto_ola_n = alto_ola * 0.7 + rand1
            ctx.fillRect(this.final_boss_.x - distancia + rand1, this.alto_total_ - alto_ola_n + 15 + rand2, ancho_ola, alto_ola_n + rand2);

            distancia = this.ancho_total_/divisiones_pantalla * (new_diff - 4);
            alto_ola_n = alto_ola * 0.4 + rand2
            ctx.fillRect(this.final_boss_.x - distancia + (Math.random() - 0.5) * 10, this.alto_total_ - alto_ola_n + 5, ancho_ola, alto_ola_n);

        
            

            distancia = this.ancho_total_/divisiones_pantalla * (new_diff + 2);
            alto_ola_n = alto_ola * 0.7 + rand3
            ctx.fillRect(this.final_boss_.x - distancia + rand1, this.alto_total_ - alto_ola_n + 15, ancho_ola, alto_ola_n);

            distancia = this.ancho_total_/divisiones_pantalla * (new_diff + 4);
            alto_ola_n = alto_ola * 0.4 + rand2
            ctx.fillRect(this.final_boss_.x - distancia + rand3, this.alto_total_ - alto_ola_n + 15, ancho_ola, alto_ola_n);

          
            x_empieza_terremoto = this.final_boss_.x - primera_distancia + rand2;
            x_final_terremoto = this.final_boss_.x - distancia + rand3;


            for (var jugador in this.playeres_) {

                if(this.playeres_[jugador].centro_x_ < x_empieza_terremoto && this.playeres_[jugador].centro_x_ > x_final_terremoto){
                    if(this.playeres_[jugador].centro_y_ > (this.alto_total_ - 100)){
                        this.playeres_[jugador].salud_ = this.playeres_[jugador].salud_ - 5;
                        this.playeres_[jugador].suena_herida_();
                        for (var i = 0; i < 10; i++) {
                            this.explosions_.push(
                                new Explosion(this.playeres_[jugador].centro_x_, this.playeres_[jugador].centro_y_, true)
                            );
                        }
                        this.playeres_[jugador].tiempo_atacado_ = this.timestamp_() + 2200;
                    }
                }
            }

        }
        

    };


    //Llama a la funcion del objeto de jugador para pintarlo... lo pongo así, porque igual hay que pintar el jugador diferente según algo del juego
    this.render_player_ = function(ctx, dt) {

        for (var jugador in this.playeres_) {
            this.playeres_[jugador].pinta_player_(dt, ctx, this.counter);
        }
    };

    //Llama a la funcion del objeto de jugador para pintarlo... lo pongo así, porque igual hay que pintar el jugador diferente según algo del juego
    this.render_enemigos_ = function(ctx, dt) {
        for (var i = 0; i < this.enemigos_.length; i++) {

            var distancia_jugador = this.distancia_player_(this.enemigos_[i].x, this.enemigos_[i].y);
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

                var distancia_centro = 999999999999;
   
                for (var jugador in this.playeres_) {
                    
                    var a = 0;
                    var b = 0;
                    a = Math.abs(particle.x - this.playeres_[jugador].centro_x_);
                    b = Math.abs(particle.y - this.playeres_[jugador].centro_y_);
                    var new_distancia_centro = Math.sqrt( a*a + b*b );
                    if(new_distancia_centro < distancia_centro){
                        distancia_centro = new_distancia_centro;
                    }
                }

                if(this.is_game_over_ && particle.final){
                    particlesAfterRemoval.splice(ii, 1);
                    continue
                }
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

            var distancia_centro = 999999999999;

            for (var jugador in this.playeres_) {
                
                var a = 0;
                var b = 0;
                a = Math.abs(disparo.x - this.playeres_[jugador].centro_x_);
                b = Math.abs(disparo.y - this.playeres_[jugador].centro_y_);
                var new_distancia_centro = Math.sqrt( a*a + b*b );
                if(new_distancia_centro < distancia_centro){
                    distancia_centro = new_distancia_centro;
                }
            }


            if(distancia_centro < this.radio_vision_ * 1.2){

                if(!this.moustro_final_){
                    for (var j = 0; j < this.cuantos_enemigos_; j++) {
                        
                        if(!this.enemigos_[j].muerto && this.timestamp_()>this.enemigos_[j].muriendo_){
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
                                this.enemigos_[j].muriendo_ = this.timestamp_() + 400;
                                this.enemigos_[j].muerto = true;
                                continue;


                            }
                        }
                        
                    }
                }
                else{
                    if(this.overlap_(this.final_boss_.x, this.final_boss_.y, this.final_boss_.ancho_, this.final_boss_.alto_, disparo.x - size_bala/2, disparo.y - size_bala/2, size_bala, size_bala)){
                        

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
                

                        this.bullets_.splice(i, 1);
                        this.final_boss_.tiempo_herido_ = this.timestamp_() + 400;
                        continue;

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


            
                var opacidad = 1 - distancia_centro/(this.radio_vision_ * 1.2);
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


    this.render_zapatillas_ = function (ctx) {
        for (var i = 0; i < this.zapatillas_.length; i++) {
            var disparo_boss = this.zapatillas_[i];
            var size_bala = disparo_boss.size * 100;
    

            var negativo = 1;
            if(disparo_boss.xv < 0){
                negativo = - 1;
            }

            var continua = true;

            if(disparo_boss.muriendo_ > this.timestamp_()){

                var rand_exp1 = (Math.random() - 0.5) * 10;
                var rand_exp2 = (Math.random() - 0.5) * 10;
                var rand_exp3 = (Math.random() - 0.5) * 10;

                var radio_explosion_muerte = Math.random() * 80;



                for (var jugador in this.playeres_) {
                    
                    if(this.dentro_circulo_(this.playeres_[jugador].centro_x_, this.playeres_[jugador].centro_y_, disparo_boss.x, disparo_boss.y, radio_explosion_muerte) &&
                        !disparo_boss.muerto_){
                        this.playeres_[jugador].salud_ -= 5;
                        this.playeres_[jugador].suena_herida_();

                        for (var i = 0; i < 10; i++) {
                            this.explosions_.push(
                                new Explosion(this.playeres_[jugador].centro_x_, this.playeres_[jugador].centro_y_, true)
                            );
                        }
                        this.playeres_[jugador].tiempo_atacado_ = this.timestamp_() + 2000; 
                    }
                }



         
                var blue = Math.floor(Math.random() * 255);

                ctx.beginPath();
                ctx.fillStyle = 'rgba(0,0,'+blue+',0,0.1)';
                ctx.arc(disparo_boss.x+rand_exp1 + size_bala/2, disparo_boss.y+rand_exp2+size_bala/2, radio_explosion_muerte, Math.PI * 2, 0, false);
                ctx.closePath();
                ctx.fill();
                continua = false;
            }
            else if(disparo_boss.pre_muerto_){
                disparo_boss.muerto_ = true;

            }

            if(disparo_boss.muerto_){
                this.zapatillas_.splice(i, 1);
                continue;

            }
            

            //TODO: optimizar esto

            for (var jugador in this.playeres_) {
                if((this.cell_(disparo_boss.x,disparo_boss.y) || 
                        this.cell_(disparo_boss.x - 5 ,disparo_boss.y) || 
                        this.cell_(disparo_boss.x - 10 ,disparo_boss.y) || 
                        this.cell_(disparo_boss.x, disparo_boss.y - 5) || 
                        this.cell_(disparo_boss.x, disparo_boss.y - 10) ||  
                        this.cell_(disparo_boss.x, disparo_boss.y + 5) || 
                        this.cell_(disparo_boss.x, disparo_boss.y + 10) || 
                        this.cell_(disparo_boss.x, disparo_boss.y + 20) ||
                        this.cell_(disparo_boss.x, disparo_boss.y + 30) || 
                        this.cell_(disparo_boss.x, disparo_boss.y + 40) || 
                        this.cell_(disparo_boss.x, disparo_boss.y + 50) ||
                        this.overlap_(this.playeres_[jugador].x, this.playeres_[jugador].y, this.playerancho_, this.playeralto_, disparo_boss.x - size_bala/2, disparo_boss.y - size_bala/2, size_bala, size_bala)
                        ) && !disparo_boss.pre_muerto_){


                    disparo_boss.muriendo_ = this.timestamp_() + 500;
                    disparo_boss.pre_muerto_ = true;

                }
            }
            


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
            
            //ctx.pinta_filas_columnas_(disparo_boss.x, disparo_boss.y, size_bala, Math.PI * 2, 0, false);

            ctx.beginPath();
            ctx.fillStyle = "rgba(250,0,0,0.01)";
            ctx.arc(disparo_boss.x, disparo_boss.y, size_bala, Math.PI * 2, 0, false);
            ctx.closePath();
            ctx.fill();
            
            var zapa_size = 8;
            var zapa_centro_x_ = disparo_boss.x + (zapa_size * zapatilla[0].length / 2);
            var zapa_centro_y_ = disparo_boss.y + (zapa_size * zapatilla[0].length / 2);
            var zapa_izq_x = disparo_boss.x + (zapa_size * zapatilla[0].length / 2);
            var zapa_izq_y = disparo_boss.y + (zapa_size * zapatilla[0].length / 2);




            ctx.save();
            ctx.translate(zapa_centro_x_, zapa_centro_y_);
            ctx.rotate(disparo_boss.angulo_*Math.PI/180);
            var zapa_relative = (-1) * zapa_size * zapatilla[0].length / 2;



            ctx.arc(0, 0, 70, 0, Math.PI * 2, false);
            var gradient = ctx.createRadialGradient(0, 0, 70, 0, 0, 0);
            gradient.addColorStop(0,"rgba(151, 110, 143, 0)");
            gradient.addColorStop(1,"rgba(151, 110, 143, 0.6)");
            ctx.fillStyle = gradient;
            ctx.fill();


            var color_zapa = "rgba(251, 110, 143, 0.7)";
            if(!continua){
                var opacidad = (disparo_boss.muriendo_ - this.timestamp_())/2500;
                color_zapa = "rgba(251, 110, 143, "+opacidad+")";
            }

            this.pinta_filas_columnas_(ctx, zapa_relative, zapa_relative, zapatilla, zapa_size, color_zapa);
            ctx.restore();

            if (disparo_boss.x > this.ancho_total_ || disparo_boss.x < 0) {
                this.zapatillas_.splice(i, 1);
                continue;
            }

            if(!continua){
                continue;
            }

            disparo_boss.x += disparo_boss.xv;
            disparo_boss.y += disparo_boss.yv;
            disparo_boss.angulo_ += disparo_boss.xv;

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
        var y_logo = 180;


        var loading =  [
                        [ 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1, 1,  ,  , 1, 1,  , 1, 1,  ,  , 1,  , 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                        [ 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  ,  ,  ,  , 1, 1,  ,  , 1,  , 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                        [ 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1, 1, 1,  , 1,  , 1, 1,  , 1, 1,  ,  ,  ,  ,  ,  ,  ,  ],
                        [ 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  , 1, 1,  , 1, 1,  , 1, 1,  ,  , 1,  ,  ,  ,  ,  ,  ,  ,  ],
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1, 1,  ,  , 1, 1,  , 1, 1,  ,  , 1,  , 1, 1, 1, 1, 1,  , 1,  , 1,  , 1,  ,  ]
                ];



        var size_loading_px = 4;
        var x_loading = this.ancho_total_/2 - (size_loading_px * loading[0].length)/2;
        

        this.pinta_filas_columnas_(ctx, x_logo, y_logo, logo, size_logo_px, "#ffffff");
        
        for (var i = -2; i < 2; i++) {
            var new_x_portal = x_logo + (0.5 - Math.random())*i*15;
            var new_y_portal = y_logo + (0.5 - Math.random())*i*15;
            this.pinta_filas_columnas_(ctx, new_x_portal, new_y_portal, logo, size_logo_px, "rgba("+this.randInt_(222,255)+","+this.randInt_(222,255)+","+this.randInt_(222,255)+",0.1)");
        }
        


        var opacidad = this.tween_frames_(this.counter, 60);
        var color_loading = "rgba(255,255,255,"+opacidad+")";

        this.pinta_filas_columnas_(ctx, x_loading, 260, loading, size_loading_px, color_loading);
        
    };


    

    //Pinta el cargador con un porcentaje
    this.angulo__intro_ = 0;
    this.tiempo_intro_ = this.timestamp_() + 5000;
    this.fin_intro_ = this.timestamp_();
    this.cambia_pantalla_intro_ = false;


    this.pinta_intro_ = function(ctx, dt) {

        if(this.fin_intro_ < this.timestamp_() && this.cambia_pantalla_intro_){
            this.setup_(false, 1800);
            window.audio.play();
            this.empezado_ = true;
            return;
        }

        if(!this.cambia_pantalla_intro_){
            //this.intro_mueve_derecha_ = (this.ancho_total_ / 2) - 200 + (300 - (this.tiempo_intro_ - this.timestamp_())/15);
            this.intro_mueve_derecha_ = (this.ancho_total_ / 2) - 200 + this.counter*2;
        }

        this.playeres_["intro"] = new Player(this, this.intro_mueve_derecha_, (this.alto_total_ / 2) + 100, 1000, 30000, this.salud_inicial_);
        this.playeres_["intro"].is_intro = true;

        this.portal_ = {};
        this.portal_.ancho_ = this.playeralto_;
        this.portal_.alto_ = this.playeralto_;
        this.portal_.x = (this.ancho_total_ / 2) + 150;
        this.portal_.y = (this.alto_total_ / 2) + 100;

        this.playeres_["intro"].right = true;
        if(this.playeres_["intro"].x >= this.portal_.x + 10 && !this.cambia_pantalla_intro_){
            this.cambia_pantalla_intro_ = true;
            this.fin_intro_ = this.timestamp_() + 3000;
        }
        if(this.playeres_["intro"].x >= this.portal_.x + 10){
            this.playeres_["intro"].dentro_portal_ = true;
        }

        this.render_portal_(ctx);
        this.playeres_["intro"].pinta_home_();
        this.angulo__intro_ = this.playeres_["intro"].pinta_player_(dt, ctx, this.counter, this.angulo__intro_);

    };




    //-------------------------------------------------------------------------
    // FIN RENDERING
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


    //Contador de frames
    juego.counter = 0; 

    var dt = 0, 
        now,
        last = juego.timestamp_();


    var fpsInterval = 1000 / 20;

    var then = juego.timestamp_();

    function frame() {
        
        if(juego.pausa_){
            requestAnimationFrame(frame, canvas);
            return;
        }


        if(!juego.empezado_){

            juego.counter++;
            juego.ctx.clearRect(0, 0, juego.ancho_total_, juego.alto_total_);
            juego.muestra_logo_(juego.ctx);
            juego.pinta_intro_(juego.ctx, dt);
            
            requestAnimationFrame(frame, canvas);
            return;
        }


        if (juego.playeres_["intro"] !== undefined) {
            delete juego.playeres_["intro"];
        }
        now = juego.timestamp_();
        dt = dt + Math.min(1, (now - last) / 1000);
        while(dt > juego.step_) {
            dt = dt - juego.step_;
            if(!juego.pre_game_over_){
                juego.update_(juego.step_);
            }
        }
        if(juego.pre_game_over_){
            var elapsed = now - then;

            if (elapsed > fpsInterval) {
                juego.pre_shake_();
                juego.render_(juego.ctx, juego.counter, dt);
                juego.post_shake_();
                juego.update_(juego.step_);
                then = now - (elapsed % fpsInterval);
            }
        }
        else{
            juego.pre_shake_();
            juego.render_(juego.ctx, juego.counter, dt);
            juego.post_shake_();
        }

        last = now;
        juego.counter++;
        requestAnimationFrame(frame, canvas);
    }





    //Locurón que hay que hacer con la música
    var music_player = new CPlayer();
    var flag_song = false;
    music_player.init(song);

    var golpe_player = new CPlayer();
    golpe_player.init(golpe);
    var flag_golpe = false;
    window.golpe_audio;

    var disparo_player = new CPlayer();
    disparo_player.init(disparo);
    var flag_disparo = false;
    window.disparo_audio;
    window.disparo_audio2;

    var levelup_player = new CPlayer();
    levelup_player.init(levelup);
    var flag_levelup = false;
    window.levelup_audio2;




    var done = false;

    frame();
    

    var intervalo_cancion = setInterval(function () {
        //Al final cuando toda la música está cargada se lanza esto
        if (done) {

            //Ademas se limpia este intervalo que no de más el follón
            clearInterval(intervalo_cancion);
            return;
        }

        if(!flag_song){
            var music_percent = music_player.generate();
            juego.music_percent = music_percent;
            if(music_percent >= 1){
                flag_song = true;
            }
        }

        
        if(!flag_golpe){
            if(golpe_player.generate() >= 1){
                flag_golpe = true;
            }
        }
        
        
        if(!flag_levelup){
            if(levelup_player.generate() >= 1){
                flag_levelup = true;
            }
        }
        
        if(!flag_disparo){
            if(disparo_player.generate() >= 1){
                flag_disparo = true;
            }
        }
        
        done = (flag_song && flag_disparo && flag_golpe);

        if (done) {
          
            var wave = music_player.createWave();
            window.audio = document.createElement("audio");
            window.audio.src = URL.createObjectURL(new Blob([wave], {type: "audio/wav"}));
            window.audio.loop=true;

            window.audio.volume = 0.3;

            var wave3 = golpe_player.createWave();
            window.golpe_audio = document.createElement("audio");
            window.golpe_audio.src = URL.createObjectURL(new Blob([wave3], {type: "audio/wav"}));
            window.golpe_audio.volume = 0.5;

            var wave5 = levelup_player.createWave();
            window.levelup_audio2 = document.createElement("audio");
            window.levelup_audio2.src = URL.createObjectURL(new Blob([wave5], {type: "audio/wav"}));
            window.levelup_audio2.volume = 1;

            var wave6 = disparo_player.createWave();
            window.disparo_audio2 = document.createElement("audio");
            window.disparo_audio = document.createElement("audio");
            window.disparo_audio.src = URL.createObjectURL(new Blob([wave6], {type: "audio/wav"}));
            window.disparo_audio.volume = 0.6;

            window.disparo_audio2.src = URL.createObjectURL(new Blob([wave6], {type: "audio/wav"}));
            window.disparo_audio2.volume = 0.3;
        
        }
    }, 50);



    // Listen for messages from other devices
    air_console.onMessage = function(from, data) {

        switch(data) {
            case "left":   
                juego.playeres_[from].left  = true;
                return false;
            case "left_false":   
                juego.playeres_[from].left  = false;
                return false;
            case "right":  
                juego.playeres_[from].right  = true; 
                return false;
            case "right_false":  
                juego.playeres_[from].right  = false; 
                return false;
            case "jump":  
                juego.playeres_[from].jump  = true; 
                return false;
            case "jump_false":  
                juego.playeres_[from].jump  = false; 
                return false;
            case "accion":  
                juego.playeres_[from].accion  = true; 
                return false;
            case "accion_false":  
                juego.playeres_[from].accion  = false; 
                return false;
        }

    };

    window.jugadores = [];
    air_console.onConnect = function(device_id) {
        console.log("entra alguien",device_id);

        var nuevo_jugador = {};
        nuevo_jugador.id = device_id;
        nuevo_jugador.color = "color1";

        window.jugadores.push(nuevo_jugador);
        juego.playeres_[device_id] = new Player(juego, 60 * Math.random(), juego.alto_total_ - 100, 1000, 30000, juego.salud_inicial_);

    };



})();
