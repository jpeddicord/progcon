const TOKEN_KEY = 'auth.token';

export function loadToken() {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

export function injectTokenHeader(options = {}, token) {
  return {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  };
}
