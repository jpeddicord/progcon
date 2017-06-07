/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
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
      <div>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/admin">Contests</Link>
          </li>
          <li className="breadcrumb-item active">{active.title}</li>
        </ol>

        <div className="row">

          <div className="col-lg-6">
            <h3>Contest Details</h3>
            <ContestEditor />
          </div>

          <div className="col-lg-6 mt-4 mt-lg-0">
            <h3>Controls</h3>
            <SafetyBox>
              <div className="row">
                <div className="col">
                  <button className="btn btn-block btn-success"
                    onClick={this.bindCommand('start')}>
                    Start
                </button>
                </div>
                <div className="col">
                  <button className="btn btn-block btn-warning"
                    onClick={this.bindCommand('end')}>
                    End
                </button>
                </div>
              </div>
            </SafetyBox>

            <h3 className="mt-4">Users</h3>
            <UserManager />
          </div>
        </div>

        <div className="row mt-5">
          <div className="col">
            <SubmissionLog />
          </div>
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
