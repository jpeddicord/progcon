/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import moment from 'moment';
import 'moment-duration-format';
import React from 'react';
import { connect } from 'react-redux';
import { fetchContestDetail, fetchLeaderboard } from '../modules/contests';

class Leaderboard extends React.Component {
  static propTypes = {
    children: React.PropTypes.element,
    dispatch: React.PropTypes.func.isRequired,
    params: React.PropTypes.object.isRequired,
    active: React.PropTypes.object,
  };

  // REVIEW: move this contest-loading logic to someplace common; it shows up everywhere
  // perhaps a Contest wrapper that lives higher up on the router
  componentDidMount() {
    const { dispatch, active, params: { contest_id } } = this.props;

    // fetch contest data if we don't have it
    if (active == null || active.id !== parseInt(contest_id)) {
      dispatch(fetchContestDetail(contest_id));
      // this will then trigger checkLeaderboard when props are next received
    } else {
      this.checkLeaderboard();
    }
  }

  componentWillReceiveProps(nextProps) {
    this.checkLeaderboard(nextProps);
  }

  checkLeaderboard(props) {
    const { dispatch } = this.props;
    props = props || this.props;
    // have we loaded the contest but not the leaderboard?
    if (props.active.id != null && props.active.leaderboard == null) {
      dispatch(fetchLeaderboard(this.props.params.contest_id));
    }
  }

  render() {
    const { active } = this.props;

    if (active == null || active.id == null || active.leaderboard == null) {
      return <div/>;
    }

    let currentPlace = 1;

    return (
      <div>
        <h3>{active.title} <small>Leaderboard</small></h3>

        <table className="table table-hover table-sm">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Score</th>
              {active.problems.map((p, i) => {
                return (<th key={i}>{p}</th>);
              })}
            </tr>
          </thead>

          <tbody>
            {active.leaderboard.map((user, i) => {
              let place = null;
              if (!user.ineligible) {
                place = currentPlace;
                currentPlace++;
              }
              return <ScoreRow key={user.id} place={place} user={user} problems={active.problems} />;
            })}
          </tbody>
        </table>
      </div>
    );
  }

}

ScoreRow.propTypes = {
  place: React.PropTypes.number.isRequired,
  user: React.PropTypes.object.isRequired,
  problems: React.PropTypes.array.isRequired,
};
function ScoreRow(props) {
  const time = moment.duration(props.user.time_score, 'seconds').format('d[d] HH[h]:mm[m]');
  return (
    <tr>
      <td>{props.place != null ? props.place :
          <small><i className="fa fa-circle-o" title="Ineligible for leaderboard"/></small>
      }</td>
      <td>{props.user.name}</td>
      <td><strong>{props.user.problems_completed.length}</strong> in {time}</td>
      {props.problems.map((p, i) => {
        return <ProblemStatus key={i} problem={p} user={props.user} />;
      })}
    </tr>
  );
}

ProblemStatus.propTypes = {
  problem: React.PropTypes.string.isRequired,
  user: React.PropTypes.object.isRequired,
};
function ProblemStatus(props) {
  let problemScores = props.user.problem_scores[props.problem];
  const plural = problemScores != null && problemScores.length === 1 ? 'submission' : 'submissions';

  if (props.user.problems_completed.includes(props.problem)) {
    const problemScore = problemScores.reduce((sum, x) => sum + x, 0);
    const formatted = moment.duration(problemScore, 'seconds').format('d[d] HH[h]:mm[m]');
    return (
      <td className="table-success">
        {formatted} <small>({problemScores.length} {plural})</small>
      </td>
    );

  } else if (problemScores != null) {
    return (
      <td className={'table-warning'}>
        <small>{problemScores.length} {plural}</small>
      </td>
    );
  } else {
    return <td/>;
  }

}

export default connect(state => {
  return {
    active: state.contests.active,
  };
})(Leaderboard);
