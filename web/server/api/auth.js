import { sign } from 'koa-jwt';
import config from '../config';


export function tryAuth(creds) {
  const claims = {};

  if (creds.name === 'admin' && creds.pass === config.admin.password) {
    claims.admin = true;
  } else {
    // TODO: also check for user in database
    // but for now... just say it's invalid
    return null;
  }

  return sign(claims, config.jwt.secret, {
    expiresIn: '1 day',
  });
}

export function issueUserToken(id, contest, participant_number) {
  const claims = {
    id,
    contest,
    participant_number,
  };
  return sign(claims, config.jwt.secret, {
    expiresIn: '1 day',
  });
}
