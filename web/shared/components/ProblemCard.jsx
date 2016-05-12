import React from 'react';
import { Link } from 'react-router';

export default class ProblemCard extends React.Component {
  static propTypes = {
    name: React.PropTypes.string.isRequired,
    children: React.PropTypes.element,
  };

  render() {
    const { name, children } = this.props;

    // XXX: bad link
    return (
      <div>
        <h4><Link to={`/contests/1/problems/${name}`}>{name}</Link></h4>
        {children}
      </div>
    );
  }
}
