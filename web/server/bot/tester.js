import moment from 'moment';
import { pickBroker } from './balancer';
import * as dbContests from '../db/contests';
import * as dbSubmissions from '../db/submissions';

export async function submitAnswer(userId, contestId, problem, answer) {
  // record the submission
  const sub = await dbSubmissions.createSubmission(userId, contestId, problem);

  // find the least-loaded broker
  const broker = pickBroker();

  // send it out for grading
  // (long-running operation, especially if there's a queue)
  const buffer = await broker.send(JSON.stringify({
    id: sub.id,
    user: userId,
    problem,
    answer,
  }));
  const result = JSON.parse(buffer.toString());
  console.log(result);

  if (sub.id !== result.id) {
    throw new Error(`submission result id mismatch (expected ${sub.id}, got ${result.id})`);
  }

  // TODO: move scoring logic+constants elsewhere
  let timeScore = 60 * 10;
  if (result.result === 'successful') {
    const contest = await dbContests.getContest(contestId);
    const start = moment(contest.start_time);
    const subTime = moment(sub.submission_time);
    timeScore = subTime.diff(start, 'seconds');
  }

  // record the result
  await dbSubmissions.updateSubmission(sub.id, timeScore, result.result, result.meta);
}
