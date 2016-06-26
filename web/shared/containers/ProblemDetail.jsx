/* eslint-disable react/no-danger */
import React from 'react';
import { connect } from 'react-redux';
import SolutionUploader from '../components/SolutionUploader';
import SubmissionStatus from '../components/SubmissionStatus';
import { fetchProblem, submitAnswer } from '../modules/problems';

class ProblemDetail extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    params: React.PropTypes.object.isRequired,
    problems: React.PropTypes.object.isRequired,
    contest: React.PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { dispatch, problems, params: { contest_id, problem_name } } = this.props;
    const problem = problems[problem_name];
    if (problem == null) {
      dispatch(fetchProblem(contest_id, problem_name));
    }
  }

  downloadStub = e => {
    const { problems, params: { problem_name } } = this.props;
    const problem = problems[problem_name];
    const encoded = encodeURIComponent(problem.stub);
    const uri = `data:text/plain;charset=utf-8,${encoded}`;

    // make a fake link and "click" it
    const ele = document.createElement('a');
    ele.setAttribute('download', problem.stub_name);
    ele.setAttribute('href', uri);
    ele.style.display = 'none';
    document.body.appendChild(ele);
    ele.click();
    document.body.removeChild(ele);
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
