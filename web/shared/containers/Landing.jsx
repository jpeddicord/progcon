import React from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { fetchContests } from '../modules/contests';

class Landing extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    contests: React.PropTypes.array.isRequired,
    active: React.PropTypes.object,
  };

  componentDidMount() {
    const { dispatch, contests } = this.props;
    if (contests == null || contests.length === 0) {
      dispatch(fetchContests());
    }
  }

  componentWillReceiveProps(nextProps) {

  }

  redirectSingle = () => {
    const { contests } = this.props;
    if (contests.length === 1) {
      browserHistory.replace(`/contests/${contests[0].id}`);
    }
  };

  render() {
    const { contests } = this.props;

    if (contests.length === 0) {
      return (
        <p>
          There are currently no active contests. If you're waiting for one to start, sit tight! We're getting it ready.
        </p>
      );
    }

    return (
      <div>
        <p>Select a contest to participate in:</p>
        <ul>
          {contests.map((c, i) => (
            <li key={i}><Link to={`/contests/${c.id}`}>{c.title}</Link></li>
          ))}
        </ul>
      </div>
    );
  }

}

export default connect(state => {
  return {
    contests: state.contests.list,
  };
})(Landing);
