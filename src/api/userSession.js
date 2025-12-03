const KEY = "userAuth";

export function saveUserAuth({ token, role, user }) {
  localStorage.setItem(KEY, JSON.stringify({ token, role, user }));
}

export function getUserAuth() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null;
  } catch {
    return null;
  }
}

export const getUserToken = () => getUserAuth()?.token || null;
export const getUser      = () => getUserAuth()?.user  || null;
export const isLoggedIn   = () => !!getUserToken();

export function userLogout() {
  localStorage.removeItem(KEY);
}
