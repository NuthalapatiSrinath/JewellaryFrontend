// src/utils/userAuth.js
const STORAGE_KEY = "app_auth_v1";

let _logoutTimerId = null;
const DEFAULT_SESSION_MS = 2 * 60 * 60 * 1000; // 2 hours

function safeJsonParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

export function saveUserAuth({ token, user = null, role = "customer" }, { sessionDurationMs } = {}) {
  const now = Date.now();

  // parse JWT exp if possible
  let expiresAt = null;
  if (token && typeof token === "string" && token.split(".").length === 3) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload && payload.exp) {
        expiresAt = payload.exp * 1000; // exp in seconds => ms
      }
    } catch (e) {
      // ignore malformed jwt
    }
  }

  // fallback to server-provided expiration on user object
  if (!expiresAt && user && (user.expiresAt || user.expiry || user.expires_at)) {
    const maybe = user.expiresAt || user.expiry || user.expires_at;
    const parsed = typeof maybe === "number" ? maybe : Date.parse(maybe);
    if (!isNaN(parsed)) expiresAt = parsed;
  }

  // final fallback: provided sessionDurationMs or default
  if (!expiresAt) {
    const ms = typeof sessionDurationMs === "number" ? sessionDurationMs : DEFAULT_SESSION_MS;
    expiresAt = now + ms;
  }

  const record = { token, user, role, savedAt: now, expiresAt };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch (e) {
    console.error("Failed to persist auth to localStorage", e);
  }

  // schedule auto logout and notify
  scheduleAutoLogout(expiresAt);
  window.dispatchEvent(new Event("auth:success"));

  return record;
}

export function getAuthRecord() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? safeJsonParse(raw) : null;
  } catch {
    return null;
  }
}

export function getUserToken() {
  const r = getAuthRecord();
  return r?.token ?? null;
}

export function getUser() {
  const r = getAuthRecord();
  return r?.user ?? null;
}

export function isLoggedIn() {
  const r = getAuthRecord();
  if (!r?.token || !r?.expiresAt) return false;
  return Date.now() < r.expiresAt;
}

export function userLogout() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  clearAutoLogoutTimer();
  window.dispatchEvent(new Event("auth:logout"));
}

function clearAutoLogoutTimer() {
  if (_logoutTimerId) {
    clearTimeout(_logoutTimerId);
    _logoutTimerId = null;
  }
}

function scheduleAutoLogout(expiresAt) {
  clearAutoLogoutTimer();
  const ms = expiresAt - Date.now();

  if (ms <= 0) {
    // already expired
    userLogout();
    return;
  }

  // set timer (no special colors) with small buffer so logout happens slightly before exact expiry
  const bufferMs = 1500;
  _logoutTimerId = setTimeout(() => {
    userLogout();
    // show toast if UI listens
    window.dispatchEvent(new CustomEvent("toast:show", { detail: { message: "Session expired. Logged out." } }));
  }, Math.max(0, ms - bufferMs));
}

// call at app startup
export function initAuthAutoLogout() {
  const r = getAuthRecord();
  if (!r) return;
  if (!r.expiresAt || Date.now() >= r.expiresAt) {
    // expired on load
    userLogout();
    return;
  }
  scheduleAutoLogout(r.expiresAt);
}
