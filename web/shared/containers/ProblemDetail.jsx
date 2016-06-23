import React from 'react';
import { connect } from 'react-redux';
import SolutionUploader from '../components/SolutionUploader';
import { fetchProblem, submitAnswer } from '../modules/problems';

class ProblemDetail extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    params: React.PropTypes.object.isRequired,
    problems: React.PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { dispatch, problems, params: { contest_id, problem_name } } = this.props;
    const problem = problems[problem_name];
    if (problem == null) {
      dispatch(fetchProblem(contest_id, problem_name));
    }
  }

  submitAnswer = content => {
    const { dispatch, params: { contest_id, problem_name } } = this.props;

    dispatch(submitAnswer(contest_id, problem_name, content));
  };

  render() {
    const { problems, params: { problem_name } } = this.props;
    const problem = problems[problem_name];
    if (problem == null) {
      return (<div>...</div>);
    }

    return (
      <div>
        Status: {problem.status}<br/>
        <SolutionUploader onSubmit={this.submitAnswer} />
      </div>
    );
  }

}

export default connect(state => {
  return {
    problems: state.problems.map,
  };
})(ProblemDetail);
