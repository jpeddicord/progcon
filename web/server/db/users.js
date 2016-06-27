/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import db from './connection';
import { contestSequence } from './contests';

export function getUser(id) {
  return db().oneOrNone('select * from users where id = $1', [id]);
}

export function getContestUsers(contest) {
  return db().any('select id, participant_numer, name from users where contest_id = $1', [contest]);
}

export function registerUser(name, password, contest) {
  // before you freak out about the password:
  // remember that these are session-based accounts. they're tied to a single,
  // time-limited contest. they're store as plaintext to proritize fast assistance
  // in case a participant gets locked out, and they're randomly-generated.

  return db().one(
    'insert into users(name, password, contest_id, participant_number) values($1, $2, $3, nextval($4)) returning id, participant_number',
    [name, password, contest, contestSequence(contest)],
  );
}

// update the user's score, optionally adding a problem to their completed list
export function addScore(id, timeScore, problem) {
  if (problem != null) {
    return db().none(
      'update users set (time_score, problems_completed) = (time_score + $2, array_append(problems_completed, $3)) where id = $1',
      [id, timeScore, problem],
    );
  } else {
    return db().none(
      'update users set (time_score) = (time_score + $2) where id = $1',
      [id, timeScore],
    );
  }
}

export function updateScore(id, totalTimeScore, problems) {
  return db().none(
    'update users set (time_score, problems_completed) = ($2, $3) where id = $1',
    [id, totalTimeScore, problems],
  );
}
