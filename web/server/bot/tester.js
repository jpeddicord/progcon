/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import winston from 'winston';
import { pickBroker } from './balancer';
import * as dbSubmissions from '../db/submissions';
import { updateScore } from '../scoring';

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
  const response = JSON.parse(buffer.toString());

  if (sub.id !== response.id) {
    winston.error(`Bot sent unexpected response: ${JSON.stringify(response)}`);
    await dbSubmissions.updateSubmission(sub.id, null, 'internal_error', null);
    return;
  }

  await updateScore(contestId, userId, sub.id, sub.submission_time, problem, response.result, response.meta);
}
