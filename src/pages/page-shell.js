import "../modules/styles/base.css";
import { renderNav, initNav } from "../modules/nav.js";
import { renderFooter, initFooter } from "../modules/footer.js";
import { renderAuthModal, initAuthModal } from "../modules/auth-modal.js";
import { renderDocPage } from "../modules/doc-page.js";
import { initSearch } from "../modules/search.js";
import { initTheme } from "../modules/theme.js";
import { initUserMenu } from "../modules/user-menu.js";
import { initAuth } from "../modules/auth.js";
// The "mini main.js" for every page besides the homepage.
// DEVELOPERS NOTE at the bottom explains why it exists.

// ① PAGE MOUNT:np
// `html` is the page's own <main>; `onMounted` runs after everything is
// in the DOM, for pages that need their own init (forms, grids).
export function mountPage({ title, html, onMounted }) {
  document.title = `${title} | NearImpact Nigeria`;

  document.querySelector("#app").innerHTML = `
    ${renderNav()}
    ${html}
    ${renderFooter()}
    ${renderAuthModal()}
  `;

  // same order as main.js
  initSearch();
  initNav();
  initUserMenu();
  initTheme();
  initFooter();
  initAuthModal();
  initAuth();

  if (onMounted) onMounted();
}

// ② DOCUMENT PAGES:
// Shortcut for text pages (About, Privacy, Terms).
export function mountDocPage(doc) {
  mountPage({ title: doc.title, html: renderDocPage(doc) });
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  main.js builds the homepage; this file builds every other page. It
  assembles the same shared pieces (nav, footer, login modal) around a
  page's own content, so the nav, theme, search and login state behave
  identically everywhere without copying code.

  WHY SEPARATE HTML FILES AND NOT A ROUTER: the site has no router,
  and a handful of standalone pages don't justify writing one. Each
  page is its own small HTML entry (about.html, list-project.html,
  ...) registered in vite.config.js. If the site later grows pages
  that need shared state or transitions, that's the point to consider
  a router; not before.

  Sub pages must link back to homepage sections with "/#section", not
  "#section", otherwise the anchor stays on the current page.

  BLOCKS DEFINITIONS:
  ① PAGE MOUNT      — mountPage() sets the tab title, renders nav +
                      the page's html + footer + auth modal into #app,
                      runs the same init calls main.js does (minus the
                      homepage-only ones), then the page's onMounted.
  ② DOCUMENT PAGES  — mountDocPage() is mountPage() for plain text
                      pages rendered by doc-page.js.
*/
