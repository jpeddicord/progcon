/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import React from 'react';
import { Link } from 'react-router';

export default class ProblemCard extends React.Component {
  static propTypes = {
    children: React.PropTypes.element,
    contestId: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
  };

  render() {
    const { children, contestId, name } = this.props;

    return (
      <div>
        <h4><Link to={`/contests/${contestId}/problems/${name}`}>{name}</Link></h4>
        {children}
      </div>
    );
  }
}
