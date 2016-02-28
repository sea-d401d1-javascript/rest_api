const gulp = require('gulp'),
      eslint = require('gulp-eslint'),
      mocha = require('gulp-mocha'),
      files = ['test/*.js', '!node_modules//**',__dirname + '/../lib/*.js'],
      webpack = require('webpack-stream'),
      html = require('html-loader');

gulp.task('lint', function() {
  return gulp.src(files)
    .pipe(eslint({
      extends: 'eslint:recommended', // imports general rules
      ecmaFeatures: {
        'modules': true,        // allows modules
        'blockBindings': true,  // allows const
        'arrowFunctions': true  // allows arrow functions
      },
      'rules': {
        'no-console': 0,       // allows console.logs without throwing err
        'semi': 2,             // requires semi-colons
      },
      envs: [
        'node',
        'mocha'
      ]
    }))
    .pipe(eslint.format());
});

gulp.task('mocha', function() {
  return gulp.src(['test/*.js'], { read: false })
    .pipe(mocha({ reporter: 'nyan' }));
});

gulp.task('html:dev', function() {
  gulp.src(__dirname + '/app/**/*.html')
    .pipe(gulp.dest(__dirname + '/build'));
});

gulp.task('css:dev', () => {
  gulp.src(__dirname + '/app/**/*.css')
    .pipe(gulp.dest(__dirname + '/build'));
});

gulp.task('webpack:dev', function() {
  gulp.src(__dirname + '/app/js/*.js')
    .pipe(webpack({
      output: {
        filename: 'bundle.js'
      }
    }))
    .pipe(gulp.dest('build/'));
});

gulp.task('webpack:test', () => {
  gulp.src(__dirname + '/test/test_entry.js')
    .pipe(webpack({
      module: {
        loaders: [
          {
            test: /\.html$/,
            loader: 'html'
          }
        ]
      },
      output: {
        filename: 'test_bundle.js'
      }
    }))
    .pipe(gulp.dest('test/'));
});

gulp.task('watch', function() {
  gulp.watch(files, ['lint']);
});

gulp.task('build:dev', ['webpack:dev', 'html:dev', 'css:dev']);
gulp.task('default', ['build:dev']);

//gulp.task('default', ['mocha', 'lint', 'watch','build:dev']);


