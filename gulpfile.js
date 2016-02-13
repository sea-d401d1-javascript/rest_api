'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
// const nodemon = require('gulp-nodemon');

const scripts = ['server.js', 'gulpfile.js', './lib/*.js', './test/*.js'];

gulp.task('lint', () => {
  return gulp.src(scripts)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('test', () => {
  return gulp.src('test/*.js')
    .pipe(mocha({ reporter: 'nyan' }));
});

// gulp.task('watch', () => {
//   return gulp.watch(scripts, ['lint', 'test']);
// });

// gulp.task('start', () => {
//   nodemon({
//     script: 'server.js',
//     ext: 'html js'
//   });
// });

gulp.task('default', [/*'watch',*/ 'lint', 'test'/*, 'start'*/]);
