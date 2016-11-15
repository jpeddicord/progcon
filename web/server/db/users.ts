/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import db from './connection';

export interface User {
  id: number;
  contest_id: number;
  name?: string;
  password?: string;
  problems_completed: string[];
  time_score: number;
  problem_scores: any;
  meta?: any;
}

export function getUser(id: number): Promise<User | null> {
  return db().oneOrNone('select * from users where id = $1', [id]);
}

interface ContestUser {
  id: number;
  name: string | null;
  meta: any | null;
}
export function getContestUsers(contest: number): Promise<ContestUser[]> {
  return db().any('select id, name, meta from users where contest_id = $1', [contest]);
}

export async function registerUser(name: string, password: string, contest: number, meta: any): Promise<number> {
  // before you freak out about the password:
  // remember that these are session-based accounts. they're tied to a single,
  // time-limited contest. they're store as plaintext to proritize fast assistance
  // in case a participant gets locked out, and they're randomly-generated.

  const user = await db().one(
    'insert into users(name, password, contest_id, meta) values($1, $2, $3, $4) returning id',
    [name, password, contest, meta],
  );
  return user.id;
}

export function updateUser(id: number, name: string, meta: any): Promise<void> {
  return db().none(
    'update users set (name, meta) = ($2, $3) where id = $1',
    [id, name, meta],
  );
}

/**
 * Update a user's score and completed problems.
 *
 * Merge in problemScores with the existing set of scores.
 */
export function updateScore(id: number, totalTimeScore: number, problems: string[], problemScores: any): Promise<void> {
  return db().none(
    'update users set (time_score, problems_completed, problem_scores) = ($2, $3, problem_scores || $4::jsonb) where id = $1',
    [id, totalTimeScore, problems, problemScores],
  );
}

/**
 * Adds a problem score without completing the problem or updating the total score.
 *
 * Used to save bad submissions. For storing successful submissions, use addScore.
 */
export function mergeProblemScores(id: number, problem: string, problemScores: any): Promise<void> {
  return db().none(
    'update users set problem_scores = problem_scores || $2::jsonb where id = $1',
    [id, {[problem]: problemScores}],
  );
}

interface LeaderboardEntry {
  id: number;
  problems_completed: string[];
  time_score: number;
  problem_scores: any;
  ineligible: boolean;
};
export function getLeaderboard(contest: number): Promise<LeaderboardEntry[]> {
  return db().any(
    'select id, name, problems_completed, time_score, problem_scores, meta->\'ineligible\' as ineligible from users where contest_id = $1 order by coalesce(array_length(problems_completed, 1), 0) desc, time_score asc',
    [contest],
  );
}
