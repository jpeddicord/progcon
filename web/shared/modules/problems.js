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
  return async dispatch => {
    const json = await fetchJSONAuth(`/api/contests/${contestId}/problems/${name}`);
    dispatch(receiveProblem(json));
  };
}

export function submitAnswer(contestId, name, answer) {
  return async dispatch => {
    const json = await fetchJSONAuth.post(`/api/contests/${contestId}/problems/${name}`, {answer});
    //.then(json => dispatch(receiveProblem(json)));
  };
}
