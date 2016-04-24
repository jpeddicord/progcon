import Router from 'koa-router';
import auth from 'basic-auth';
import { tryAuth } from './auth';

const routes = new Router({prefix: '/api'});

routes.get('/hello', (ctx, next) => {
  ctx.body = {greet: 'to you'};
});

routes.get('/contest/', (ctx, next) => {
  // TODO: list contests (admin -> all; non-admin -> active)
  ctx.status = 501;
});
routes.post('/contest/', (ctx, next) => {
  // TODO: create contest
  ctx.status = 501;
});
routes.get('/contest/:contest_id', (ctx, next) => {
  // TODO: get contest details (questions, timing, etc)
  ctx.body = ctx.params.contest_id;
  ctx.status = 501;
});
routes.post('/contest/:contest_id', (ctx, next) => {
  // TODO: contest C&C (start/stop/edit/etc)
  ctx.status = 501;
});
routes.get('/contest/:contest_id/register', (ctx, next) => {
  // TODO: register for a contest
  ctx.status = 501;
});
routes.get('/contest/:contest_id/problem/:problem', (ctx, next) => {
  // TODO: get problem details & submission status (good/bad/pending/etc)
  ctx.status = 501;
});
routes.post('/contest/:contest_id/problem/:problem', (ctx, next) => {
  // TODO: submit a problem solution
  ctx.status = 501;
});

routes.get('/auth', (ctx, next) => {
  let creds = auth(ctx);

  // auth attempt
  if (creds) {
    const jwt = tryAuth(creds);
    if (jwt != null) {
      ctx.body = jwt;
      return;
    } else {
      creds = null;
    }
  }

  // ask for auth w/ popup
  if (creds == null) {
    ctx.status = 401;
    ctx.set('WWW-Authenticate', 'Basic realm="progcon"');
    return;
  }
});

export default routes.routes();
