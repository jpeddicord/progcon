import React from 'react';
import { connect } from 'react-redux';
import ProblemCard from '../components/ProblemCard';
import { fetchContestDetail } from '../modules/contests';

class ContestOverview extends React.Component {
  static propTypes = {
    children: React.PropTypes.element,
    dispatch: React.PropTypes.func.isRequired,
    params: React.PropTypes.object.isRequired,
    active: React.PropTypes.object,
  };

  componentDidMount() {
    const { dispatch, active, params: { contest_id } } = this.props;
    if (active == null || active.id !== parseInt(contest_id)) {
      dispatch(fetchContestDetail(contest_id));
    }
  }

  // XXX: problem is just a string
  mapProblem = (problem, index) => {
    const { children, params: { contest_id, problem_name } } = this.props;
    if (problem_name != null && problem_name === problem) {
      return (
        <ProblemCard key={index} contestId={contest_id} name={problem}>{children}</ProblemCard>
      );
    }

    return (<ProblemCard key={index} contestId={contest_id} name={problem} />);
  };

  render() {
    const { active } = this.props;

    if (active == null || active.id == null) {
      return <div/>;
    }

    return (
      <div>
        <h3>{active.title}</h3>

        {active.problems.map(this.mapProblem)}
      </div>
    );
  }

}

export default connect(state => {
  return {
    active: state.contests.active,
  };
})(ContestOverview);
