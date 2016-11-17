/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import * as moment from 'moment';
import 'moment-duration-format';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Timer from '../components/Timer';

interface Props {
  dispatch: Function;
  active?: any;
  score?: any;
}

class StatusNav extends React.Component<Props, {}> {
  render() {
    const { active, score } = this.props;

    let display;
    if (score != null && score.time_score > 0) {
      const timeScore = (moment.duration(score.time_score, 'seconds') as any).format('d[d] HH[h]:mm[m]');
      display = `${score.problems_completed.length} in ${timeScore}`;
    }

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
          <ul className="nav navbar-nav pull-xs-right">
            {display != null ? <li className="nav-item">
              {/* FIXME: css abuse in bootstrap v4 alpha*/}
              <a className="nav-link">
                <i className="fa fa-flag-checkered" /> {display}
              </a>
            </li> : ''}
            <li className="nav-item">
              <a className="nav-link">
                <i className="fa fa-clock-o" /> <Timer startTime={active.start_time} />
              </a>
            </li>
          </ul>
        </div>
      : ''}
    </nav>
  );
  }

}

export default connect(state => {
  return {
    active: state.contests.active,
    score: state.contests.score,
  };
})(StatusNav);
