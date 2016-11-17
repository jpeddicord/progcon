/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import ProblemCard from '../components/ProblemCard';
import { fetchContestDetail } from '../modules/contests';
import { loadToken } from '../util/token';

class ContestOverview extends React.Component {
  static propTypes = {
    children: React.PropTypes.element,
    dispatch: React.PropTypes.func.isRequired,
    params: React.PropTypes.object.isRequired,
    active: React.PropTypes.object,
  };

  componentDidMount() {
    const { dispatch, active, params: { contest_id } } = this.props;

    // if not authenticated, then send over to the registration form
    if (loadToken() == null) {
      browserHistory.replace(`/contests/${contest_id}/register`);
      return;
    }

    // fetch contest data if we don't have it
    if (active == null || active.id !== parseInt(contest_id)) {
      dispatch(fetchContestDetail(contest_id));
    }
  }

  mapProblem = (problem, index) => {
    const { children, params: { contest_id, problem_name } } = this.props;
    if (problem_name != null && problem_name === problem) {
      return (
        <ProblemCard key={index} contestId={contest_id} name={problem}>{children}</ProblemCard>
      );
    }

    return (<ProblemCard key={index} contestId={contest_id} name={problem} />);
  };

  render() {
    const { active } = this.props;

    if (active == null || active.id == null) {
      return <p>This contest is not currently active. If you just registered, sit tight -- it will be active soon.</p>;
    }

    return (
      <div>
        <h3>{active.title}</h3>

        {active.problems.map(this.mapProblem)}
      </div>
    );
  }

}

export default connect(state => {
  return {
    active: state.contests.active,
  };
})(ContestOverview);
