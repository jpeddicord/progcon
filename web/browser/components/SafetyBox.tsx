/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import * as React from 'react';

interface State {
  armed: boolean;
}

export default class SafetyBox extends React.Component<{}, State> {
  state = {
    armed: false,
  };

  timeout: any = null;

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  arm = (e: any) => {
    this.setState({armed: true});
    this.timeout = setTimeout(() => {
      this.setState({armed: false});
    }, 10 * 1000);
  }

  render() {
    const { children } = this.props;

    return (
      <div style={{position: 'relative', padding: '10px'}}>
        { this.state.armed ? '' :
          <div className="caution-stripes" onDoubleClick={this.arm} title="Control is locked. Double-click to arm."/>
        }
        {children}
      </div>
    );
  }

}
