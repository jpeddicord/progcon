/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

/* global __BUILD */
import alertify from 'alertify.js';
import React from 'react';
import StatusNav from '../containers/StatusNav';
import { clearToken } from '../util/token';

export default class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.element,
  };

  logout = async e => {
    const result = await alertify.okBtn('Log out').cancelBtn('Cancel')
        .confirm('Sign out? You will need a recovery code to sign back in.');
    result.event.preventDefault();
    if (result.buttonClicked === 'ok') {
      clearToken();
      window.location.reload();
    }
  };

  render() {
    return (
      <div>
        <StatusNav />

        <br/>

        <div className="container">
          <div className="row">
            <div className="col-md-12">
              {this.props.children}
            </div>
          </div>
        </div>

        <footer className="footer">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="pull-xs-right">
                  <small>
                    <button className="btn btn-link btn-sm" onClick={this.logout}>logout</button>
                  </small>
                </div>
                <small className="text-muted">
                  brought to you by <a href="https://github.com/jpeddicord/progcon" title={`${__BUILD.version} built on ${__BUILD.timestamp}`}>progcon</a>
                </small>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

}
