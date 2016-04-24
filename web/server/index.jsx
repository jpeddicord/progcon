import 'babel-polyfill';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { RouterContext, match } from 'react-router';
import apiRoutes from './api';
import uiRoutes from '../shared/routes';
import store from '../shared/store';

const app = new Koa();

app.use(bodyParser());
app.use(apiRoutes);

app.use(async (ctx, next) => {
  const component = await new Promise((resolve, reject) => {
    match({routes: uiRoutes, location: ctx.req.url}, (err, redirectLocation, renderProps) => {
      if (err) {
        return reject(err);
      }
      if (!renderProps) {
        return resolve();
      }

      resolve(
        <Provider store={store}>
          <RouterContext {...renderProps} />
        </Provider>
      );
    });
  });

  if (component == null) {
    ctx.status = 404;
    return;
  }

  const rendered = ReactDOMServer.renderToString(component);

  const script = 'http://localhost:3030/assets/app.js';
  const html = `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>progcon</title>
    </head>
    <body>
      <div id="app">${rendered}</div>
      <script src="${script}" charset="utf-8"></script>
    </body>
  </html>`;

  ctx.body = html;
});

app.listen(3000);
