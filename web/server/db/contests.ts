/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import db from './connection';

export type RegistrationMode = 'open' | 'code' | 'preset';
export interface Contest {
  id: number;
  title: number;
  start_time?: Date;
  end_time?: Date;
  mode: RegistrationMode;
  code: string;
  problems: string[];
  archived: boolean;
}

export function listContests(all: boolean = false): Promise<Contest[]> {
  if (all) {
    return db().any('select id, title from contests');
  }
  return db().any('select id, title from contests where archived = false');
}

export function getContest(id: number | string): Promise<Contest | null> {
  return db().oneOrNone('select * from contests where id = $1', [id]);
}

export function getActiveContest(id: number | string): Promise<Contest | null> {
  return db().oneOrNone(
    'select * from contests where id = $1 and start_time is not null and start_time < now() and (end_time > now() or end_time is null)',
    [id],
  );
}

export async function createContest(title: string): Promise<number> {
  const row = await db().one(
    'insert into contests(title) values($1) returning id',
    [title],
  );
  return row.id;
}

export function updateContest(id: number, title: string, start_time: Date, end_time: Date, mode: RegistrationMode, code: string, problems: string[], archived: boolean): Promise<void> {
  return db().none(
    'update contests set (title, start_time, end_time, mode, code, problems, archived) = ($2, $3, $4, $5, $6, $7, $8) where id = $1',
    [id, title, start_time, end_time, mode, code, problems, archived],
  );
}

export function updateContestTimer(id: number, field: string): Promise<void> {
  if (field !== 'end_time' && field !== 'start_time') {
    throw new Error(`invalid field ${field}`);
  }

  return db().none(
    'update contests set $2~ = now() where id = $1',
    [id, field],
  );
}
