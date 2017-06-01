/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import * as React from 'react';
import { browserHistory } from 'react-router';
import { alertServerError } from '../util/alert';
import { fetchJSON } from '../util/fetch';

async function auth(user: string, pass: string) {
  try {
    await fetchJSON.post('/api/auth', {user, pass});
    browserHistory.push('/');
  } catch (err) {
    alertServerError(err);
  }
}

export default class AuthForm extends React.Component<{}, {}> {
  submit = (e: any) => {
    const fields = e.target.elements;
    e.preventDefault();

    auth(fields.user.value, fields.pass.value);
  }

  render() {
    return (
      <form onSubmit={this.submit}>
        <fieldset className="form-group">
          <label htmlFor="userId">User ID (number)</label>
          <input type="text" name="user" id="userId" className="form-control" required />
        </fieldset>
        <fieldset className="form-group">
          <label htmlFor="recoveryCode">Recovery Code</label>
          <input type="password" name="pass" id="recoveryCode" className="form-control" required />
        </fieldset>

        <button type="submit" className="btn btn-lg btn-primary">Login</button>
      </form>
    );
  }

}
