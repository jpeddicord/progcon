/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import alertify from 'alertify.js';
import React from 'react';
import { connect } from 'react-redux';
import { fetchUsers, updateUser } from '../modules/users';

class UserManager extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    contestId: React.PropTypes.number.isRequired,
    userList: React.PropTypes.array,
    users: React.PropTypes.object,
  };

  state = {
    editing: null,
  };

  componentDidMount() {
    const { dispatch, contestId } = this.props;
    dispatch(fetchUsers(contestId));
  }

  saveUser = e => {
    e.preventDefault();
    const { dispatch, contestId } = this.props;
    const fields = e.target.elements;

    try {
      JSON.parse(fields.meta.value);
    } catch (err) {
      alertify.error(`Not valid JSON: ${err}`);
      return;
    }

    dispatch(updateUser(contestId, fields.userId.value, fields.name.value, fields.meta.value));
    this.setState({editing: null});
  };

  render() {
    const { userList, users } = this.props;

    if (users == null) {
      return <div/>;
    }

    if (this.state.editing != null) {
      return <UserEditor
        user={users[this.state.editing]}
        exitForm={e => this.setState({editing: null})}
        onSubmit={this.saveUser}
        />;
    }

    return (
      <div style={{maxHeight: '300px', overflowY: 'scroll'}}>
        <ul>
          {userList.map(id => {
            return (
              <li key={id}>
                <button className="btn btn-sm btn-link" onClick={e => this.setState({editing: id})}>
                  {users[id].name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

UserEditor.propTypes = {
  user: React.PropTypes.object.isRequired,
  exitForm: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
};
function UserEditor(props) {
  return (
    <div>
      <button className="btn btn-sm" onClick={props.exitForm}>back</button>
      <form onSubmit={props.onSubmit}>
        <input type="hidden" name="userId" defaultValue={props.user.id} /><br/>
        <input type="text" name="name" defaultValue={props.user.name} /><br/>
        <textarea name="meta" defaultValue={JSON.stringify(props.user.meta)} /><br/>
        <button className="btn btn-sm btn-primary">Save</button>
      </form>
    </div>
  );
}


export default connect(state => {
  return {
    contestId: state.contests.active.id,
    userList: state.users.list,
    users: state.users.users,
  };
})(UserManager);
