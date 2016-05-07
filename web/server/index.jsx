import 'babel-polyfill';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { RouterContext, match } from 'react-router';
import apiRoutes from './api';
import uiRoutes from '../shared/routes';
import create from '../shared/store';
import { fetchComponentData } from '../shared/util/needs';

const app = new Koa();

app.use(bodyParser());
app.use(apiRoutes);

app.use(async (ctx, next) => {

  let stateStr;
  const component = await new Promise((resolve, reject) => {
    match({routes: uiRoutes, location: ctx.req.url}, (err, redirectLocation, renderProps) => {
      if (err) {
        return reject(err);
      }
      if (!renderProps) {
        return resolve();
      }

      // build up our redux store
      const store = create();

      // grab component state, then return a resolved component
      fetchComponentData(store.dispatch, renderProps.components, renderProps.params)
        .then(() => {
          stateStr = JSON.stringify(store.getState());
          resolve(
            <Provider store={store}>
              <RouterContext {...renderProps} />
            </Provider>
          );
        });
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
      <script charset="utf-8">window._initialState = ${stateStr}</script>
      <script src="${script}" charset="utf-8"></script>
    </body>
  </html>`;

  ctx.body = html;
});

app.listen(3000);
