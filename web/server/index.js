import 'babel-polyfill';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import apiRoutes from './api';

const app = new Koa();

app.use(bodyParser());
app.use(apiRoutes);

app.use(async (ctx, next) => {
  ctx.body = `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <link rel="icon" type="image/png" href="data:image/png;base64,iVBORw0KGgo=">
      <title>progcon</title>
    </head>
    <body>
      <div id="app"></div>
      <script src="/assets/app.js" charset="utf-8"></script>
    </body>
  </html>`;
});

app.listen(3000);
