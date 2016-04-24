import db from './index';

export function listContests(activeOnly) {
  db.any('select * from contest');
}

export function getContest(contest_id) {
  db.one('select * from contest where id = $1', [contest_id]);
}

export function createContest(title, start_time, end_time) {
  db.one(
    'insert into contest(title, start_time, end_time) values($1, $2, $3) returning id',
    [title, start_time, end_time],
  );
}
