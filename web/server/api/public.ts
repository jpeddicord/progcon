/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

/**
 * Public routes that require no authentication.
 */
import * as Router from 'koa-router';
import { tryAuth, generateUserPassword, rateLimiter, setSignedCookie } from './auth';
import * as dbContests from '../db/contests';
import * as dbUsers from '../db/users';
import { AuthError, RequestError, NotFoundError } from '../util/errors';
const { config } = require('../config');

const routes = new Router();

// basic configuration
routes.get('/config', async (ctx, next) => {
  ctx.body = {
    registration: config.registration,
  };
});

// list contests
routes.get('/contests/', async (ctx, next) => {
  const contests = await dbContests.listContests();
  ctx.body = {contests};
});

// register for a contest
routes.post('/contests/:contest_id/register', rateLimiter, async (ctx, next) => {
  const { code, name, meta } = ctx.request.body;

  if (name.trim().length === 0) {
    throw new RequestError('Please enter your name');
  }

  const contest = await dbContests.getContest(ctx.params.contest_id);
  if (contest == null) {
    throw new NotFoundError('Contest doesn\'t exist');
  }

  // validate the registration code
  if (code.toLowerCase() !== contest.code.toLowerCase()) {
    throw new AuthError('Invalid registration code');
  }

  // set up a contest-specific user account
  // note: meta information is not validated, so don't trust its value unless audited!
  const password = await generateUserPassword();
  const userId = await dbUsers.registerUser(name, password, ctx.params.contest_id, meta);

  // issue a cookie for the newly-created user
  setSignedCookie(ctx, userId, contest.id);
  ctx.body = {id: userId, password: password};
});

// alternative authentication. not expected to be used for most contest participants,
// but can be used in case someone loses their session. also used for admin auth.
routes.post('/auth', rateLimiter, async (ctx, next) => {
  const success = await tryAuth(ctx, ctx.request.body.user, ctx.request.body.pass);
  if (success) {
    ctx.body = {};
  } else {
    ctx.status = 401;
  }
});

routes.post('/auth/logout', async (ctx, next) => {
  ctx.cookies.set('progcon', undefined, {signed: true});
  ctx.body = {};
});

export default routes.routes();
