var gulp = require('gulp');
import 'babel-polyfill';
var browserify = require('browserify');
var babelify = require('babelify');
var util = require('gulp-util');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var webserver = require('gulp-webserver');

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
  console.log('init');
  gulp.src("./app/**", { base: './' })
  .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch(['./app/*.js'], ['init', 'build']);
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

gulp.task('default', ['init', 'build', 'watch', 'webserver']);
