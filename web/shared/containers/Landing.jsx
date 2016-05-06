import React from 'react';
import { connect } from 'react-redux';
import { fetchContests } from '../modules/contests';

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
    const { dispatch } = this.props;

    dispatch(fetchContests());
  }

  render() {
    return (<div>
      Some list here. {JSON.stringify(this.props.contests)}
    </div>);
  }

}

export default connect(state => {
  return {
    contests: state.contests.list,
    active: state.contests.active,
  };
})(Landing);
