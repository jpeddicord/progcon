/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

'use strict';

const path = require('path');
const webpack = require('webpack');
const moment = require('moment');

const prod = process.env.NODE_ENV === 'production';

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    '__BUILD': JSON.stringify({
      'version': require('./package.json').version,
      'timestamp': moment().format('ddd Do MMM YYYY HH:mm:ss ZZ'),
    }),
  }),
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
  }),
  new webpack.NoErrorsPlugin(),
];
if (prod) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}));
}

module.exports = {
  // future TODO: move font-awesome elsewhere (vendor css or something)
  entry: ['font-awesome/css/font-awesome.css', './styles/style.scss', './browser/app.tsx'],
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        exclude: /server/,
        loader: 'ts-loader',
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass'],
      },
      {
        test: /\.(woff2?|svg)(\?v=[\d\.]+)?$/,
        loader: 'url?limit=10000',
      },
      {
        test: /\.(ttf|eot)(\?v=[\d\.]+)?$/,
        loader: 'file',
      },
    ],
  },
  ts: {
    compilerOptions: {
      target: 'es5',
    },
  },
  resolve: {
    extensions: ['', '.ts', '.tsx', '.js'],
  },
  output: {
    path: path.join(__dirname, 'build/browser'),
    filename: 'app.js',
    publicPath: '/assets/',
  },
  plugins: plugins,
  devtool: prod ? 'source-map' : 'cheap-module-eval-source-map',
};
