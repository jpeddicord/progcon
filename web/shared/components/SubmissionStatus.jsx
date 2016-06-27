/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import moment from 'moment';
import 'moment-duration-format';
import React from 'react';
import Timer from './Timer';

const statusClasses = {
  unsubmitted: '',
  pending: 'card-inverse card-primary',
  successful: 'card-inverse card-success',
  failed_tests: 'card-inverse card-danger',
  bad_compile: 'card-inverse card-danger',
  crashed: 'card-inverse card-danger',
  timeout: 'card-inverse card-danger',
  internal_error: 'card-warning',
};

export default class SubmissionStatus extends React.Component {
  static propTypes = {
    submission: React.PropTypes.object,
    contestStartTime: React.PropTypes.object.isRequired,
  };

  static timeScoreFormat(seconds, str = 'd[d] hh:mm:ss') {
    return moment.duration(seconds, 'seconds').format(str);
  }

  render() {
    const { submission, contestStartTime } = this.props;

    let result;
    if (submission == null) {
      result = 'unsubmitted';
    } else if (submission.result == null) {
      result = 'pending';
    } else {
      result = submission.result;
    }

    let penaltyCount = 0;
    let penaltySeconds = 0;
    let penaltyTime = 0;
    if (submission != null) {
      penaltyCount = submission.penalties.length;
      penaltySeconds = submission.penalties.reduce((sum, x) => sum + x, 0);
      penaltyTime = SubmissionStatus.timeScoreFormat(penaltySeconds, 'H[h] mm[m]');
    }

    const resubmit = (
      <span><br/>
        A correct submission now will add approximately{' '}
        <strong><Timer startTime={contestStartTime} /></strong>{' '}
        { penaltyCount > 0 ?
          `(plus ${penaltyTime} for ${penaltyCount} incorrect submissions) `
          : ''}
        to your score.
      </span>
    );

    let heading, text;
    switch (result) {
      case 'unsubmitted':
        text = resubmit;
        break;
      case 'pending': {
        const pendingTotalTimeScore = SubmissionStatus.timeScoreFormat(
          submission.submission_time.diff(contestStartTime, 'seconds') + penaltySeconds
        );
        text = `Your submission is in queue for grading. If successful, ${pendingTotalTimeScore} will be added to your total time.`;
        break;
      }
      case 'successful': {
        const formattedTimeScore = SubmissionStatus.timeScoreFormat(submission.total_time_score);
        heading = 'Correct!';
        text = `Congratulations, your answer was correct! It added ${formattedTimeScore} to your time.`; // XXX: this is wrong? try again with recent contest
        break;
      }
      case 'failed_tests':
        heading = 'Incorrect solution';
        text = (
          <span>
            Your submission <strong>failed {submission.test_fail} tests</strong> and passed {submission.test_pass}.
            {resubmit}
          </span>
        );
        break;
      case 'bad_compile':
        heading = 'Bad compile';
        text = (
          <span>
            Your program didn't compile! Be sure to compile locally before uploading.
            {resubmit}
          </span>
        );
        break;
      case 'crashed':
        heading = 'Crashed!';
        text = (
          <span>
            Yikes! Your program crashed on one of our tests.
            {resubmit}
          </span>
        );
        break;
      case 'timeout':
        heading = 'Killed (timeout)';
        text = (
          <span>
            Yikes! Your program took too long to run on one of our tests. Make sure you don't have any infinite loops, and try to make it faster.
            {resubmit}
          </span>
        );
        break;
      case 'internal_error':
        text = 'Oops. There was a problem grading your submission. Try it again. (No time penalty.)';
        break;
    }

    return (
      <div className={`card card-block ${statusClasses[result]}`}>
        {heading != null ? <h4 className="card-title">{heading}</h4> : ''}
        <p className="card-text">{text}</p>
      </div>
    );
  }
}
