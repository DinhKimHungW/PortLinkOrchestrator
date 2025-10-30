const TOKEN_KEY = 'token';

function getLocalStorage() {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.localStorage;
}

function getSessionStorage() {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.sessionStorage;
}

export function storeToken(token, remember = true) {
  const local = getLocalStorage();
  const session = getSessionStorage();
  if (remember) {
    local?.setItem(TOKEN_KEY, token);
    session?.removeItem(TOKEN_KEY);
  } else {
    session?.setItem(TOKEN_KEY, token);
    local?.removeItem(TOKEN_KEY);
  }
}

export function getStoredToken() {
  const local = getLocalStorage();
  const session = getSessionStorage();
  return local?.getItem(TOKEN_KEY) || session?.getItem(TOKEN_KEY) || null;
}

export function clearStoredToken() {
  const local = getLocalStorage();
  const session = getSessionStorage();
  local?.removeItem(TOKEN_KEY);
  session?.removeItem(TOKEN_KEY);
}
