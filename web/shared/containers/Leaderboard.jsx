/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

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

    if (active == null || active.id == null) {
      return <div/>;
    }

    return (
      <div>
        <h3>{active.title} <small>Leaderboard</small></h3>

        <table className="table table-hover table-sm">
          <thead>
            <tr>
              <th>ID#</th>
              <th>Name</th>
              {active.problems.map((p, i) => {
                return (<th key={i}>{p}</th>);
              })}
            </tr>
          </thead>

          <tbody>
            {active.leaderboard.map((user, i) => {
              return (
                <tr key={i}>
                  <td>{user.participant_number}</td>
                  <td>{user.name}</td>
                  {active.problems.map((p, i) => {

                    return (<td key={i}>???</td>);
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        {JSON.stringify(active.leaderboard)}
      </div>
    );
  }

}

export default connect(state => {
  return {
    active: state.contests.active,
  };
})(Leaderboard);
