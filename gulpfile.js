"use strict";

var gulp        = require('gulp'),
    compass     = require('gulp-compass'),
    watch       = require('gulp-watch'),
    cssmin      = require('gulp-minify-css'),
    filter      = require('gulp-filter'),
    rename      = require('gulp-rename'),
    plumber     = require('gulp-plumber'),
    svgSprite   = require('gulp-svg-sprite'),
    uglify      = require('gulp-uglify'),
    concat      = require('gulp-concat');

var local = 'template/',
    path = {
        build: {
            sass:     local + 'sass',
            styles:   local + 'css',
            js:       local + 'js',
            images:   local + 'img',
            fonts:    local + 'fonts'
        },
        src: {
            styles:   local + 'sass/**/*.scss',
            images:   local + 'img/**/*.*',
            js:       local + 'js-dev/**/*.js'
        },
        watch: {
            styles:   local + 'sass/**/*.scss',
            images:   local + 'img/**/*.*',
            js:       local + 'js-dev/**/*.js'
        }
    };

// CSS
gulp.task('styles:build', function () {
    gulp.src(path.src.styles)
        .pipe(plumber())
        .pipe(compass({
            css:   path.build.styles,
            sass:  path.build.sass,
            image: path.build.images,
            font:  path.build.fonts
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest(path.build.styles))
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(path.build.styles));
});

gulp.task('watchCSS', function(){
    watch([path.watch.styles], function(event, cb) {
        gulp.start('styles:build');
    });
});

// images
gulp.task('images:svg', function () {
    return gulp.src('**/*.svg', {cwd: path.build.images + '/icon'})
        .pipe(plumber())
        .pipe(svgSprite({
            dest: '.', 
            shape: {
                dimension: {
                    maxWidth: 16,
                    maxHeight: 16,
                    precision: 2,
                    attributes: false,
                },
                spacing: {
                    padding: 0
                },
                transform: ['svgo']
            },
            mode: {
                symbol: {
                    dest: '.',
                    sprite: 'icons.svg'
                }
            }
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest(path.build.images));
});

gulp.task('watchSVG', function(){
    watch([path.watch.images], function(event, cb) {
        gulp.start('images:svg');
    });
});

// JS
gulp.task('js:min', function () {
    gulp.src(path.src.js)
        .pipe(plumber())
        .pipe(filter(function(file) {
            return !/min.js/.test(file.path)
        }))
        .pipe(concat('init.min.js'))
        .pipe(uglify())
        .pipe(plumber.stop())
        .pipe(gulp.dest(path.build.js))
});

gulp.task('watchJS', function(){
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:min');
    });
});

// 
gulp.task('build', ['styles:build', 'images:svg', 'js:min']);

gulp.task('default', ['build', 'watchCSS', 'watchSVG', 'watchJS']);