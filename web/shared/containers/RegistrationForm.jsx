/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import React from 'react';
import { connect } from 'react-redux';
import { registerForContest } from '../modules/contests';

class RegistrationForm extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    params: React.PropTypes.object.isRequired,
    active: React.PropTypes.object,
  };

  componentDidMount() {
    /* TODO: show contest details on reg form
    const { dispatch, active, params: { contest_id } } = this.props;
    if (active == null || active.id !== parseInt(contest_id)) {
      dispatch(fetchContestDetail(contest_id));
    }
    */
  }

  submitRegistration = e => {
    const { dispatch, params: { contest_id } } = this.props;
    const fields = e.target.elements;
    e.preventDefault();

    dispatch(registerForContest(contest_id, fields.code.value, fields.name.value));
  };

  render() {
    return (
      <form onSubmit={this.submitRegistration}>
        registration code: <input type="text" name="code" /><br/>
        your name: <input type="text" name="name" /><br/>
        <button type="submit">register</button>
      </form>
    );
  }

}

export default connect(state => {
  return {
    active: state.contests.active,
  };
})(RegistrationForm);
