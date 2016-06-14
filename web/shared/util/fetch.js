import 'isomorphic-fetch';

export function fetchAuth(url, options) {
  // TODO: authentication
  return fetch(url, options);
}

fetchAuth.post = function(url, json, options) {
  const extraHeaders = options != null ? options.headers : {};
  return fetchAuth(url, {
    ...options,
    method: 'post',
    body: JSON.stringify(json),
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
  });
};
