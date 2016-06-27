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
    }
  }

  // REVIEW: bleh
  componentWillReceiveProps(nextProps) {
    const { dispatch, params: { contest_id } } = this.props;
    console.log(nextProps);
    if (nextProps.active.id != null && nextProps.active.leaderboard == null) {
      dispatch(fetchLeaderboard(contest_id));
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
