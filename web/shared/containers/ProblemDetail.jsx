import React from 'react';
import { connect } from 'react-redux';
import SolutionUploader from '../components/SolutionUploader';
import { fetchProblem, submitAnswer } from '../modules/problems';
import { fetchNeeds } from '../util/needs';

class ProblemDetail extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    params: React.PropTypes.object.isRequired,
    problems: React.PropTypes.object.isRequired,
  };

  static needs = [
    params => fetchProblem(params.contest_id, params.problem_name),
  ];

  componentDidMount() {
    const { problems, params: { problem_name } } = this.props;
    const problem = problems[problem_name];
    if (problem == null) {
      fetchNeeds(this);
    }
  }

  submitAnswer = content => {
    const { dispatch, params: { contest_id, problem_name } } = this.props;

    console.log(content);
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
