/**************************************************
*** EXPLOSION CLASSes
**************************************************/
var Explosion = function(x, y, propia) {
    this.particles_ = [];
    this.particulas_por_explosion_ = 25;
    if(propia){
        this.particulas_por_explosion_ = this.particulas_por_explosion_ /100;
    }

    for (var i = 0; i < this.particulas_por_explosion_; i++) {
        this.particles_.push(
            new Particle(x, y, propia)
        );
    }
};



var Particle = function(x, y, propia) {
    
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


    //TODO: parametrizar
    this.particlesMinSpeed_      = 3;
    this.particlesMaxSpeed_      = 15;
    this.particlesMinSize_       = 2;
    this.max_particulas_size_    = 15;


    this.r    = this.randInt_(0, 155);
    this.g    = '0';
    this.b    = this.randInt_(0, 55);
    if(propia){
        this.r    = this.randInt_(0, 255);
        this.g    = '0';
        this.b    = '0';
    }

  
    this.x    = x;
    this.y    = y;
    this.xv   = this.randInt_(this.particlesMinSpeed_, this.particlesMaxSpeed_, false);
    this.yv   = this.randInt_(this.particlesMinSpeed_/2, this.particlesMaxSpeed_/2, false);
    if(this.xv > 0){
	    this.max_x = x + Math.random()*100;
    }
    else{
    	this.max_x = x - Math.random()*100;
    }
    if(this.yv > 0){
	    this.max_y = y + Math.random()*100;
    }
    else{
	    this.max_y = y - Math.random()*100;
    }

    this.opacidad = Math.random();


    this.size = this.randInt_(this.particlesMinSize_, this.max_particulas_size_, true);
    
};
