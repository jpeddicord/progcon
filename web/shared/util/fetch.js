import 'isomorphic-fetch';
import { loadToken, injectTokenHeader } from './token';

export async function fetchAuth(url, options, retry = true) {
  // load or fetch our token
  let token = loadToken();
  if (token == null) {
    // TODO: oh no!
    throw new Error('no auth token; unregistered?');
  }

  return fetch(url, injectTokenHeader(options, token));
}

fetchAuth.post = function(url, json, options = {}) {
  return fetchAuth(url, {
    ...options,
    method: 'post',
    body: JSON.stringify(json),
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
};
