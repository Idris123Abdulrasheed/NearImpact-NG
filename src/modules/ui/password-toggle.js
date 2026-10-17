import "../styles/password-toggle.css";
// Show/hide button for any password input.
// DEVELOPERS NOTE at the bottom.

// ① RENDERING:
// Emoji on purpose here (everywhere else uses SVG from icons.js): the
// see-no-evil monkey IS the design. 👁️ = hidden, tap to show. 🙈 = shown, tap to hide.
function emojiIcon(visible) {
  return `<span class="password-toggle__emoji" aria-hidden="true">${visible ? "🙈" : "👁️"}</span>`;
}

// Starts disabled: there is nothing to reveal until something is typed.
export function renderPasswordToggle() {
  return `
    <button type="button" class="password-toggle" aria-pressed="false" aria-label="Show password" disabled>
      ${emojiIcon(false)}
    </button>
  `;
}

// ② STATE:
function setVisible(input, button, visible) {
  input.type = visible ? "text" : "password";
  button.setAttribute("aria-pressed", String(visible));
  button.setAttribute("aria-label", visible ? "Hide password" : "Show password");
  button.innerHTML = emojiIcon(visible);
}

// Clickable only while the field has text. If it gets emptied while the
// password is showing, hide it again so a blank field never sits in "shown" mode.
function syncAvailability(input, button) {
  const hasText = input.value.length > 0;
  button.disabled = !hasText;
  if (!hasText && input.type !== "password") setVisible(input, button, false);
}

export function resetPasswordToggle(input, button) {
  if (!input || !button) return;
  setVisible(input, button, false);
  syncAvailability(input, button);
}

// ③ INITIALIZATION:
export function initPasswordToggle(input, button) {
  if (!input || !button) return;

  syncAvailability(input, button);
  ["input", "change"].forEach((type) => {
    input.addEventListener(type, () => syncAvailability(input, button));
  });
  // form.reset() clears the value without firing "input"
  input.form?.addEventListener("reset", () => setTimeout(() => syncAvailability(input, button)));

  button.addEventListener("click", () => {
    if (button.disabled) return;
    setVisible(input, button, input.type === "password");
  });
}




/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
 Deliberately dumb: the button does not watch typing. Open eye = password
hidden (also while typing), tap to show; one click reveals the password
and the icon becomes the monkey with its eyes closed, tap to hide; another
click goes back to the open eye.

The button is disabled while the field is empty (syncAvailability), and
emptying the field while the password is showing hides it again.

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
