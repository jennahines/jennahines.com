var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var minifycss = require('gulp-uglifycss');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');



//ERRORS
var reportError = function (error) {
  var lineNumber = (error.lineNumber) ? 'LINE ' + error.lineNumber + ' -- ' : '';

  notify({
    title: 'Task Failed [' + error.plugin + ']',
    message: lineNumber + 'See console.',
    sound: 'Sosumi' // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
  }).write(error);

  gutil.beep();

  // Pretty error reporting
  var report = '';
  var chalk = gutil.colors.white.bgRed;

  report += chalk('TASK:') + ' [' + error.plugin + ']\n';
  report += chalk('PROB:') + ' ' + error.message + '\n';
  if (error.lineNumber) { report += chalk('LINE:') + ' ' + error.lineNumber + '\n'; }
  if (error.fileName)   { report += chalk('FILE:') + ' ' + error.fileName + '\n'; }
  console.error(report);

  // Prevent the 'watch' task from stopping
  this.emit('end');
}


//sass tashs
gulp.task('sass', function() {
  return gulp.src('static/sass/master.scss')
  .pipe(plumber({
    errorHandler: reportError
  }))
  .pipe(sass({
    outputStyle: 'compact'
  }))
  .pipe(postcss([ autoprefixer({ browsers: ['> 1%'], remove: false }) ]))
  .pipe(gulp.dest('static/css'))
  //.pipe(browserSync.reload({
  //  stream: true
  //}))
  .pipe(notify({ message: 'Styles task complete' }))
});


////optimize images & cache
//gulp.task('images', function() {
//  return gulp.src('./static/images/**/*.+(png|jpg|gif|svg)')
//  .pipe(cache(imagemin({
//    interlaced: true
//  })))
//  .pipe(gulp.dest('./static/images'))
//  .pipe(notify({ message: 'Images optimized' }))
//});


////browsersync
//gulp.task('browserSync', function() {
//  browserSync.init({
//    proxy: "jennahines.dev"
//  })
//})


//// Cleaning 
//gulp.task('clean', function() {
//  return del([
//    'static/**/*'
//  ]);
//})
//
//gulp.task('clean:static', function() {
//  return del([
//    'static/**/*',
//    '!static/images/',
//    '!static/images/**/*'
//  ]);
//});


//watch for changes
gulp.task('watch', function() {
  gulp.watch('static/sass/**/*.scss', ['sass']); 
  //gulp.watch('**/*.md', browserSync.reload); 
  //gulp.watch('**/*.md', browserSync.reload); gulp.watch('./static/js/**/*.js', browserSync.reload); 
})


//build!
gulp.task('default', function (callback) {
  //runSequence('clean', ['sass','browserSync'], 'watch',
  runSequence('sass', 'watch',
    callback
    )
})


gulp.task('build', function(callback) {
  runSequence(
    //'clean:static',
    'sass',
    //'images',
    callback
    )
})
