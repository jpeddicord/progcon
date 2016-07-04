/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import moment from 'moment';
import { browserHistory } from 'react-router';
import { alertServerError } from '../util/alert';
import { fetchJSON, fetchJSONAuth } from '../util/fetch';
import { saveRecoveryCode } from '../util/recovery';
import { saveToken } from '../util/token';

const RECEIVE_CONTESTS = 'app/contests/receive-contests';
const RECEIVE_CONTEST_DETAIL = 'app/contests/receive-contest-detail';
const RECEIVE_LEADERBOARD = 'app/contests/receive-leaderboard';

const initial = {
  list: [],
  active: {
    id: null,
    leaderboard: null,
  },
};

export default function reducer(state = initial, action) {
  switch (action.type) {
    case RECEIVE_CONTESTS:
      return Object.assign({}, state, {
        list: action.contests,
      });
    case RECEIVE_CONTEST_DETAIL:
      return Object.assign({}, state, {
        active: {
          ...action.data,
          start_time: moment(action.data.start_time),
          end_time: moment(action.data.end_time),
        },
      });
    case RECEIVE_LEADERBOARD:
      return Object.assign({}, state, {
        active: {
          ...state.active,
          leaderboard: action.leaderboard,
        },
      });
    default:
      return state;
  }
}

export function receiveContests(contests) {
  return {
    type: RECEIVE_CONTESTS,
    contests,
  };
}

export function receiveContestDetail(data) {
  return {
    type: RECEIVE_CONTEST_DETAIL,
    data,
  };
}

export function receiveLeaderboard(leaderboard) {
  return {
    type: RECEIVE_LEADERBOARD,
    leaderboard,
  };
}

export function fetchContests() {
  return async dispatch => {
    try {
      const json = await fetchJSON('/api/contests/');
      dispatch(receiveContests(json.contests));
    } catch (err) {
      alertServerError(err);
    }
  };
}

export function fetchContestDetail(id) {
  return async dispatch => {
    try {
      const json = await fetchJSONAuth(`/api/contests/${id}`);
      dispatch(receiveContestDetail(json));
    } catch (err) {
      alertServerError(err);
    }
  };
}

export function registerForContest(id, code, name, meta) {
  return async dispatch => {
    try {
      const json = await fetchJSON.post(`/api/contests/${id}/register`, {code, name, meta});
      saveToken(json.token);
      saveRecoveryCode(json.id, json.password);
      browserHistory.push(`/contests/${id}`);
    } catch (err) {
      alertServerError(err);
    }
  };
}

export function createContest(title) {
  return async dispatch => {
    try {
      const json = await fetchJSONAuth.post('/api/contests/', {title});
      dispatch(fetchContests());
      browserHistory.push(`/admin/contests/${json.id}`);
    } catch (err) {
      alertServerError(err);
    }
  };
}

export function updateContest(id, values) {
  return async dispatch => {
    try {
      await fetchJSONAuth.post(`/api/contests/${id}`, values);
      dispatch(fetchContestDetail(id));
    } catch (err) {
      alertServerError(err);
    }
  };
}

export function contestCommand(id, command) {
  return async dispatch => {
    try {
      await fetchJSONAuth.post(`/api/contests/${id}/control`, {action: command});
      dispatch(fetchContestDetail(id));
    } catch (err) {
      alertServerError(err);
    }
  };
}

export function fetchLeaderboard(id) {
  return async dispatch => {
    try {
      const json = await fetchJSONAuth(`/api/contests/${id}/leaderboard`);
      dispatch(receiveLeaderboard(json.leaderboard));
    } catch (err) {
      alertServerError(err);
    }
  };
}
