// The single source of truth for "is anyone logged in, and who." Every
// component that needs to read or change that — user-menu.js,
// project-list.js, community.js, auth-form.js — goes through this
// file, the same way every component reads/writes map-store.js instead
// of keeping its own copy of location state. DEVELOPERS NOTE at the
// bottom has the full story on what changed from the old stub version.

// ① STATE:
let user = null; // { id, name, email } | null
const listeners = new Set();

function notify() {
  for (const fn of listeners) fn(user);
}



// ② PUBLIC STATE ACCESS:
export function getCurrentUser() {
  return user;
}

export function isLoggedIn() {
  return user !== null;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn); // unsubscribe, prevents memory leaks
}

// ③ SESSION BOOTSTRAP:
// Call once, early, from main.js. Checks whether a session cookie from
// a previous visit is still valid, so a page reload doesn't log
// someone out just because the in-memory `user` reset to null.
export async function initAuth() {
  try {
    const res = await fetch("/api/auth/me");
    if (!res.ok) return; // no valid session — user stays null, that's fine
    const data = await res.json();
    user = data.user;
    notify();
  } catch (err) {
    console.error("Failed to check session:", err);
  }
}

// ④ AUTH ACTIONS:
export async function login(email, password, remember = false) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, remember }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login failed");

  user = data.user;
  notify();
  return user;
}

export async function register(name, email, role, password) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, role, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Registration failed");

  user = data.user;
  notify();
  return user;
}

export async function logout() {
  try {
    const res = await fetch("/api/auth/logout", { method: "POST" });
    if (!res.ok) throw new Error("Logout request failed");
  } catch (err) {
    console.error("Logout failed:", err);
  }
  user = null;
  notify();
}

// ⑤ AUTH GATE:
// Sign in and create account live on ONE page, /login.html. Anything
// that needs a login sends the visitor there with goToAuth(); the
// current address rides along as ?next= so login-page.js can bring
// them back to exactly where they were.
export function goToAuth(mode = "login") {
  const params = new URLSearchParams();
  if (mode !== "login") params.set("mode", mode);

  // Already on the login page: next would just point back at it.
  if (!window.location.pathname.endsWith("/login.html")) {
    params.set("next", window.location.pathname + window.location.search + window.location.hash);
  }

  const query = params.toString();
  window.location.assign(`/login.html${query ? `?${query}` : ""}`);
}

// Anything wanting to gate an action behind login calls this instead
// of checking isLoggedIn() itself, so the "not logged in" experience
// stays identical everywhere it's used. Logged in, the action runs now.
// Logged out, the visitor is sent to /login and the page reloads when
// they come back, so the callback can NOT be resumed. Forms that would
// lose typed answers save them first (see ui/form-draft.js).
export function requireAuth(onAuthenticated) {
  if (isLoggedIn()) {
    onAuthenticated();
    return;
  }
  goToAuth("login");
}




/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  This used to be a stub: isLoggedIn() always returned false, and
  requireAuth() just showed a toast. That stub had a real promise
  attached to it (see the original DEVELOPERS NOTE this replaces):
  "only the body of isLoggedIn() is expected to change; everything
  downstream just keeps working." That promise only holds if every
  caller actually goes THROUGH this file — by the time prototype 2
  started, two places had quietly stopped doing that: project-list.js
  had its own local requireAuth() that never imported this file, and
  user-menu.js kept a separate `mockUser` variable that had nothing to
  do with isLoggedIn() here. Both are now fixed to import from this
  file instead (see their own DEVELOPERS NOTEs for what changed).

  This file follows the exact subscribe/notify shape map-store.js
  already uses (getState-equivalent, setState-equivalent via the
  actions below, subscribe with its own unsubscribe function) —
  deliberately the same pattern, not a new one, per the standards
  doc's "match the existing pattern" rule. The difference: map-store.js
  exposes one generic setState(partial), while this file exposes named
  actions (login/register/logout) instead, since each one has real
  server work and error handling attached that a generic setState
  can't express cleanly.

  BLOCKS DEFINITIONS:
  ① STATE                  — the current user (or null), the listener
                             set.
  ② PUBLIC STATE ACCESS     — getCurrentUser(), isLoggedIn(), and
                             subscribe(), the read side every component
                             uses.
  ③ SESSION BOOTSTRAP       — initAuth(), called once from main.js, to
                             recover a still-valid session after a
                             reload.
  ④ AUTH ACTIONS            — login()/register()/logout(), each one
                             talking to its matching /api/auth/*
                             endpoint, updating `user`, and notifying
                             subscribers.
  ⑤ AUTH GATE               — goToAuth() sends the visitor to
                             /login.html (mode + ?next= return address);
                             requireAuth() is the one function anything
                             else should call to gate an action behind
                             login, and uses goToAuth() when logged out.
                             The old popup and its pendingCallback are
                             gone: a page navigation cannot carry a
                             callback, so forms save their own drafts.
                             auth.js still never imports any UI file.

*/