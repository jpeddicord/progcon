/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import Landing from './containers/Landing';
import ContestOverview from './containers/ContestOverview';
import ProblemDetail from './containers/ProblemDetail';
import Leaderboard from './containers/Leaderboard';
import RegistrationForm from './containers/RegistrationForm';
import AuthForm from './components/AuthForm';
import AdminView from './containers/AdminView';
import ContestDashboard from './containers/ContestDashboard';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Landing} />
    <Route path="contests/:contest_id" component={ContestOverview}>
      <Route path="problems/:problem_name" component={ProblemDetail} />
    </Route>
    <Route path="contests/:contest_id/leaderboard" component={Leaderboard} />
    <Route path="contests/:contest_id/register" component={RegistrationForm} />
    <Route path="auth" component={AuthForm} />
    <Route path="admin" component={AdminView} />
    <Route path="admin/contests/:contest_id" component={ContestDashboard} />
  </Route>
);
