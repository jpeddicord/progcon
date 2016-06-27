/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

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
