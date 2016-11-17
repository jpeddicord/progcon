/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

'use strict';

const spawn = require('child_process').spawn;
const gulp = require('gulp');
const gutil = require('gulp-util');
const plumber = require('gulp-plumber');
const ts = require('gulp-typescript');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const WebpackDevServer = require('webpack-dev-server');

if (process.env.NODE_ENV == null) {
  process.env.NODE_ENV = 'development';
}

const tsServerProject = ts.createProject('tsconfig.json', {typescript: require('typescript')});
gulp.task('build-server', () => {
  return gulp.src('server/**/*.@(ts|js)')
    .pipe(plumber())
    .pipe(tsServerProject())
    .pipe(gulp.dest('build/server'));
});

gulp.task('build-browser', () => {
  return gulp.src('browser/app.js')
    .pipe(webpackStream(require('./webpack.config.js')))
    .pipe(gulp.dest('build/browser'));
});

gulp.task('copy-meta', () => {
  return gulp.src('package.json')
    .pipe(gulp.dest('build/'));
});

let node;
gulp.task('dev-server', ['build-server'], () => {
  if (node) {
    node.kill();
  }
  node = spawn('node', ['build/server/index.js'], {stdio: 'inherit'});
});

gulp.task('dev', ['dev-server'], () => {
  gulp.watch(['server/**/*.@(js|ts)'], {debounceDelay: 500}, ['dev-server']);

  const compiler = webpack(require('./webpack.config.js'));
  new WebpackDevServer(compiler, {
    publicPath: '/assets/',
    proxy: {'*': 'http://localhost:3000'},
    stats: 'minimal',
  })
    .listen(3030, 'localhost', err => {
      if (err) {
        throw new gutil.PluginError('webpack-dev-server', err);
      }
      gutil.log('[webpack-dev-server]', 'http://localhost:3030/webpack-dev-server/');
    });
});

gulp.task('default', ['build-server', 'build-browser', 'copy-meta']);

process.on('exit', () => {
  if (node) {
    node.kill();
  }
});
