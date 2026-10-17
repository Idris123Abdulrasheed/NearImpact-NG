import "./styles/glass.css";
import "./styles/auth-form.css";
import logo from "../assets/brand/logo.png";
import { icon } from "./data/icons.js";
import { CONTACT } from "./data/footer-config.js";
import { login, register } from "./auth.js";
import {
  renderPasswordToggle,
  initPasswordToggle,
  resetPasswordToggle,
} from "./ui/password-toggle.js";
// The sign in / create account / forgot password card on /login.
// DEVELOPERS NOTE at the bottom has the full story.

// ① CONFIG:
const MODES = {
  login: {
    title: "Welcome back",
    subtitle: "Your impact starts nearby.",
    submit: "Log In",
  },
  register: {
    title: "Create your account",
    subtitle: "Your impact starts nearby. Tell us a little about you to get started.",
    submit: "Create Account",
  },
  forgot: {
    title: "Reset your password",
    subtitle: "Enter your email and we'll help you get back in.",
    submit: "Send reset link",
  },
};

// Keep in sync with ALLOWED_ROLES in api/auth/register.js.
const ROLES = [
  { value: "student", label: "Student" },
  { value: "volunteer", label: "Volunteer" },
  { value: "organisation", label: "Organisation or NGO" },
  { value: "educator", label: "Educator" },
  { value: "professional", label: "Professional" },
  { value: "other", label: "Other" },
];

const MIN_PASSWORD_LENGTH = 8;

// `icon` is a key into icons.js. Real OAuth later: turn each button
// into a link to its /api/auth/<id> start route.
const SOCIAL_PROVIDERS = [
  { id: "google", label: "Continue with Google", name: "Google", icon: "google" },
  { id: "linkedin", label: "Continue with LinkedIn", name: "LinkedIn", icon: "linkedinBrand" },
];

// ② RENDERING:
function passwordField({ name, label, autocomplete, hint = "", modes }) {
  return `
    <label class="auth-form__field glass-field" data-modes="${modes}">
      <span>${label}</span>
      <div class="auth-form__password-wrap">
        <input type="password" name="${name}" autocomplete="${autocomplete}" required minlength="${MIN_PASSWORD_LENGTH}" />
        ${renderPasswordToggle()}
      </div>
      ${hint}
    </label>
  `;
}

export function renderAuthForm({ titleId = "auth-form-title", headingTag = "h1" } = {}) {
  const socialButtons = SOCIAL_PROVIDERS.map(
    (p) => `
      <button type="button" class="auth-form__social-btn glass-btn glass-btn--ghost" data-provider="${p.id}">
        <span class="auth-form__social-icon" aria-hidden="true">${icon(p.icon)}</span>
        <span>${p.label}</span>
      </button>`
  ).join("");

  const roleOptions = ROLES.map((r) => `<option value="${r.value}">${r.label}</option>`).join("");

  return `
    <div class="auth-form" data-mode="login">

      <header class="auth-form__brand">
        <img class="auth-form__logo" src="${logo}" alt="NearImpact Nigeria" width="56" height="56" />
        <${headingTag} class="auth-form__title" id="${titleId}">${MODES.login.title}</${headingTag}>
        <p class="auth-form__subtitle">${MODES.login.subtitle}</p>
      </header>

      <div class="auth-form__social" data-modes="login register">${socialButtons}</div>

      <div class="auth-form__divider" data-modes="login register"><span>or use your email</span></div>

      <form class="auth-form__form" novalidate>
        <label class="auth-form__field glass-field" data-modes="register">
          <span>Full name</span>
          <input type="text" name="name" autocomplete="name" minlength="2" maxlength="100"
                 placeholder="e.g. Ada Obi" required />
        </label>

        <label class="auth-form__field glass-field">
          <span>Email</span>
          <input type="email" name="email" autocomplete="email" inputmode="email"
                 autocapitalize="none" spellcheck="false" placeholder="you@example.com" required />
        </label>

        <label class="auth-form__field glass-field" data-modes="register">
          <span>I am a</span>
          <select name="role" required>
            <option value="" disabled selected>Select your role</option>
            ${roleOptions}
          </select>
        </label>

        ${passwordField({
          name: "password",
          label: "Password",
          autocomplete: "current-password",
          hint: `<small class="auth-form__hint" data-modes="register">At least ${MIN_PASSWORD_LENGTH} characters.</small>`,
          modes: "login register",
        })}

        ${passwordField({
          name: "confirmPassword",
          label: "Confirm password",
          autocomplete: "new-password",
          modes: "register",
        })}

        <div class="auth-form__options" data-modes="login">
          <label class="auth-form__remember">
            <input type="checkbox" name="remember" />
            <span class="auth-form__check" aria-hidden="true"></span>
            <span>Remember me</span>
          </label>
          <button type="button" class="auth-form__link" data-go="forgot">Forgot password?</button>
        </div>

        <p class="auth-form__error glass-error" role="alert" hidden></p>
        <p class="auth-form__notice" role="status" hidden></p>

        <button type="submit" class="auth-form__submit glass-btn">${MODES.login.submit}</button>
      </form>

      <p class="auth-form__switch" data-modes="login">
        <span>New to NearImpact?</span>
        <button type="button" class="auth-form__link auth-form__link--strong" data-go="register">
          <span class="auth-form__plus" aria-hidden="true">${icon("plus")}</span>
          Create Account
        </button>
      </p>

      <p class="auth-form__switch" data-modes="register">
        <span>Already have an account?</span>
        <button type="button" class="auth-form__link auth-form__link--strong" data-go="login">Log In</button>
      </p>

      <p class="auth-form__switch" data-modes="forgot">
        <button type="button" class="auth-form__link auth-form__link--strong" data-go="login">
          <span class="auth-form__back" aria-hidden="true">${icon("arrowLeft")}</span>
          Back to log in
        </button>
      </p>

      <p class="auth-form__legal" data-modes="login register">
        By continuing you agree to our <a href="/terms.html">Terms</a> and
        <a href="/privacy.html">Privacy Policy</a>.
      </p>

    </div>
  `;
}

// ③ MESSAGES:
function showError(root, message) {
  const el = root.querySelector(".auth-form__error");
  el.textContent = message;
  el.hidden = false;
}

// `html` is always our own static copy, never user input.
function showNotice(root, html) {
  const el = root.querySelector(".auth-form__notice");
  el.innerHTML = html;
  el.hidden = false;
}

function clearMessages(root) {
  root.querySelector(".auth-form__error").hidden = true;
  root.querySelector(".auth-form__notice").hidden = true;
}

function contactLink() {
  return `<a href="mailto:${CONTACT.email}">${CONTACT.email}</a>`;
}

// ④ MODE + STATE:
// Anything marked data-modes="login register" is shown only in those
// modes; everything else about the card is the same markup.
export function setAuthMode(root, mode) {
  const next = MODES[mode] ? mode : "login";
  const config = MODES[next];

  root.dataset.mode = next;
  root.querySelectorAll("[data-modes]").forEach((el) => {
    el.hidden = !el.dataset.modes.split(" ").includes(next);
  });

  root.querySelector(".auth-form__title").textContent = config.title;
  root.querySelector(".auth-form__subtitle").textContent = config.subtitle;
  root.querySelector(".auth-form__submit").textContent = config.submit;
  root.querySelector('input[name="password"]').autocomplete =
    next === "register" ? "new-password" : "current-password";

  clearAuthTransient(root);
}

// Clears errors/notices and puts every monkey back to "hidden", so a
// password is never left on screen when the mode changes.
export function clearAuthTransient(root) {
  clearMessages(root);
  root.querySelectorAll(".auth-form__password-wrap").forEach((wrap) => {
    resetPasswordToggle(wrap.querySelector("input"), wrap.querySelector(".password-toggle"));
  });
}

export function focusAuthForm(root) {
  const first = root.dataset.mode === "register" ? "name" : "email";
  root.querySelector(`[name="${first}"]`)?.focus();
}

// ⑤ SUBMISSION:
async function handleSubmit(e, root) {
  e.preventDefault();
  const form = e.currentTarget;
  const submitBtn = form.querySelector(".auth-form__submit");
  const mode = root.dataset.mode;
  const value = (name) => form.elements.namedItem(name).value;
  const email = value("email").trim();

  clearMessages(root);

  if (mode === "register" && value("name").trim().length < 2) {
    showError(root, "Enter your full name.");
    return;
  }

  if (!email) {
    showError(root, "Enter your email address.");
    return;
  }

  // UI only for now: no email service is connected, so we say so
  // plainly instead of pretending a link was sent.
  if (mode === "forgot") {
    showNotice(root, `Password reset by email isn't switched on yet. Message us at ${contactLink()} and we'll help you back in.`);
    return;
  }

  if (mode === "register" && !value("role")) {
    showError(root, "Select your role.");
    return;
  }

  const password = value("password");
  if (!password) {
    showError(root, "Enter your password.");
    return;
  }

  if (mode === "register") {
    if (password.length < MIN_PASSWORD_LENGTH) {
      showError(root, `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== value("confirmPassword")) {
      showError(root, "Your passwords don't match.");
      return;
    }
  }

  submitBtn.disabled = true;
  try {
    if (mode === "register") await register(value("name").trim(), email, value("role"), password);
    else await login(email, password, form.elements.namedItem("remember").checked);
    form.reset();
    // Nothing else to do here: login-page.js sees the new user through
    // auth.js's subscribe() and redirects.
  } catch (err) {
    showError(root, err.message || "Something went wrong. Try again.");
  } finally {
    submitBtn.disabled = false;
  }
}

// ⑥ INITIALIZATION:
// `root` is the .auth-form element.
export function initAuthForm(root) {
  if (!root) return;

  root.querySelectorAll(".auth-form__password-wrap").forEach((wrap) => {
    initPasswordToggle(wrap.querySelector("input"), wrap.querySelector(".password-toggle"));
  });

  root.querySelector(".auth-form__form").addEventListener("submit", (e) => handleSubmit(e, root));

  // every mode-switch link/button
  root.addEventListener("click", (e) => {
    const go = e.target.closest("[data-go]");
    if (go) {
      setAuthMode(root, go.dataset.go);
      focusAuthForm(root);
      return;
    }

    // Google / LinkedIn: buttons only until real OAuth exists
    const provider = e.target.closest("[data-provider]");
    if (provider) {
      clearMessages(root);
      const name = SOCIAL_PROVIDERS.find((p) => p.id === provider.dataset.provider)?.name;
      showNotice(root, `${name} sign-in is coming soon. For now, continue with your email below.`);
    }
  });

  setAuthMode(root, "login");
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  One card, three modes (login, register, forgot), shown on the
  /login page by login-page.js. This file knows nothing about pages or
  redirects; it only draws the card and talks to auth.js. After a
  successful login the page redirects through auth.js's subscribe().

  The card carries NO ids (only classes), so every lookup is scoped to
  the card's own root and nothing can clash with other markup.

  MODES: elements marked data-modes="login register" show only in those
  modes. setAuthMode() flips the hidden attribute and swaps the title,
  subtitle and button text from the MODES table. No markup is rebuilt.

  CREATE ACCOUNT collects: full name, email, role, password and a
  confirmation. The confirmation is checked here only (the server never
  sees it). Role is a fixed list; the server checks it against the same
  list (ALLOWED_ROLES in api/auth/register.js), so change both together.
  Reading values uses elements.namedItem() because form.name would
  clash with the form's own name property.

  HONESTY RULE (until the real thing exists): Google/LinkedIn buttons
  and the forgot-password form do NOT fake success. They show a plain
  "coming soon" or "contact us" notice. Remove those two branches in
  handleSubmit() / initAuthForm() when real OAuth and a reset email
  service are built.

  BLOCKS DEFINITIONS:
  ① CONFIG          — MODES copy, ROLES list, password length, and the
                      SOCIAL_PROVIDERS list.
  ② RENDERING       — passwordField() helper + renderAuthForm(): logo,
                      heading, social buttons, divider, form, the three
                      mode-switch rows, legal.
  ③ MESSAGES        — error (red, role=alert) and notice (neutral,
                      role=status) helpers.
  ④ MODE + STATE    — setAuthMode(), clearAuthTransient(), focusAuthForm().
  ⑤ SUBMISSION      — client checks, then login()/register() from
                      auth.js; forgot mode shows the notice only.
  ⑥ INITIALIZATION  — wires the password toggles, submit, mode links and
                      social buttons (one delegated click listener).

  CLASS NAME GLOSSARY:
  .auth-form                The whole card contents (has data-mode).
  .auth-form__brand         Logo + title + subtitle block.
  .auth-form__logo          The NearImpact logo.
  .auth-form__title         The page heading (h1).
  .auth-form__subtitle      Line under the heading.
  .auth-form__social        Wrapper for the two provider buttons.
  .auth-form__social-btn    One "Continue with ..." button.
  .auth-form__social-icon   Provider icon inside that button.
  .auth-form__divider       "or use your email" rule.
  .auth-form__form          The form (all fields).
  .auth-form__field         One labelled input or select.
  .auth-form__password-wrap Positioning wrapper for input + monkey.
  .auth-form__hint          "At least 8 characters." (register only).
  .auth-form__options       Row with Remember me (left) and Forgot password (right).
  .auth-form__remember      The Remember me label (checkbox + box + text).
  .auth-form__check         The drawn checkbox; shows the checkmark when ticked.
  .auth-form__link          Text-style button used for mode switches.
  .auth-form__link--strong  Bolder variant (Create Account, Log In).
  .auth-form__error         Red error message.
  .auth-form__notice        Neutral info message (coming soon etc).
  .auth-form__submit        Main submit button.
  .auth-form__switch        Row at the bottom that changes mode.
  .auth-form__plus          The round plus badge on Create Account.
  .auth-form__back          Small back arrow on "Back to log in".
  .auth-form__legal         Terms and Privacy line.
*/
