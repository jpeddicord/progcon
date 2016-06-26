import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Timer from '../components/Timer';

class StatusNav extends React.Component {
  static propTypes = {
    active: React.PropTypes.object,
  };

  render() {
    const { active } = this.props;

    return (
      <nav className="navbar navbar-full navbar-dark bg-inverse">
      <Link className="navbar-brand" to="/">the programming contest</Link>

      { active != null && active.id != null ?
        <div>
          <ul className="nav navbar-nav">
            <li className="nav-item active">
              <a className="nav-link" href="#">Problems</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Leaderboard</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Rules</a>
            </li>
          </ul>
          <div className="form-inline pull-xs-right">
            <Timer startTime={active.start_time} />
          </div>
        </div>
      : ''}
    </nav>
  );
  }

}

export default connect(state => {
  return {
    active: state.contests.active,
  };
})(StatusNav);
