import { fetchAuth } from '../util/fetch';

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
        [action.problem.name]: action.problem,
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

export function fetchProblem(name) {
  return dispatch => {
    // XXX: bad url
    return fetchAuth(`/api/contests/1/problems/${name}`)
      .then(resp => resp.json())
      .then(json => dispatch(receiveProblem(json)));
  };
}
