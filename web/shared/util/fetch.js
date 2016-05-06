import 'isomorphic-fetch';

export function fetchAuth(url, options) {
  // FIXME: not isomprohic or whatever
  url = `http://localhost:3000${url}`;
  return fetch(url, options);
}
