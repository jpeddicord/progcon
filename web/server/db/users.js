import db from './index';
import { contestSequence } from './users';

export function getUser(id) {
  return db.one('select * from users where id = $1', [id]);
}

export function getContestUsers(contest) {
  return db.any('select id, participant_numer, name from users where contest = $1', [contest]);
}

export function registerUser(name, password, contest) {
  return db.one(
    'insert into users(name, password, participant_number) values($1, $2, nextval($3)) returning id',
    [name, password, contestSequence(contest)],
  );
}
