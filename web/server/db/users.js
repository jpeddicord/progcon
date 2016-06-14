import db from './index';
import { contestSequence } from './contests';

export function getUser(id) {
  return db.one('select * from users where id = $1', [id]);
}

export function getContestUsers(contest) {
  return db.any('select id, participant_numer, name from users where contest = $1', [contest]);
}

export async function registerUser(name, password, contest) {
  const user = await db.one(
    'insert into users(name, password, contest, participant_number) values($1, $2, $3, nextval($4)) returning id',
    [name, password, contest, contestSequence(contest)],
  );
  return user.id;
}
