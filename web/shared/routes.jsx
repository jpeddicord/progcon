import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import Landing from './containers/Landing';
import ContestOverview from './containers/ContestOverview';
import ProblemDetail from './containers/ProblemDetail';
import RegistrationForm from './containers/RegistrationForm';
import AuthForm from './components/AuthForm';
import AdminView from './containers/AdminView';
import ContestEditor from './containers/ContestEditor';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Landing} />
    <Route path="contests/:contest_id" component={ContestOverview}>
      <Route path="problems/:problem_name" component={ProblemDetail} />
    </Route>
    <Route path="contests/:contest_id/register" component={RegistrationForm} />
    <Route path="auth" component={AuthForm} />
    <Route path="admin" component={AdminView} />
    <Route path="admin/contests/:contest_id" component={ContestEditor} />
  </Route>
);
