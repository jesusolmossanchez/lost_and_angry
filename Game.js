

/**************************************************
** GAME CLASS
**************************************************/
var Game = function() {




    //Variables que uso por ahí

    this.empezado_ = false;
    this.pausa_ = false;
    this.is_game_over_ = false;

    //Preparado para el mapa
    this.MAP_ = {};
    this.MAP_.datos = [];
    this.MAP_.size_bloques_ = 20;
    this.MAP_.ancho_bloques_ = 126;
    this.MAP_.alto_bloques_ = 90;


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

    //Numeros para pintar... igual me hacen falta
    this.numeros_ = {
                '0': [
                    [1, 1, 1],
                    [1, ,  1],
                    [1, ,  1],
                    [1, ,  1],
                    [1, 1, 1]
                ],
                '1': [
                    [ , , 1],
                    [ , , 1],
                    [ , , 1],
                    [ , , 1],
                    [ , , 1]
                ],
                '2': [
                    [ 1, 1, 1],
                    [  ,  , 1],
                    [ 1, 1, 1],
                    [ 1,  ,  ],
                    [ 1, 1, 1]
                ],
                '3': [
                    [ 1, 1, 1],
                    [  ,  , 1],
                    [ 1, 1, 1],
                    [  ,  , 1],
                    [ 1, 1, 1]
                ],
                '4': [
                    [ 1,  , 1],
                    [ 1,  , 1],
                    [ 1, 1, 1],
                    [  ,  , 1],
                    [  ,  , 1]
                ],
                '5': [
                    [ 1, 1, 1],
                    [ 1,  ,  ],
                    [ 1, 1, 1],
                    [  ,  , 1],
                    [ 1, 1, 1]
                ],
                '6': [
                    [ 1, 1, 1],
                    [ 1,  ,  ],
                    [ 1, 1, 1],
                    [ 1,  , 1],
                    [ 1, 1, 1]
                ],
                '7': [
                    [ 1, 1, 1],
                    [  ,  , 1],
                    [  ,  , 1],
                    [  ,  , 1],
                    [  ,  , 1]
                ],
                '8': [
                    [ 1, 1, 1],
                    [ 1,  , 1],
                    [ 1, 1, 1],
                    [ 1,  , 1],
                    [ 1, 1, 1]
                ],
                '9': [
                    [ 1, 1, 1],
                    [ 1,  , 1],
                    [ 1, 1, 1],
                    [  ,  , 1],
                    [ 1, 1, 1]
                ],
            };




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
                player.left  = down;
                return false;
            case this.KEY.RIGHT: 
                ev.preventDefault(); 
                player.right  = down; 
                return false;
            case this.KEY.UP: 
                ev.preventDefault(); 
                player.jump  = down; 
                return false;
            case this.KEY.DOWN: 
                ev.preventDefault(); 
                player.down  = down; 
                return false;
            case this.KEY.ENTER: 
                ev.preventDefault(); 
                player.accion  = down; 
                return false;
            case this.KEY.Z: 
                ev.preventDefault(); 
                player.accion  = down; 
                return false;
        }
    };

    //devuelve el tiempo en milisegundos
    this.timestamp_ = function() {
        return new Date().getTime();
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
    this.tcell_ = function(tx,ty){
        return this.MAP_.datos[tx + (ty*this.MAP_.ancho_bloques_)];
    }
    */


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
    this.setup_ = function() {
        player = new Player(this, 96, 1107, 800, 30000, 1);
    };



    this.empieza_ = function(){
        
        //Hacer cosas al empezar?

    };


    this.game_over_ = function(ctx) {
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

        this.pinta_filas_columnas_(ctx, this.ancho_total_/2 - 330, 250, game_over, 16);
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
        player.update(dt);
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

        this.render_map_(ctx, dt);
        this.render_player_(ctx, dt);
        this.render_explosion_(ctx);
    };



    this.render_map_ = function(ctx, dt) {
        //Aqui para renderizar el mapa
        
    }


    //Llama a la funcion del objeto de jugador para pintarlo... lo pongo así, porque igual hay que pintar el jugador diferente según algo del juego
    this.render_player_ = function(ctx, dt) {
        player.pinta_player_(dt, ctx, this.counter);
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

                // Check particle size
                // If 0, remove
                if (particle.size <= 0) {
                    particlesAfterRemoval.splice(ii, 1);
                    continue;
                }

                ctx.beginPath();
                //ctx.arc(particle.x, particle.y, particle.size, Math.PI * 2, 0, false);
                ctx.fillRect(particle.x, particle.y, particle.size, particle.size);

                ctx.closePath();
                ctx.fillStyle = 'rgb(' + particle.r + ',' + particle.g + ',' + particle.b + ')';
                ctx.fill();

                // Update
                particle.x += particle.xv;
                particle.y += particle.yv;
                particle.size -= 0.1;
            }

            explosion.particles_ = particlesAfterRemoval;

        }
    };



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

        document.getElementById('der_mobile').addEventListener('touchstart', function(e){
            player.right = true;
            this.className = "tecla_mobile pulsada";
            e.preventDefault();
        });

        document.getElementById('izq_mobile').addEventListener('touchstart', function(e){ 
            player.left = true;
            this.className = "tecla_mobile pulsada";
            e.preventDefault();
        });

        document.getElementById('arr_mobile').addEventListener('touchstart', function(e){ 
            player.jump = true;
            this.className = "tecla_mobile pulsada";
            e.preventDefault();
        });

        document.getElementById('accion_mobile').addEventListener('touchstart', function(e){ 
            player.accion = true;
            this.className = "tecla_mobile pulsada";
            e.preventDefault();
        });



        document.getElementById('der_mobile').addEventListener('touchend', function(e){
            player.right = false;
            this.className = "tecla_mobile";
            e.preventDefault();
        });

        document.getElementById('izq_mobile').addEventListener('touchend', function(e){ 
            player.left = false;
            this.className = "tecla_mobile";
            e.preventDefault();
        });

        document.getElementById('arr_mobile').addEventListener('touchend', function(e){ 
            player.jump = false;
            this.className = "tecla_mobile";
            e.preventDefault();
        });

        document.getElementById('accion_mobile').addEventListener('touchend', function(e){ 
            player.accion = false;
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
  
    //Bucle principal
    function frame() {
        if(!juego.empezado_ || juego.pausa_){
            requestAnimationFrame(frame, canvas);
            return;
        }
        now = juego.timestamp_();
        dt = dt + Math.min(1, (now - last) / 1000);
        while(dt > juego.step_) {
            dt = dt - juego.step_;
            juego.update_(juego.step_);
        }
        juego.render(juego.ctx, juego.counter, dt);
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
            juego.setup_();
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
    }, 40);


})();
