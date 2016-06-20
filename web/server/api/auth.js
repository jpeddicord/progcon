import crypto from 'crypto';
import { sign } from 'koa-jwt';
import config from '../config';
import * as dbUsers from '../db/users';

export async function tryAuth(creds) {
  if (creds.name === 'admin' && creds.pass === config.admin.password) {
    // auth as administrator
    return sign({
      admin: true,
    }, config.jwt.secret, {
      expiresIn: '1 day',
    });

  } else {
    // user recovery sign-in flow
    const user = await dbUsers.getUser(parseInt(creds.name));
    if (user == null) {
      return null;
    }

    if (creds.pass !== user.password) {
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
 * Middleware that requires an admin session.
 */
export async function adminOnly(ctx, next) {
  await next(); // TODO
}

/**
 * Require that a user has access to the contest.
 *
 * This can either be because they're an administrator, or they're registered for it.
 */
export async function contestAccess(ctx, next) {
  await next(); // TODO
}
