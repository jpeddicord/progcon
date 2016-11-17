/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import db from './connection';

export type SubmissionResult = 'successful' | 'failed_tests' | 'bad_compile' | 'crashed' | 'timeout' | 'internal_error' | null;
export interface Submission {
  id: number;
  user_id: number;
  contest_id: number;
  problem: string;
  answer: string;
  submission_time: Date;
  time_score?: number;
  result?: SubmissionResult;
  meta?: any;
}

export function getSubmission(id: number): Promise<Submission | null> {
  return db().oneOrNone('select * from submissions where id = $1', [id]);
}

export function getContestSubmissions(contestId: number): Promise<Submission[]> {
  return db().any('select s.id, s.user_id, s.problem, s.submission_time, s.time_score, s.result, u.name as user_name from submissions s, users u where s.user_id = u.id and s.contest_id = $1 order by submission_time desc', [contestId]);
}

/**
 * Fetch the set of successful problems a user has submitted.
 *
 * Cached in user.problems_completed.
 */
export function getSuccessfulUserSubmissions(userId: number): Promise<Submission[]> {
  return db().any(
    'select distinct on (problem) problem, submission_time, time_score from submissions where user_id = $1 and result = $2 order by problem, submission_time asc',
    [userId, 'successful'],
  );
}

export function getLatestSubmission(user: number, problem: string): Promise<Submission> {
  return db().oneOrNone(
    'select * from submissions where user_id = $1 and problem = $2 order by submission_time desc limit 1',
    [user, problem],
  );
}

export async function getProblemPenalties(user: number, problem: string): Promise<number[]> {
  const penalties = await db().any(
    'select time_score from submissions where user_id = $1 and problem = $2 and result != $3 and result is not null order by submission_time desc',
    [user, problem, 'successful'],
  );
  return penalties.map((p: any) => p.time_score);
}

export async function createSubmission(user: number, contest: number, problem: string, answer: string): Promise<{id: number, submission_time: Date}> {
  const sub = await db().one(
    'insert into submissions(user_id, contest_id, problem, answer) values($1, $2, $3, $4) returning id, submission_time',
    [user, contest, problem, answer],
  );
  return sub;
}

export async function updateSubmission(id: number, timeScore: number | null, result: SubmissionResult, meta: any = null): Promise<void> {
  await db().none(
    'update submissions set (time_score, result, meta) = ($2, $3, $4) where id = $1',
    [id, timeScore, result, meta],
  );
}
