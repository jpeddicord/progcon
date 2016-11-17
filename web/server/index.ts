/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import 'babel-polyfill';
import * as path from 'path';
import * as Koa from 'koa';
import * as koaBodyParser from 'koa-bodyparser';
import * as koaCompress from 'koa-compress';
import * as koaMount from 'koa-mount';
import * as koaStatic from 'koa-static';
import * as winston from 'winston';
import apiRoutes from './api';
import { initBalancer } from './bot/balancer';
import { launchBots } from './bot/process';
import { load } from './config';
import { connect } from './db/connection';
import { mapProblems } from './problems';

const app = new Koa();

app.use(koaBodyParser());
app.use(koaCompress());
app.use(apiRoutes);

// static stuff
app.use(koaMount('/assets', koaStatic(path.join(__dirname, '../browser'))));
app.use((ctx, next) => {
  ctx.body = `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=Edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="icon" type="image/png" href="data:image/png;base64,iVBORw0KGgo=">
      <title>progcon</title>
    </head>
    <body>
      <div id="app"></div>
      <script src="/assets/app.js" charset="utf-8"></script>
    </body>
  </html>`;
});

export function start(port) {
  winston.info('Loading configuration');
  load()
    .then(config => {
      winston.level = config.logLevel;

      winston.info('Starting grading robots');
      launchBots();

      winston.info('Creating IPC brokers');
      initBalancer();

      winston.info('Loading & mapping problems');
      return mapProblems();
    })
    .then(() => {
      winston.info('Connecting to database');
      connect();
    })
    .then(() => {
      winston.info('Server ready.');
      app.listen(port);
    })
    .catch(err => {
      console.error(err);
    });
}

// make sure cleanup handlers get run
process.on('SIGTERM', () => process.exit());
process.on('SIGINT', () => process.exit());

if (require.main === module) {
  start(3000);
}
