const gulp = require('gulp');
const sass = require('gulp-sass');
const webpack = require('webpack-stream');

const files = {
	all: [__dirname + '/www/app/*.html', __dirname + '/www/app/js/*.js', 
  __dirname + '/www/app/templates/**/*.html']
};

gulp.task('html:dev', () => {
	gulp.src(__dirname + '/www/app/**/*.html')
	.pipe(gulp.dest(__dirname + '/www/build/'))
});


// Webpack
gulp.task('webpack:dev', () => {
  gulp.src(__dirname + '/www/app/js/app.js')
    .pipe(webpack({
      output: {
        filename: 'bundle.js'
      }
    }))
    .pipe(gulp.dest(__dirname + '/www/build/'))
});


// Test
gulp.task('webpack:test', () => {
  gulp.src(__dirname + '/test/client/test-entry.js')
    .pipe(webpack({
      module: {
        loaders: [
          {
            test:/\.html$/,
            loader: 'html'
          }
        ]
      },
      output: {
        filename: 'test-bundle.js'
      }
    }))
    .pipe(gulp.dest(__dirname + '/test/client/'));
});


// Sass
gulp.task('sass:all', function() {
  return gulp.src(__dirname + '/www/app/stylesheets/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(__dirname + '/www/build/css'));
});

gulp.task('sass:watch', function() {
  gulp.watch(__dirname + '/www/app/stylesheets/sass/*.scss', ['sass:all']);
});


gulp.task('dev:watch', () => {
  gulp.watch(files.all, ['webpack:dev', 'html:dev'])
});

gulp.task('default', ['dev:watch', 'sass:watch']);
