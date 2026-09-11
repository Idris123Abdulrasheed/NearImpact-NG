// If any of this looks unfamiliar, the DEVELOPERS NOTE at the bottom
// walks through how the toast lifecycle fits together.

import "../styles/toast.css";

// ① TOAST LIFECYCLE:
export function showToast({ message, actionLabel, actionHref, duration = 5000 }) {
  // build + show
  document.querySelector(".toast")?.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  toast.innerHTML = `
    <p>${message}</p>
    ${actionLabel ? `<a href="${actionHref}" class="toast__action">${actionLabel}</a>` : ""}
    <button class="toast__close" aria-label="Dismiss">×</button>
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("visible"));

  // dismiss — manual click or auto after duration
  const close = () => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 300);
  };
  toast.querySelector(".toast__close").addEventListener("click", close);
  if (duration) setTimeout(close, duration);
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  A tiny, self-contained toast component; one exported function,
  no state kept between calls. Any file that needs to show a toast
  (auth.js is the current caller) just imports showToast() and
  passes it a message. It builds its own DOM node, appends it to
  <body>, and cleans itself up after a timeout or a manual dismiss.

  Vanilla JS, no framework — the toast is plain DOM manipulation
  (createElement + innerHTML), same pattern used everywhere else in
  this codebase. Class names follow BEM: "toast" is the block, and
  the two interactive bits inside it (the action link, the close
  button) are toast__action and toast__close.

  Worth calling out: any existing toast on the page gets removed
  before a new one is created (see the querySelector(".toast")?.remove()
  line)


  BLOCKS DEFINITIONS:
  ① TOAST LIFECYCLE — the whole thing lives in one function since
                       show/build and dismiss are tightly coupled
                       (the close handler is built using values from
                       the same call). Split with plain inline
                       comments instead of a second numbered section,
                       since it's really one continuous flow, not two
                       separate concerns.


  CLASS NAME GLOSSARY:
  .toast          The toast container itself; fixed position, holds
                   the message, and (optionally) the action link and
                   close button.
  .toast__action  The optional call-to-action link inside the toast
                   (e.g. "Log in"). Only renders if actionLabel was
                   passed in.
  .toast__close   The × button that dismisses the toast early.

  State class note: .visible isn't part of the BEM naming above on
  purpose.  It has added a frame after the toast is inserted (to
  trigger the CSS transition) and removed right before the toast's
  removed from the DOM. It's a flag for "currently animated in," not
  a structural name.
*/