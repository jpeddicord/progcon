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
  active: any;
  score: any;
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
      <nav className="navbar navbar-toggleable navbar-inverse bg-inverse">
        <Link className="navbar-brand" to="/">the programming contest</Link>

        {active != null && active.id != null ?
          <div className="collapse navbar-collapse justify-content-between">
            <div className="navbar-nav">
              <Link className="nav-item nav-link" to={`/contests/${active.id}`}>Problems</Link>
              <Link className="nav-item nav-link" to={`/contests/${active.id}/leaderboard`}>Leaderboard</Link>
            </div>
            <div className="navbar-nav navbar-text">
              {display != null ? <a className="nav-item mr-3">
                <i className="fa fa-flag-checkered" /> {display}
              </a> : ''}
              <a className="nav-item">
                <i className="fa fa-clock-o" /> <Timer startTime={active.start_time} />
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
    score: state.contests.score,
  };
})(StatusNav);
