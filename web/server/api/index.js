import Router from 'koa-router';
import auth from 'basic-auth';
import { tryAuth, issueUserToken, generateUserPassword, adminOnly, contestAccess } from './auth';
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
routes.post('/contests/', adminOnly, async (ctx, next) => {
  const { title } = ctx.request.body;
  const id = await dbContests.createContest(title);
  ctx.body = {id};
});

// get a single contest's details
routes.get('/contests/:contest_id', contestAccess, async (ctx, next) => {
  const contest = await dbContests.getContest(ctx.params.contest_id);
  ctx.body = contest;
});

// edit a contest
routes.post('/contests/:contest_id', adminOnly, async (ctx, next) => {
  const body = ctx.request.body;
  const { title, start_time, end_time, mode, code, problems } = body;
  await dbContests.updateContest(ctx.params.contest_id, title, start_time, end_time, mode, code, problems);
  ctx.body = {id: ctx.params.contest_id, ...body};
});

routes.post('/contests/:contest_id/register', async (ctx, next) => {
  const { code, name } = ctx.request.body;

  // validate the registration code
  const contest = await dbContests.getContest(ctx.params.contest_id);
  if (code !== contest.code) {
    throw new Error('invalid registration code');
  }

  // set up a contest-specific user account
  const user = await dbUsers.registerUser(name, generateUserPassword(), ctx.params.contest_id);

  // issue a token for the newly-created user
  const jwt = issueUserToken(user.id, contest.id, user.participant_number);
  ctx.body = {token: jwt};
});

routes.get('/contests/:contest_id/problems/:problem_name', contestAccess, (ctx, next) => {
  // TODO: get problem details & submission status (good/bad/pending/etc)
  ctx.body = {name: ctx.params.problem_name, status: 'unsolved'};
});

routes.post('/contests/:contest_id/problems/:problem', contestAccess, (ctx, next) => {
  // TODO: some data validation; ensure problem exists in contest, user validation, etc
  submitAnswer(9999, ctx.params.contest_id, ctx.params.problem, ctx.request.body.answer);

  ctx.body = {status: 'submitted'};
});

// TODO: rate limit
routes.get('/auth', async (ctx, next) => {
  let creds = auth(ctx);

  // auth attempt
  if (creds) {
    const jwt = await tryAuth(creds);
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
