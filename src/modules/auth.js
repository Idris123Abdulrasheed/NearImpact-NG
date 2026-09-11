import { showToast } from "./ui/toast.js";
// This is a stub file; the real auth system doesn't exist yet.
// DEVELOPERS NOTE at the bottom explains what's temporary vs permanent.

// ① STORAGE KEY:
const RETURN_TO_KEY = "ni_return_to";

// ② AUTH STATE (stub):
export function isLoggedIn() {
  return false;
}

// ③ AUTH GATE:
export function requireAuth(onAuthenticated) {
  if (isLoggedIn()) {
    onAuthenticated();
    return;
  }
  sessionStorage.setItem(RETURN_TO_KEY, window.location.href);
  showToast({
    message: "Log in to view full impactmaker profiles.",
    actionLabel: "Log in",
    actionHref: "#login", // placeholder until a real login route exists
  });
}

// ④ RETURN-TO HANDLING:
export function consumeReturnTo() {
  const dest = sessionStorage.getItem(RETURN_TO_KEY);
  sessionStorage.removeItem(RETURN_TO_KEY);
  return dest;
}



/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  This is a stand-in for a real auth system that hasn't been built yet. 
  Every function here is written so that whatever calls requireAuth() 
  elsewhere in the app like project-list.js, community.js, etc. won't need to change
  when real sessions get wired up. Only the body of isLoggedIn() is
  expected to change; everything downstream of it just keeps working.


  BLOCKS DEFINITIONS:
  ① STORAGE KEY          — the sessionStorage key used to remember
                           where to send someone back to after login.
  ② AUTH STATE (stub)    — isLoggedIn() always returns false right
                           now because there's no session system to
                           check yet. 
  ③ AUTH GATE            — requireAuth() is what other files actually
                           call. If logged in, runs the callback. If
                           not, remembers the current page and shows
                           a toast prompting login.
  ④ RETURN-TO HANDLING   — consumeReturnTo() is for a login page that
                           doesn't exist yet so once it does, it'll
                           call this after a successful login to know
                           where to send the user back to. Reads the
                           value AND clears it in one call, so a
                           stale return-to page can't leak into an
                           unrelated later login.


*/