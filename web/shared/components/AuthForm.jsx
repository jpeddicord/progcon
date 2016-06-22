import React from 'react';
import { browserHistory } from 'react-router';
import { fetchJSON } from '../util/fetch';
import { saveToken } from '../util/token';

async function auth(user, pass) {
  const json = await fetchJSON.post('/api/auth', {user, pass});
  saveToken(json.token);
  browserHistory.push('/');
}

export default class AuthForm extends React.Component {
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
