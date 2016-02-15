'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const webpack = require('webpack-stream');

const scripts = ['index.js', 'bin/*.js', 'lib/*.js', 'test/*.js',
  'app/**/*.js'];
const clientScripts = ['app/**/*.js'];
const staticFiles = ['app/**/*.html'];

gulp.task('static:dev', () => {
  gulp.src(staticFiles, { 'base': 'app' })
    .pipe(gulp.dest('build/'));
});

gulp.task('build:dev', () => {
  gulp.src(clientScripts)
    .pipe(webpack({
      output: {
        filename: 'bundle.js'
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
          }
        ]
      },
      devtool: 'source-map'
    }))
    .pipe(gulp.dest('build/'));
});

gulp.task('lint', () => {
  return gulp.src(scripts)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('test', () => {
  return gulp.src('test/*spec.js')
    .pipe(mocha());
});

gulp.task('watch', () => {
  gulp.watch(scripts, ['lint']);
  gulp.watch(clientScripts, ['build:dev']);
  gulp.watch(staticFiles, ['static:dev']);
});

gulp.task('dev', ['lint', 'static:dev', 'build:dev']);

gulp.task('default', ['watch', 'dev']);
