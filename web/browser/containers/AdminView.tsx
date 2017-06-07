/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { createContest, fetchContests } from '../modules/contests';

interface Props {
  dispatch: Function;
  contests: any[];
}

class AdminView extends React.Component<Props, {}> {
  componentDidMount() {
    const { dispatch, contests } = this.props;
    if (contests == null || contests.length === 0) {
      dispatch(fetchContests(true));
    }
  }

  createContest = e => {
    const { dispatch } = this.props;
    const fields = e.target.elements;
    e.preventDefault();

    dispatch(createContest(fields.title.value));
  }

  render() {
    const { contests } = this.props;
    return (
      <div>
        <h2>Contests</h2>

        <form className="form-inline mb-4" onSubmit={this.createContest}>
          <input type="text" name="title" placeholder="Contest name" required className="form-control" />
          <button type="submit" className="btn btn-primary">Create</button>
        </form>

        <div className="list-group">
          {contests.map((c, i) => (
            <Link key={i} to={`/admin/contests/${c.id}`} className="list-group-item">
              {c.title}&nbsp;
              {c.archived && <em>(archived)</em>}
            </Link>
          ))}
        </div>
      </div>
    );
  }

}

export default connect(state => {
  return {
    contests: state.contests.list,
  };
})(AdminView);
