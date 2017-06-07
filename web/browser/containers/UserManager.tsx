/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import * as alertify from 'alertify.js';
import * as React from 'react';
import { connect } from 'react-redux';
import { fetchUsers, updateUser } from '../modules/users';

interface Props {
  dispatch: Function;
  contestId: number;
  userList: any[];
  users: any;
}
interface State {
  editing: string | null;
}

class UserManager extends React.Component<Props, State> {
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
      JSON.parse(fields.user_meta.value);
    } catch (err) {
      alertify.error(`Not valid JSON: ${err}`);
      return;
    }

    dispatch(updateUser(contestId, fields.user_id.value, fields.user_name.value, fields.user_meta.value));
    this.setState({editing: null});
  }

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
      <div style={{maxHeight: '350px', overflowY: 'scroll'}}>
        <div className="list-group">
          {userList.map(id => {
            return (
              <button key={id} className="list-group-item list-group-item-action" onClick={e => this.setState({editing: id})}>
                {users[id].name}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
}

interface UserEditorProps {
  user: any;
  exitForm: (e) => void;
  onSubmit: (e) => void;
}
function UserEditor(props: UserEditorProps) {
  const userJSON = JSON.stringify(props.user.meta, null, 2);

  return (
    <div>
      <button className="btn" onClick={props.exitForm}>Back</button>

      <form onSubmit={props.onSubmit} className="mt-2">
        <input type="hidden" name="user_id" defaultValue={props.user.id} />

        <div className="form-group">
          <label htmlFor="user_name">Name</label>
          <input type="text" id="user_name" defaultValue={props.user.name} required className="form-control" />
        </div>

        <div className="form-group">
          <label htmlFor="user_meta">Metadata</label>
          <textarea id="user_meta" defaultValue={userJSON} rows={8} style={{fontFamily: 'monospace'}} className="form-control" />
        </div>

        <button className="btn btn-primary">Save</button>
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
})(UserManager) as React.ComponentClass<{}>;
