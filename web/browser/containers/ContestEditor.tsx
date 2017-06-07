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
      title: nully(fields.contest_title.value),
      start_time: nully(fields.contest_start_time.value),
      end_time: nully(fields.contest_end_time.value),
      mode: fields.contest_mode.value,
      code: nully(fields.contest_code.value),
      problems: fields.contest_problems.value.trim().split('\n'),
      archived: fields.contest_archived.checked,
    }));
  }

  render() {
    const { active } = this.props;

    const startTime = ContestEditor.formatTimestamp(active.start_time);
    const endTime = ContestEditor.formatTimestamp(active.end_time);

    return (
      <SafetyBox>
        <form onSubmit={this.saveContest} className="container">
          <div className="form-group row">
            <label htmlFor="contest_title" className="col-3 col-form-label col-form-label-sm">Title</label>
            <div className="col-9">
              <input id="contest_title" type="text" defaultValue={active.title} className="form-control form-control-sm" />
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="contest_start_time" className="col-3 col-form-label col-form-label-sm">Start Time</label>
            <div className="col-9">
              <input id="contest_start_time" type="text" defaultValue={startTime} className="form-control form-control-sm" />
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="contest_end_time" className="col-3 col-form-label col-form-label-sm">End Time</label>
            <div className="col-9">
              <input id="contest_end_time" type="text" defaultValue={endTime} className="form-control form-control-sm" />
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="contest_mode" className="col-3 col-form-label col-form-label-sm">Registration Mode</label>
            <div className="col-9">
              <select disabled id="contest_mode" defaultValue={active.mode} className="form-control form-control-sm"><option value="code">registration code</option></select>
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="contest_code" className="col-3 col-form-label col-form-label-sm">Registration Code</label>
            <div className="col-9">
              <input id="contest_code" type="text" defaultValue={active.code} className="form-control form-control-sm" />
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="contest_problems" className="col-3 col-form-label col-form-label-sm">Problems</label>
            <div className="col-9">
              <textarea id="contest_problems" defaultValue={active.problems.join('\n')} rows={6} className="form-control form-control-sm" />
            </div>
          </div>

          <div className="form-group row">
            <div className="form-check col">
              <label htmlFor="contest_archived" className="form-check-label">
                <input id="contest_archived" type="checkbox" value="true" defaultChecked={active.archived} className="form-check-input" /> Archived
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">Save</button>
        </form>
      </SafetyBox>
    );
  }

}

export default connect(state => {
  return {
    active: state.contests.active,
  };
})(ContestEditor) as React.ComponentClass<{}>;
