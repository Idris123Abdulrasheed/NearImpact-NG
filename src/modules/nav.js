// Stuck on something below? Check DEVELOPERS NOTE at the bottom,
// it probably already answers it.

import "./styles/nav.css";
import logo from "../assets/brand/logo.png";
import { renderUserMenu } from "./user-menu.js";

// ① DOM REFERENCE:
const selectors = {
  nav: ".nav",
  sidebar: ".nav__sidebar",
  backdrop: ".nav__backdrop",
  menuButton: ".nav__menu-button",
};

const navHeightProperty = "--nav-h";

// ② STATE MANAGEMENT:
const isSidebarOpen = () => {
  const sidebar = document.querySelector(selectors.sidebar);
  return sidebar?.classList.contains("is-open") ?? false;
};

// ③ NAV HEIGHT:
const syncNavHeight = () => {
  const nav = document.querySelector(selectors.nav);
  if (!nav) return;
  document.documentElement.style.setProperty(
    navHeightProperty,
    `${nav.offsetHeight}px`
  );
};

// ④ MOBILE MENU CONTROL:
const openSidebar = () => {
  const elements = getMenuElements();
  syncNavHeight();

  elements.sidebar.classList.add("is-open");
  elements.sidebar.setAttribute("aria-hidden", "false");
  elements.backdrop.classList.add("is-open");
  elements.menuButton.setAttribute("aria-expanded", "true");
  elements.nav.classList.add("menu-open");

  lockScroll();
};

const closeSidebar = () => {
  const elements = getMenuElements();

  elements.sidebar.classList.remove("is-open");
  elements.sidebar.setAttribute("aria-hidden", "true");
  elements.backdrop.classList.remove("is-open");
  elements.menuButton.setAttribute("aria-expanded", "false");
  elements.nav.classList.remove("menu-open", "dropdown-open");

  unlockScroll();
};

const getMenuElements = () => ({
  sidebar: document.querySelector(selectors.sidebar),
  backdrop: document.querySelector(selectors.backdrop),
  menuButton: document.querySelector(selectors.menuButton),
  nav: document.querySelector(selectors.nav),
});

// ⑤ SCROLL LOCKING:
const lockScroll = () => {
  document.body.classList.add("no-scroll");
};

const unlockScroll = () => {
  document.body.classList.remove("no-scroll");
};

// ⑥ NAVIGATION ACTIONS:
const handleHomeClick = (event) => {
  event.preventDefault();

  window.scrollTo({ top: 0, behavior: "smooth" });

  if (isSidebarOpen()) {
    closeSidebar();
  }
};

const handleKeyDown = (event) => {
  if (event.key !== "Escape" || !isSidebarOpen()) return;
  closeSidebar();
};

// ⑦ INITIALIZATION:
export const initNav = () => {
  syncNavHeight();
  bindEvents();
};

const bindEvents = () => {
  window.addEventListener("resize", syncNavHeight);
  document.addEventListener("keydown", handleKeyDown);
};

// ⑧ RENDERING:
export const renderNav = () => `
  <header class="nav">
    <div class="nav__inner">
      ${renderBrand()}
      ${renderSearchBar()}
      ${renderNavLinks()}
      ${renderActions()}
    </div>

    <div class="nav__backdrop" onclick="closeSidebar()"></div>
    ${renderMobileMenu()}
  </header>
`;

const renderBrand = () => `
  <a
    href="#"
    class="nav__brand"
    onclick="handleHomeClick(event)"
    aria-label="NearImpact Nigeria home"
  >
    <div class="nav__brand-mark">
      <img src="${logo}" alt="NearImpact Nigeria logo" />
    </div>
    <div class="nav__brand-text">
      <strong>Near<span>Impact</span></strong>
      <small>Nigeria</small>
    </div>
  </a>
`;

const renderSearchBar = () => `
  <div class="nav__search">
    <span>⌕</span>
    <input
      type="text"
      id="nav-search-input"
      class="nav__search-input"
      placeholder="Search projects, places..."
      autocomplete="off"
    />
    <div id="nav-search-results" class="search-dropdown" hidden></div>
  </div>
`;

const renderNavLinks = () => `
  <nav class="nav__links">
    <a href="#discover" class="nav__link">Discover</a>
    <a href="#map" class="nav__link">View Map</a>
    <a href="#opportunities" class="nav__link">Opportunities</a>
    <a href="#sdgs" class="nav__link">Learn SDGs</a>
  </nav>
`;

const renderActions = () => `
  <div class="nav__actions">
    <!-- Log In button -->
    <a href="#" class="nav__login-btn">Log In</a>

    <!-- Hamburger icon (mobile only) -->
    <button
      class="nav__menu-button"
      onclick="openSidebar()"
      aria-expanded="false"
      aria-controls="mobile-menu-panel"
      aria-label="Open menu"
    >
      ${renderMenuIcon()}
    </button>

    <!-- Avatar + dropdown, built in user-menu.js -->
    ${renderUserMenu()}
  </div>
`;

const renderMobileMenu = () => `
  <nav class="nav__sidebar" id="mobile-menu-panel" aria-hidden="true">
    <!-- Close (X) button -->
    <div
      class="nav__close-btn"
      onclick="closeSidebar()"
      aria-label="Close menu"
    >
      ${renderCloseIcon()}
    </div>

    <!-- Mobile's own search box -->
    <div class="nav__sidebar-search">
      <span>⌕</span>
      <input
        type="text"
        id="sidebar-search-input"
        class="nav__sidebar-search-input"
        placeholder="Search projects, places..."
        autocomplete="off"
      />
      <div id="sidebar-search-results" class="search-dropdown" hidden></div>
    </div>

    <!-- Menu links -->
    <a href="#discover" class="nav__sidebar-link" onclick="closeSidebar()">Discover</a>
    <a href="#map" class="nav__sidebar-link" onclick="closeSidebar()">View Map</a>
    <a href="#opportunities" class="nav__sidebar-link" onclick="closeSidebar()">Opportunities</a>
    <a href="#sdgs" class="nav__sidebar-link" onclick="closeSidebar()">Learn SDGs</a>
  </nav>
`;

// ⑨ SVG ICONS:
const renderMenuIcon = () => `
  <svg xmlns="http://www.w3.org/2000/svg" height="26" viewBox="0 96 960 960" width="26">
    <path d="M120 816v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z"/>
  </svg>
`;

const renderCloseIcon = () => `
  <svg xmlns="http://www.w3.org/2000/svg" height="26" viewBox="0 96 960 960" width="26">
    <path d="m249 849-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"/>
  </svg>
`;

// ⑩ GLOBAL EXPORTS:
Object.assign(window, {
  openSidebar,
  closeSidebar,
  handleHomeClick,
});





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  This file owns the top nav bar. It builds its HTML and makes the
  mobile menu actually work. Where main.js calls renderNav() to get the HTML back 
  as text, drops it in the page, then calls initNav() to switch interactive parts on.

  There's no framework here yet, so we build the HTML as text using template literals. 
  Because nothing enforces structure the way a framework component would, each render 
  function is kept small and named for the one piece it's responsible for. 
  It is our deliberate choice, not an accident.

  Class names follow BEM (Block__Element) where "nav" is the component,
  and anything written "nav__something" is a piece that only makes
  sense as part of that nav. It's why you can usually guess what a
  class does just from its name, without needing to go look it up.


  BLOCKS DEFINITIONS:
  ① DOM REFERENCE       — the CSS selectors used to find elements on
                           the page, kept in one spot so nothing gets
                           typed out twice and drifts out of sync.
  ② STATE MANAGEMENT     — answers one question: is the mobile menu
                           open right now or not.
  ③ NAV HEIGHT           — measures the nav bar and saves its real
                           height, so the mobile menu always starts
                           right below it and never covers the logo.
  ④ MOBILE MENU CONTROL  — opens/closes the mobile menu, plus a
                           helper that grabs every element the menu
                           needs at once instead of one at a time.
  ⑤ SCROLL LOCKING       — stops the page scrolling behind the menu
                           while it's open.
  ⑥ NAVIGATION ACTIONS   — what happens on a logo click (scroll to
                           top) and on Escape (close the menu).
  ⑦ INITIALIZATION       — runs once, right after the nav's HTML
                           lands on the page, to turn on resize and
                           keyboard handling.
  ⑧ RENDERING            — builds the nav's HTML piece by piece:
                           brand, search box, desktop links, action
                           buttons, mobile menu panel.
  ⑨ SVG ICONS            — the hamburger and X icon shapes, split out
                           so RENDERING doesn't get cluttered with
                           SVG path data.
  ⑩ GLOBAL EXPORTS       — makes openSidebar, closeSidebar, and
                           handleHomeClick reachable from the plain
                           HTML onclick="..." attributes above 


  CLASS NAME GLOSSARY:

  .nav                  The whole top bar, edge to edge.
  .nav__inner           The row of content inside the bar — kept
                         narrower than .nav so nothing touches the
                         screen edges.
  .nav__brand           Logo + "NearImpact Nigeria" text, as one
                         clickable unit.
  .nav__brand-mark      Just the logo image.
  .nav__brand-text      Just the "NearImpact Nigeria" words.
  .nav__search          Search box on wide (desktop) screens.
  .nav__search-input    The actual typing field inside it.
  .nav__links           The row of links shown on wide screens.
  .nav__link             One link inside .nav__links.
  .nav__actions         The button group on the right (Log In,
                         hamburger, avatar).
  .nav__login-btn       The "Log In" button.
  .nav__menu-button     The hamburger icon — mobile only, opens the
                         menu.
  .nav__backdrop        The dark overlay behind the open mobile menu.
  .nav__sidebar         The mobile menu panel itself.
  .nav__close-btn       The X button that closes the mobile menu.
  .nav__sidebar-search  Search box shown inside the mobile menu.
  .nav__sidebar-search-input  Its typing field.
  .nav__sidebar-link    One link inside the mobile menu.

  Two things you'll see in the HTML that aren't listed above:
  - .search-dropdown and co. belong to their own reusable
    component, check nav.css's own note for this.
  - The avatar/account button is entirely built in user-menu.js;
    renderUserMenu() just hands back its finished HTML.

  STATES: is-open, menu-open, dropdown-open, and no-scroll
  aren't part of the BEM naming above on purpose. They're just
  flags this file switches on and off as the user clicks around,
  not permanent names for anything.
*/