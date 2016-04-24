import 'babel-polyfill';
import Koa from 'koa';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { RouterContext, match } from 'react-router';
import createLocation from 'history/lib/createLocation';
import apiRoutes from './api';
import uiRoutes from '../shared/routes';

const app = new Koa();

app.use(apiRoutes);

app.use(async (ctx, next) => {
  const location = createLocation(ctx.req.url);

  let component;
  await new Promise((resolve, reject) => {
    match({uiRoutes, location}, (err, redirectLocation, renderProps) => {
      if (err) {
        return reject(err);
      }
      if (!renderProps) {
        ctx.status = 404;
        return resolve();
      }

      component = (<RouterContext {...renderProps} />);
      resolve();
    });
  });

  if (component == null) {
    ctx.status = 404;
    ctx.body = 'not found';
    return;
  }

  const rendered = ReactDOMServer.renderToString(component);

  const html = `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>progcon</title>
    </head>
    <body>
      <div id="app">${rendered}</div>
      <script src="http://localhost:3030/assets/app.js" charset="utf-8"></script>
    </body>
  </html>`;

  ctx.body = html;
});

app.listen(3000);
