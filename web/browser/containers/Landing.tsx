/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { fetchContests } from '../modules/contests';

interface Props {
  dispatch: Function;
  contests: any[];
}

class Landing extends React.Component<Props, {}> {
  componentDidMount() {
    const { dispatch, contests } = this.props;
    if (contests == null || contests.length === 0) {
      dispatch(fetchContests());
    }
  }

  redirectSingle = () => {
    const { contests } = this.props;
    if (contests.length === 1) {
      browserHistory.replace(`/contests/${contests[0].id}`);
    }
  };

  render() {
    const { contests } = this.props;

    if (contests.length === 0) {
      return (
        <p>
          There are currently no active contests. If you're waiting for one to start, sit tight! We're getting it ready.
        </p>
      );
    }

    return (
      <div>
        <p>Select a contest to participate in:</p>
        <ul>
          {contests.map((c, i) => (
            <li key={i}><Link to={`/contests/${c.id}`}>{c.title}</Link></li>
          ))}
        </ul>
      </div>
    );
  }

}

export default connect(state => {
  return {
    contests: state.contests.list,
  };
})(Landing);
