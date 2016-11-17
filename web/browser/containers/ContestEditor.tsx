/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import * as React from 'react';
import { connect } from 'react-redux';
import SafetyBox from '../components/SafetyBox';
import { updateContest } from '../modules/contests';

interface Props {
  dispatch: Function;
  active: any;
}

class ContestEditor extends React.Component<Props, {}> {
  static formatTimestamp(stamp) {
    if (stamp == null || !stamp.isValid()) {
      return '';
    }

    return stamp.format('YYYY-MM-DD HH:mm:ss Z');
  }

  saveContest = e => {
    const { dispatch, active } = this.props;
    const fields = e.target.elements;
    e.preventDefault();

    function nully(v) {
      if (v.length === 0) {
        return null;
      }
      return v;
    }

    dispatch(updateContest(active.id, {
      title: nully(fields.title.value),
      start_time: nully(fields.start_time.value),
      end_time: nully(fields.end_time.value),
      mode: fields.mode.value,
      code: nully(fields.code.value),
      problems: fields.problems.value.trim().split('\n'),
    }));
  };

  render() {
    const { active } = this.props;

    const startTime = ContestEditor.formatTimestamp(active.start_time);
    const endTime = ContestEditor.formatTimestamp(active.end_time);

    return (
      <SafetyBox>
        <form onSubmit={this.saveContest}>
          title: <input name="title" type="text" defaultValue={active.title} /><br/>
          start time: <input name="start_time" type="text" defaultValue={startTime} /><br/>
          end time: <input name="end_time" type="text" defaultValue={endTime} /><br/>
          reg mode: <select disabled name="mode" defaultValue={active.mode}><option value="code">registration code</option></select><br/>
          reg code: <input name="code" type="text" defaultValue={active.code} /><br/>
          problems: <textarea name="problems" defaultValue={active.problems.join('\n')} /><br/>
          <button type="submit">save</button>
        </form>
      </SafetyBox>
    );
  }

}

export default connect(state => {
  return {
    active: state.contests.active,
  };
})(ContestEditor);
