var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var util = require('gulp-util');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var webserver = require('gulp-webserver');
var gulp = require('gulp');
var sass = require('gulp-sass');

import 'babel-polyfill';

var sourcePath = 'app/';
var dest = 'dist/app/';
var bootstrapSass = {
  in: './node_modules/bootstrap-sass/'
};
var fonts = {
  in: [sourcePath + 'fonts/*.*', bootstrapSass.in + 'assets/fonts/**/*'],
  out: dest + 'fonts/'
};
var scss = {
  in: sourcePath + 'scss/main.scss',
  out: dest + 'css/',
  watch: sourcePath + 'scss/**/*',
  sassOpts: {
    outputStyle: 'nested',
    precison: 3,
    errLogToConsole: true,
    includePaths: [bootstrapSass.in + 'assets/stylesheets']
  }
};

gulp.task('fonts', function () {
    return gulp
        .src(fonts.in)
        .pipe(gulp.dest(fonts.out));
});

gulp.task('sass', ['fonts'], function () {
    return gulp.src(scss.in)
        .pipe(sass(scss.sassOpts))
        .pipe(gulp.dest(scss.out));
});

gulp.task('build', function() {
  browserify('./app/main.js', { debug: true })
  .add(require.resolve('babel-polyfill'))
  .transform(babelify.configure({
    ignore: ['node_modules', 'app/*/lib']
  }))
  .bundle()
  .on('error', util.log.bind(util, 'Browserify Error'))
  .pipe(source('app/main.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(uglify({ mangle: false }))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('./dist'));
});

gulp.task('init', function() {
  gulp.src("./app/**", { base: './' })
  .pipe(gulp.dest('dist'));
});

gulp.task('webserver', function() {
  gulp.src('dist/app')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true,
      esversion: 6
    }));
});

gulp.task('default', ['sass', 'init', 'build', 'webserver'], function () {
     gulp.watch(scss.watch, ['sass']);
     gulp.watch('app/**/*.js', ['build']);
     gulp.watch('app/**/*.html', ['init', 'build']);
});
