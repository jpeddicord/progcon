/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

/**
 * Routes requiring access to a specific contest
 */
import * as Router from 'koa-router';
import * as cache from 'memory-cache';
import * as winston from 'winston';
import { contestAccess } from './auth';
import * as dbContests from '../db/contests';
import * as dbSubmissions from '../db/submissions';
import * as dbUsers from '../db/users';
import { testAnswer } from '../bot/tester';
import { getProblem } from '../problems';
import { RequestError, NotFoundError } from '../util/errors';

const routes = new Router({prefix: '/contests/:contest_id'});
routes.use(contestAccess);

// get a single contest's details
routes.get('/', contestIsActive, async (ctx, next) => {
  const id = ctx.params.contest_id;
  const contest = await getContestCached(id, ctx);
  ctx.body = contest;
});

routes.get('/problems/:problem', contestIsActive, contestHasProblem, async (ctx, next) => {
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
  const userId = ctx.state.user.id;
  const contestId = ctx.params.contest_id;
  const problem = ctx.params.problem;
  const answer = ctx.request.body.answer;

  // see if they've submitted something already
  const submission = await dbSubmissions.getLatestSubmission(userId, ctx.params.problem);
  if (submission != null) {
    if (submission.result == null) {
      throw new RequestError('You already have a pending submission for this problem.');
    }
    if (submission.result === 'successful') {
      throw new RequestError('You have already completed this problem.');
    }
  }

  // otherwise, store the submission
  const sub = await dbSubmissions.createSubmission(userId, contestId, problem, answer);

  // do *NOT* `await` on this in a request; it's meant to run in the background
  testAnswer(sub.id, sub.submission_time, userId, contestId, problem, answer);

  ctx.body = {id: sub.id};
});

routes.get('/score', async (ctx, next) => {
  const userId = ctx.state.user.id;
  const user = await dbUsers.getUser(userId);

  // user can be null if admin; just silence this
  if (user == null) {
    ctx.body = {score: 0, problems_completed: []};
    return;
  }

  ctx.body = {
    time_score: user.time_score,
    problems_completed: user.problems_completed,
  };
});

routes.get('/leaderboard', async (ctx, next) => {
  // check cache for leaderboard
  const id = ctx.params.contest_id;
  const cacheKey = `contest/${id}/leaderboard`;

  // admin skips cache
  let leaderboard;
  if (!ctx.state.user.admin) {
    leaderboard = cache.get(cacheKey);
  }

  // fetch and cache if not present
  if (leaderboard == null) {
    winston.silly(`Cache miss: ${cacheKey}`);
    leaderboard = await dbUsers.getLeaderboard(id);
    cache.put(cacheKey, leaderboard, 10 * 1000);
  }

  ctx.body = {leaderboard};
});

async function contestHasProblem(ctx, next): Promise<void> {
  const problemName = ctx.params.problem;
  const contest = await getContestCached(ctx.params.contest_id, ctx);
  if (contest == null || !contest.problems.includes(problemName)) {
    throw new NotFoundError('Problem not found in contest');
  }
  await next();
}

async function contestIsActive(ctx, next): Promise<void> {
  const contest = await getContestCached(ctx.params.contest_id, ctx);
  if (contest == null) {
    throw new NotFoundError('Contest is not active');
  }
  await next();
}

async function getContestCached(id, ctx): Promise<dbContests.Contest> {
  const cacheKey = `contest/${id}`;
  let contest: dbContests.Contest & {_active?: boolean};

  // admin will always bypass cache
  if (!ctx.state.user.admin) {
    contest = cache.get(cacheKey);
  }

  // fetch and cache if not present
  if (contest == null) {
    winston.silly(`Cache miss: ${cacheKey}`);

    // try to find active contest first
    contest = await dbContests.getActiveContest(id);
    if (contest == null) {
      // failing that, look up without "active" criteria
      contest = await dbContests.getContest(id);
      contest._active = false;
    } else {
      contest._active = true;
    }

    cache.put(cacheKey, contest, 5 * 1000);
  }

  // only admin can see contests that are inactive
  if (ctx.state.user.admin || contest._active === true) {
    return contest;
  }

  return null;
}

export default routes.routes();
