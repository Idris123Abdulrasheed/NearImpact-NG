import "./styles/auth-modal.css";
import { login, register } from "./auth.js";
import {
  renderPasswordToggle,
  initPasswordToggle,
  resetPasswordToggle,
} from "./ui/password-toggle.js";
// The login/register modal. Opened two ways: user-menu.js's dropdown
// items dispatch the same event this file listens for, and so does
// auth.js's requireAuth() when something elsewhere in the app needs a
// login first. Registration now asks for ONLY email + password.
// See DEVELOPERS NOTE at the bottom.

// ① RENDERING:
export function renderAuthModal() {
  return `
    <div class="auth-modal" id="auth-modal" aria-hidden="true">
      <div class="auth-modal__backdrop" data-close></div>

      <div class="auth-modal__panel" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
        <button type="button" class="auth-modal__close" data-close aria-label="Close">&times;</button>

        <div class="auth-modal__tabs" role="tablist">
          <button type="button" class="auth-modal__tab active" data-mode="login" role="tab">Log In</button>
          <button type="button" class="auth-modal__tab" data-mode="register" role="tab">Create Account</button>
        </div>

        <h2 class="auth-modal__title" id="auth-modal-title">Welcome back</h2>

        <form class="auth-modal__form" id="auth-modal-form" novalidate>
          <label class="auth-modal__field">
            <span>Email</span>
            <input type="email" name="email" autocomplete="email" required />
          </label>

          <label class="auth-modal__field">
            <span>Password</span>
            <div class="auth-modal__password-wrap">
              <input type="password" name="password" autocomplete="current-password" required minlength="8" />
              ${renderPasswordToggle()}
            </div>
            <small class="auth-modal__hint" id="auth-modal-hint" hidden>At least 8 characters.</small>
          </label>

          <p class="auth-modal__error" id="auth-modal-error" hidden></p>

          <button type="submit" class="auth-modal__submit">Log In</button>
        </form>
      </div>
    </div>
  `;
}

// ② PASSWORD VISIBILITY:
// Always put the monkey back to "hidden" when the modal closes or
// switches mode, so a password is never left on screen.
function hidePassword() {
  const modal = document.getElementById("auth-modal");
  if (!modal) return;
  resetPasswordToggle(
    modal.querySelector('input[name="password"]'),
    modal.querySelector(".password-toggle")
  );
}

// ③ MODE SWITCHING:
// Same two fields in both modes; only labels, the autocomplete hint
// and the "at least 8 characters" hint change.
function setMode(mode) {
  const modal = document.getElementById("auth-modal");
  const passwordInput = modal.querySelector('input[name="password"]');
  const title = modal.querySelector(".auth-modal__title");
  const submitBtn = modal.querySelector(".auth-modal__submit");
  const hint = document.getElementById("auth-modal-hint");

  modal.querySelectorAll(".auth-modal__tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.mode === mode);
  });

  const isRegister = mode === "register";
  passwordInput.autocomplete = isRegister ? "new-password" : "current-password";
  title.textContent = isRegister ? "Create your account" : "Welcome back";
  submitBtn.textContent = isRegister ? "Create Account" : "Log In";
  hint.hidden = !isRegister;

  modal.dataset.mode = mode;
  hidePassword();
  hideError();
}

// ④ OPEN / CLOSE:
function openModal() {
  const modal = document.getElementById("auth-modal");
  if (!modal) return;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  modal.querySelector('input[name="email"]')?.focus();
}

function closeModal() {
  const modal = document.getElementById("auth-modal");
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  hidePassword();
  hideError();
}

// ⑤ ERROR DISPLAY:
function showError(message) {
  const errorEl = document.getElementById("auth-modal-error");
  errorEl.textContent = message;
  errorEl.hidden = false;
}

function hideError() {
  const errorEl = document.getElementById("auth-modal-error");
  errorEl.hidden = true;
}

// ⑥ FORM SUBMISSION:
async function handleSubmit(e) {
  e.preventDefault();
  const modal = document.getElementById("auth-modal");
  const form = e.target;
  const submitBtn = form.querySelector(".auth-modal__submit");
  const mode = modal.dataset.mode;

  const email = form.email.value.trim();
  const password = form.password.value;

  submitBtn.disabled = true;
  hideError();

  try {
    if (mode === "register") {
      await register(email, password);
    } else {
      await login(email, password);
    }
    form.reset();
    closeModal();
  } catch (err) {
    showError(err.message || "Something went wrong. Try again.");
  } finally {
    submitBtn.disabled = false;
  }
}

// ⑦ INITIALIZATION:
export function initAuthModal() {
  const modal = document.getElementById("auth-modal");
  if (!modal) return;

  modal.dataset.mode = "login";

  modal.querySelectorAll(".auth-modal__tab").forEach((tab) => {
    tab.addEventListener("click", () => setMode(tab.dataset.mode));
  });

  modal.querySelectorAll("[data-close]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  initPasswordToggle(
    modal.querySelector('input[name="password"]'),
    modal.querySelector(".password-toggle")
  );

  document.getElementById("auth-modal-form").addEventListener("submit", handleSubmit);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });

  // Single entry point for opening this modal from anywhere in the
  // app — auth.js's requireAuth(), user-menu.js and the detail page's
  // register box all dispatch this instead of importing this file.
  window.addEventListener("ni:open-auth-modal", (e) => {
    setMode(e.detail?.mode || "login");
    openModal();
  });
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The login/register modal, rendered once alongside every other
  section and toggled open/closed via CSS classes (kept in the DOM so
  it can animate; is-open is a state flag, not BEM'd).

  WHY AN EVENT, NOT A DIRECT IMPORT: user-menu.js, auth.js
  (requireAuth()) and the detail page all need to open this modal,
  and none of them should import auth-modal.js. They dispatch a plain
  "ni:open-auth-modal" CustomEvent on window with detail.mode
  ("login" | "register"); this file is the only listener.

  WHAT CHANGED (minimal registration): the Name field is gone. The form
  is ONE pair of fields (email + password) for both modes; setMode()
  only changes labels and shows the "at least 8 characters" hint. The
  server derives a display name from the email when none is sent (see
  api/auth/register.js), so users.name stays NOT NULL and the avatar
  initials still work. register() in auth.js is now register(email,
  password).

  The password field has the monkey toggle (ui/password-toggle.js).
  hidePassword() resets it on close and on mode switch.

  BLOCKS DEFINITIONS:
  ① RENDERING           — the modal's markup: backdrop, close button,
                          tabs, email + password (with monkey toggle).
  ② PASSWORD VISIBILITY — hidePassword() puts the toggle back to hidden.
  ③ MODE SWITCHING      — setMode() flips labels/hints between modes.
  ④ OPEN / CLOSE        — visibility classes, scroll lock, focus.
  ⑤ ERROR DISPLAY       — one inline message (server error text).
  ⑥ FORM SUBMISSION     — calls login() or register() per mode, closes
                          on success, disables submit while waiting.
  ⑦ INITIALIZATION      — tabs, close buttons, monkey toggle, Escape,
                          submit, and the window-level open listener.

  CLASS NAME GLOSSARY:
  .auth-modal                    The whole overlay, always in the DOM.
  .auth-modal__backdrop          Dimmed background (data-close).
  .auth-modal__panel             The card.
  .auth-modal__close             The × button (data-close).
  .auth-modal__tabs              Row holding the two mode tabs.
  .auth-modal__tab               One tab button.
  .auth-modal__title             "Welcome back" / "Create your account".
  .auth-modal__form              The shared form.
  .auth-modal__field             One labelled input.
  .auth-modal__password-wrap     position: relative box around the
                                 password input + monkey button. (new)
  .auth-modal__hint              "At least 8 characters." (register only) (new)
  .auth-modal__error             Inline error, hidden by default.
  .auth-modal__submit            Submit button; label changes with mode.

  State classes "active" (tab) and "is-open" (modal) are deliberately
  not BEM'd.
*/
