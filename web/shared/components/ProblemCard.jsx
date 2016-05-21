import React from 'react';
import { Link } from 'react-router';

export default class ProblemCard extends React.Component {
  static propTypes = {
    children: React.PropTypes.element,
    contestId: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
  };

  render() {
    const { children, contestId, name } = this.props;

    return (
      <div>
        <h4><Link to={`/contests/${contestId}/problems/${name}`}>{name}</Link></h4>
        {children}
      </div>
    );
  }
}
