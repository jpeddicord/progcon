/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

/* eslint-disable react/no-danger */
import * as React from 'react';
import { connect } from 'react-redux';
import SolutionUploader from '../components/SolutionUploader';
import SubmissionStatus from '../components/SubmissionStatus';
import { fetchProblem, submitAnswer } from '../modules/problems';
import { triggerTextDownload } from '../util/download';

interface Props {
  dispatch: Function;
  params: any;
  problems: any;
  contest: any;
}

class ProblemDetail extends React.Component<Props, {}> {
  componentDidMount() {
    this.fetchProblem();
  }

  fetchProblem = () => {
    const { dispatch, params: { contest_id, problem_name } } = this.props;
    dispatch(fetchProblem(contest_id, problem_name));
  };

  downloadStub = e => {
    const { problems, params: { problem_name } } = this.props;
    const problem = problems[problem_name];
    triggerTextDownload(problem.stub_name, problem.stub);
  };

  submitAnswer = content => {
    const { dispatch, params: { contest_id, problem_name } } = this.props;

    dispatch(submitAnswer(contest_id, problem_name, content));
  };

  render() {
    const { problems, contest, params: { problem_name } } = this.props;
    const problem = problems[problem_name];
    if (problem == null) {
      return (<div>...</div>);
    }

    // description is HTML loaded from file, it's safe
    const description = {__html: problem.description};

    return (
      <div>
        <div className="row">
          <div className="col-md-7">
            <SubmissionStatus
              submission={problem.submission}
              contestStartTime={contest.start_time}
              refresh={this.fetchProblem}
            />
          </div>
          <div className="col-md-5">
            <SolutionUploader onSubmit={this.submitAnswer} />
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <p>
              Implement your solution starting with this template:{' '}
              <button className="btn btn-link" onClick={this.downloadStub}>
                Download Stub
              </button>
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12" dangerouslySetInnerHTML={description} />
        </div>
      </div>
    );
  }

}

export default connect(state => {
  return {
    problems: state.problems.map,
    contest: state.contests.active,
  };
})(ProblemDetail);
