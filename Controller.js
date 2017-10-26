var air_console = new AirConsole({"orientation": AirConsole.ORIENTATION_LANDSCAPE});

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


    this.ancho_total_ = 840;
    this.alto_total_  = 600;





    //-------------------------------------------------------------------------
    // UTILITIES
    //-------------------------------------------------------------------------

    //Control si es un móvil o tablet
    this.is_touch_device_ = function() {
        return 'ontouchstart' in document.documentElement;
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
                        var distancia_centro = 0;
                        var a = 0;
                        var b = 0;
                        a = Math.abs(currX + i_x * size - this.player_.centro_x_);
                        b = Math.abs(currY - this.player_.centro_y_);
                        distancia_centro = Math.sqrt( a*a + b*b );



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
          
    };
  
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


        var self = this;

        document.getElementById('der_mobile').addEventListener('touchstart', function(e){
            air_console.message(AirConsole.SCREEN, "right");
            this.className = "tecla_mobile pulsada";
            e.preventDefault();
        });

        document.getElementById('izq_mobile').addEventListener('touchstart', function(e){ 
            air_console.message(AirConsole.SCREEN, "left");
            this.className = "tecla_mobile pulsada";
            e.preventDefault();
        });

        document.getElementById('arr_mobile').addEventListener('touchstart', function(e){ 
            air_console.message(AirConsole.SCREEN, "jump");
            this.className = "tecla_mobile pulsada";
            e.preventDefault();
        });

        document.getElementById('der_mobile').addEventListener('mousedown', function(e){
            air_console.message(AirConsole.SCREEN, "right");
            this.className = "tecla_mobile pulsada";
            e.preventDefault();
        });

        document.getElementById('izq_mobile').addEventListener('mousedown', function(e){ 
            air_console.message(AirConsole.SCREEN, "left");
            this.className = "tecla_mobile pulsada";
            e.preventDefault();
        });

        document.getElementById('arr_mobile').addEventListener('mousedown', function(e){ 
            air_console.message(AirConsole.SCREEN, "jump");
            this.className = "tecla_mobile pulsada";
            e.preventDefault();
        });

        document.getElementById('accion_mobile').addEventListener('mousedown', function(e){ 
            air_console.message(AirConsole.SCREEN, "accion");
            this.className = "tecla_mobile pulsada";
            e.preventDefault();
        });

        document.getElementById('lost').addEventListener('touchmove', function(e){ 
            var target = document.elementFromPoint(e.touches[0].pageX, e.touches[0].pageY);

            e.preventDefault();
            if(target.id === "der_mobile"){
                air_console.message(AirConsole.SCREEN, "right");
                document.getElementById('der_mobile').className = "tecla_mobile pulsada";
            }
            else{
                air_console.message(AirConsole.SCREEN, "right_false");
                document.getElementById('der_mobile').className = "tecla_mobile";

            }
            if(target.id === "izq_mobile"){
                air_console.message(AirConsole.SCREEN, "left");
                document.getElementById('izq_mobile').className = "tecla_mobile pulsada";
            }
            else{
                air_console.message(AirConsole.SCREEN, "left_false");
                document.getElementById('izq_mobile').className = "tecla_mobile";
                
            }
            
        });




        document.getElementById('der_mobile').addEventListener('touchend', function(e){
            air_console.message(AirConsole.SCREEN, "right_false");
            this.className = "tecla_mobile";
            e.preventDefault();
        });

        document.getElementById('izq_mobile').addEventListener('touchend', function(e){ 
            air_console.message(AirConsole.SCREEN, "left_false");
            this.className = "tecla_mobile";
            e.preventDefault();
        });

        document.getElementById('arr_mobile').addEventListener('touchend', function(e){ 
            air_console.message(AirConsole.SCREEN, "jump_false");
            this.className = "tecla_mobile";
            e.preventDefault();
        });

        document.getElementById('accion_mobile').addEventListener('touchend', function(e){ 
            air_console.message(AirConsole.SCREEN, "accion_false");
            this.className = "tecla_mobile";
            e.preventDefault();
        });

        document.getElementById('der_mobile').addEventListener('mouseup', function(e){
            air_console.message(AirConsole.SCREEN, "right_false");
            this.className = "tecla_mobile";
            e.preventDefault();
        });

        document.getElementById('izq_mobile').addEventListener('mouseup', function(e){ 
            air_console.message(AirConsole.SCREEN, "left_false");
            this.className = "tecla_mobile";
            e.preventDefault();
        });

        document.getElementById('arr_mobile').addEventListener('mouseup', function(e){ 
            air_console.message(AirConsole.SCREEN, "jump_false");
            this.className = "tecla_mobile";
            e.preventDefault();
        });

        document.getElementById('accion_mobile').addEventListener('mouseup', function(e){ 
            air_console.message(AirConsole.SCREEN, "accion_false");
            this.className = "tecla_mobile";
            e.preventDefault();
        });
          
    };


    var canvas_mobile;
    var ctx_mobile;
    var self = this;
    this.controla_orientacion_ = function(){
        console.log("innerHeight",window.innerHeight);
        console.log("innerWidth",window.innerWidth);
        if(this.is_touch_device_() || true){
            self.pinta_cosas_mobile_();
            
            /*
            if (window.innerHeight > window.innerWidth) {
                self.pinta_cosas_mobile_gira_();
            } else {
                self.pinta_cosas_mobile_();
            }
            window.addEventListener('orientationchange', function (argument) {
                window.setTimeout(function () {
                    if (window.innerHeight > window.innerWidth) {
                        self.pinta_cosas_mobile_gira_();
                    } else {
                        self.pinta_cosas_mobile_();
                    }
                },300);
            });
            */
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

    //Control de orientación en mobile
    juego.controla_orientacion_();




})();
