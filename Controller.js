var air_console = new AirConsole({"orientation": AirConsole.ORIENTATION_LANDSCAPE});
window.numero = "0";
 // Listen for messages from other devices
air_console.onMessage = function(from, data) {

    if(data.mensaje === "nuevo_color"){
        window.color = data.color;
        window.numero = data.numero;

        canvas_mobile   = document.getElementById('canvas_mobile');
        ctx_mobile      = canvas_mobile.getContext('2d');
        ctx_mobile.clearRect(0, 0, window.ancho, window.alto);
        window.juego.controla_orientacion_();
        window.juego.muestra_logo_(ctx_mobile);
    }

};

/**************************************************
** GAME CLASS
**************************************************/
var Game = function() {

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



    //Pinta el logo
    this.muestra_logo_ = function(ctx) {
        var logo =  [
                        [ 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1, 1,  ,  , 1,  , 1, 1, 1,  ,  ,  ,  , 1, 1, 1, 1,  , 1, 1,  ,  , 1,  , 1, 1, 1, 1,  ,  , 1, 1, 1, 1,  ,  , 1, 1,  ,  , 1, 1,],
                        [ 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1,  ,  ,  ,  , 1, 1,  ,  ,  ,  , 1, 1,  , 1,  , 1, 1,  ,  , 1,  , 1, 1,  , 1,  ,  ,  , 1, 1,  , 1,  , 1, 1,  ,  , 1,  , 1, 1,  ,  ,  ,  , 1, 1,  , 1,  ,  ,  , 1, 1, 1, 1,  ,],
                        [ 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1, 1, 1,  ,  , 1, 1,  ,  ,  ,  , 1, 1,  , 1,  , 1, 1, 1,  , 1,  , 1, 1,  , 1,  ,  ,  , 1, 1,  , 1,  , 1, 1, 1,  , 1,  , 1, 1,  , 1, 1,  , 1, 1, 1,  ,  ,  ,  ,  , 1, 1,  ,  ,],
                        [ 1, 1,  ,  ,  , 1, 1,  , 1,  ,  ,  , 1, 1,  ,  , 1, 1,  ,  ,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1, 1,  , 1, 1,  , 1,  ,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1, 1,  , 1, 1,  ,  , 1,  , 1, 1,  , 1,  ,  ,  ,  , 1, 1,  ,  ,],
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  ,  , 1, 1,  ,  ,  ,  , 1, 1,  , 1,  , 1, 1,  ,  , 1,  , 1, 1, 1,  ,  ,  ,  , 1, 1,  , 1,  , 1, 1,  ,  , 1,  , 1, 1, 1, 1, 1,  , 1, 1,  ,  , 1,  ,  ,  , 1, 1,  ,  ,]
                ];

        var size_logo_px = 6;
        var x_logo = window.ancho/2 - (size_logo_px * logo[0].length)/2;
        var y_logo = 50;


        var color_logo = "#ffffff";
        if(window.color){
            color_logo = window.color;
        }

        this.pinta_filas_columnas_(ctx, x_logo, y_logo, logo, size_logo_px, color_logo);

        var p =  [
                [ 1, 1, 1, 1,  ],
                [ 1, 1,  , 1,  ],
                [ 1, 1, 1, 1,  ],
                [ 1, 1,  ,  ,  ],
                [ 1, 1,  ,  ,  ],
        ];
        var flecha =  [
                [ 1, 1, 1, 1, 1],
                [  , 1, 1, 1,  ],
                [  ,  , 1,  ,  ]
        ];

        this.pinta_filas_columnas_(ctx, window.ancho/2 - 50, y_logo + 60, p, size_logo_px * 2, color_logo);
        this.pinta_filas_columnas_(ctx, window.ancho/2 + 10, y_logo + 60, this.numeros_[window.numero], size_logo_px * 2, color_logo);
        this.pinta_filas_columnas_(ctx, window.ancho/2 - 25, y_logo + 130, flecha, size_logo_px * 2, color_logo);
        
        for (var i = -2; i < 2; i++) {
            var new_x_portal = x_logo + (0.5 - Math.random())*i*15;
            var new_y_portal = y_logo + (0.5 - Math.random())*i*15;
            this.pinta_filas_columnas_(ctx, new_x_portal, new_y_portal, logo, size_logo_px, "rgba("+this.randInt_(222,255)+","+this.randInt_(222,255)+","+this.randInt_(222,255)+",0.1)");
        }
        
    };

    this.pinta_cosas_mobile_ = function() {
        document.getElementById('canvas_mobile_gira').style.display = "none";

        canvas_mobile   = document.getElementById('canvas_mobile');
        ctx_mobile      = canvas_mobile.getContext('2d');
        canvas_mobile.style.display = "block";

        canvas_mobile.width  = this.ancho_total_;

        canvas_mobile.height = window.alto;


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

        var alto_cosas = canvas_mobile.height - size_flecha_px*5 - 20;

        this.pinta_filas_columnas_(ctx_mobile, 20, alto_cosas, flecha_izq, size_flecha_px, "rgba(255,255,255,0.4)");
        this.pinta_filas_columnas_(ctx_mobile, 120, alto_cosas, flecha_der, size_flecha_px, "rgba(255,255,255,0.4)");
        this.pinta_filas_columnas_(ctx_mobile, window.ancho - 180, alto_cosas, flecha_arr, size_flecha_px, "rgba(255,255,255,0.4)");
        this.pinta_filas_columnas_(ctx_mobile, window.ancho - 80, alto_cosas, accion_boton, size_flecha_px, "rgba(255,255,255,0.4)");

        document.getElementById('controles_mobile').style.display = "block";


        var self = this;

        document.getElementById('der_mobile').addEventListener('touchstart', function(e){
            e.preventDefault();
            air_console.message(AirConsole.SCREEN, "right");
            this.className = "tecla_mobile pulsada";
        });

        document.getElementById('izq_mobile').addEventListener('touchstart', function(e){ 
            e.preventDefault();
            air_console.message(AirConsole.SCREEN, "left");
            this.className = "tecla_mobile pulsada";
        });

        document.getElementById('arr_mobile').addEventListener('touchstart', function(e){ 
            e.preventDefault();
            air_console.message(AirConsole.SCREEN, "jump");
            this.className = "tecla_mobile pulsada";
        });

        document.getElementById('accion_mobile').addEventListener('touchstart', function(e){ 
            e.preventDefault();
            air_console.message(AirConsole.SCREEN, "accion");
            this.className = "tecla_mobile pulsada";
        });

        document.getElementById('der_mobile').addEventListener('touchend', function(e){
            e.preventDefault();
            air_console.message(AirConsole.SCREEN, "right_false");
            this.className = "tecla_mobile";
        });

        document.getElementById('izq_mobile').addEventListener('touchend', function(e){ 
            e.preventDefault();
            air_console.message(AirConsole.SCREEN, "left_false");
            this.className = "tecla_mobile";
        });

        document.getElementById('arr_mobile').addEventListener('touchend', function(e){ 
            e.preventDefault();
            air_console.message(AirConsole.SCREEN, "jump_false");
            this.className = "tecla_mobile";
        });

        document.getElementById('accion_mobile').addEventListener('touchend', function(e){ 
            e.preventDefault();
            air_console.message(AirConsole.SCREEN, "accion_false");
            this.className = "tecla_mobile";
        });
    };


    var canvas_mobile;
    var ctx_mobile;
    var self = this;
    this.controla_orientacion_ = function(){
        self.pinta_cosas_mobile_();
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
    //Control de orientación en mobile
    document.addEventListener("DOMContentLoaded", function() {
        //AIR
        window.alto = window.innerWidth;
        window.ancho = window.innerHeight;
        //NO AIR
        //window.ancho = window.innerWidth;
        //window.alto = window.innerHeight;

        window.juego = new Game();
        window.juego.controla_orientacion_();
        canvas_mobile   = document.getElementById('canvas_mobile');
        ctx_mobile      = canvas_mobile.getContext('2d');
        window.juego.muestra_logo_(ctx_mobile);



    });





})();
