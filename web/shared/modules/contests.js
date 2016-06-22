import { browserHistory } from 'react-router';
import { fetchJSON, fetchJSONAuth } from '../util/fetch';
import { saveToken } from '../util/token';

const RECEIVE_CONTESTS = 'app/contests/receive-contests';
const RECEIVE_CONTEST_DETAIL = 'app/contests/receive-contest-detail';

const initial = {
  list: [],
  active: {},
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
        ...state.active,
        ...action.data,
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

export function fetchContests() {
  return async dispatch => {
    const json = await fetchJSON('/api/contests/');
    dispatch(receiveContests(json.contests));
  };
}

export function fetchContestDetail(id) {
  return async dispatch => {
    const json = await fetchJSONAuth(`/api/contests/${id}`);
    dispatch(receiveContestDetail(json));
  };
}

export function registerForContest(id, code, name) {
  return async dispatch => {
    const json = await fetchJSON.post(`/api/contests/${id}/register`, {code, name});
    saveToken(json.token);
    browserHistory.push(`/contests/${id}`);
  };
}

export function createContest(title) {
  return async dispatch => {
    await fetchJSONAuth.post('/api/contests/', {title});
    dispatch(fetchContests());
  };
}

export function updateContest(id, values) {
  return async dispatch => {
    const json = await fetchJSONAuth.post(`/api/contests/${id}`, values);
    dispatch(receiveContestDetail(json));
  };
}
