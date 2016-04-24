import React from 'react';
import { connect } from 'react-redux';
import { fetchContests } from '../modules/contests';

class Landing extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { dispatch } = this.props;

    dispatch(fetchContests());
  }

  render() {
    return (<div>Some list here.</div>);
  }

}

export default connect(state => {
  return {
    contests: state.contests.list,
    active: state.contests.active,
  };
})(Landing);
