/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import db from './connection';

export function getUser(id) {
  return db().oneOrNone('select * from users where id = $1', [id]);
}

export function getContestUsers(contest) {
  return db().any('select id, name, meta from users where contest_id = $1', [contest]);
}

export function registerUser(name, password, contest) {
  // before you freak out about the password:
  // remember that these are session-based accounts. they're tied to a single,
  // time-limited contest. they're store as plaintext to proritize fast assistance
  // in case a participant gets locked out, and they're randomly-generated.

  return db().one(
    'insert into users(name, password, contest_id) values($1, $2, $3) returning id',
    [name, password, contest],
  );
}

export function updateUser(id, name, meta) {
  return db().none(
    'update users set (name, meta) = ($2, $3) where id = $1',
    [id, name, meta],
  );
}

// update the user's score, optionally adding a problem to their completed list
export function addScore(id, timeScore, problem, problemScores) {
  if (problem != null) {
    return db().none(
      'update users set (time_score, problems_completed, problem_scores) = (time_score + $2, array_append(problems_completed, $3), problem_scores || $4::jsonb) where id = $1',
      [id, timeScore, problem, {[problem]: problemScores}],
    );
  } else {
    return db().none(
      'update users set (time_score) = (time_score + $2) where id = $1',
      [id, timeScore],
    );
  }
}

export function updateScore(id, totalTimeScore, problems, problemScores) {
  return db().none(
    'update users set (time_score, problems_completed, problemScores) = ($2, $3, $4) where id = $1',
    [id, totalTimeScore, problems, problemScores],
  );
}

/**
 * Adds a problem score without completing the problem or updating the total score.
 *
 * Used to save bad submissions. For storing successful submissions, use addScore.
 */
export function mergeProblemScores(id, problem, problemScores) {
  return db().none(
    'update users set problem_scores = problem_scores || $2::jsonb where id = $1',
    [id, {[problem]: problemScores}],
  );
}

export function getLeaderboard(contest) {
  return db().any(
    'select id, name, problems_completed, time_score, problem_scores from users where contest_id = $1 order by coalesce(array_length(problems_completed, 1), 0) desc, time_score asc',
    [contest],
  );
}
