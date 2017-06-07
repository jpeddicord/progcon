/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

/**
 * Admin-only routes.
 */
import * as Router from 'koa-router';
import { adminOnly } from './auth';
import { regradeSubmission } from '../bot/tester';
import * as dbContests from '../db/contests';
import * as dbSubmissions from '../db/submissions';
import * as dbUsers from '../db/users';

const routes = new Router();
routes.use(adminOnly);

// create a new contest
routes.post('/contests/', async (ctx, next) => {
  const { title } = ctx.request.body;
  const id = await dbContests.createContest(title);
  ctx.body = {id};
});

// edit a contest
routes.post('/contests/:contest_id', async (ctx, next) => {
  const body = ctx.request.body;
  const { title, start_time, end_time, mode, code, problems, archived } = body;
  await dbContests.updateContest(ctx.params.contest_id, title, start_time, end_time, mode, code, problems, archived);
  ctx.body = {id: ctx.params.contest_id, ...body};
});

// start/stop a contest
routes.post('/contests/:contest_id/control', async (ctx, next) => {
  const body = ctx.request.body;
  const id = ctx.params.contest_id;
  if (body.action === 'start') {
    await dbContests.updateContestTimer(id, 'start_time');
    ctx.body = {id};
  } else if (body.action === 'end') {
    await dbContests.updateContestTimer(id, 'end_time');
    ctx.body = {id};
  } else {
    ctx.status = 400;
  }
});

// view contest submissions
routes.get('/contests/:contest_id/submissions', async (ctx, next) => {
  const subs = await dbSubmissions.getContestSubmissions(ctx.params.contest_id);
  ctx.body = {submissions: subs};
});

// view a specific submission
routes.get('/submissions/:submission_id', async (ctx, next) => {
  const sub = await dbSubmissions.getSubmission(ctx.params.submission_id);
  ctx.body = sub;
});

// re-run a submission
routes.post('/submissions/:submission_id/rerun', async (ctx, next) => {
  const sub = regradeSubmission(ctx.params.submission_id);
  ctx.body = sub;
});

// get all users for a contest
routes.get('/contests/:contest_id/users', async (ctx, next) => {
  const users = await dbUsers.getContestUsers(ctx.params.contest_id);
  ctx.body = {users};
});

// update a user
routes.post('/users/:user_id', async (ctx, next) => {
  const body = ctx.request.body;
  await dbUsers.updateUser(ctx.params.user_id, body.name, body.meta);
  ctx.body = {id: ctx.params.user_id, ...body};
});

export default routes.routes();
