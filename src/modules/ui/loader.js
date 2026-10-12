import "../styles/loader.css";
import { escapeHtml } from "./escape-html.js";
// ONE loading indicator for the whole site (the SDG GIF).
// DEVELOPERS NOTE at the bottom.

// ① CONFIG:
const SRC = "/loaders/sdg-loader.png";
const SIZES = ["sm", "md", "lg"];
const VARIANTS = ["inline", "block", "page"];

// ② RENDERING:
// inline = sits in a line of content, block = centred in its container,
// page = fixed full-screen overlay (use showPageLoader() for that one).
export function renderLoader({ size = "md", label = "Loading…", variant = "inline" } = {}) {
  const s = SIZES.includes(size) ? size : "md";
  const v = VARIANTS.includes(variant) ? variant : "inline";
  return `
    <span class="loader loader--${s} loader--${v}" role="status" aria-live="polite">
      <img class="loader__img" src="${SRC}" alt="" />
      <span class="loader__label">${escapeHtml(label)}</span>
    </span>
  `;
}

// ③ FULL-PAGE OVERLAY:
// A counter, so two overlapping requests don't hide it too early.
let pageLoaderCount = 0;
let pageLoaderEl = null;

export function showPageLoader(label = "Loading…") {
  pageLoaderCount += 1;
  if (pageLoaderEl) return;
  document.body.insertAdjacentHTML("beforeend", renderLoader({ size: "lg", label, variant: "page" }));
  pageLoaderEl = document.body.lastElementChild;
}

export function hidePageLoader() {
  pageLoaderCount = Math.max(0, pageLoaderCount - 1);
  if (pageLoaderCount > 0 || !pageLoaderEl) return;
  pageLoaderEl.remove();
  pageLoaderEl = null;
}

// try/finally: the overlay always goes away, on success AND on error.
export async function withPageLoader(task, label) {
  showPageLoader(label);
  try {
    return await task();
  } finally {
    hidePageLoader();
  }
}

/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ARCHITECTURE OVERVIEW:
  The single loading indicator. Same shape as ui/toast.js: callers
  import it, nothing else in the app draws its own spinner. It imports
  its own CSS, so any page using it gets the styles automatically.
  The GIF is decorative (alt=""); the accessible name is the label text,
  inside role="status". The label is visually hidden for inline loaders
  and visible for block/page ones.
  Reduced motion: a GIF can't be paused by CSS, so with
  prefers-reduced-motion the image is hidden and the label shows instead.

  BLOCKS DEFINITIONS:
  ① CONFIG         — asset path, allowed sizes and variants.
  ② RENDERING      — renderLoader() returns markup.
  ③ FULL-PAGE      — showPageLoader / hidePageLoader (counted) and
                     withPageLoader() which guarantees cleanup.

  CLASS NAME GLOSSARY:
  .loader            The indicator.
  .loader__img       The GIF (aspect ratio kept, height:auto).
  .loader__label     The text (screen-reader only when inline).
  .loader--sm/md/lg  Sizes: 24 / 48 / 96px.
  .loader--inline / --block / --page   Layout variants.
*/