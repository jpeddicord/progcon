import Router from 'koa-router';
import { tryAuth, issueUserToken, generateUserPassword, jwtMiddleware, rateLimiter, adminOnly, contestAccess } from './auth';
import * as dbContests from '../db/contests';
import * as dbSubmissions from '../db/submissions';
import * as dbUsers from '../db/users';
import { submitAnswer } from '../bot/tester';
import { getProblem } from '../problems';
import { AuthError } from '../util/errors';

const routes = new Router({prefix: '/api'});

// a fun error handler
// just kidding it isn't really all that fun
routes.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    const status = err.statusCode || err.status || 500;
    ctx.status = status;
    if (status === 500) {
      console.error(err);
      ctx.body = {error: 'internal error'};
    } else {
      ctx.body = {error: err.message.trim()};
    }
  }
});

// list contests
routes.get('/contests/', async (ctx, next) => {
  // TODO: permission restrictions (admin -> all; non-admin -> active)
  const contests = await dbContests.listContests();
  ctx.body = {contests};
});

// register for a contest
// XXX: for some reason rate limiting doesn't work here...?
routes.post('/contests/:contest_id/register', rateLimiter, async (ctx, next) => {
  const { code, name } = ctx.request.body;

  // validate the registration code
  const contest = await dbContests.getContest(ctx.params.contest_id);
  if (code !== contest.code) {
    throw new AuthError('invalid registration code');
  }

  // set up a contest-specific user account
  const user = await dbUsers.registerUser(name, generateUserPassword(), ctx.params.contest_id);

  // issue a token for the newly-created user
  const jwt = issueUserToken(user.id, contest.id, user.participant_number);
  ctx.body = {token: jwt};
});

// alternative authentication. not expected to be used for most contest participants,
// but can be used in case someone loses their session. also used for admin auth.
routes.post('/auth', rateLimiter, async (ctx, next) => {
  const jwt = await tryAuth(ctx.request.body.user, ctx.request.body.pass);
  if (jwt != null) {
    ctx.body = {token: jwt};
  } else {
    ctx.status = 401;
  }
});

/* * * * * * * * * * * * * * * * * * * */
// auth required for routes below this
routes.use(jwtMiddleware);
/* * * * * * * * * * * * * * * * * * * */

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


routes.get('/contests/:contest_id/problems/:problem_name', contestAccess, async (ctx, next) => {
  // TODO: get problem details & submission status (good/bad/pending/etc)
  // TODO: ensure problem exists, is in contest, etc
  const problem = getProblem(ctx.params.problem_name);

  const submission = await dbSubmissions.getLatestSubmission(9999 /*ctx.state.user.id*/, problem.name);
  if (submission == null) {
    ctx.body = {
      ...problem,
      result: 'unsubmitted',
    };
    return;
  }

  // do NOT directly respond with submission.meta, it has solution diffs!
  ctx.body = {
    ...problem,
    submission_time: submission.submission_time,
    time_score: submission.time_score,
    result: submission.result ? submission.result : 'pending',
  };

  if (submission.meta != null) {
    submission.meta.diff = null; // paranoid
    ctx.body.test_pass = submission.meta.pass;
    ctx.body.test_fail = submission.meta.fail;
  }
});

routes.post('/contests/:contest_id/problems/:problem', contestAccess, (ctx, next) => {
  // TODO: some data validation; ensure problem exists in contest, user validation, etc
  // TODO: ensure the contest isn't over
  submitAnswer(9999, ctx.params.contest_id, ctx.params.problem, ctx.request.body.answer);

  ctx.body = {status: 'submitted'};
});

export default routes.routes();
