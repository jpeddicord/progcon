/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import db from './connection';

export function contestSequence(id) {
  return `contest_participants__${id}`;
}

export function listContests(activeOnly) {
  return db().any('select id, title from contests');
}

export function getContest(id) {
  return db().oneOrNone('select * from contests where id = $1', [id]);
}

export async function createContest(title) {
  const row = await db().one(
    'insert into contests(title) values($1) returning id',
    [title],
  );
  const id = row.id;
  await db().none(
    'create sequence $1~ start 1 owned by users.participant_number',
    [contestSequence(id)]
  );
  return id;
}

export function updateContest(id, title, start_time, end_time, mode, code, problems) {
  return db().none(
    'update contests set (title, start_time, end_time, mode, code, problems) = ($2, $3, $4, $5, $6, $7) where id = $1',
    [id, title, start_time, end_time, mode, code, problems],
  );
}

export function updateContestTimer(id, field) {
  if (field !== 'end_time' && field !== 'start_time') {
    throw new Error(`invalid field ${field}`);
  }

  return db().none(
    'update contests set $2~ = now() where id = $1',
    [id, field],
  );
}
