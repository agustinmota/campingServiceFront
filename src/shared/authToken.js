export const TOKEN_STORAGE_KEY = "camping_token";
export const USER_STORAGE_KEY = "camping_user";
export const SESSION_EXPIRED_EVENT = "camping:session-expired";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getTokenPayload(token) {
  try {
    const payload = token.split(".")[1];
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(normalizedPayload));
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  const payload = getTokenPayload(token);
  return !payload?.exp || payload.exp * 1000 <= Date.now();
}

export function clearSavedSession() {
  if (!canUseStorage()) {
    return;
  }

  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
}

export function getSavedSession() {
  if (!canUseStorage()) {
    return { token: null, user: null };
  }

  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const savedUser = localStorage.getItem(USER_STORAGE_KEY);

  if (!token || isTokenExpired(token)) {
    clearSavedSession();
    return { token: null, user: null };
  }

  try {
    return {
      token,
      user: savedUser ? JSON.parse(savedUser) : null
    };
  } catch {
    clearSavedSession();
    return { token: null, user: null };
  }
}

export function saveSession({ token, user }) {
  if (!canUseStorage()) {
    return;
  }

  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}
