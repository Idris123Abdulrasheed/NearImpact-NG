import "./styles/anchor-reveal.css";
// Instant in-page jumps wrapped in a cross-fade (View Transitions API),
// with the old fade/slide reveal as the fallback. DEVELOPERS NOTE at the bottom.

// ① CONFIG:
const REVEAL_CLASS = "is-revealing";
const REVEALABLE = "section, article, main";
const NAV_VT_CLASS = "vt-nav";

// ② HELPERS:
const normalisePath = (path) => path.replace(/index\.html$/, "").replace(/\/+$/, "") || "/";
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function getTarget(hash) {
  if (!hash || hash === "#") return null;
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
}

// Fallback reveal for browsers without View Transitions.
function reveal(el) {
  el.classList.remove(REVEAL_CLASS);
  void el.offsetWidth; // restart the animation if it was already running
  el.classList.add(REVEAL_CLASS);
  const done = (e) => {
    if (e.target !== el) return; // ignore children's animations
    el.classList.remove(REVEAL_CLASS);
    el.removeEventListener("animationend", done);
  };
  el.addEventListener("animationend", done);
}

// ③ TRANSITION:
// Runs `update` inside a cross-fade when the browser supports it, otherwise
// runs it straight away. Returns true if a transition was used.
// The nav only gets its view-transition-name DURING the transition: a
// permanent name would make it the containing block of the fixed drawer.
function withTransition(update) {
  if (!document.startViewTransition || prefersReducedMotion()) {
    update();
    return false;
  }
  const nav = document.querySelector(".nav");
  nav?.classList.add(NAV_VT_CLASS); // keeps the sticky nav still while the page fades
  const transition = document.startViewTransition(update);
  transition.finished.finally(() => nav?.classList.remove(NAV_VT_CLASS));
  return true;
}

// ④ NAVIGATION:
function goTo(hash, { push }) {
  const target = getTarget(hash);
  if (!target) return false;

  const jump = () => {
    target.scrollIntoView({ behavior: "instant", block: "start" }); // honours scroll-padding-top
    if (push) {
      const url = `${window.location.pathname}${window.location.search}${hash}`;
      history[window.location.hash === hash ? "replaceState" : "pushState"](null, "", url);
    }
    if (target.matches("input, textarea, select, button, a")) target.focus({ preventScroll: true });
  };

  const usedTransition = withTransition(jump);
  if (!usedTransition && target.matches(REVEALABLE) && !prefersReducedMotion()) reveal(target);
  return true;
}

export function scrollToTop() {
  const jump = () => window.scrollTo({ top: 0, behavior: "instant" });
  const usedTransition = withTransition(jump);
  const hero = document.querySelector(".hero");
  if (!usedTransition && hero && !prefersReducedMotion()) reveal(hero);
}

// ⑤ EVENTS:
function handleClick(e) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const link = e.target.closest("a[href]");
  if (!link || (link.target && link.target !== "_self") || link.hasAttribute("download")) return;

  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin || !url.hash) return;
  if (normalisePath(url.pathname) !== normalisePath(window.location.pathname)) return;
  if (url.search !== window.location.search) return;

  if (goTo(url.hash, { push: true })) e.preventDefault();
}

// ⑥ INITIALIZATION:
// Call LAST, after the page markup is in the DOM.
export function initAnchorReveal() {
  document.addEventListener("click", handleClick);
  window.addEventListener("hashchange", () => goTo(window.location.hash, { push: false })); // back/forward

  // Arriving with #section from another page: plain jump, no transition
  // (there is no "old view" to fade from). Skipped on reload/back so we
  // don't fight the browser's own scroll restoration.
  const navType = performance.getEntriesByType("navigation")[0]?.type;
  const target = getTarget(window.location.hash);
  if (target && navType === "navigate") {
    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "instant", block: "start" });
      if (target.matches(REVEALABLE) && !prefersReducedMotion()) reveal(target);
    });
  }
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  Replaces CSS smooth scrolling. One delegated click listener catches
  links to a #hash on the CURRENT page, then jumps instantly inside
  document.startViewTransition(): the browser snapshots the old view,
  we jump, and it cross-fades to the new view (look and timing live in
  anchor-reveal.css). Links to other pages are never touched.

  FALLBACKS: browsers without startViewTransition (older Firefox) and
  visitors with prefers-reduced-motion get a plain instant jump; the
  no-transition path still plays the small .is-revealing fade/slide
  unless reduced motion is on.

  WHY THE NAV GETS ITS NAME ONLY DURING A TRANSITION: a permanent
  view-transition-name makes an element the containing block for its
  fixed-position children, which would move the drawer. So withTransition()
  adds .vt-nav just before the transition and removes it when finished.

  Arriving from another page with a #hash is a full page load, so there
  is no old view to fade from; that case jumps and plays the reveal.

  BLOCKS DEFINITIONS:
  ① CONFIG  ② HELPERS  ③ TRANSITION  ④ NAVIGATION  ⑤ EVENTS
  ⑥ INITIALIZATION

  CLASS NAME GLOSSARY:
  .is-revealing  State flag (not BEM): fallback fade/slide on the target.
  .vt-nav        State flag (not BEM): gives the nav a view-transition-name
                 for the length of one transition.
*/