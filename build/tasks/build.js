var gulp = require('gulp');
var sourceMaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var runSequence = require('run-sequence');
var paths = require('../paths');

gulp.task('build-es6', function () {
  return gulp.src(paths.source)
    .pipe(gulp.dest(paths.output + 'es6'));
});

gulp.task('build-commonjs', function () {
  return gulp.src(paths.source)
	  .pipe(sourceMaps.init())
    .pipe(babel({modules:'common', optional: ['runtime']}))
	  .pipe(sourceMaps.write())
    .pipe(gulp.dest(paths.output + 'commonjs'));
});

gulp.task('build-system', function () {
	return gulp.src(paths.source)
		.pipe(sourceMaps.init())
		.pipe(babel({modules:'system', optional: ['runtime']}))
		.pipe(sourceMaps.write())
		.pipe(gulp.dest(paths.output + 'system'));
});

gulp.task('build', function(callback) {
  return runSequence(
    'clean',
    ['build-es6', 'build-commonjs', 'build-system'],
    callback
  );
});