import { fetchAuth } from '../util/fetch';

const RECEIVE_CONTESTS = 'app/contests/receive-contests';

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

export function fetchContests() {
  return dispatch => {
    return fetchAuth('/api/contests/')
      .then(resp => resp.json())
      .then(json => dispatch(receiveContests(json.contests)));
  };
}
