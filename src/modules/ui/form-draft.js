// Remembers what someone typed in a form while they pop over to /login.
// DEVELOPERS NOTE at the bottom.

// ① CONFIG:
const PREFIX = "ni:draft:";
const SKIPPED_TYPES = ["password", "file", "submit", "button", "reset", "hidden"];

// ② SAVE:
export function saveDraft(form, key) {
  const draft = {};

  [...form.elements].forEach((el) => {
    if (!el.name || SKIPPED_TYPES.includes(el.type)) return;

    if (el.type === "checkbox" || el.type === "radio") {
      draft[el.name] = draft[el.name] || [];
      if (el.checked) draft[el.name].push(el.value);
    } else {
      draft[el.name] = el.value;
    }
  });

  try {
    sessionStorage.setItem(PREFIX + key, JSON.stringify(draft));
  } catch {
    // private browsing can refuse storage: the form just won't be refilled
  }
}

// ③ RESTORE:
// Reads the draft once and deletes it, so an old draft can never refill
// a form days later. Call it AFTER the form's own listeners are wired,
// because it fires change events (the SDG cap listens for those).
export function restoreDraft(form, key) {
  let draft;
  try {
    draft = JSON.parse(sessionStorage.getItem(PREFIX + key) || "null");
    sessionStorage.removeItem(PREFIX + key);
  } catch {
    return;
  }
  if (!draft) return;

  [...form.elements].forEach((el) => {
    if (!el.name || !(el.name in draft) || SKIPPED_TYPES.includes(el.type)) return;

    if (el.type === "checkbox" || el.type === "radio") {
      el.checked = draft[el.name].includes(el.value);
    } else {
      el.value = draft[el.name];
    }
    el.dispatchEvent(new Event("change", { bubbles: true }));
  });
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  Sign in now lives on its own page, so a logged-out visitor who
  submits the list-project or become-impactmaker form leaves the page
  and loses everything they typed. This helper stops that: just before
  they are sent to /login the form's values are saved to sessionStorage,
  and when they land back on the form the values are put back (they
  press submit again).

  sessionStorage, not localStorage, on purpose: a draft belongs to this
  browser tab and disappears when it closes. Passwords and files are
  never saved. Every storage call is in try/catch because browsers can
  refuse storage; if so the only effect is an empty form.

  BLOCKS DEFINITIONS:
  ① CONFIG   — the storage key prefix and field types never saved.
  ② SAVE     — saveDraft(form, key): one entry per named field;
               checkboxes are saved as the list of ticked values.
  ③ RESTORE  — restoreDraft(form, key): refills once, then deletes the
               draft.
*/
