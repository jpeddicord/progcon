import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import Landing from './containers/Landing';
import ContestOverview from './containers/ContestOverview';
import ProblemDetail from './containers/ProblemDetail';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Landing} />
    <Route path="contests/:contest_id" component={ContestOverview}>
      <Route path="problems/:problem_name" component={ProblemDetail} />
    </Route>
  </Route>
);
