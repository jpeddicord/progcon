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
import cache from 'memory-cache';
import winston from 'winston';
import { contestAccess } from './auth';
import * as dbContests from '../db/contests';
import * as dbSubmissions from '../db/submissions';
import * as dbUsers from '../db/users';
import { submitAnswer } from '../bot/tester';
import { getProblem } from '../problems';
import { RequestError, NotFoundError } from '../util/errors';

const routes = new Router({prefix: '/contests/:contest_id'});
routes.use(contestAccess);

// get a single contest's details
routes.get('/', async (ctx, next) => {
  const id = ctx.params.contest_id;

  // check cache for contest data
  const cacheKey = `contest/${id}`;
  let contest = cache.get(cacheKey);

  // fetch and cache if not present
  if (contest == null) {
    winston.silly(`Cache miss: ${cacheKey}`);
    contest = await dbContests.getContest(id);
    cache.put(cacheKey, contest, 10 * 1000);
  }

  ctx.body = contest;
});

routes.get('/problems/:problem', contestHasProblem, async (ctx, next) => {
  // sanity check
  const problemName = ctx.params.problem;
  const problem = getProblem(problemName);
  if (problem == null) {
    throw new Error(`problem ${problemName} is in contest, but not in library`);
  }

  // if they have submitted something, show it
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

  // include basic test information if the submission had it
  if (submission.meta != null) {
    submission.meta.diff = null; // paranoid
    ctx.body.submission.test_pass = submission.meta.pass;
    ctx.body.submission.test_fail = submission.meta.fail;
  }
});

routes.post('/problems/:problem', contestIsActive, contestHasProblem, async (ctx, next) => {
  // see if they've submitted something already
  const submission = await dbSubmissions.getLatestSubmission(ctx.state.user.id, ctx.params.problem);
  if (submission != null) {
    if (submission.result == null) {
      throw new RequestError('You already have a pending submission for this problem.');
    }
    if (submission.result === 'successful') {
      throw new RequestError('You have already completed this problem.');
    }
  }

  // do *NOT* `await` on this; it's meant to run in the background
  submitAnswer(ctx.state.user.id, ctx.params.contest_id, ctx.params.problem, ctx.request.body.answer);

  ctx.body = {status: 'submitted'};
});

routes.get('/leaderboard', async (ctx, next) => {
  const id = ctx.params.contest_id;

  // check cache for leaderboard
  const cacheKey = `contest/${id}/leaderboard`;
  let leaderboard = cache.get(cacheKey);

  // fetch and cache if not present
  if (leaderboard == null) {
    winston.silly(`Cache miss: ${cacheKey}`);
    leaderboard = await dbUsers.getLeaderboard(id);
    cache.put(cacheKey, leaderboard, 10 * 1000);
  }

  ctx.body = {leaderboard};
});

async function contestHasProblem(ctx, next) {
  const problemName = ctx.params.problem;
  const contest = await dbContests.getContest(ctx.params.contest_id);
  if (contest == null || !contest.problems.includes(problemName)) {
    throw new NotFoundError('Problem not found in contest');
  }
  await next();
}

async function contestIsActive(ctx, next) {
  const contest = await dbContests.getActiveContest(ctx.params.contest_id);
  if (contest == null) {
    throw new NotFoundError('Contest is not active');
  }
  await next();
}

export default routes.routes();
