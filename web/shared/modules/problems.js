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

export function fetchProblem(contestId, name) {
  return dispatch => {
    return fetchAuth(`/api/contests/${contestId}/problems/${name}`)
      .then(resp => resp.json())
      .then(json => dispatch(receiveProblem(json)));
  };
}

export function submitAnswer(contestId, name, answer) {
  return dispatch => {
    return fetchAuth(`/api/contests/${contestId}/problems/${name}`, {
      method: 'post',
      body: JSON.stringify({answer}),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(resp => resp.json());
      //.then(json => dispatch(receiveProblem(json)));
  };
}
