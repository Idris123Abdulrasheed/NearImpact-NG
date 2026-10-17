import "./styles/auth-modal.css";
import { renderAuthForm, initAuthForm, setAuthMode, clearAuthTransient, focusAuthForm } from "./auth-form.js";
// The login/register popup. Opened by events from user-menu.js, nav.js,
// the detail page and auth.js's requireAuth(); the card inside it is
// shared with the /login page (see auth-form.js).
// See DEVELOPERS NOTE at the bottom.

// ① RENDERING:
export function renderAuthModal() {
  return `
    <div class="auth-modal" id="auth-modal" aria-hidden="true">
      <div class="auth-modal__backdrop" data-close></div>

      <div class="auth-modal__panel glass-panel" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
        <button type="button" class="auth-modal__close" data-close aria-label="Close">&times;</button>
        ${renderAuthForm({ titleId: "auth-modal-title" })}
      </div>
    </div>
  `;
}

// ② OPEN / CLOSE:
function getForm(modal) {
  return modal.querySelector(".auth-form");
}

function openModal(modal) {
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  focusAuthForm(getForm(modal));
}

function closeModal(modal) {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  clearAuthTransient(getForm(modal));
}

// ③ INITIALIZATION:
export function initAuthModal() {
  const modal = document.getElementById("auth-modal");
  if (!modal) return;

  const form = getForm(modal);
  initAuthForm(form, { onSuccess: () => closeModal(modal) });

  modal.querySelectorAll("[data-close]").forEach((el) => {
    el.addEventListener("click", () => closeModal(modal));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal(modal);
  });

  // Single entry point for opening this popup from anywhere in the
  // app: auth.js's requireAuth(), user-menu.js, nav.js and the detail
  // page all dispatch this instead of importing this file.
  window.addEventListener("ni:open-auth-modal", (e) => {
    setAuthMode(form, e.detail?.mode);
    openModal(modal);
  });
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  Just the popup shell now: backdrop, close button, open/close and
  Escape. The card inside (logo, Google/LinkedIn buttons, email and
  password, forgot password, create account) is auth-form.js, shared
  with the /login page so the two always match. This file used to
  hold its own tabs and form; those moved out, not away.

  Rendered once alongside every other section and toggled with CSS
  classes (kept in the DOM so it can animate; is-open is a state flag,
  not BEM'd).

  WHY AN EVENT, NOT A DIRECT IMPORT: user-menu.js, nav.js, auth.js
  (requireAuth()) and the detail page all need to open this popup, and
  none of them should import auth-modal.js. They dispatch a plain
  "ni:open-auth-modal" CustomEvent on window with detail.mode
  ("login" | "register" | "forgot"); this file is the only listener.
  On the /login page this popup is not mounted (see page-shell.js) and
  login-page.js listens for the same event instead.

  BLOCKS DEFINITIONS:
  ① RENDERING       — backdrop, close button and the shared card.
  ② OPEN / CLOSE    — visibility classes, scroll lock, focus; closing
                      also hides the password and clears messages.
  ③ INITIALIZATION  — wires the card (closing on success), close
                      buttons, Escape and the window-level open event.

  CLASS NAME GLOSSARY:
  .auth-modal           The whole overlay, always in the DOM.
  .auth-modal__backdrop Dimmed, blurred background (data-close).
  .auth-modal__panel    The frosted card (also a .glass-panel).
  .auth-modal__close    The × button (data-close).

  State class "is-open" is deliberately not BEM'd.
  Everything inside the card is styled by auth-form.css.
*/
