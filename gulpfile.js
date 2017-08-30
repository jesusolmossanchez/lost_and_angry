var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');
var replace = require('gulp-replace');
var zip = require('gulp-zip');
var fs = require("fs");


var option_ugly = {
    mangle: { 
        toplevel: true
    },
    mangleProperties: { regex: /_$/ }
};


function minimiza_css() {
    return gulp.src('styles.css')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./prod/'));
}


//Tarea que minimiza CSSs esperando que se actualice versión y se pase a sass
gulp.task('styles-deploy', function() {
   return minimiza_css();
});

gulp.task('html-deploy', ['styles-deploy', 'deploy-js'], function() {
  return gulp.src('index.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('prod'));
});

gulp.task('deploy-js', function () {
    return gulp.src(['Explosion.js','Bullet.js','Zapatilla.js','Enemigo.js','Player.js','tiny_music.js','player-small.js','Game.js'])
      .pipe(concat('lost.min.js'))
      .pipe(uglify(option_ugly))
      .pipe(gulp.dest('prod/'));
});

gulp.task('html-inject', ['styles-deploy', 'deploy-js'], function() {
  return gulp.src('index_prod.html')
        .pipe(replace(/ESTILOS_PRO/, function() {
            var style = fs.readFileSync('prod/styles.css', 'utf8');
            return style;
        }))
        .pipe(replace(/SCRIPTS_PRO/, function() {
            var scripts = fs.readFileSync('prod/lost.min.js', 'utf8');
            return scripts;
        }))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('prod'));
});

gulp.task('comprime', ['html-inject'], function(){
    gulp.src('prod/index_prod.html')
        .pipe(zip('index_prod.zip'))
        .pipe(gulp.dest('prod'));
});


gulp.task('deploy', ['html-deploy', 'html-inject', 'comprime']);
