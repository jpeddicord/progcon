/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import React from 'react';
import { connect } from 'react-redux';
import { fetchSubmissions, fetchSubmissionDetail, rerunSubmission } from '../modules/submissions';
import hljs from '../util/highlight';

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

  rerun = id => {
    const { dispatch } = this.props;
    dispatch(rerunSubmission(id));
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
        <h3>Submissions</h3>
        <div style={{height: '400px', overflowY: 'scroll'}}>
          <table className="table table-sm table-hover">
            <thead>
              <tr>
                <th>ID</th>
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

        <SubmissionDetails details={details} rerun={this.rerun} />
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

  let resultClass = '';
  if (result === 'successful') {
    resultClass = 'table-success';
  } else if (result === 'failed_tests') {
    resultClass = 'table-warning';
  } else if (result != null) {
    resultClass = 'table-danger';
  }

  return (
    <tr style={{cursor: 'pointer'}} onClick={() => props.loadDetails(id)}>
      <td>{id}</td>
      <td>{user_name} ({user_id})</td>
      <td>{problem}</td>
      <td className={resultClass}>{result}</td>
      <td>{time_score}</td>
      <td>{submission_time}</td>
    </tr>
  );
}

class SubmissionDetails extends React.Component {
  static propTypes = {
    details: React.PropTypes.object,
    rerun: React.PropTypes.func.isRequired,
  };

  code = null;
  diff = null;

  componentDidMount() {
    this.highlight();
  }

  componentDidUpdate() {
    this.highlight();
  }

  highlight() {
    if (this.props.details == null) {
      return;
    }

    hljs.highlightBlock(this.code);

    if (this.diff != null) {
      hljs.highlightBlock(this.diff);
    }
  }

  render() {
    if (this.props.details == null) {
      return <div/>;
    }

    const { id, answer, meta } = this.props.details;
    this.diff = null;

    // keys are used below to force react to re-mount each code block.
    // otherwise, hljs will not update its highlighted view.
    return (
      <div>
        <br/>
        <div className="pull-xs-right">
          <button className="btn btn-sm btn-info" onClick={e => this.props.rerun(id)}>Re-test this submission</button>
        </div>
        <h3>Submission {id}</h3>
        <h4>Submitted Answer</h4>
        <pre key={`ans-${id}`} className="pre-scrollable" ref={ref => this.code = ref}>
          <code className="java">
            {answer}
          </code>
        </pre>
        {meta != null ?
          <pre key={`diff-${id}`} className="pre-scrollable">
            <code className="diff" ref={ref => this.diff = ref}>
              {meta.diff}
            </code>
          </pre>
        : ''}
      </div>
    );
  }
}

export default connect(state => {
  return {
    contestId: state.contests.active.id,
    submissionSet: state.submissions.contests,
    submissionDetails: state.submissions.details,
  };
})(SubmissionLog);
