import moment from 'moment';
import * as dbContests from '../db/contests';
import * as dbSubmissions from '../db/submissions';
import * as dbUsers from '../db/users';

const TIME_PENALTY = 10 * 60;

// given a submission result, update the score for the user
export async function updateScore(contestId, userId, submissionId, submissionTime, problem, result, meta) {
  let timeScore;

  let successful;
  if (result.result === 'successful') {
    const contest = await dbContests.getContest(contestId);
    const start = moment(contest.start_time);
    const subTime = moment(submissionTime);
    timeScore = subTime.diff(start, 'seconds');
    successful = true;
  } else {
    timeScore = TIME_PENALTY;
    successful = false;
  }

  await dbSubmissions.updateSubmission(submissionId, timeScore, result, meta);
  await dbUsers.updateScore(userId, timeScore, successful ? problem : null);
}

// re-calculate the time score for a user based on their submission history
// (should rarely need to be run, but can be used in case of problem/grading mishaps)
export function recalculateScores() {
  // TODO
}

// regrade the latest submission for every user in a contest for a given problem.
// only regrade if they got it wrong. also useful if a problem was broken.
export function regradeProblem() {
  // TODO
}
