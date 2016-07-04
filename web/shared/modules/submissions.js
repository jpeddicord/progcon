/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import { alertServerError } from '../util/alert';
import { fetchJSONAuth } from '../util/fetch';

const RECEIVE_SUBMISSIONS = 'app/submissions/receive-submissions';
const RECEIVE_SUBMISSION_DETAIL = 'app/submissions/receive-submission-detail';

// REVIEW: state is overly complex; remove contest mapping
const initial = {
  contests: {
    // <id>: [submisisons]
  },
  details: {
    // <id>: submission_details
  },
};

export default function reducer(state = initial, action) {
  switch (action.type) {
    case RECEIVE_SUBMISSIONS:
      return Object.assign({}, state, {
        contests: {
          ...state.contests,
          [action.contest]: action.submissions,
        },
      });
    case RECEIVE_SUBMISSION_DETAIL:
      return Object.assign({}, state, {
        details: {
          ...state.details,
          [action.id]: action.details,
        },
      });
    default:
      return state;
  }
}

export function receiveSubmissions(contestId, submissions) {
  return {
    type: RECEIVE_SUBMISSIONS,
    contest: contestId,
    submissions,
  };
}

export function receiveSubmissionDetail(submissionId, details) {
  return {
    type: RECEIVE_SUBMISSION_DETAIL,
    id: submissionId,
    details,
  };
}

export function fetchSubmissions(contestId) {
  return async dispatch => {
    try {
      const json = await fetchJSONAuth(`/api/contests/${contestId}/submissions`);
      dispatch(receiveSubmissions(contestId, json.submissions));
    } catch (err) {
      alertServerError(err);
    }
  };
}

export function fetchSubmissionDetail(submissionId) {
  return async dispatch => {
    try {
      const json = await fetchJSONAuth(`/api/submissions/${submissionId}`);
      dispatch(receiveSubmissionDetail(submissionId, json));
    } catch (err) {
      alertServerError(err);
    }
  };
}
