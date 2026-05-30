import { beforeEach, describe, expect, it } from "vitest";
import {
  clearSavedSession,
  getSavedSession,
  isTokenExpired,
  saveSession,
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY
} from "./authToken";

function createToken(payload) {
  const encode = (value) => btoa(JSON.stringify(value)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  return `${encode({ alg: "HS256", typ: "JWT" })}.${encode(payload)}.signature`;
}

describe("authToken", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saves and reads a valid session", () => {
    const token = createToken({ exp: Math.floor(Date.now() / 1000) + 3600 });
    const user = { id: 1, role: "admin" };

    saveSession({ token, user });

    expect(getSavedSession()).toEqual({ token, user });
  });

  it("clears expired sessions", () => {
    const token = createToken({ exp: Math.floor(Date.now() / 1000) - 10 });
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ id: 1 }));

    expect(isTokenExpired(token)).toBe(true);
    expect(getSavedSession()).toEqual({ token: null, user: null });
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
    expect(localStorage.getItem(USER_STORAGE_KEY)).toBeNull();
  });

  it("clears saved session values", () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, "token");
    localStorage.setItem(USER_STORAGE_KEY, "{}");

    clearSavedSession();

    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
    expect(localStorage.getItem(USER_STORAGE_KEY)).toBeNull();
  });
});
