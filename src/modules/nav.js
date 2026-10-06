// Stuck on something below? Check DEVELOPERS NOTE at the bottom,
// it probably already answers it.

import "./styles/nav.css";
import logo from "../assets/brand/logo.png";
import { icon } from "./data/icons.js";
import { renderUserMenu, getInitials } from "./user-menu.js";
import { getTheme, toggleTheme } from "./theme.js";
import { getCurrentUser, isLoggedIn, logout, subscribe } from "./auth.js";

// ① CONFIG:
// Keep these two in sync with the @media rules in nav.css.
const DESKTOP_QUERY = "(min-width: 1180px)";
const INLINE_SEARCH_QUERY = "(min-width: 720px)";

// One list feeds BOTH the desktop bar (desktop: true) and the drawer (all).
// `section` = homepage section id (scroll-spy), `pages` = page file names
// (without .html) this link should highlight on.
const NAV_LINKS = [
  { key: "discover", label: "Discover", href: "/#discover", section: "discover", desktop: true },
  { key: "map", label: "View Map", href: "/#map", section: "map", desktop: true },
  { key: "opportunities", label: "Opportunities", href: "/all-opportunities.html", section: "opportunities", desktop: true },
  { key: "sdgs", label: "Learn SDGs", href: "/sdgs.html", pages: ["sdgs", "sdg"], desktop: true },
  { key: "impactmakers", label: "Impactmakers", href: "/impactmakers.html", pages: ["impactmakers", "impactmaker"] },
  { key: "list-project", label: "List Your Project", href: "/list-project.html", pages: ["list-project"] },
  { key: "about", label: "About", href: "/about.html", pages: ["about"] },
];

const FOCUSABLE = "a[href], button:not([disabled]), input:not([disabled])";

// ② DOM REFERENCE:
const selectors = {
  nav: ".nav",
  drawer: ".nav__drawer",
  backdrop: ".nav__backdrop",
  menuButton: ".nav__menu-button",
  searchToggle: ".nav__search-toggle",
  searchInput: "#nav-search-input",
};

const $ = (selector) => document.querySelector(selector);
const navHeightProperty = "--nav-h";

let activeLinkKey = null;

// ③ STATE:
const isDrawerOpen = () => $(selectors.drawer)?.classList.contains("is-open") ?? false;
const isSearchOpen = () => $(selectors.nav)?.classList.contains("search-open") ?? false;

const getPageName = () =>
  window.location.pathname.replace(/^\/|\.html$/g, "").replace(/\/$/, "");
const isHomePage = () => ["", "index"].includes(getPageName());

// ④ NAV HEIGHT:
const syncNavHeight = () => {
  const nav = $(selectors.nav);
  if (!nav) return;
  document.documentElement.style.setProperty(navHeightProperty, `${nav.offsetHeight}px`);
};

// ⑤ DRAWER (HAMBURGER MENU):
const openDrawer = () => {
  const nav = $(selectors.nav);
  const drawer = $(selectors.drawer);
  const menuButton = $(selectors.menuButton);

  closeSearch({ returnFocus: false }); // one overlay at a time
  syncNavHeight();

  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  $(selectors.backdrop).classList.add("is-open");
  menuButton.setAttribute("aria-expanded", "true");
  menuButton.setAttribute("aria-label", "Close menu");
  nav.classList.add("menu-open");
  document.body.classList.add("no-scroll");
};

const closeDrawer = ({ returnFocus = true } = {}) => {
  if (!isDrawerOpen()) return;
  const menuButton = $(selectors.menuButton);

  $(selectors.drawer).classList.remove("is-open");
  $(selectors.drawer).setAttribute("aria-hidden", "true");
  $(selectors.backdrop).classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open menu");
  $(selectors.nav).classList.remove("menu-open");
  document.body.classList.remove("no-scroll");

  if (returnFocus) menuButton.focus();
};

// Tab / Shift+Tab stay inside [hamburger button + drawer] while it is open.
const trapFocus = (event) => {
  const items = [
    $(selectors.menuButton),
    ...[...$(selectors.drawer).querySelectorAll(FOCUSABLE)].filter(
      (el) => el.getClientRects().length > 0
    ),
  ];
  const first = items[0];
  const last = items[items.length - 1];
  const active = document.activeElement;

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  } else if (!items.includes(active)) {
    event.preventDefault();
    first.focus();
  }
};

// ⑥ SEARCH OVERLAY (PHONES):
// Below 720px the search box is an icon that opens a full-width bar over
// the nav; from 720px up it is always visible inline. See nav.css.
const openSearch = () => {
  if (isSearchOpen()) return;
  closeDrawer({ returnFocus: false });
  $(selectors.nav).classList.add("search-open");
  $(selectors.searchToggle).setAttribute("aria-expanded", "true");
  $(selectors.searchInput)?.focus();
};

const closeSearch = ({ returnFocus = true } = {}) => {
  if (!isSearchOpen()) return;
  const toggle = $(selectors.searchToggle);
  $(selectors.nav).classList.remove("search-open");
  toggle.setAttribute("aria-expanded", "false");
  if (returnFocus) toggle.focus();
};

// ⑦ THEME + AUTH UI SYNC:
// Both read from their single source of truth (theme.js / auth.js) and
// only mirror it into the DOM; nothing here keeps its own copy.
const syncThemeUi = () => {
  const isDark = getTheme() === "dark";
  document.querySelectorAll('[data-nav-action="toggle-theme"]').forEach((el) => {
    el.setAttribute(el.hasAttribute("aria-checked") ? "aria-checked" : "aria-pressed", String(isDark));
  });
};

const syncAuthUi = () => {
  const nav = $(selectors.nav);
  if (!nav) return;
  const loggedIn = isLoggedIn();

  nav.querySelectorAll('[data-auth="out"]').forEach((el) => (el.hidden = loggedIn));
  nav.querySelectorAll('[data-auth="in"]').forEach((el) => (el.hidden = !loggedIn));

  const user = getCurrentUser();
  if (!user) return;
  // textContent, never innerHTML: name/email are user-typed text.
  nav.querySelector("[data-user-initials]").textContent = getInitials(user.name);
  nav.querySelector("[data-user-name]").textContent = user.name;
  nav.querySelector("[data-user-email]").textContent = user.email;
};

// ⑧ ACTIVE LINK:
const setActiveLink = (key, type = "page") => {
  activeLinkKey = key;
  document.querySelectorAll("[data-link-key]").forEach((el) => {
    const isActive = key !== null && el.dataset.linkKey === key;
    el.classList.toggle("is-active", isActive);
    if (isActive) el.setAttribute("aria-current", type);
    else el.removeAttribute("aria-current");
  });
};

const initActiveLink = () => {
  // Sub pages: match on the page file name.
  if (!isHomePage()) {
    const link = NAV_LINKS.find((l) => l.pages?.includes(getPageName()));
    if (link) setActiveLink(link.key, "page");
    return;
  }

  // Homepage: highlight whichever section crosses the middle of the screen.
  if (!("IntersectionObserver" in window)) return;
  const sectionLinks = NAV_LINKS.filter((l) => l.section);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = sectionLinks.find((l) => l.section === entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) setActiveLink(link.key, "location");
        else if (activeLinkKey === link.key) setActiveLink(null);
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sectionLinks.forEach((l) => {
    const section = document.getElementById(l.section);
    if (section) observer.observe(section);
  });
};

// ⑨ ACTIONS:
const openAuth = (mode) => {
  closeDrawer({ returnFocus: false });
  window.dispatchEvent(new CustomEvent("ni:open-auth-modal", { detail: { mode } }));
};

const handleHomeClick = (event) => {
  if (!isHomePage()) return; // on sub pages the link just goes to "/"
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
  closeDrawer({ returnFocus: false });
};

// data-nav-action="..." in the markup maps to one entry here.
const actions = {
  "toggle-drawer": () => (isDrawerOpen() ? closeDrawer() : openDrawer()),
  "close-drawer": () => closeDrawer(),
  "open-search": () => openSearch(),
  "close-search": () => closeSearch(),
  "toggle-theme": () => {
    toggleTheme();
    syncThemeUi();
  },
  login: () => openAuth("login"),
  register: () => openAuth("register"),
  logout: () => {
    closeDrawer({ returnFocus: false });
    logout(); // the auth subscription updates every piece of UI
  },
};

// ⑩ EVENT HANDLERS:
// ONE click listener on .nav instead of an inline onclick per element.
// It also survives user-menu.js re-rendering its own markup.
const handleClick = (event) => {
  const trigger = event.target.closest("[data-nav-action]");
  if (trigger) {
    const action = actions[trigger.dataset.navAction];
    if (action) {
      event.preventDefault();
      action();
    }
    return;
  }

  if (event.target.closest(".nav__brand")) {
    handleHomeClick(event);
    return;
  }

  // Choosing a menu row or a search result means "I'm done here".
  if (event.target.closest(".nav__drawer-row, .search-dropdown__result")) {
    closeDrawer({ returnFocus: false });
    closeSearch({ returnFocus: false });
  }
};

const handleKeyDown = (event) => {
  if (event.key === "Escape") {
    if (isSearchOpen()) closeSearch();
    else if (isDrawerOpen()) closeDrawer();
    return;
  }
  if (event.key === "Tab" && isDrawerOpen()) trapFocus(event);
};

const handleScroll = () => {
  $(selectors.nav)?.classList.toggle("is-scrolled", window.scrollY > 4);
};

// ⑪ INITIALIZATION:
export const initNav = () => {
  const nav = $(selectors.nav);
  if (!nav) return;

  syncNavHeight();
  if ("ResizeObserver" in window) new ResizeObserver(syncNavHeight).observe(nav);

  syncThemeUi();
  syncAuthUi();
  subscribe(syncAuthUi);
  initActiveLink();

  nav.addEventListener("click", handleClick);
  document.addEventListener("keydown", handleKeyDown);
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // Rotating a tablet or resizing a window must not strand an open overlay.
  window.matchMedia(DESKTOP_QUERY).addEventListener("change", (e) => {
    if (e.matches) closeDrawer({ returnFocus: false });
  });
  window.matchMedia(INLINE_SEARCH_QUERY).addEventListener("change", (e) => {
    if (e.matches) closeSearch({ returnFocus: false });
  });
};

// ⑫ RENDERING:
export const renderNav = () => `
  <header class="nav">
    <div class="nav__inner">
      ${renderBrand()}
      ${renderSearchBar()}
      ${renderNavLinks()}
      ${renderActions()}
    </div>

    <div class="nav__backdrop" data-nav-action="close-drawer"></div>
    ${renderDrawer()}
  </header>
`;

const renderBrand = () => `
  <a href="/" class="nav__brand" aria-label="NearImpact Nigeria home">
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
  <div class="nav__search" id="nav-search" role="search">
    <button type="button" class="nav__icon-btn nav__search-back" data-nav-action="close-search" aria-label="Close search">
      ${renderBackIcon()}
    </button>
    <span class="nav__search-icon" aria-hidden="true">${renderSearchIcon()}</span>
    <input
      type="text"
      id="nav-search-input"
      class="nav__search-input"
      placeholder="Search projects, places..."
      aria-label="Search projects, opportunities and impactmakers"
      aria-controls="nav-search-results"
      autocomplete="off"
      enterkeyhint="search"
      inputmode="search"
      maxlength="100"
    />
    <button type="button" class="nav__search-clear" id="nav-search-clear" aria-label="Clear search" hidden>
      ${renderCloseIcon()}
    </button>
    <div id="nav-search-results" class="search-dropdown" hidden></div>
  </div>
`;

const renderNavLinks = () => `
  <nav class="nav__links" aria-label="Main">
    ${NAV_LINKS.filter((l) => l.desktop)
      .map((l) => `<a href="${l.href}" class="nav__link" data-link-key="${l.key}">${l.label}</a>`)
      .join("")}
  </nav>
`;

const renderActions = () => `
  <div class="nav__actions">
    <!-- Phones only: opens the full-width search bar -->
    <button
      type="button"
      class="nav__icon-btn nav__search-toggle"
      data-nav-action="open-search"
      aria-label="Search"
      aria-expanded="false"
      aria-controls="nav-search"
    >${renderSearchIcon()}</button>

    <button
      type="button"
      class="nav__icon-btn nav__theme-btn"
      data-nav-action="toggle-theme"
      aria-label="Dark mode"
      aria-pressed="false"
    >
      <span class="nav__theme-moon">${icon("moon")}</span>
      <span class="nav__theme-sun">${renderSunIcon()}</span>
    </button>

    <!-- Logged-out only (nav.js syncAuthUi) -->
    <div class="nav__auth" data-auth="out">
      <button type="button" class="nav__btn nav__btn--ghost" data-nav-action="login">Log In</button>
      <button type="button" class="nav__btn nav__btn--primary nav__btn--signup" data-nav-action="register">Sign Up</button>
    </div>

    <!-- Logged-in only; built and re-rendered by user-menu.js -->
    ${renderUserMenu()}

    <!-- Keep LAST in this row: the focus trap relies on DOM order -->
    <button
      type="button"
      class="nav__icon-btn nav__menu-button"
      data-nav-action="toggle-drawer"
      aria-expanded="false"
      aria-controls="nav-drawer"
      aria-label="Open menu"
    >
      <span class="nav__menu-icon nav__menu-icon--open">${renderMenuIcon()}</span>
      <span class="nav__menu-icon nav__menu-icon--close">${renderCloseIcon()}</span>
    </button>
  </div>
`;

const renderDrawer = () => `
  <div class="nav__drawer" id="nav-drawer" role="dialog" aria-label="Menu" aria-hidden="true">

    <div class="nav__drawer-search">
      <span class="nav__search-icon" aria-hidden="true">${renderSearchIcon()}</span>
      <input
        type="text"
        id="sidebar-search-input"
        class="nav__search-input"
        placeholder="Search projects, places..."
        aria-label="Search projects, opportunities and impactmakers"
        aria-controls="sidebar-search-results"
        autocomplete="off"
        enterkeyhint="search"
        inputmode="search"
        maxlength="100"
      />
      <button type="button" class="nav__search-clear" id="sidebar-search-clear" aria-label="Clear search" hidden>
        ${renderCloseIcon()}
      </button>
      <div id="sidebar-search-results" class="search-dropdown" hidden></div>
    </div>

    <nav class="nav__drawer-list" aria-label="Menu">
      ${NAV_LINKS.map(
        (l) => `
        <a href="${l.href}" class="nav__drawer-row" data-link-key="${l.key}">
          <span class="nav__drawer-row-label">${l.label}</span>
          <span class="nav__drawer-chevron" aria-hidden="true">${icon("chevronRight")}</span>
        </a>`
      ).join("")}
    </nav>

    <div class="nav__drawer-footer">
      <div class="nav__drawer-auth" data-auth="out">
        <button type="button" class="nav__btn nav__btn--ghost" data-nav-action="login">Log In</button>
        <button type="button" class="nav__btn nav__btn--primary" data-nav-action="register">Sign Up</button>
      </div>

      <div class="nav__drawer-user" data-auth="in" hidden>
        <span class="nav__drawer-avatar" data-user-initials aria-hidden="true"></span>
        <div class="nav__drawer-who">
          <strong data-user-name></strong>
          <span data-user-email></span>
        </div>
        <button type="button" class="nav__btn nav__btn--ghost" data-nav-action="logout">Sign Out</button>
      </div>

      <button type="button" class="nav__drawer-switch-row" role="switch" aria-checked="false" data-nav-action="toggle-theme">
        <span class="nav__drawer-switch-icon" aria-hidden="true">${icon("moon")}</span>
        <span class="nav__drawer-switch-label">Dark Mode</span>
        <span class="nav__switch" aria-hidden="true"></span>
      </button>
    </div>
  </div>
`;

// ⑬ SVG ICONS:
// Only the icons icons.js doesn't have. Stroke/fill use currentColor,
// so they follow the text colour and dark mode automatically.
const renderSearchIcon = () => `
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>
  </svg>
`;

const renderBackIcon = () => `
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M19 12H5M11 6l-6 6 6 6"/>
  </svg>
`;

const renderMenuIcon = () => `
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <path d="M4 7h16M4 12h16M4 17h16"/>
  </svg>
`;

const renderCloseIcon = () => `
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6 6 18"/>
  </svg>
`;

const renderSunIcon = () => `
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/>
  </svg>
`;





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  This file owns the top nav bar AND the hamburger drawer. main.js (home)
  and page-shell.js (every other page) call renderNav() for the HTML,
  drop it into the page, then call initNav() to switch it on. So the nav
  behaves identically on every page.

  THREE LAYOUTS, ONE MARKUP (breakpoints live in nav.css; the two
  matchMedia strings in ① must match them):
    - under 720px   : brand + search ICON + hamburger. The search icon
                      opens a full-width search bar over the nav (the
                      YouTube pattern).
    - 720px-1179px  : brand + inline search + dark-mode button + Log In
                      + hamburger.
    - 1180px and up : brand + search + links + dark-mode button +
                      Log In / Sign Up (or the avatar when logged in).
                      No hamburger.
  The drawer is a full-width panel on phones and a right-hand panel on
  tablets. Every nav link lives once in NAV_LINKS; the bar shows the ones
  flagged desktop, the drawer shows all of them (DRY).

  NO MORE INLINE onclick AND NO MORE window GLOBALS: every clickable thing
  carries data-nav-action="...", and ONE click listener on .nav looks it
  up in the `actions` table (⑨). Trade-off: you read behaviour in JS
  instead of in the HTML attribute, and a typo in data-nav-action fails
  silently (the lookup finds nothing). Gains: no globals, and the listener
  survives user-menu.js replacing its own markup.

  LOGIN STATE: this file never stores it. syncAuthUi() reads auth.js
  (isLoggedIn / getCurrentUser) and flips `hidden` on [data-auth] groups;
  subscribe() re-runs it on every change. Known limitation: until
  initAuth() finishes its /api/auth/me call, a returning logged-in user
  briefly sees Log In / Sign Up. A real fix needs an "auth is ready" flag
  in auth.js; not worth it yet.

  THEME: theme.js stays the only owner of the saved theme. The bar button
  and the drawer switch both call toggleTheme(), then syncThemeUi()
  updates aria-pressed / aria-checked. The sun/moon swap is pure CSS off
  html[data-theme].

  ACCESSIBILITY: the hamburger button flips aria-expanded + aria-label;
  the drawer's aria-hidden follows its real state; Tab is trapped between
  the hamburger button and the drawer while open; Escape closes (search
  first, then drawer) and focus returns to the control that opened it.
  Active links get aria-current ("page" on sub pages, "location" for the
  homepage section being read).

  BLOCKS DEFINITIONS:
  ① CONFIG              — breakpoint strings, NAV_LINKS, focusable selector.
  ② DOM REFERENCE        — selectors + the $() shortcut.
  ③ STATE                — is the drawer / search overlay open; which page.
  ④ NAV HEIGHT           — keeps --nav-h equal to the real nav height
                           (ResizeObserver) so the drawer starts under it.
  ⑤ DRAWER               — open/close, focus trap.
  ⑥ SEARCH OVERLAY       — open/close the phone search bar.
  ⑦ THEME + AUTH UI SYNC — mirror theme.js / auth.js into the DOM.
  ⑧ ACTIVE LINK          — page match on sub pages, scroll-spy on home.
  ⑨ ACTIONS              — the data-nav-action lookup table.
  ⑩ EVENT HANDLERS       — delegated click, keyboard, scroll shadow.
  ⑪ INITIALIZATION       — initNav(): runs once after the HTML is in.
  ⑫ RENDERING            — brand, search, links, actions, drawer.
  ⑬ SVG ICONS            — only icons not already in icons.js.

  CLASS NAME GLOSSARY:
  .nav                    The whole sticky top bar.
  .nav__inner             The row inside it (also the overlay's anchor).
  .nav__brand / -mark / -text   Logo + wordmark link.
  .nav__search            Search field (inline pill, or full-width bar
                          on phones when .search-open).
  .nav__search-icon       Magnifier inside a search field.
  .nav__search-input      The typing field (nav + drawer share it).
  .nav__search-clear      The "x" that empties the field (search.js
                          shows/hides it).
  .nav__search-back       Arrow that closes the phone search bar.
  .nav__search-toggle     Phone-only icon that opens the search bar.
  .nav__links / .nav__link   Desktop link row / one link.
  .nav__actions           Right-hand button group.
  .nav__icon-btn          Shared round 44px icon button.
  .nav__theme-btn         Dark-mode button (-moon / -sun swap by CSS).
  .nav__auth              Log In + Sign Up pair (logged out).
  .nav__btn               Shared text button; --ghost / --primary
                          modifiers; --signup is hidden below 1180px.
  .nav__menu-button       Hamburger (-icon--open / -icon--close).
  .nav__backdrop          Dim layer behind the drawer.
  .nav__drawer            The menu panel.
  .nav__drawer-search     Search field inside the drawer.
  .nav__drawer-list       Scrollable list of rows.
  .nav__drawer-row        One big link row (-label, -chevron).
  .nav__drawer-footer     Pinned bottom block (auth, user, dark mode).
  .nav__drawer-auth       Log In / Sign Up pair in the drawer.
  .nav__drawer-user       Signed-in card (-avatar, -who).
  .nav__drawer-switch-row Dark-mode row; .nav__switch is its pill.
  .search-dropdown*       Owned by nav.css, filled by search.js.

  User-menu pieces (.user-menu*) belong to user-menu.js.

  STATES (plain, not BEM): is-open, menu-open, search-open, is-scrolled,
  is-active, no-scroll. They are flags this file flips.
*/
