/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

/* global __BUILD */
import * as alertify from 'alertify.js';
import * as React from 'react';
import { connect } from 'react-redux';
import StatusNav from '../containers/StatusNav';
import { fetchConfig } from '../modules/common';
import { fetchJSON } from '../util/fetch';

interface Props {
  dispatch: Function;
  config?: any;
}

class App extends React.Component<Props, {}> {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchConfig());
  }

  logout = async e => {
    const result = await alertify.okBtn('Log out').cancelBtn('Cancel')
        .confirm('Sign out? You will need a recovery code to sign back in.');
    result.event.preventDefault();
    if (result.buttonClicked === 'ok') {
      await fetchJSON.post('/api/auth/logout', {});
      window.location.reload();
    }
  }

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

export default connect(state => {
  return {};
})(App);
