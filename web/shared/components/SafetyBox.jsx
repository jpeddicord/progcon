/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import React from 'react';

export default class SafetyBox extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    mode: React.PropTypes.oneOf(['hide', 'mask']),
  };
  static defaultProps = {
    mode: 'mask',
  };

  state = {
    armed: false,
  };

  timeout = null;

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  arm = e => {
    this.setState({armed: true});
    this.timeout = setTimeout(() => {
      this.setState({armed: false});
    }, 10 * 1000);
  };

  render() {
    const { children, mode } = this.props;

    return (
      <div style={{position: 'relative'}}>
        { this.state.armed ? '' :
          <div className="caution-stripes" onClick={this.arm} />
        }
        {children}
      </div>
    );
  }

}
