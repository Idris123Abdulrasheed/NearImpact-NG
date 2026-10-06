import "./styles/list-project.css";
import { TYPE_META } from "./data/type-meta.js";
import { STATE_LGAS } from "./data/projects.js";
import { SDG_TITLES } from "./data/sdg-titles.js";
import { getCurrentUser, requireAuth, subscribe } from "./auth.js";
// The "List your project or opportunity" form. DEVELOPERS NOTE at the
// bottom explains the login gate and where submissions go.

// ① CONFIG:
const MAX_SDGS = 3;

// ② RENDERING — PIECES:
function renderTypeOptions() {
  return Object.entries(TYPE_META)
    .map(([key, meta]) => `<option value="${key}">${meta.label}</option>`)
    .join("");
}

function renderSdgChoices() {
  return SDG_TITLES.map(
    (title, i) => `
      <label class="list-project__sdg">
        <input type="checkbox" name="sdgs" value="${i + 1}" />
        <span><strong>${i + 1}</strong> ${title}</span>
      </label>
    `
  ).join("");
}

// ③ RENDERING — PAGE:
export function renderListProject() {
  const stateOptions = Object.keys(STATE_LGAS)
    .map((s) => `<option value="${s}"></option>`)
    .join("");

  return `
    <main class="list-project">
      <div class="list-project__wrap">

        <header class="list-project__header">
          <h1>List your project or opportunity</h1>
          <p>
            Tell us about a project, volunteer role, training, fellowship, grant,
            internship or job. We review every listing before it appears on NearImpact.
            You'll be asked to log in when you submit.
          </p>
        </header>

        <div class="list-project__panel" id="list-project-panel">
          <form class="list-project__form" id="list-project-form">

            <div class="list-project__row">
              <label class="list-project__field">
                <span>What are you listing?</span>
                <select name="type" required>
                  <option value="">Choose a type</option>
                  ${renderTypeOptions()}
                </select>
              </label>

              <label class="list-project__field">
                <span>Organisation or your name</span>
                <input type="text" name="organisation" maxlength="150" required autocomplete="organization" />
              </label>
            </div>

            <label class="list-project__field">
              <span>Title</span>
              <input type="text" name="title" minlength="3" maxlength="150" placeholder="e.g. Community tree planting in Akure" required />
            </label>

            <div class="list-project__row">
              <label class="list-project__field">
                <span>State</span>
                <input type="text" name="state" list="list-project-states" maxlength="50" required />
                <datalist id="list-project-states">${stateOptions}</datalist>
              </label>

              <label class="list-project__field">
                <span>LGA or town <em>(optional)</em></span>
                <input type="text" name="lga" maxlength="100" />
              </label>
            </div>

            <label class="list-project__field">
              <span>Description</span>
              <textarea name="description" rows="6" minlength="20" maxlength="1500" required
                placeholder="What is it, who is it for, and what will people do?"></textarea>
            </label>

            <fieldset class="list-project__sdgs">
              <legend>Which SDGs does it support? <em>Pick up to ${MAX_SDGS}</em></legend>
              <div class="list-project__sdg-grid">${renderSdgChoices()}</div>
              <p class="list-project__hint" id="list-project-sdg-hint" aria-live="polite"></p>
            </fieldset>

            <div class="list-project__row">
              <label class="list-project__field">
                <span>What do participants get? <em>(optional)</em></span>
                <input type="text" name="benefits" maxlength="150" placeholder="e.g. Certificate, stipend, mentorship" />
              </label>

              <label class="list-project__field">
                <span>Closing date <em>(optional)</em></span>
                <input type="date" name="deadline" />
              </label>
            </div>

            <label class="list-project__field">
              <span>Link to apply or learn more <em>(optional)</em></span>
              <input type="url" name="applyUrl" maxlength="255" placeholder="https://" />
            </label>

            <div class="list-project__row">
              <label class="list-project__field">
                <span>Contact email</span>
                <input type="email" name="contactEmail" maxlength="255" required autocomplete="email" />
              </label>

              <label class="list-project__field">
                <span>Contact phone <em>(optional)</em></span>
                <input type="tel" name="contactPhone" maxlength="30" autocomplete="tel" />
              </label>
            </div>

            <label class="list-project__consent">
              <input type="checkbox" name="consent" required />
              <span>
                I confirm these details are accurate and I agree to the
                <a href="/terms.html">Terms of Use</a>.
              </span>
            </label>

            <p class="list-project__error" id="list-project-error" role="alert" tabindex="-1" hidden></p>

            <button type="submit" class="list-project__submit" id="list-project-submit">Submit for review</button>
          </form>
        </div>

      </div>
    </main>
  `;
}

// ④ INITIALIZATION:
export function initListProject() {
  const form = document.getElementById("list-project-form");
  if (!form) return;

  const panel = document.getElementById("list-project-panel");
  const errorEl = document.getElementById("list-project-error");
  const hintEl = document.getElementById("list-project-sdg-hint");
  const submitBtn = document.getElementById("list-project-submit");
  const sdgBoxes = [...form.querySelectorAll('input[name="sdgs"]')];

  // contact email: prefill from the logged-in account, never overwrite typing
  function prefillEmail() {
    const user = getCurrentUser();
    if (user && !form.contactEmail.value) form.contactEmail.value = user.email;
  }
  prefillEmail();
  subscribe(prefillEmail);

  // SDG cap: once 3 are picked, the rest are disabled until one is unticked
  function syncSdgLimit() {
    const checked = sdgBoxes.filter((b) => b.checked).length;
    sdgBoxes.forEach((b) => {
      b.disabled = !b.checked && checked >= MAX_SDGS;
    });
    hintEl.textContent = checked >= MAX_SDGS ? `You've picked ${MAX_SDGS}. Untick one to change.` : "";
  }
  sdgBoxes.forEach((b) => b.addEventListener("change", syncSdgLimit));

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
    errorEl.focus();
  }

  function hideError() {
    errorEl.hidden = true;
  }

  function readPayload() {
    const value = (name) => form.elements[name].value.trim();
    return {
      type: value("type"),
      organisation: value("organisation"),
      title: value("title"),
      state: value("state"),
      lga: value("lga"),
      description: value("description"),
      sdgs: sdgBoxes.filter((b) => b.checked).map((b) => Number(b.value)),
      benefits: value("benefits"),
      deadline: value("deadline"),
      applyUrl: value("applyUrl"),
      contactEmail: value("contactEmail"),
      contactPhone: value("contactPhone"),
    };
  }

  function showDone(message) {
    panel.innerHTML = `
      <div class="list-project__done" role="status">
        <h2>Listing received</h2>
        <p>${message}</p>
        <div class="list-project__done-actions">
          <a href="/list-project.html" class="list-project__done-btn">List another</a>
          <a href="/" class="list-project__done-btn list-project__done-btn--ghost">Back to home</a>
        </div>
      </div>
    `;
  }

  async function send(payload) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting…";

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 401) throw new Error("Please log in to submit your listing.");
      if (!res.ok) throw new Error(data.error || "Could not submit your listing. Try again.");

      showDone(data.message || "Thanks! We'll review your listing soon.");
    } catch (err) {
      showError(err.message || "Something went wrong. Try again.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit for review";
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    hideError();

    if (!sdgBoxes.some((b) => b.checked)) {
      showError("Pick at least one SDG your listing supports.");
      return;
    }

    // Capture the answers NOW; if login is needed, requireAuth() runs
    // send() automatically once the person signs in.
    const payload = readPayload();
    requireAuth(() => send(payload));
  });
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The destination of the CTA's "List Your Project" button. One form
  for projects AND opportunities: the "type" dropdown is built from
  type-meta.js, so it always offers exactly the kinds the rest of the
  site already knows how to display.

  LOGIN GATE: anyone can fill in the form, but submitting goes through
  auth.js's requireAuth(). Logged out, the login modal opens and the
  already-captured answers are sent automatically after sign-in, so
  nothing typed is lost. The server checks the session cookie again
  (POST /api/listings returns 401 without one); the client gate is
  for experience, the server gate is the real one.

  WHERE SUBMISSIONS GO: into the listing_submissions table with
  status "pending". They do NOT appear on the site yet. A person
  reviews them (for now in TablePlus) and approves them. That keeps
  unchecked content off a public site.

  The form uses the browser's own validation (required, maxlength,
  type=email/url), then the server validates everything again.

  The 17 SDG titles come from data/sdg-titles.js, shared with the
  impactmaker form and the profile pages.

  Class names follow BEM where "list-project" is the block.

  BLOCKS DEFINITIONS:
  ① CONFIG               — the SDG cap.
  ② RENDERING — PIECES   — type options and SDG checkboxes.
  ③ RENDERING — PAGE     — the header and the full form.
  ④ INITIALIZATION       — email prefill, SDG cap, validation message
                           display, the login-gated submit, and the
                           success panel.

  CLASS NAME GLOSSARY:
  .list-project                 The <main> element.
  .list-project__wrap           Reading-width wrapper.
  .list-project__header         Title + intro.
  .list-project__panel          The bordered box holding the form (or
                                the success message afterwards).
  .list-project__form           The form.
  .list-project__row            Two fields side by side on wide screens.
  .list-project__field          One labelled input/select/textarea.
  .list-project__sdgs           The SDG fieldset.
  .list-project__sdg-grid       Grid of SDG choices.
  .list-project__sdg            One SDG checkbox + label.
  .list-project__hint           Small helper line under the SDG list.
  .list-project__consent        The confirm-and-agree checkbox row.
  .list-project__error          Inline error message, hidden by default.
  .list-project__submit         The submit button.
  .list-project__done           Success panel.
  .list-project__done-actions   Row of buttons in the success panel.
  .list-project__done-btn       One button there.
  .list-project__done-btn--ghost  Modifier — outlined version.
*/
