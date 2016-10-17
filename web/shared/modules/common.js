/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import { alertServerError } from '../util/alert';
import { fetchJSON } from '../util/fetch';

const RECEIVE_CONFIG = 'app/common/receive-config';

const initial = {
  config: {
    registration: {
      fields: [],
    },
  },
};

export default function reducer(state = initial, action) {
  switch (action.type) {
    case RECEIVE_CONFIG:
      return Object.assign({}, state, {
        config: action.config,
      });
    default:
      return state;
  }
}

export function receiveConfig(config) {
  return {
    type: RECEIVE_CONFIG,
    config,
  };
}

export function fetchConfig() {
  return async dispatch => {
    try {
      const json = await fetchJSON('/api/config');
      dispatch(receiveConfig(json));
    } catch (err) {
      alertServerError(err);
    }
  };
}
