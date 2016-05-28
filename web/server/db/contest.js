import db from './index';

export function listContests(activeOnly) {
  return db.any('select id, title from contests');
}

export function getContest(id) {
  return db.one('select * from contests where id = $1', [id]);
}

export function createContest(title) {
  return db.one(
    'insert into contests(title) values($1) returning id',
    [title],
  );
}

export function updateContest(id, title, start_time, end_time, mode, code, problems) {
  return db.none(
    'update contests set (title, start_time, end_time, mode, code, problems) = ($2, $3, $4, $5, $6, $7) where id = $1',
    [id, title, start_time, end_time, mode, code, problems],
  );
}
