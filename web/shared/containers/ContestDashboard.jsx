import React from 'react';
import { connect } from 'react-redux';
import SafetyBox from '../components/SafetyBox';
import ContestEditor from '../containers/ContestEditor';
import { fetchContestDetail, contestCommand } from '../modules/contests';

class ContestDashboard extends React.Component {
  static propTypes = {
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

  bindCommand = command => {
    const { dispatch, active } = this.props;
    return e => {
      dispatch(contestCommand(active.id, command));
    };
  }

  render() {
    const { active, params: { contest_id } } = this.props;

    if (active == null || active.id !== parseInt(contest_id)) {
      return <div/>;
    }

    return (
      <div>
        <SafetyBox>
          <button className="btn btn-lg btn-success"
                  onClick={this.bindCommand('start')}>
            Start
          </button>
          <button className="btn btn-lg btn-warning"
                  onClick={this.bindCommand('end')}>
            End
          </button>
        </SafetyBox>


        <ContestEditor />
      </div>
    );

  }

}

export default connect(state => {
  return {
    active: state.contests.active,
  };
})(ContestDashboard);
