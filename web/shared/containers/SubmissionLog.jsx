/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import React from 'react';
import { connect } from 'react-redux';
import { fetchSubmissionLog } from '../modules/contests';

class SubmissionLog extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    contestId: React.PropTypes.number.isRequired,
    submissions: React.PropTypes.array,
  };

  componentDidMount() {
    const { dispatch, contestId, submissions } = this.props;
    if (submissions == null) {
      dispatch(fetchSubmissionLog(contestId));
    }
  }

  render() {
    const { submissions } = this.props;

    return (
      <div id="submission-log">
        {JSON.stringify(submissions)}
      </div>
    );

  }

}

export default connect(state => {
  return {
    contestId: state.contests.active.id,
    submissions: state.contests.active.submissions,
  };
})(SubmissionLog);
