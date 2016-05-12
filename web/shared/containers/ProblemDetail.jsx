import React from 'react';
import { connect } from 'react-redux';
import { fetchProblem } from '../modules/problems';
import { fetchNeeds } from '../util/needs';

class ProblemDetail extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    params: React.PropTypes.object.isRequired,
    active: React.PropTypes.object,
  };

  static needs = [
    params => fetchProblem(params.problem_name),
  ];

  componentDidMount() {
    /*
    const { active, params: { contest_id } } = this.props;
    if (active == null || active.id !== parseInt(contest_id)) {
      fetchNeeds(this);
    }
    */
  }

  render() {
    return (
      <div>
        [[ DETAILS HERE ]]
      </div>
    );
  }

}

export default connect(state => {
  return {
    problems: state.problems.map,
  };
})(ProblemDetail);
