/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import 'whatwg-fetch';

export async function fetchJSON(url: string, options: any = {}) {
  const resp = await fetch(url, {
    ...options,
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (resp.status !== 200) {
    const msg = await resp.text();
    const err = new Error(msg);
    (err as any).server = true;
    (err as any).code = resp.status;
    throw err;
  }

  return resp.json();
}
export namespace fetchJSON {
  export let post: Function;
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
