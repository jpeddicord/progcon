/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import * as moment from 'moment';
import 'moment-duration-format';
import * as React from 'react';

interface Props {
  startTime: any;
  format?: string;
}
interface State {
  elapsed: number | null;
}

export default class Timer extends React.Component<Props, State> {
  static defaultProps = {
    format: 'd[d] hh[h]:mm[m]',
  }

  state = {
    elapsed: null as number | null,
  };

  timeout: any = null;

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
    if (this.state.elapsed == null) {
      return <span/>;
    }

    const display = (moment.duration(this.state.elapsed, 'seconds') as any).format(this.props.format);
    return (
      <span>
        {display}
      </span>
    );
  }

}
