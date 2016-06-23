import 'whatwg-fetch';
import { clearToken, loadToken, injectTokenHeader } from './token';

export async function fetchJSON(url, options = {}) {
  const resp = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (resp.status === 401) {
    clearToken();
  }

  if (resp.status !== 200) {
    throw new Error(resp.error);
  }

  return resp.json();
}

export async function fetchJSONAuth(url, options) {
  // load or fetch our token
  let token = loadToken();
  if (token == null) {
    // TODO: oh no!
    throw new Error('no auth token; unregistered?');
  }

  const response = await fetchJSON(url, injectTokenHeader(options, token));
  // XXX: doesn't actually work; this reads the json payload
  if (response.status === 401) {
    clearToken();
  }
  return response;
}

/**
 * Attach a .post method to submit a JSON body as a POST request.
 */
function addPostMethod(fn) {
  fn.post = function(url, json, options = {}) {
    return fetchJSON(url, {
      ...options,
      method: 'post',
      body: JSON.stringify(json),
    });
  };
}

addPostMethod(fetchJSON);
addPostMethod(fetchJSONAuth);
