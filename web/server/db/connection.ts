/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import * as pgp from 'pg-promise';
const { config } = require('../config');

let opts = {};

if (process.env.NODE_ENV === 'development') {
  const monitor = require('pg-monitor');
  monitor.attach(opts);
}

let db: any;

export function connect() {
  db = pgp(opts)(config.database);
}

export default function () {
  return db;
}
