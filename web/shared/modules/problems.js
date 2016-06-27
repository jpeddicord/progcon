/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import moment from 'moment';
import { fetchJSONAuth } from '../util/fetch';

const RECEIVE_PROBLEM = 'app/contests/receive-problem';

const initial = {
  map: {},
};

export default function reducer(state = initial, action) {
  switch (action.type) {
    case RECEIVE_PROBLEM:
      return Object.assign({}, state, {
        map: {
          ...state.map,
          [action.problem.name]: {
            ...action.problem,
            submission: action.problem.submission == null ? null : {
              ...action.problem.submission,
              submission_time: moment(action.problem.submission.submission_time),
            },
          },
        },
      });
    default:
      return state;
  }
}

export function receiveProblem(problem) {
  return {
    type: RECEIVE_PROBLEM,
    problem,
  };
}

export function fetchProblem(contestId, name) {
  return async dispatch => {
    const json = await fetchJSONAuth(`/api/contests/${contestId}/problems/${name}`);
    dispatch(receiveProblem(json));
  };
}

export function submitAnswer(contestId, name, answer) {
  return async dispatch => {
    await fetchJSONAuth.post(`/api/contests/${contestId}/problems/${name}`, {answer});
    dispatch(fetchProblem(contestId, name));
  };
}
