import db from './index';

export function listContests(activeOnly) {
  return db.any('select * from contests');
}

export function getContest(contest_id) {
  return db.one('select * from contests where id = $1', [contest_id]);
}

export function createContest(title, start_time, end_time) {
  return db.one(
    'insert into contests(title, start_time, end_time, registration_mode) values($1, $2, $3, $4) returning id',
    [title, start_time, end_time, 'code'],
  );
}
