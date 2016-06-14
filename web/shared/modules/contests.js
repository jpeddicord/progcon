import { fetchAuth } from '../util/fetch';

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
  return dispatch => {
    return fetchAuth('/api/contests/')
      .then(resp => resp.json())
      .then(json => dispatch(receiveContests(json.contests)));
  };
}

export function fetchContestDetail(id) {
  return dispatch => {
    return fetchAuth(`/api/contests/${id}`)
      .then(resp => resp.json())
      .then(json => dispatch(receiveContestDetail(json)));
  };
}

export function registerForContest(id, code, name) {
  return dispatch => {
    return fetchAuth.post(`/api/contests/${id}/register`, {code, name})
      .then(resp => dispatch(fetchContestDetail(id)));
  };
}

export function createContest(title) {
  return dispatch => {
    return fetchAuth.post('/api/contests/', {title})
      .then(resp => resp.json())
      .then(json => {
        dispatch(fetchContests());
        dispatch(receiveContestDetail(json));
      });
  };
}

export function updateContest(id, values) {
  return dispatch => {
    return fetchAuth.post(`/api/contests/${id}`, values)
      .then(resp => resp.json())
      .then(json => dispatch(receiveContestDetail(json)));
  };
}
