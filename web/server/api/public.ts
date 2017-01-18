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
import { tryAuth, issueUserToken, generateUserPassword, rateLimiter } from './auth';
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
  const user = await dbUsers.registerUser(name, password, ctx.params.contest_id, meta);

  // issue a token for the newly-created user
  const jwt = issueUserToken(user, contest.id);
  ctx.body = {token: jwt, id: user, password: password};
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

export default routes.routes();
