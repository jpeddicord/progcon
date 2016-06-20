import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import routes from '../shared/routes';
import create from '../shared/store';

const store = create();

ReactDOM.render(
  (
    <Provider store={store}>
      <Router children={routes} history={browserHistory} />
    </Provider>
  ),
  document.getElementById('app'),
);
