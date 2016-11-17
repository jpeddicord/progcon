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
import { saveToken } from '../util/token';

async function auth(user, pass) {
  try {
    const json = await fetchJSON.post('/api/auth', {user, pass});
    saveToken(json.token);
    browserHistory.push('/');
  } catch (err) {
    alertServerError(err);
  }
}

export default class AuthForm extends React.Component<{}, {}> {
  submit = e => {
    const fields = e.target.elements;
    e.preventDefault();

    auth(fields.user.value, fields.pass.value);
  };

  render() {
    return (
      <form onSubmit={this.submit}>
        user id: <input type="text" name="user" /><br/>
        password: <input type="password" name="pass" /><br/>
        <button type="submit">login</button>
      </form>
    );
  }

}
