/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import 'whatwg-fetch';
import { loadToken, injectTokenHeader } from './token';

export async function fetchJSON(url, options = {}) {
  const resp = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (resp.status !== 200) {
    const msg = await resp.text();
    const err = new Error(msg);
    err.server = true;
    throw err;
  }

  return resp.json();
}

export async function fetchJSONAuth(url, options) {
  // load or fetch our token
  let token = loadToken();

  return fetchJSON(url, injectTokenHeader(options, token));
}

/**
 * Attach a .post method to submit a JSON body as a POST request.
 */
function addPostMethod(fn) {
  fn.post = function(url, json, options = {}) {
    return fn(url, {
      ...options,
      method: 'post',
      body: JSON.stringify(json),
    });
  };
}

addPostMethod(fetchJSON);
addPostMethod(fetchJSONAuth);
