var gulp = require('gulp'),
    less = require('gulp-less'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    karma = require('gulp-karma')
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    runSequence = require('run-sequence');

var path = require('path');

var srcFile = 'jquery.barrating.js';

var lessFiles = [
      path.join(__dirname, 'examples', 'less', 'examples.less'),
      path.join(__dirname, 'examples', 'less', 'main.less'),
    ];

var cssPath = path.join(__dirname, 'examples', 'css'),
    distPath = 'dist';

var themePath = path.join(__dirname, 'dist', 'themes');

gulp.task('jshint', function() {
  return gulp.src(srcFile)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('uglify', function() {
  return gulp.src(srcFile)
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename(function(path) {
      path.basename += '.min';
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(distPath));
});

gulp.task('test', function() {
    return gulp.src('dummy')
        .pipe(karma({
          configFile: 'karma.conf.js',
          action: 'run'
        }))
        .on('error', function(err) {
          // Stop gulp from any further processing.
          throw err;
        });
});

gulp.task('less', function() {
  return gulp.src(lessFiles)
    .pipe(less())
    .pipe(gulp.dest(cssPath));
});

gulp.task('themes', function() {
  return gulp.src(['themes/*.less', '!themes/variables.less'])
    .pipe(less())
    .pipe(gulp.dest(themePath));
});

gulp.task('build', function() {
  runSequence('jshint', 'test', 'themes', 'uglify');
});

gulp.task('watch', function() {
  gulp.watch(srcFile, ['jshint']);
  gulp.watch(lessFiles, ['less']);
  gulp.watch(themeLessFiles, ['themes']);
});

gulp.task('default', ['build']);
