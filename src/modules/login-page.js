import "./styles/login-page.css";
import { renderAuthForm, initAuthForm, setAuthMode } from "./auth-form.js";
import { subscribe } from "./auth.js";
// Body of login.html: THE place to sign in or create an account.
// DEVELOPERS NOTE at the bottom.

// ① HELPERS:
// Only same-site paths are allowed as a redirect target, so a crafted
// ?next=https://evil.example link can never bounce someone off-site.
function getNextUrl() {
  const next = new URLSearchParams(window.location.search).get("next");
  return next && /^\/(?![/\\])/.test(next) ? next : "/";
}

// ② RENDERING:
export function renderLoginPage() {
  return `
    <main class="login-page glass-stage">
      <div class="login-page__card glass-panel">
        ${renderAuthForm({ titleId: "login-page-title", headingTag: "h1" })}
      </div>
    </main>
  `;
}

// ③ INITIALIZATION:
export function initLoginPage() {
  const root = document.querySelector(".login-page .auth-form");
  if (!root) return;

  initAuthForm(root);

  // /login.html?mode=register opens straight on Create Account
  const mode = new URLSearchParams(window.location.search).get("mode");
  setAuthMode(root, mode);

  // Fires on a fresh login/registration AND when an existing session
  // is recovered on load, so one listener covers "already signed in".
  subscribe((user) => {
    if (user) window.location.replace(getNextUrl());
  });
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  A thin wrapper: it puts auth-form.js's card inside a glass panel on a
  page and decides what happens after sign-in (go to ?next=, or the
  homepage). All the form behaviour lives in auth-form.js.

  There is no login popup any more. Everything that needs a login (the
  nav's Log In / Sign Up, "View project" style gates, the detail page's
  register box) sends the visitor here through auth.js's goToAuth(),
  which adds ?mode= and ?next= for this file to read. Redirecting
  through auth.js's subscribe() means a visitor who is already signed
  in is sent on immediately too.

  BLOCKS DEFINITIONS:
  ① HELPERS         — getNextUrl() validates ?next= to same-site paths.
  ② RENDERING       — renderLoginPage(): the glass-stage main + card.
  ③ INITIALIZATION  — card wiring, ?mode=, redirect.

  CLASS NAME GLOSSARY:
  .login-page        The whole page body (also a .glass-stage).
  .login-page__card  The frosted card holding the form.
*/
