/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import moment from 'moment';
import winston from 'winston';
import * as dbContests from '../db/contests';
import * as dbSubmissions from '../db/submissions';
import * as dbUsers from '../db/users';

const TIME_PENALTY = 10 * 60;

/**
 * Update single submission and re-calculate total scores.
 */
export async function updateScore(contestId, userId, submissionId, submissionTime, problem, result, meta) {
  // calculate the score
  let subTimeScore;
  if (result === 'successful') {
    const contest = await dbContests.getContest(contestId);
    const start = moment(contest.start_time);
    const subTime = moment(submissionTime);
    subTimeScore = subTime.diff(start, 'seconds');
  } else {
    subTimeScore = TIME_PENALTY;
  }

  // update the individual submission
  await dbSubmissions.updateSubmission(submissionId, subTimeScore, result, meta);

  // update score totals for the user
  if (result === 'successful') {
    // if successful, re-calculate user's complete score
    await recalculateTotalScore(userId);
  } else {
    // otherwise, just mark the penalty in their problem score map for the leaderboard.
    // the penalty doesn't actually count until the problem is finished.
    const penalties = await dbSubmissions.getProblemPenalties(userId, problem);
    await dbUsers.mergeProblemScores(userId, problem, penalties);
  }
}

/**
 * Calculate and save the score for a user.
 */
export async function recalculateTotalScore(userId) {
  winston.debug(`Re-calculating score for ${userId}`);

  // find all of the completed problems (incompletes don't count towards time)
  // this function returns unique successful submissions; i.e. one per completed problem
  const subs = await dbSubmissions.getSuccessfulUserSubmissions(userId);

  // add up the total time score
  let total = 0;
  let problemsCompleted = [];
  let partialProblemScores = {};
  for (let sub of subs) {
    // add the first successful score
    let scores = [sub.time_score];

    // and then add the penalties
    const penalties = await dbSubmissions.getProblemPenalties(userId, sub.problem);
    scores = scores.concat(penalties);

    total += scores.reduce((sum, x) => sum + x, 0);
    problemsCompleted.push(sub.problem);
    partialProblemScores[sub.problem] = scores;
  }

  // set total score and completed problems, and merge successful problem
  // scores (partialProblemScores) with the existing set
  winston.debug(`New total score for ${userId}: ${problemsCompleted.length} in ${total}s`);
  await dbUsers.updateScore(userId, total, problemsCompleted, partialProblemScores);
}
