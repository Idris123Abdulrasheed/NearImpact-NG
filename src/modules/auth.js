// The single source of truth for "is anyone logged in, and who." Every
// component that needs to read or change that — user-menu.js,
// project-list.js, community.js, auth-modal.js — goes through this
// file, the same way every component reads/writes map-store.js instead
// of keeping its own copy of location state. DEVELOPERS NOTE at the
// bottom has the full story on what changed from the old stub version.

// ① STATE:
let user = null; // { id, name, email } | null
let pendingCallback = null; // set by requireAuth(), run after a successful login/register
const listeners = new Set();

function notify() {
  for (const fn of listeners) fn(user);
}

function resolvePendingAuth() {
  const callback = pendingCallback;
  pendingCallback = null;
  if (callback) callback();
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
export async function login(email, password) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login failed");

  user = data.user;
  notify();
  resolvePendingAuth();
  return user;
}

export async function register(email, password) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Registration failed");

  user = data.user;
  notify();
  resolvePendingAuth();
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
// Anything wanting to gate an action behind login calls this instead
// of checking isLoggedIn() itself, so the "not logged in" experience
// stays identical everywhere it's used. Unlike the old stub (which
// just showed a toast), this opens the real login/register modal —
// see auth-modal.js. onAuthenticated is stashed and run automatically
// once login/register succeeds, so e.g. clicking "View Project" while
// logged out and then logging in actually resumes viewing that
// project, instead of dropping the original intent on the floor.
export function requireAuth(onAuthenticated) {
  if (isLoggedIn()) {
    onAuthenticated();
    return;
  }
  pendingCallback = onAuthenticated || null;
  window.dispatchEvent(new CustomEvent("ni:open-auth-modal", { detail: { mode: "login" } }));
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
                             set, and pendingCallback (see ⑤).
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
  ⑤ AUTH GATE               — requireAuth(), the one function anything
                             else in the app should call to gate an
                             action behind login. Stashes the intended
                             action in pendingCallback and opens the
                             modal via a CustomEvent rather than
                             importing auth-modal.js directly — this
                             file has no idea the modal exists, which
                             keeps the dependency one-directional (the
                             modal depends on auth.js, not the other
                             way around).

*/