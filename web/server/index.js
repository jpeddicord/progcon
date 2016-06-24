import 'babel-polyfill';
import path from 'path';
import Koa from 'koa';
import koaBodyParser from 'koa-bodyparser';
import koaCompress from 'koa-compress';
import koaMount from 'koa-mount';
import koaStatic from 'koa-static';
import winston from 'winston';
import apiRoutes from './api';
import { load } from './config';
import { mapProblems } from './problems';

winston.level = 'debug';

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
    .then(() => {
      return mapProblems();
    })
    .then(() => {
      winston.info('Server ready.');
      app.listen(port);
    })
    .catch(err => {
      console.error(err);
    });
}

if (require.main === module) {
  start(3000);
}
