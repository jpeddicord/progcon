/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import * as React from 'react';
import { connect } from 'react-redux';
import SafetyBox from '../components/SafetyBox';
import ContestEditor from '../containers/ContestEditor';
import SubmissionLog from '../containers/SubmissionLog';
import UserManager from '../containers/UserManager';
import { fetchContestDetail, contestCommand } from '../modules/contests';

interface Props {
  dispatch: Function;
  params: any;
  active: any;
}

class ContestDashboard extends React.Component<Props, {}> {
  componentDidMount() {
    const { dispatch, active, params: { contest_id } } = this.props;
    if (active == null || active.id !== parseInt(contest_id)) {
      dispatch(fetchContestDetail(contest_id));
    }
  }

  bindCommand = command => {
    const { dispatch, active } = this.props;
    return e => {
      dispatch(contestCommand(active.id, command));
    };
  }

  render() {
    const { active, params: { contest_id } } = this.props;

    if (active == null || active.id !== parseInt(contest_id)) {
      return <div/>;
    }

    return (
      <div className="row">
        <div className="col-md-8">
          <SubmissionLog />
        </div>

        <div className="col-md-4">
          <h3>Controls</h3>
          <SafetyBox>
            <div className="row">
              <div className="col-6">
                <button className="btn btn-block btn-success"
                  onClick={this.bindCommand('start')}>
                  Start
                </button>
              </div>
              <div className="col-6">
                <button className="btn btn-block btn-warning"
                  onClick={this.bindCommand('end')}>
                  End
                </button>
              </div>
            </div>
          </SafetyBox>
          <br/><h3>Contest Details</h3>
          <ContestEditor />
          <br/><h3>Users</h3>
          <UserManager />
        </div>
      </div>

    );

  }

}

export default connect(state => {
  return {
    active: state.contests.active,
  };
})(ContestDashboard);
