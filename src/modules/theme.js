// Short file, but if the call-order isn't obvious, 
// the DEVELOPERS NOTE at the bottom spells it out.

// ① STORAGE KEY:
const STORAGE_KEY = "nearimpact-theme";

// ② READ / APPLY THEME:
export function getTheme() {
  return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
}

export function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

// ③ PERSIST THEME:
export function setTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
  }
  applyTheme(theme);
}

// ④ TOGGLE:
export function toggleTheme() {
  const next = getTheme() === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
}

// ⑤ INITIALIZATION:
export function initTheme() {
  applyTheme(getTheme());
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  Dark mode, isolated into its own file on purpose. This module
  knows nothing about the nav bar or the avatar dropdown; it just
  reads/writes a theme value and applies it to the DOM. That's plain
  separation of concerns.

  
  BLOCKS DEFINITIONS:
  ① STORAGE KEY         — the localStorage key everything else in
                           this file reads and writes.
  ② READ / APPLY THEME  — getTheme() reads the saved value (defaults
                           to "light" if nothing's stored or the
                           value's garbage); applyTheme() is the only
                           function that actually touches the DOM.
  ③ PERSIST THEME        — setTheme() saves to localStorage, then
                           calls applyTheme(). Wrapped in try/catch
                           because localStorage can throw in private
                           browsing, if that happens, the theme
                           still applies for the current session, it
                           just won't survive a reload.
  ④ TOGGLE               — flips between light/dark and returns
                           whichever one it landed on, so callers
                           (like user-menu.js) can update their own
                           UI without a second getTheme() call.
  ⑤ INITIALIZATION       — call initTheme() once, as early as
                           possible in main.js, so the saved theme
                           applies before the page has a chance to
                           flash the wrong one.


*/