import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import Landing from './containers/Landing';

export default (
  <Route name="app" path="/" component={App}>
    <IndexRoute component={Landing} />
  </Route>
);
