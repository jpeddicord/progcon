import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
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

  render() {
    const { contests } = this.props;

    return (
      <ul>
        {contests.map((c, i) => (
          <li key={i}><Link to={`/contests/${c.id}`}>{c.title}</Link></li>
        ))}
      </ul>
    );
  }

}

export default connect(state => {
  return {
    contests: state.contests.list,
  };
})(Landing);
