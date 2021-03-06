/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import { combineReducers } from 'redux';
import common from './modules/common';
import contests from './modules/contests';
import problems from './modules/problems';
import submissions from './modules/submissions';
import users from './modules/users';

export default combineReducers({
  common,
  contests,
  problems,
  submissions,
  users,
});
