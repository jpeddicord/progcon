/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

/**
 * Public routes that require no authentication.
 */
import Router from 'koa-router';
import { tryAuth, issueUserToken, generateUserPassword, rateLimiter } from './auth';
import * as dbContests from '../db/contests';
import * as dbUsers from '../db/users';
import { AuthError } from '../util/errors';

const routes = new Router();

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

export default routes.routes();
