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
import AutoRefresh from '../components/AutoRefresh';
import { fetchContestDetail, fetchLeaderboard } from '../modules/contests';

interface Props {
  dispatch: Function;
  params: any;
  active: any;
  leaderboard: any[];
}

class Leaderboard extends React.Component<Props, {}> {
  componentDidMount() {
    const { dispatch, params: { contest_id } } = this.props;

    dispatch(fetchContestDetail(contest_id));
    this.fetchLeaderboard();
  }

  fetchLeaderboard = () => {
    const { dispatch, params: { contest_id } } = this.props;
    dispatch(fetchLeaderboard(contest_id));
  };

  render() {
    const { active, leaderboard } = this.props;

    if (active == null || active.id == null || leaderboard == null) {
      return <div/>;
    }

    let currentPlace = 1;

    return (
      <div>
        <div className="pull-xs-right">
          <AutoRefresh func={this.fetchLeaderboard} interval={10 * 1000} />
        </div>

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
            {leaderboard.map((user, i) => {
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

interface ScoreRowProps {
  place?: number;
  user: any;
  problems: any[];
}
function ScoreRow(props: ScoreRowProps) {
  const time = (moment.duration(props.user.time_score, 'seconds') as any).format('d[d] HH[h]:mm[m]');
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

interface ProblemStatusProps {
  problem: string;
  user: any;
}
function ProblemStatus(props: ProblemStatusProps) {
  let problemScores = props.user.problem_scores[props.problem];
  const plural = problemScores != null && problemScores.length === 1 ? 'submission' : 'submissions';

  if (props.user.problems_completed.includes(props.problem)) {
    const problemScore = problemScores.reduce((sum, x) => sum + x, 0);
    const formatted = (moment.duration(problemScore, 'seconds') as any).format('d[d] HH[h]:mm[m]');
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
    leaderboard: state.contests.leaderboard,
  };
})(Leaderboard);
