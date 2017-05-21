/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import * as crypto from 'mz/crypto';
import * as Cookies from 'cookies';
import { Context } from 'koa';
import * as koaConvert from 'koa-convert';
import * as koaLimit from 'koa-better-ratelimit';
import * as dbUsers from '../db/users';
import { AccessError, AuthError } from '../util/errors';
const { config } = require('../config');

export async function tryAuth(ctx: Context, userId: string, pass: string): Promise<boolean> {
  if (userId === 'admin') {
    const hash = await crypto.pbkdf2(pass, '', 1000000, 16, 'sha256');
    if (hash.toString('hex') !== config.admin.passwordHash) {
      return false;
    }

    ctx.cookies.set('progcon', JSON.stringify({
      id: -1,
      admin: true,
    }), {
      maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days
      domain: ctx.request.hostname,
      httpOnly: true,
      signed: true,
    });

    return true;
  } else {
    const id = parseInt(userId);
    if (Number.isNaN(id)) {
      return false;
    }

    // user recovery sign-in flow
    const user = await dbUsers.getUser(id);
    if (user == null) {
      return false;
    }

    if (pass !== user.password) {
      return false;
    }

    setSignedCookie(ctx, user.id, user.contest_id);
    return true;
  }
}

export function setSignedCookie(ctx: Context, id: number, contest: number): void {
  ctx.cookies.set('progcon', JSON.stringify({
    id,
    contest,
  }), {
    maxAge: 1000 * 60 * 60 * 24 * 5, // 5 days
    domain: ctx.request.hostname,
    httpOnly: true,
    signed: true,
  });
}

/**
 * Generate a simple password for a participant.
 *
 * This will only be used in the event a user lost their session during the contest. Passwords
 * are still scoped to a single contest session; they're never re-used for anything else.
 */
export async function generateUserPassword() {
  // TODO: use passhelp
  const buf = await crypto.randomBytes(4);
  return buf.toString('hex');
}

/**
 * Cookie-to-user middleware.
 */
export async function authMiddleware(ctx: Context, next: Function) {
  const cookie = ctx.cookies.get('progcon', {signed: true});
  if (cookie == null) {
    throw new AuthError('not signed in');
  }
  ctx.state.user = JSON.parse(cookie);
  await next();
}

/**
 * Pre-initialized rate limiting middleware to protect login spam.
 */
export const rateLimiter = koaConvert(koaLimit({
  max: 10,
  duration: 1000 * 20,
}));

/**
 * Middleware that requires an admin session.
 */
export async function adminOnly(ctx: Context, next: Function) {
  if (ctx.state.user.admin !== true) {
    throw new AccessError('no access');
  }
  await next();
}

/**
 * Require that a user has access to the contest.
 *
 * This can either be because they're an administrator, or they're registered for it.
 */
export async function contestAccess(ctx: Context, next: Function) {
  const url_id = ctx.params.contest_id;
  if (ctx.state.user.admin === true) {
    await next();
    return;
  }
  if (parseInt(url_id) !== ctx.state.user.contest) {
    throw new AccessError('no access to this contest');
  }
  await next();
}
