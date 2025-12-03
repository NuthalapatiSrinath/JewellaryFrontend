import { userLogout } from "./userAuth";

const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 mins
let timer;

function resetTimer() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    userLogout();
    window.dispatchEvent(new Event("auth:logout"));
    alert("Logged out due to inactivity");
  }, INACTIVITY_LIMIT);
}

export function initAutoLogout() {
  ["mousemove", "keydown", "click", "scroll", "touchstart"].forEach((event) =>
    window.addEventListener(event, resetTimer)
  );
  resetTimer(); // start first time
}

export function stopAutoLogout() {
  clearTimeout(timer);
}
