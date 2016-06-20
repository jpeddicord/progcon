import db from './index';

export function getSubmission(id) {
  return db.oneOrNone('select * from submissions where id = $1', [id]);
}

export async function createSubmission(user, contest, problem) {
  const sub = await db.one(
    'insert into submissions(user_id, contest_id, problem) values($1, $2, $3) returning id, submission_time',
    [user, contest, problem],
  );
  return sub;
}

export async function updateSubmission(id, timeScore, result, meta = null) {
  await db.none(
    'update submissions set (time_score, result, meta) = ($2, $3, $4) where id = $1',
    [id, timeScore, result, meta],
  );
}
