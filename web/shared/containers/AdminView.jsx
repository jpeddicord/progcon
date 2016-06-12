import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { createContest, fetchContests } from '../modules/contests';

class AdminView extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    contests: React.PropTypes.array.isRequired,
  };

  componentDidMount() {
    const { dispatch, contests } = this.props;
    if (contests == null || contests.length === 0) {
      dispatch(fetchContests());
    }
  }

  createContest = e => {
    const { dispatch } = this.props;
    const fields = e.target.elements;
    e.preventDefault();

    dispatch(createContest(fields.title.value));
  };

  render() {
    const { contests } = this.props;
    return (
      <div>
        admin stuff.

        <h2>contests</h2>

        <form onSubmit={this.createContest}>
          <input type="text" name="title" required />
          <button type="submit">create</button>
        </form>

        <ul>
          {contests.map((c, i) => (
            <li key={i}><Link to={`/admin/contests/${c.id}`}>{c.title}</Link></li>
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
})(AdminView);
