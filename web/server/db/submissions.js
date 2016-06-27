/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import db from './index';

export function getSubmission(id) {
  return db.oneOrNone('select * from submissions where id = $1', [id]);
}

export function getContestSubmissions(contestId) {
  return db.any('select * from submissions where contest_id = $1', [contestId]);
}

/**
 * Fetch the set of successful problems a user has submitted.
 *
 * Cached in user.problems_completed.
 */
export function getSuccessfulUserSubmissions(userId) {
  const subs = db.any(
    'select distinct on (problem) problem from submissions where user_id = $1 and result = $2',
    [userId, 'successful'],
  );
  return subs.map(s => s.problem);
}

export function getLatestSubmission(user, problem) {
  return db.oneOrNone(
    'select * from submissions where user_id = $1 and problem = $2 order by submission_time desc limit 1',
    [user, problem],
  );
}

export async function getProblemPenalties(user, problem) {
  const penalties = await db.any(
    'select time_score from submissions where user_id = $1 and problem = $2 and result != $3 and result is not null',
    [user, problem, 'successful'],
  );
  return penalties.map(p => p.time_score);
}

export async function getProblemScore(user, problem) {
  const scores = await db.any(
    'select time_score from submissions where user_id = $1 and problem = $2 and time_score is not null',
    [user, problem],
  );
  return scores.reduce((sum, x) => sum + x.time_score, 0);
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
