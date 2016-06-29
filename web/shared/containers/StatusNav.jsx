/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

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
            <li className="nav-item">
              <Link className="nav-link" to={`/contests/${active.id}`}>Problems</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={`/contests/${active.id}/leaderboard`}>Leaderboard</Link>
            </li>
          </ul>
          <div className="nav navbar-nav pull-xs-right">
            {/* FIXME: css abuse in bootstrap v4 alpha*/}
            <a className="nav-link">
              <Timer startTime={active.start_time} />
            </a>
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
