/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

/**
 * Routes requiring access to a specific contest
 */
import Router from 'koa-router';
import { contestAccess } from './auth';
import * as dbContests from '../db/contests';
import * as dbSubmissions from '../db/submissions';
import * as dbUsers from '../db/users';
import { submitAnswer } from '../bot/tester';
import { getProblem } from '../problems';

const routes = new Router({prefix: '/contests/:contest_id'});
routes.use(contestAccess);

// get a single contest's details
routes.get('/', async (ctx, next) => {
  const contest = await dbContests.getContest(ctx.params.contest_id);
  ctx.body = contest;
});

routes.get('/problems/:problem_name', async (ctx, next) => {
  // TODO: ensure problem exists, is in contest, etc
  const problem = getProblem(ctx.params.problem_name);

  const submission = await dbSubmissions.getLatestSubmission(ctx.state.user.id, problem.name);
  if (submission == null) {
    ctx.body = problem;
    return;
  }

  const penalties = await dbSubmissions.getProblemPenalties(ctx.state.user.id, problem.name);

  // do NOT directly respond with submission.meta, it has solution diffs!
  ctx.body = problem;
  ctx.body.submission = {
    result: submission.result,
    submission_time: submission.submission_time,
    time_score: submission.time_score,
    penalties: penalties,
    total_time_score: submission.time_score + penalties.reduce((sum, x) => sum + x, 0),
  };

  if (submission.meta != null) {
    submission.meta.diff = null; // paranoid
    ctx.body.submission.test_pass = submission.meta.pass;
    ctx.body.submission.test_fail = submission.meta.fail;
  }
});

routes.post('/problems/:problem', (ctx, next) => {
  // TODO: some data validation; ensure problem exists in contest, user validation, etc
  // TODO: ensure a successful answer wasn't already submitted
  // TODO: ensure the contest isn't over
  submitAnswer(ctx.state.user.id, ctx.params.contest_id, ctx.params.problem, ctx.request.body.answer);

  ctx.body = {status: 'submitted'};
});

routes.get('/leaderboard', async (ctx, next) => {
  const leaderboard = await dbUsers.getLeaderboard(ctx.params.contest_id);
  ctx.body = {leaderboard};
});

export default routes.routes();
