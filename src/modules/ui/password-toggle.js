import "../styles/password-toggle.css";
import { icon } from "../data/icons.js";
// Monkey show/hide button for any password input.
// DEVELOPERS NOTE at the bottom.

// ① RENDERING:
export function renderPasswordToggle() {
  return `
    <button type="button" class="password-toggle" aria-pressed="false" aria-label="Show password">
      ${icon("monkeyClosed")}
    </button>
  `;
}

// ② STATE:
function setVisible(input, button, visible) {
  input.type = visible ? "text" : "password";
  button.setAttribute("aria-pressed", String(visible));
  button.setAttribute("aria-label", visible ? "Hide password" : "Show password");
  button.innerHTML = icon(visible ? "monkeyOpen" : "monkeyClosed");
}

export function resetPasswordToggle(input, button) {
  if (!input || !button) return;
  setVisible(input, button, false);
}

// ③ INITIALIZATION:
export function initPasswordToggle(input, button) {
  if (!input || !button) return;
  button.addEventListener("click", () => {
    setVisible(input, button, input.type === "password");
  });
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  Deliberately dumb: the monkey does not watch typing. Eyes closed =
  password hidden (also while typing); one click opens the eyes and
  shows the password; another click closes them. The only state is
  input.type, so the icon, aria-pressed and aria-label can never
  disagree with what the field is really doing. The button is
  type="button" so it never submits the form.

  The caller owns the layout: put the input and the button inside a
  position: relative wrapper (the button is absolutely placed in its
  right edge). auth-modal.js is the first caller. Call
  resetPasswordToggle() when the form closes or switches mode so a
  password is never left visible.

  BLOCKS DEFINITIONS:
  ① RENDERING      — renderPasswordToggle() returns the button HTML
                     (starts hidden, eyes closed).
  ② STATE          — setVisible() is the single function that changes
                     type, ARIA and icon together; resetPasswordToggle()
                     forces hidden.
  ③ INITIALIZATION — initPasswordToggle(input, button) wires the click.

  CLASS NAME GLOSSARY:
  .password-toggle   The round 40px button holding the monkey icon.
  State is the aria-pressed attribute (not a class), styled in
  password-toggle.css.
*/
