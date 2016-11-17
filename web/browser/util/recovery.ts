/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import alertify from 'alertify.js';
import { triggerTextDownload } from './download';

export function saveRecoveryCode(userId, recoveryCode) {
  alertify.log('Save this recovery file in case you need to sign back in to your account during the contest.');
  const text = `User ID: ${userId}\nRecovery Code: ${recoveryCode}`;
  triggerTextDownload(`recovery-${userId}.txt`, text);
}
