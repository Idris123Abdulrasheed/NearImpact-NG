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

// Feeds the DESKTOP bar (desktop: true) and the active-link logic.
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

// Feeds the DRAWER only. "link" = a plain row, "group" = a dropdown.
// An item with no href is a page that isn't built yet: it renders as a
// "Soon" label instead of a dead link. `key` (optional) hooks the item
// into the active-link highlight (same keys as NAV_LINKS).
const DRAWER_MENU = [
  {
    type: "group",
    label: "Discover",
    items: [
      { label: "Projects", href: "/all-projects.html" },
      { label: "Opportunities", href: "/all-opportunities.html" },
    ],
  },

  {
    type: "group",
    label: "Who We Are",
    items: [
      { key: "about", label: "About NearImpact Nigeria", href: "/about.html" },
      { label: "Meet Our Team" },
      { label: "Contact Us", href: "/about.html#get-in-touch" },
    ],
  },

  {
    type: "group",
    label: "What We Do",
    items: [
      { label: "Our Activities & Projects", href: "/all-projects.html" },
      { label: "Our Partners", href: "/#partners" },
    ],
  },

  {
    type: "group",
    label: "Quick Actions",
    items: [
      { key: "map", label: "View Map", href: "/#map" },
      { key: "sdgs", label: "Learn SDGs", href: "/sdgs.html" },
      { key: "impactmakers", label: "Our Impactmakers", href: "/impactmakers.html" },
      { key: "list-project", label: "List Your Project", href: "/list-project.html" },
    ],
  },

  {
    type: "group",
    label: "Media & Gallery",
    items: [
      { label: "Pictures" },
      { label: "Videos" },
      // though our footer's newsletter field exists on every page
      { label: "Our Newsletter", href: "#footer-newsletter-email" },
    ],
  },

  {
    type: "group",
    label: "Get Involved",
    items: [
      { label: "Volunteer", href: "/all-projects.html?type=volunteer" },
      { label: "Become an Impactmaker", href: "/become-impactmaker.html" },
      { label: "Support Us", href: "/about.html#get-in-touch" },
      { label: "Donate for a Project" },
    ],
  },
];

const FOCUSABLE = "a[href], button:not([disabled]), input:not([disabled]), summary";

// ② DOM REFERENCE:
const selectors = {
  nav: ".nav",
  drawer: ".nav__drawer",
  backdrop: ".nav__backdrop",
  menuButton: ".nav__menu-button",
  searchToggle: ".nav__search-toggle",
  searchInput: "#nav-search-input",
  accountMenu: "#nav-account-menu",
  accountToggle: '[data-nav-action="toggle-account"]',
};

const $ = (selector) => document.querySelector(selector);
const navHeightProperty = "--nav-h";

let activeLinkKey = null;

// ③ STATE:
const isDrawerOpen = () => $(selectors.drawer)?.classList.contains("is-open") ?? false;
const isSearchOpen = () => $(selectors.nav)?.classList.contains("search-open") ?? false;
const isAccountOpen = () => {
  const menu = $(selectors.accountMenu);
  return Boolean(menu) && !menu.hidden;
};

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

  setAccountOpen(false);
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
// Links inside a closed dropdown have no layout box, so the filter skips them.
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

// Account pop-up above the drawer's bottom bar (signed-in only).
function setAccountOpen(open) {
  const menu = $(selectors.accountMenu);
  const toggle = $(selectors.accountToggle);
  if (!menu || !toggle) return;
  menu.hidden = !open;
  toggle.setAttribute("aria-expanded", String(open));
}

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
  if (!user) {
    setAccountOpen(false);
    return;
  }
  // textContent, never innerHTML: name/email are user-typed text.
  // querySelectorAll because the name now appears twice (button + pop-up).
  nav.querySelectorAll("[data-user-initials]").forEach((el) => (el.textContent = getInitials(user.name)));
  nav.querySelectorAll("[data-user-name]").forEach((el) => (el.textContent = user.name));
  nav.querySelectorAll("[data-user-email]").forEach((el) => (el.textContent = user.email));
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
  "toggle-account": () => setAccountOpen(!isAccountOpen()),
  "toggle-theme": () => {
    toggleTheme();
    syncThemeUi();
  },
  login: () => openAuth("login"),
  register: () => openAuth("register"),
  logout: () => {
    setAccountOpen(false);
    closeDrawer({ returnFocus: false });
    logout(); // the auth subscription updates every piece of UI
  },
};

// ⑩ EVENT HANDLERS:
// ONE click listener on .nav instead of an inline onclick per element.
// It also survives user-menu.js re-rendering its own markup.
const handleClick = (event) => {
  // A tap anywhere outside the account area folds its pop-up away.
  if (isAccountOpen() && !event.target.closest(".nav__drawer-account")) setAccountOpen(false);

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

  // Choosing a real link or a search result means "I'm done here".
  // `a.` on purpose: a dropdown <summary> shares .nav__drawer-row but
  // must NOT close the drawer, and "Soon" labels are <span>s.
  if (event.target.closest("a.nav__drawer-row, a.nav__sub-link, a.nav__account-item, .search-dropdown__result")) {
    closeDrawer({ returnFocus: false });
    closeSearch({ returnFocus: false });
  }
};

const handleKeyDown = (event) => {
  if (event.key === "Escape") {
    if (isSearchOpen()) closeSearch();
    else if (isAccountOpen()) {
      setAccountOpen(false);
      $(selectors.accountToggle)?.focus();
    } else if (isDrawerOpen()) closeDrawer();
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

// One markup for the theme button; the bar and the drawer both use it so
// there is a single look (sun/moon swap is pure CSS off html[data-theme]).
const renderThemeButton = (className) => `
  <button
    type="button"
    class="nav__icon-btn ${className}"
    data-nav-action="toggle-theme"
    aria-label="Dark mode"
    aria-pressed="false"
  >
    <span class="nav__theme-moon">${icon("moon")}</span>
    <span class="nav__theme-sun">${renderSunIcon()}</span>
  </button>
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

    ${renderThemeButton("nav__theme-btn")}

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

// DRAWER — rows and dropdowns
const renderSubItem = (item) =>
  item.href
    ? `<a href="${item.href}" class="nav__sub-link"${item.key ? ` data-link-key="${item.key}"` : ""}>${item.label}</a>`
    : `<span class="nav__sub-link is-soon" aria-disabled="true">${item.label}<em class="nav__soon">Soon</em></span>`;

// A group starts open only when the visitor is already on one of its pages.
const groupHoldsCurrentPage = (group) =>
  group.items.some(
    (item) => item.key && NAV_LINKS.find((l) => l.key === item.key)?.pages?.includes(getPageName())
  );

// Native <details name="..."> = a dropdown that closes its siblings by
// itself, no JS (same "let the browser do it" rule as faq.js).
const renderGroup = (group) => `
  <details class="nav__group" name="nav-groups"${groupHoldsCurrentPage(group) ? " open" : ""}>
    <summary class="nav__drawer-row nav__group-summary">
      <span class="nav__drawer-row-label">${group.label}</span>
      <span class="nav__drawer-chevron nav__group-chevron" aria-hidden="true">${icon("chevronRight")}</span>
    </summary>
    <div class="nav__group-panel">
      ${group.items.map(renderSubItem).join("")}
    </div>
  </details>
`;

const renderDrawerRow = (entry) =>
  entry.type === "group"
    ? renderGroup(entry)
    : `
      <a href="${entry.href}" class="nav__drawer-row" data-link-key="${entry.key}">
        <span class="nav__drawer-row-label">${entry.label}</span>
        <span class="nav__drawer-chevron" aria-hidden="true">${icon("chevronRight")}</span>
      </a>`;

// DRAWER — bottom bar: ONE sign-in button (or the account button when
// signed in) + the same theme button the desktop bar uses.
const renderDrawerFooter = () => `
  <div class="nav__drawer-footer">

    <button type="button" class="nav__signin" data-auth="out" data-nav-action="login">
      ${renderAccountIcon()}
      <span>Sign in</span>
    </button>

    <div class="nav__drawer-account" data-auth="in" hidden>
      <div class="nav__account-menu" id="nav-account-menu" role="group" aria-label="Account" hidden>
        <div class="nav__account-header">
          <strong data-user-name></strong>
          <span data-user-email></span>
        </div>
        <a class="nav__account-item" href="/list-project.html">
          <span aria-hidden="true">${icon("sparkle")}</span>
          <span>List Your Project</span>
        </a>
        <button type="button" class="nav__account-item" data-nav-action="logout">
          <span aria-hidden="true">${icon("logout")}</span>
          <span>Sign Out</span>
        </button>
      </div>

      <button
        type="button"
        class="nav__signin nav__signin--user"
        data-nav-action="toggle-account"
        aria-expanded="false"
        aria-controls="nav-account-menu"
        aria-label="Account menu"
      >
        <span class="nav__signin-avatar" data-user-initials aria-hidden="true"></span>
        <span class="nav__signin-name" data-user-name></span>
        <span class="nav__signin-caret" aria-hidden="true">${icon("chevronRight")}</span>
      </button>
    </div>

    ${renderThemeButton("nav__drawer-theme")}
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
      ${DRAWER_MENU.map(renderDrawerRow).join("")}
    </nav>

    ${renderDrawerFooter()}
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

// Person-in-a-circle, the "account" glyph used on the Sign in button.
const renderAccountIcon = () => `
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="9.8" r="3.1"/>
    <path d="M6.2 18.3c1.2-2.3 3.3-3.4 5.8-3.4s4.6 1.1 5.8 3.4"/>
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
  tablets.

  TWO LISTS, TWO JOBS: NAV_LINKS feeds the desktop bar and the
  active-link logic. DRAWER_MENU feeds the drawer only: two plain rows
  (Discover, Opportunities) then five dropdown groups (Quick Actions,
  Who We Are, What We Do, Media & Gallery, Get Involved). They were one
  list before; the drawer outgrew it. An item without an href is a page
  that doesn't exist yet and renders as a "Soon" label instead of a dead
  link; give it an href later and it becomes a real link, nothing else
  changes. Items with a `key` join the active-link highlight.

  DROPDOWNS = native <details name="nav-groups">: the browser handles
  open/close and closes the sibling group (same idea as faq.js). Two
  consequences handled in code: (1) <summary> shares the .nav__drawer-row
  class for looks, so the "close the drawer on choosing a row" check uses
  `a.nav__drawer-row` and never fires for a summary; (2) the focus trap
  includes `summary`, and links inside a closed group are skipped because
  they have no layout box.

  BOTTOM BAR: ONE button. Logged out it is "Sign in" (opens the login
  modal; the modal's own tab switches to Create Account). Logged in the
  same slot becomes an account button (initials + name) that opens a
  small pop-up with List Your Project and Sign Out, so a signed-in phone
  user can still log out. Beside it sits the same sun/moon icon button
  the desktop bar uses (renderThemeButton, one markup, two classes).
  The pop-up closes on: second tap, tap outside, Escape (before the
  drawer does), drawer close, logout.

  LOGIN STATE: this file never stores it. syncAuthUi() reads auth.js
  (isLoggedIn / getCurrentUser) and flips `hidden` on [data-auth] groups;
  subscribe() re-runs it on every change. Do NOT put data-auth on the
  account pop-up itself: syncAuthUi would un-hide it. Known limitation:
  until initAuth() finishes its /api/auth/me call, a returning logged-in
  user briefly sees "Sign in".

  THEME: theme.js stays the only owner of the saved theme. Both theme
  buttons call toggleTheme(), then syncThemeUi() updates aria-pressed.
  The sun/moon swap is pure CSS off html[data-theme].

  ACCESSIBILITY: the hamburger button flips aria-expanded + aria-label;
  the drawer's aria-hidden follows its real state; Tab is trapped between
  the hamburger button and the drawer while open; Escape closes (search
  first, then account pop-up, then drawer) and focus returns to the
  control that opened it. Active links get aria-current ("page" on sub
  pages, "location" for the homepage section being read).

  BLOCKS DEFINITIONS:
  ① CONFIG              — breakpoint strings, NAV_LINKS, DRAWER_MENU,
                           focusable selector.
  ② DOM REFERENCE        — selectors + the $() shortcut.
  ③ STATE                — is the drawer / search / account pop-up open;
                           which page.
  ④ NAV HEIGHT           — keeps --nav-h equal to the real nav height.
  ⑤ DRAWER               — open/close, focus trap, account pop-up state.
  ⑥ SEARCH OVERLAY       — open/close the phone search bar.
  ⑦ THEME + AUTH UI SYNC — mirror theme.js / auth.js into the DOM.
  ⑧ ACTIVE LINK          — page match on sub pages, scroll-spy on home.
  ⑨ ACTIONS              — the data-nav-action lookup table.
  ⑩ EVENT HANDLERS       — delegated click, keyboard, scroll shadow.
  ⑪ INITIALIZATION       — initNav(): runs once after the HTML is in.
  ⑫ RENDERING            — brand, search, links, actions, theme button,
                           drawer rows/groups, drawer bottom bar.
  ⑬ SVG ICONS            — only icons not already in icons.js.

  CLASS NAME GLOSSARY:
  .nav                    The whole sticky top bar.
  .nav__inner             The row inside it (also the overlay's anchor).
  .nav__brand / -mark / -text   Logo + wordmark link.
  .nav__search            Search field (inline pill, or full-width bar
                          on phones when .search-open).
  .nav__search-icon       Magnifier inside a search field.
  .nav__search-input      The typing field (nav + drawer share it).
  .nav__search-clear      The "x" that empties the field.
  .nav__search-back       Arrow that closes the phone search bar.
  .nav__search-toggle     Phone-only icon that opens the search bar.
  .nav__links / .nav__link   Desktop link row / one link.
  .nav__actions           Right-hand button group.
  .nav__icon-btn          Shared round 44px icon button.
  .nav__theme-btn         Dark-mode button in the bar (moon/sun by CSS).
  .nav__auth              Log In + Sign Up pair (logged out, bar).
  .nav__btn               Shared text button; --ghost / --primary
                          modifiers; --signup is hidden below 1180px.
  .nav__menu-button       Hamburger: 52px solid blue square; shows a
                          ringed border while open (-icon--open/--close).
  .nav__backdrop          Dim layer behind the drawer.
  .nav__drawer            The menu panel.
  .nav__drawer-search     Search field inside the drawer.
  .nav__drawer-list       Scrollable list of rows and groups.
  .nav__drawer-row        One big row (link, or a group's <summary>).
  .nav__drawer-row-label  Its text. .nav__drawer-chevron: its arrow box.
  .nav__group             One dropdown (<details>).
  .nav__group-summary     Its clickable header (a .nav__drawer-row).
  .nav__group-chevron     Arrow that turns when the group opens.
  .nav__group-panel       The revealed list of sub links.
  .nav__sub-link          One sub link (or a "Soon" label, .is-soon).
  .nav__soon              The small "Soon" pill.
  .nav__drawer-footer     Pinned bottom bar (sign in + theme button).
  .nav__signin            The one dark Sign in button;
  .nav__signin--user      modifier for the signed-in account button
                          (-avatar, -name, -caret inside it).
  .nav__drawer-account    Wrapper holding the account button + pop-up.
  .nav__account-menu      The pop-up (-header, and .nav__account-item rows).
  .nav__drawer-theme      The theme button in the drawer bar.
  .search-dropdown*       Owned by nav.css, filled by search.js.

  User-menu pieces (.user-menu*) belong to user-menu.js.

  STATES (plain, not BEM): is-open, menu-open, search-open, is-scrolled,
  is-active, is-soon, no-scroll. They are flags this file (or the
  browser, for [open]) flips.
*/