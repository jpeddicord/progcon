/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import React from 'react';
import { connect } from 'react-redux';
import SafetyBox from '../components/SafetyBox';
import ContestEditor from '../containers/ContestEditor';
import SubmissionLog from '../containers/SubmissionLog';
import { fetchContestDetail, contestCommand } from '../modules/contests';

class ContestDashboard extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    params: React.PropTypes.object.isRequired,
    active: React.PropTypes.object,
  };

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
        <div className="row">
          <div className="col-md-8">
            <SubmissionLog />
          </div>

          <div className="col-md-4">
            <SafetyBox>
              <div className="pull-md-right">
                <button className="btn btn-lg btn-success"
                  onClick={this.bindCommand('start')}>
                  Start
                </button>
                <button className="btn btn-lg btn-warning"
                  onClick={this.bindCommand('end')}>
                  End
                </button>
              </div>
              <br style={{clear: 'both'}}/>
            </SafetyBox>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <ContestEditor />
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
