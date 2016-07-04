/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import { alertServerError } from '../util/alert';
import { fetchJSONAuth } from '../util/fetch';

const RECEIVE_USERS = 'app/submissions/receive-users';

const initial = {
  list: [],
  users: {},
};

export default function reducer(state = initial, action) {
  switch (action.type) {
    case RECEIVE_USERS:
      return Object.assign({}, state, {
        list: action.list,
        users: {
          ...state.users,
          ...action.users,
        },
      });
    default:
      return state;
  }
}

export function receiveUsers(users) {
  return {
    type: RECEIVE_USERS,
    list: users.map(u => u.id),
    users: users.reduce((map, u) => {
      map[u.id] = u;
      return map;
    }, {}),
  };
}

export function fetchUsers(contestId) {
  return async dispatch => {
    try {
      const json = await fetchJSONAuth(`/api/contests/${contestId}/users`);
      dispatch(receiveUsers(json.users));
    } catch (err) {
      alertServerError(err);
    }
  };
}

export function updateUser(contestId, userId, name, meta) {
  return async dispatch => {
    try {
      await fetchJSONAuth.post(`/api/users/${userId}`, {name, meta});
      dispatch(fetchUsers(contestId));
    } catch (err) {
      alertServerError(err);
    }
  };
}
