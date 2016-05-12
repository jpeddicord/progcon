import Router from 'koa-router';
import auth from 'basic-auth';
import { tryAuth } from './auth';
import * as db from '../db/contest';

const routes = new Router({prefix: '/api'});

routes.get('/contests/', async (ctx, next) => {
  // TODO: list contests (admin -> all; non-admin -> active)
  const contests = await db.listContests();
  ctx.body = {contests};
});
routes.post('/contests/', async (ctx, next) => {
  const { title, start_time, end_time } = ctx.req.body;
  await db.createContest(title, start_time, end_time);
});
routes.get('/contests/:contest_id', async (ctx, next) => {
  const contest = await db.getContest(ctx.params.contest_id);
  ctx.body = contest;
});
routes.post('/contests/:contest_id', (ctx, next) => {
  // TODO: contest C&C (start/stop/edit/etc)
  ctx.status = 501;
});
routes.get('/contests/:contest_id/register', (ctx, next) => {
  // TODO: register for a contest
  ctx.status = 501;
});
routes.get('/contests/:contest_id/problems/:problem_name', (ctx, next) => {
  // TODO: get problem details & submission status (good/bad/pending/etc)
  ctx.body = {name: ctx.params.problem_name, status: 'unsolved'};
  console.log(ctx.body);
  //.config/ctx.status = 501;
});
routes.post('/contests/:contest_id/problems/:problem', (ctx, next) => {
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
