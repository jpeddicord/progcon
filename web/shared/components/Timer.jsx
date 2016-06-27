/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import moment from 'moment';
import 'moment-duration-format';
import React from 'react';

export default class Timer extends React.Component {
  static propTypes = {
    startTime: React.PropTypes.object,
    format: React.PropTypes.string,
  };
  static defaultProps = {
    format: 'd[d] hh[h]:mm[m]',
  }

  state = {
    elapsed: null,
  };

  timeout = null;

  componentDidMount() {
    this.timeout = setInterval(this.updateTime, 30 * 1000);
    this.updateTime();
  }

  componentWillUnmount() {
    clearInterval(this.timeout);
  }

  updateTime = () => {
    if (this.props.startTime == null) {
      this.setState({elapsed: null});
      return;
    }

    this.setState({
      elapsed: moment().diff(this.props.startTime, 'seconds'),
    });
  };

  render() {
    const display = moment.duration(this.state.elapsed, 'seconds').format(this.props.format);
    return (
      <span>
        {display}
      </span>
    );
  }

}
