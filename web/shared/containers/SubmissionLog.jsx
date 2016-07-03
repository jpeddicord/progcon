/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import React from 'react';
import { connect } from 'react-redux';
import { fetchSubmissions, fetchSubmissionDetail } from '../modules/submissions';

class SubmissionLog extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    contestId: React.PropTypes.number.isRequired,
    submissionSet: React.PropTypes.object,
    submissionDetails: React.PropTypes.object,
  };

  state = {
    selectedSubmission: null,
  };

  // REVIEW: submissionSet is kinda dumb. maybe don't keep a contest->submissions map.
  componentDidMount() {
    const { dispatch, contestId, submissionSet } = this.props;
    if (submissionSet == null || submissionSet[contestId] == null) {
      dispatch(fetchSubmissions(contestId));
    }
  }

  loadDetails = id => {
    const { dispatch } = this.props;
    dispatch(fetchSubmissionDetail(id));
    this.setState({selectedSubmission: id});
  }

  render() {
    const { contestId, submissionSet, submissionDetails } = this.props;
    const { selectedSubmission } = this.state;
    const submissions = submissionSet[contestId];

    if (submissions == null) {
      return <div/>;
    }

    const details = selectedSubmission ? submissionDetails[selectedSubmission] : null;

    return (
      <div>
        <div style={{height: '400px', overflowY: 'scroll'}}>
          <table className="table table-sm table-hover">
            <thead>
              <tr>
                <th>User</th>
                <th>Problem</th>
                <th>Result</th>
                <th>Score</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody>
              {submissions.map((sub, i) => <SubmissionRow key={i} sub={sub} loadDetails={this.loadDetails} />)}
            </tbody>
          </table>
        </div>

        <SubmissionDetails details={details} />
      </div>
    );
  }
}

SubmissionRow.propTypes = {
  sub: React.PropTypes.object.isRequired,
  loadDetails: React.PropTypes.func.isRequired,
};
function SubmissionRow(props) {
  const { id, problem, result, submission_time, time_score, user_id, user_name } = props.sub;
  return (
    <tr style={{cursor: 'pointer'}} onClick={() => props.loadDetails(id)}>
      <td>{user_name} ({user_id})</td>
      <td>{problem}</td>
      <td>{result}</td>
      <td>{time_score}</td>
      <td>{submission_time}</td>
    </tr>
  );
}

SubmissionDetails.propTypes = {
  details: React.PropTypes.object,
};
function SubmissionDetails(props) {
  return (
    <div>
      {JSON.stringify(props.details)}
    </div>
  );
}

export default connect(state => {
  return {
    contestId: state.contests.active.id,
    submissionSet: state.submissions.contests,
    submissionDetails: state.submissions.details,
  };
})(SubmissionLog);
