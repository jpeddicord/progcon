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

export async function testAnswer(submissionId, submissionTime, userId, contestId, problem, answer) {
  // find the least-loaded broker
  const broker = pickBroker();

  // send it out for grading
  // (long-running operation, especially if there's a queue)
  const buffer = await broker.send(JSON.stringify({
    id: submissionId,
    user: userId,
    problem,
    answer,
  }));
  const response = JSON.parse(buffer.toString());

  if (submissionId !== response.id) {
    winston.error(`Bot sent unexpected response: ${JSON.stringify(response)}`);
    await dbSubmissions.updateSubmission(submissionId, null, 'internal_error', null);
    return;
  }

  await updateScore(contestId, userId, submissionId, submissionTime, problem, response.result, response.meta);
}
