import crypto from 'crypto';
import koaConvert from 'koa-convert';
import koaJWT, { sign } from 'koa-jwt';
import koaLimit from 'koa-limit';
import config from '../config';
import * as dbUsers from '../db/users';
import { AccessError } from '../util/errors';

export async function tryAuth(user, pass) {
  if (user === 'admin' && pass === config.admin.password) {
    // auth as administrator
    return sign({
      id: -1,
      admin: true,
    }, config.jwt.secret, {
      expiresIn: '1 day',
    });

  } else {
    const id = parseInt(user);
    if (Number.isNaN(id)) {
      return null;
    }

    // user recovery sign-in flow
    const user = await dbUsers.getUser(id);
    if (user == null) {
      return null;
    }

    if (pass !== user.password) {
      return null;
    }

    return issueUserToken(user.id, user.contest_id, user.participant_number);
  }
}

export function issueUserToken(id, contest, participant_number) {
  const claims = {
    id,
    contest,
    number: participant_number,
  };
  return sign(claims, config.jwt.secret, {
    expiresIn: '1 day',
  });
}

/**
 * Generate a simple password for a participant.
 *
 * This will only be used in the event a user lost their session during the contest. Passwords
 * are still scoped to a single contest session; they're never re-used for anything else.
 */
export async function generateUserPassword() {
  await new Promise((resolve, reject) => {
    crypto.randomBytes(4, (err, buf) => {
      if (err != null) {
        return reject(err);
      }
      resolve(buf.toString('hex'));
    });
  });
}

/**
 * General JWT middleware.
 */
export const jwtMiddleware = koaConvert(koaJWT({secret: config.jwt.secret}));

/**
 * Pre-initialized rate limiting middleware to protect login spam.
 */
export const rateLimiter = koaConvert(koaLimit({
  limit: 5,
  interval: 1000 * 30,
}));

/**
 * Middleware that requires an admin session.
 */
export async function adminOnly(ctx, next) {
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
export async function contestAccess(ctx, next) {
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
