import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { fetchContests } from '../modules/contests';
import { fetchNeeds } from '../util/needs';

class Landing extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    contests: React.PropTypes.array.isRequired,
    active: React.PropTypes.object,
  };

  static needs = [
    params => fetchContests(),
  ];

  componentDidMount() {
    const { contests } = this.props;
    if (contests == null || contests.length === 0) {
      fetchNeeds(this);
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
