/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import React from 'react';

export default class AutoRefresh extends React.Component {
  static propTypes = {
    func: React.PropTypes.func.isRequired,
    interval: React.PropTypes.number.isRequired,
    icon: React.PropTypes.string,
    spinClass: React.PropTypes.string,
  };
  static defaultProps = {
    icon: 'fa-refresh',
    spinClass: 'fa-spin',
  }

  state = {
    enabled: true,
  };

  interval = null;

  componentDidMount() {
    this.startRefreshing();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  startRefreshing() {
    const { func, interval } = this.props;
    this.interval = setInterval(func, interval);
  }

  onClick = e => {
    if (this.state.enabled) {
      this.setState({enabled: false});
      clearInterval(this.interval);
    } else {
      this.setState({enabled: true});
      this.startRefreshing();
    }
  };

  render() {
    const { icon, spinClass } = this.props;
    const { enabled } = this.state;

    const spin = enabled ? spinClass : '';
    return (
      <i onClick={this.onClick} className={`fa fa-fw ${icon} ${spin}`} />
    );
  }

}
