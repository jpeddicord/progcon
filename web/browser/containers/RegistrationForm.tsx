/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { registerForContest } from '../modules/contests';

interface Props {
  dispatch: Function;
  params: any;
  active: any;
  extraFields: any[];
}

class RegistrationForm extends React.Component<Props, {}> {
  submitRegistration = e => {
    const { dispatch, params: { contest_id }, extraFields } = this.props;
    const fields = e.target.elements;
    e.preventDefault();

    const meta = {};
    for (let customField of extraFields) {
      meta[customField.name] = fields[customField.name].value;
    }

    dispatch(registerForContest(contest_id, fields.code.value, fields.name.value, meta));
  }

  render() {
    const { extraFields } = this.props;
    return (
      <form onSubmit={this.submitRegistration}>
        <fieldset className="form-group">
          <label htmlFor="registrationCode">Registration Code</label>
          <input type="text" name="code" id="registrationCode" className="form-control" required />
        </fieldset>
        <fieldset className="form-group">
          <label htmlFor="registrationName">Your Name</label>
          <input type="text" name="name" id="registrationName" className="form-control" required />
        </fieldset>

        {extraFields.map(field => {
          return (
            <fieldset key={field.name} className="form-group">
              <label htmlFor={`registration-${field.name}`}>{field.label}</label>
              <input type="text" name={field.name} id={`registration-${field.name}`} className="form-control" required />
            </fieldset>
          );
        })}

        <button type="submit" className="btn btn-lg btn-primary">Register</button>

        <br/><br/>
        <p><small><Link to="/auth">Have a recovery code?</Link></small></p>
      </form>
    );
  }

}

export default connect(state => {
  return {
    active: state.contests.active,
    extraFields: state.common.config.registration.fields,
  };
})(RegistrationForm);
