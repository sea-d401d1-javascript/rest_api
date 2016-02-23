'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const webpack = require('webpack-stream');
const Server = require('karma').Server;

const scripts = ['index.js', 'bin/*.js', 'lib/*.js', 'test/**/*.js',
  'app/**/*.js', '!test/client/test_bundle.js'];
const clientScripts = ['app/**/*.js'];
const staticFiles = ['app/**/*.html', 'app/**/*.css'];
const clientTests = ['test/client/*.js', '!test/client/test_bundle.js'];

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
      }
    }))
    .pipe(gulp.dest('build/'));
});

gulp.task('build:test', () => {
  return gulp.src('test/client/test_entry.js')
    .pipe(webpack({
      output: {
        filename: 'test_bundle.js'
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
          }
        ]
      }
    }))
    .pipe(gulp.dest('test/client/'));
});

gulp.task('lint', () => {
  return gulp.src(scripts)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('test:server', () => {
  return gulp.src('test/server/*spec.js')
    .pipe(mocha());
});

gulp.task('test:client', ['build:test'], (done) => {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('test', ['test:client']);

gulp.task('watch', () => {
  gulp.watch(scripts, ['lint', 'test']);
  gulp.watch(clientScripts, ['build:dev']);
  gulp.watch(staticFiles, ['static:dev']);
  gulp.watch([clientTests], ['test:client']);
});

gulp.task('dev', ['lint', 'test', 'static:dev', 'build:dev']);

gulp.task('default', ['watch', 'dev']);
