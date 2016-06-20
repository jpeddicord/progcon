import db from './index';

export function contestSequence(id) {
  return `contest_participants__${id}`;
}

export function listContests(activeOnly) {
  return db.any('select id, title from contests');
}

export function getContest(id) {
  return db.oneOrNone('select * from contests where id = $1', [id]);
}

export async function createContest(title) {
  const row = await db.one(
    'insert into contests(title) values($1) returning id',
    [title],
  );
  const id = row.id;
  await db.none(
    'create sequence $1~ start 1 owned by users.participant_number',
    [contestSequence(id)]
  );
  return id;
}

export function updateContest(id, title, start_time, end_time, mode, code, problems) {
  return db.none(
    'update contests set (title, start_time, end_time, mode, code, problems) = ($2, $3, $4, $5, $6, $7) where id = $1',
    [id, title, start_time, end_time, mode, code, problems],
  );
}
