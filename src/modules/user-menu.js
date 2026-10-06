// If the auth wiring or dropdown wiring below looks odd, the
// DEVELOPERS NOTE at the bottom covers the "why."

import "./styles/user-menu.css";
import { icon } from "./data/icons.js";
import { escapeHtml } from "./ui/escape-html.js";
import { getCurrentUser, isLoggedIn, logout, subscribe } from "./auth.js";

// ① HELPERS:
export function getInitials(name) {
  return String(name ?? "")
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ② RENDERING:
function renderDropdownItems() {
  const user = getCurrentUser();
  if (!user) return "";

  return `
    <div class="user-menu__header">
      <strong>${escapeHtml(user.name)}</strong>
      <span>${escapeHtml(user.email)}</span>
    </div>
    <a class="user-menu__dropdown-item" href="/list-project.html">
      <span class="user-menu__item-icon">${icon("sparkle")}</span>
      <span class="user-menu__item-label">List Your Project</span>
    </a>
    <button class="user-menu__dropdown-item" data-action="sign-out" type="button">
      <span class="user-menu__item-icon">${icon("logout")}</span>
      <span class="user-menu__item-label">Sign Out</span>
    </button>
  `;
}

// Rendered even when logged out (but `hidden`), so nav.js always has a
// slot to put it in and the re-render below has something to replace.
export function renderUserMenu() {
  const user = getCurrentUser();

  return `
    <div class="user-menu" id="user-menu" ${isLoggedIn() ? "" : "hidden"}>
      <button
        class="user-menu__avatar-btn"
        id="avatar-btn"
        type="button"
        aria-expanded="false"
        aria-controls="user-dropdown"
        aria-label="Account menu"
      >
        <span class="user-menu__avatar-initials">${user ? escapeHtml(getInitials(user.name)) : ""}</span>
      </button>

      <div class="user-menu__dropdown" id="user-dropdown" aria-hidden="true">
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

// ③ DROPDOWN STATE:
function setDropdownOpen(open) {
  const dropdown = document.getElementById("user-dropdown");
  const avatarBtn = document.getElementById("avatar-btn");
  if (!dropdown || !avatarBtn) return;

  dropdown.classList.toggle("is-open", open);
  dropdown.setAttribute("aria-hidden", String(!open));
  avatarBtn.setAttribute("aria-expanded", String(open));
}

// ④ INITIALIZATION:
function wireEvents() {
  const avatarBtn = document.getElementById("avatar-btn");
  const dropdown = document.getElementById("user-dropdown");
  if (!avatarBtn || !dropdown) return;

  avatarBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdown.classList.contains("is-open"));
  });

  // One listener for every item; links navigate on their own.
  dropdown.addEventListener("click", (e) => {
    const item = e.target.closest(".user-menu__dropdown-item");
    if (!item) return;
    if (item.dataset.action === "sign-out") logout(); // UI refreshes via subscribe() below
    setDropdownOpen(false);
  });
}

export function initUserMenu() {
  wireEvents();

  document.addEventListener("click", (e) => {
    const menu = document.getElementById("user-menu");
    if (menu && !menu.contains(e.target)) setDropdownOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const dropdown = document.getElementById("user-dropdown");
    if (!dropdown?.classList.contains("is-open")) return;
    setDropdownOpen(false);
    document.getElementById("avatar-btn")?.focus();
  });

  // Re-renders the avatar/dropdown whenever login state changes,
  // regardless of what caused it — a successful login in the modal, a
  // sign-out click, or initAuth() recovering an existing session on page
  // load. Same "react to the store, don't care who triggered it" pattern
  // project-list.js and map.js already use for map-store.js.
  subscribe(() => rerenderUserMenu());
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The signed-in avatar + its dropdown. It reads real state through
  auth.js (getCurrentUser()/isLoggedIn()) and only changes it by calling
  logout(); it never sets user state itself.

  WHAT CHANGED IN THE NAV UPGRADE:
  - The menu is now for SIGNED-IN users only. Logged out, it renders
    `hidden`. Log In / Sign Up live in the nav bar and the drawer
    (nav.js), and Dark Mode has its own button there, so the old
    dropdown rows for them are gone. That also fixes the bug where the
    whole menu was display:none on desktop.
  - "My Profile" is removed instead of staying a dead button. Add it
    back as a normal <a> once a profile page exists.
  - The dropdown is a disclosure (button + aria-expanded), not
    role="menu", because role="menu" promises arrow-key behaviour this
    file doesn't implement.
  - Every piece of user text goes through escapeHtml() (initials too).
  - The old "dim the mobile sidebar links" coupling to .nav is gone.

  Class names follow BEM: "user-menu" is the block.

  BLOCKS DEFINITIONS:
  ① HELPERS         — getInitials(): 2-letter avatar label. Exported,
                       nav.js reuses it for the drawer's user card.
  ② RENDERING       — the avatar button + dropdown (renderUserMenu),
                       its items (renderDropdownItems), and the full
                       re-render used when login state changes.
  ③ DROPDOWN STATE  — setDropdownOpen(): the one place that opens/closes
                       it and keeps aria-expanded / aria-hidden in sync.
  ④ INITIALIZATION  — wireEvents() binds clicks on the current markup;
                       initUserMenu() adds outside-click, Escape (focus
                       returns to the avatar) and the auth subscription.

  CLASS NAME GLOSSARY:
  .user-menu                   The whole avatar + dropdown component.
  .user-menu__avatar-btn       The round button.
  .user-menu__avatar-initials  The 2-letter initials inside it.
  .user-menu__dropdown         The panel.
  .user-menu__header           Name + email block at the top of it.
  .user-menu__dropdown-item    One row (link or button).
  .user-menu__item-icon        The row's icon.
  .user-menu__item-label       The row's text.

  State classes .is-open (dropdown) is a flag this file flips.
*/
