// If the auth stub or dropdown wiring below looks odd, the
// DEVELOPERS NOTE at the bottom covers the "why."

import "./styles/user-menu.css";
import { getTheme, toggleTheme } from "./theme.js";

// ① AUTH STUB:
// Stand-in for a logged-in session, no backend yet, see DEVELOPERS NOTE.
let mockUser = null; // e.g. { name: "Idris Abdulrasheed" } once "logged in"

// ② HELPERS:
function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function avatarIconSvg() {
  return `
    <svg class="user-menu__avatar-icon" viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <clipPath id="avatarClip">
          <circle cx="20" cy="20" r="18" />
        </clipPath>
      </defs>
      <circle class="user-menu__avatar-ring" cx="20" cy="20" r="19" fill="none" stroke="currentColor" stroke-width="1.6"/>
      <g clip-path="url(#avatarClip)">
        <circle cx="20" cy="16" r="6.2" fill="currentColor"/>
        <path d="M6 34c2-8 7-12.5 14-12.5S32 26 34 34Z" fill="currentColor"/>
      </g>
    </svg>
  `;
}

// ③ RENDERING:
function renderAvatarContent() {
  if (mockUser) {
    return `<span class="user-menu__avatar-initials">${getInitials(mockUser.name)}</span>`;
  }
  return avatarIconSvg();
}

function renderDropdownItems() {
  const isDark = getTheme() === "dark";

  // dark mode row — shown in both logged-in and logged-out states
  const darkModeRow = `
    <button class="user-menu__dropdown-item" data-action="dark-mode" role="menuitem" type="button">
      <span class="user-menu__item-icon">🌙</span>
      <span class="user-menu__item-label">Dark Mode</span>
      <span class="user-menu__toggle ${isDark ? "is-on" : ""}" id="dark-mode-toggle" aria-hidden="true"></span>
    </button>
  `;

  // logged-in item set
  if (mockUser) {
    return `
      ${darkModeRow}
      <button class="user-menu__dropdown-item" data-action="profile" role="menuitem" type="button">
        <span class="user-menu__item-icon">👤</span>
        <span class="user-menu__item-label">My Profile</span>
      </button>
      <button class="user-menu__dropdown-item" data-action="sign-out" role="menuitem" type="button">
        <span class="user-menu__item-icon">🚪</span>
        <span class="user-menu__item-label">Sign Out</span>
      </button>
    `;
  }

  // logged-out item set
  return `
    ${darkModeRow}
    <button class="user-menu__dropdown-item" data-action="login" role="menuitem" type="button">
      <span class="user-menu__item-icon">🔑</span>
      <span class="user-menu__item-label">Log In</span>
    </button>
    <button class="user-menu__dropdown-item" data-action="create-account" role="menuitem" type="button">
      <span class="user-menu__item-icon">✨</span>
      <span class="user-menu__item-label">Create Account</span>
    </button>
  `;
}

export function renderUserMenu() {
  return `
    <div class="user-menu" id="user-menu">
      <button
        class="user-menu__avatar-btn"
        id="avatar-btn"
        type="button"
        aria-haspopup="true"
        aria-expanded="false"
        aria-controls="user-dropdown"
        aria-label="Account menu"
      >
        ${renderAvatarContent()}
      </button>

      <div class="user-menu__dropdown" id="user-dropdown" role="menu" aria-hidden="true">
        ${renderDropdownItems()}
      </div>
    </div>
  `;
}

function rerenderUserMenu() {
  const container = document.getElementById("user-menu");
  if (!container || !container.parentElement) return;
  container.outerHTML = renderUserMenu();
  wireEvents();
}

// ④ DROPDOWN STATE:
function setDropdownOpen(open) {
  const dropdown = document.getElementById("user-dropdown");
  const avatarBtn = document.getElementById("avatar-btn");
  const navEl = document.querySelector(".nav");
  if (!dropdown || !avatarBtn) return;

  dropdown.classList.toggle("is-open", open);
  dropdown.setAttribute("aria-hidden", String(!open));
  avatarBtn.setAttribute("aria-expanded", String(open));

  // Grey out the mobile menu links while the dropdown is open 
  navEl?.classList.toggle("dropdown-open", open);
}

// ⑤ ACTIONS:
function handleAction(action) {
  switch (action) {
    case "dark-mode": {
      toggleTheme();
      const toggle = document.getElementById("dark-mode-toggle");
      toggle?.classList.toggle("is-on", getTheme() === "dark");
      return; // keep dropdown open — flipping a switch isn't a "done" action
    }
    case "login":
      // TEMPORARY: simulates a logged-in state for frontend testing.
      // Replace with a real login form + API call later.
      mockUser = { name: "Idris Abdulrasheed" };
      rerenderUserMenu();
      break;
    case "sign-out":
      mockUser = null;
      rerenderUserMenu();
      break;
    case "create-account":
    case "profile":
      // Stubs — wire to real routes/pages once they exist.
      console.log(`${action} clicked (not yet implemented)`);
      break;
  }
  setDropdownOpen(false);
}

// ⑥ INITIALIZATION:
function wireEvents() {
  const avatarBtn = document.getElementById("avatar-btn");
  const dropdown = document.getElementById("user-dropdown");
  if (!avatarBtn || !dropdown) return;

  avatarBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.contains("is-open");
    setDropdownOpen(!isOpen);
  });

  dropdown.querySelectorAll(".user-menu__dropdown-item").forEach((item) => {
    item.addEventListener("click", () => handleAction(item.dataset.action));
  });
}

export function initUserMenu() {
  wireEvents();

  document.addEventListener("click", (e) => {
    const menu = document.getElementById("user-menu");
    if (menu && !menu.contains(e.target)) {
      setDropdownOpen(false);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setDropdownOpen(false);
  });
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The avatar + account dropdown, shown in place of the hamburger
  icon once the mobile menu is open (nav.css controls that swap via
  .nav.menu-open, this file only owns what happens once the avatar
  itself is visible and clicked).

  There's no real auth backend yet, so mockUser is a placeholder
  that lets the "logged in" vs "logged out" UI get built and tested
  now. 
  
  Class names follow BEM: "user-menu" is the block, and
  every element specific to it like the avatar button, the dropdown,
  each dropdown item; is user-menu__something.

  BLOCKS DEFINITIONS:
  ① AUTH STUB       — the mockUser placeholder standing in for a real
                       session.
  ② HELPERS         — getInitials() turns a name into a 2-letter
                       avatar label; avatarIconSvg() is the fallback
                       icon shown when nobody's "logged in."
  ③ RENDERING       — builds the avatar button and its dropdown
                       (renderUserMenu), including the two different
                       item sets depending on login state
                       (renderDropdownItems), plus a full re-render
                       used after login/logout changes what should
                       show (rerenderUserMenu).
  ④ DROPDOWN STATE  — the single function that opens/closes the
                       dropdown and keeps its aria attributes + the
                       nav's dimming effect in sync.
  ⑤ ACTIONS         — what happens when a dropdown item gets
                       clicked: toggling dark mode, faking a login/
                       logout, or logging a stub message for routes
                       that don't exist yet.
  ⑥ INITIALIZATION  — wireEvents() attaches the click/keyboard
                       handlers; initUserMenu() is what main.js
                       actually calls, and also handles closing the
                       dropdown on an outside click or Escape.


  CLASS NAME GLOSSARY:
  .user-menu                   The whole avatar + dropdown component.
  .user-menu__avatar-btn       The circular button showing the avatar.
  .user-menu__avatar-icon      The fallback person-outline SVG icon
                                (shown when nobody's "logged in").
  .user-menu__avatar-ring      The thin outline ring drawn around
                                that fallback icon.
  .user-menu__avatar-initials  The 2-letter initials shown instead of
                                the icon once mockUser is set.
  .user-menu__dropdown         The dropdown panel itself.
  .user-menu__dropdown-item    One clickable row inside the dropdown
                                (Dark Mode, My Profile, Sign Out, etc).
  .user-menu__item-icon        The small emoji icon inside a row.
  .user-menu__item-label       The text label inside a row.
  .user-menu__toggle           The pill-shaped on/off switch used
                                specifically for the Dark Mode row.

  One class you'll see referenced here but not owned by this file:
  .nav — this file reads/toggles .dropdown-open on it, but the
  element and its other classes belong to nav.js.

  State classes .is-open (on the dropdown) and .is-on (on the dark
  mode toggle) aren't part of the BEM naming above on purpose ;
  they're flags this file flips as the user interacts with the menu,
  not permanent names for what the elements are. Same applicable for
  .dropdown-open, which this file adds to the nav element itself.
*/