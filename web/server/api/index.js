import Router from 'koa-router';
import auth from 'basic-auth';
import { tryAuth } from './auth';
import * as dbContests from '../db/contests';
import * as dbUsers from '../db/users';
import { submitAnswer } from '../bot/tester';

const routes = new Router({prefix: '/api'});

// list contests
routes.get('/contests/', async (ctx, next) => {
  // TODO: permission restrictions (admin -> all; non-admin -> active)
  const contests = await dbContests.listContests();
  ctx.body = {contests};
});

// create a new contest
// TODO: admin auth required
routes.post('/contests/', async (ctx, next) => {
  const { title } = ctx.request.body;
  const id = await dbContests.createContest(title);
  ctx.body = {id};
});

// get a single contest's details
routes.get('/contests/:contest_id', async (ctx, next) => {
  const contest = await dbContests.getContest(ctx.params.contest_id);
  ctx.body = contest;
});

// edit a contest
// TODO: admin auth required
routes.post('/contests/:contest_id', async (ctx, next) => {
  const body = ctx.request.body;
  const { title, start_time, end_time, mode, code, problems } = body;
  await dbContests.updateContest(ctx.params.contest_id, title, start_time, end_time, mode, code, problems);
  ctx.body = {id: ctx.params.contest_id, ...body};
});

routes.post('/contests/:contest_id/register', async (ctx, next) => {
  const body = ctx.request.body;
  const { code, name } = body;

  // validate the registration code
  const contest = await dbContests.getContest(ctx.params.contest_id);
  if (code !== contest.code) {
    throw new Error('invalid registration code');
  }

  // TODO: assign a password (maybe, do we even care? these are session-based contests)
  const id = await dbUsers.registerUser(name, 'xxx', ctx.params.contest_id);

  // TODO: issue a token
  ctx.body = {id: id};
});

routes.get('/contests/:contest_id/problems/:problem_name', (ctx, next) => {
  // TODO: get problem details & submission status (good/bad/pending/etc)
  ctx.body = {name: ctx.params.problem_name, status: 'unsolved'};
});

routes.post('/contests/:contest_id/problems/:problem', (ctx, next) => {
  // TODO: some data validation; ensure problem exists in contest, user validation, etc
  submitAnswer(9999, ctx.params.contest_id, ctx.params.problem, ctx.request.body.answer);

  ctx.body = {status: 'submitted'};
});

routes.get('/auth', async (ctx, next) => {
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
