'use strict';

const spawn = require('child_process').spawn;
const gulp = require('gulp');
const gutil = require('gulp-util');
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const WebpackDevServer = require('webpack-dev-server');

if (process.env.NODE_ENV == null) {
  process.env.NODE_ENV = 'development';
}

gulp.task('build-server', ['build-shared'], () => {
  return gulp.src('server/**/*.js?(x)')
    .pipe(plumber())
    .pipe(babel())
    .pipe(gulp.dest('build/server'));
});

gulp.task('build-browser', () => {
  return gulp.src('browser/app.js')
    .pipe(webpackStream(require('./webpack.config.js')))
    .pipe(gulp.dest('build/browser'));
});

gulp.task('build-shared', () => {
  return gulp.src('shared/**/*.js?(x)')
    .pipe(plumber())
    .pipe(babel())
    .pipe(gulp.dest('build/shared'));
});

let node;
gulp.task('dev-server', ['build-server'], () => {
  if (node) {
    node.kill();
  }
  node = spawn('node', ['build/server/index.js'], {stdio: 'inherit'});
});

gulp.task('dev', ['dev-server'], () => {
  gulp.watch(['server/**/*.js?(x)', 'shared/**/*.js?(x)'], {debounceDelay: 500}, ['dev-server']);

  const compiler = webpack(require('./webpack.config.js'));
  new WebpackDevServer(compiler, {
    publicPath: '/assets/',
    proxy: {'*': 'http://localhost:3000'},
  })
    .listen(3030, 'localhost', err => {
      if (err) {
        throw new gutil.PluginError('webpack-dev-server', err);
      }
      gutil.log('[webpack-dev-server]', 'http://localhost:3030/webpack-dev-server/');
    });
});

gulp.task('default', ['build-server', 'build-browser']);

process.on('exit', () => {
  if (node) {
    node.kill();
  }
});
