/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import moment from 'moment';
import * as dbContests from '../db/contests';
import * as dbSubmissions from '../db/submissions';
import * as dbUsers from '../db/users';

const TIME_PENALTY = 10 * 60;

// given a submission result, update the score for the user
export async function updateScore(contestId, userId, submissionId, submissionTime, problem, result, meta) {
  let subTimeScore;

  // calculate the score
  if (result === 'successful') {
    const contest = await dbContests.getContest(contestId);
    const start = moment(contest.start_time);
    const subTime = moment(submissionTime);
    subTimeScore = subTime.diff(start, 'seconds');
  } else {
    subTimeScore = TIME_PENALTY;
  }

  // store the individual submission
  await dbSubmissions.updateSubmission(submissionId, subTimeScore, result, meta);

  // update score totals for the user
  const problemScores = await dbSubmissions.getProblemScores(userId, problem);
  if (result === 'successful') {
    // if successful, add to their total score
    const problemTimeScore = problemScores.reduce((sum, x) => sum + x, 0);
    await dbUsers.addScore(userId, problemTimeScore, problem, problemScores);
  } else {
    // otherwise, just mark the penalty in their problem score map for the leaderboard.
    // the penalty doesn't actually count until the problem is finished.
    await dbUsers.mergeProblemScores(userId, problem, problemScores);
  }
}

// re-calculate the time score for a user based on their submission history
// (should rarely need to be run, but can be used in case of problem/grading mishaps)
export async function recalculateScores(userId) {
  let total = 0;
  const problems = await dbSubmissions.getSuccessfulUserSubmissions(userId);
  for (let problem of problems) {
    const scores = await dbSubmissions.getProblemScores(userId, problem);
    total += scores.reduce((sum, x) => sum + x, 0);
  }
  // FIXME
  await dbUsers.updateScore(userId);
}

// re-run a submission for a user
export function regradeSubmission() {
  // TODO
}
