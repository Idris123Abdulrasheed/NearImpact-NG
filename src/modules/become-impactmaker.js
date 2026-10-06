import "./styles/become-impactmaker.css";
import { SDG_TITLES } from "./data/sdg-titles.js";
import { CONTACT } from "./data/footer-config.js";
import { escapeHtml } from "./ui/escape-html.js";
import { getCurrentUser, requireAuth, subscribe } from "./auth.js";
// The "Become an impactmaker" application form. DEVELOPERS NOTE at the
// bottom explains the login gate and the review step.

// ① CONFIG:
const CONTRIBUTION_SLOTS = [1, 2, 3];
const NEXT_YEAR = new Date().getFullYear() + 1;

// ② RENDERING — PIECES:
function renderSdgOptions() {
  return SDG_TITLES.map((title, i) => `<option value="${i + 1}">${i + 1}. ${escapeHtml(title)}</option>`).join("");
}

function renderContributionGroup(n) {
  return `
    <fieldset class="become-impactmaker__group">
      <legend>Contribution ${n} <em>(optional)</em></legend>

      <div class="become-impactmaker__row become-impactmaker__row--year">
        <label class="become-impactmaker__field">
          <span>Year</span>
          <input type="number" name="contribYear${n}" min="2000" max="${NEXT_YEAR}" inputmode="numeric" />
        </label>

        <label class="become-impactmaker__field">
          <span>What did you do?</span>
          <input type="text" name="contribTitle${n}" maxlength="120" placeholder="e.g. Led a school tree-planting drive" />
        </label>
      </div>

      <label class="become-impactmaker__field">
        <span>Result or details</span>
        <textarea name="contribDescription${n}" rows="3" maxlength="300"></textarea>
      </label>
    </fieldset>
  `;
}

// ③ RENDERING — PAGE:
export function renderBecomeImpactmaker() {
  return `
    <main class="become-impactmaker">
      <div class="become-impactmaker__wrap">

        <header class="become-impactmaker__header">
          <h1>Become an impactmaker</h1>
          <p>
            Tell us who you are and the impact you've made. We review every
            application, and once approved your profile appears publicly in
            the impactmakers network. Only share what you're happy to be
            public. You'll be asked to log in when you submit.
          </p>
        </header>

        <div class="become-impactmaker__panel" id="become-impactmaker-panel">
          <form class="become-impactmaker__form" id="become-impactmaker-form">

            <div class="become-impactmaker__row">
              <label class="become-impactmaker__field">
                <span>Full name</span>
                <input type="text" name="fullName" minlength="2" maxlength="100" required autocomplete="name" />
              </label>

              <label class="become-impactmaker__field">
                <span>Main SDG focus</span>
                <select name="sdg" required>
                  <option value="">Choose a goal</option>
                  ${renderSdgOptions()}
                </select>
              </label>
            </div>

            <div class="become-impactmaker__row">
              <label class="become-impactmaker__field">
                <span>Role <em>(optional)</em></span>
                <input type="text" name="role" maxlength="100" placeholder="e.g. Project coordinator" />
              </label>

              <label class="become-impactmaker__field">
                <span>Organisation <em>(optional)</em></span>
                <input type="text" name="organisation" maxlength="150" autocomplete="organization" />
              </label>
            </div>

            <div class="become-impactmaker__row">
              <label class="become-impactmaker__field">
                <span>Location <em>(optional)</em></span>
                <input type="text" name="location" maxlength="100" placeholder="e.g. Akure, Ondo" />
              </label>

              <label class="become-impactmaker__field">
                <span>Impactmaker since <em>(optional)</em></span>
                <input type="number" name="since" min="2000" max="${NEXT_YEAR - 1}" inputmode="numeric" placeholder="Year" />
              </label>
            </div>

            <label class="become-impactmaker__field">
              <span>About you <em>(optional)</em></span>
              <textarea name="bio" rows="4" maxlength="600"
                placeholder="Two or three sentences about you and your work."></textarea>
            </label>

            <div class="become-impactmaker__row become-impactmaker__row--three">
              <label class="become-impactmaker__field">
                <span>Projects <em>(optional)</em></span>
                <input type="number" name="statProjects" min="0" max="1000000" inputmode="numeric" />
              </label>

              <label class="become-impactmaker__field">
                <span>Impact hours <em>(optional)</em></span>
                <input type="number" name="statHours" min="0" max="1000000" inputmode="numeric" />
              </label>

              <label class="become-impactmaker__field">
                <span>Communities reached <em>(optional)</em></span>
                <input type="number" name="statCommunities" min="0" max="1000000" inputmode="numeric" />
              </label>
            </div>

            ${CONTRIBUTION_SLOTS.map(renderContributionGroup).join("")}

            <label class="become-impactmaker__field">
              <span>Skills and interests <em>(optional, separate with commas)</em></span>
              <input type="text" name="skills" maxlength="250" placeholder="Community organising, Public speaking" />
            </label>

            <div class="become-impactmaker__row">
              <label class="become-impactmaker__field">
                <span>LinkedIn <em>(optional)</em></span>
                <input type="url" name="linkedin" maxlength="255" placeholder="https://" />
              </label>

              <label class="become-impactmaker__field">
                <span>Website <em>(optional)</em></span>
                <input type="url" name="website" maxlength="255" placeholder="https://" />
              </label>
            </div>

            <label class="become-impactmaker__consent">
              <input type="checkbox" name="consent" required />
              <span>
                I agree that the details above can be shown publicly on NearImpact
                once approved, and I accept the <a href="/terms.html">Terms of Use</a>
                and <a href="/privacy.html">Privacy Policy</a>.
              </span>
            </label>

            <p class="become-impactmaker__error" id="become-impactmaker-error" role="alert" tabindex="-1" hidden></p>

            <button type="submit" class="become-impactmaker__submit" id="become-impactmaker-submit">
              Submit application
            </button>
          </form>
        </div>

      </div>
    </main>
  `;
}

// ④ INITIALIZATION:
export function initBecomeImpactmaker() {
  const form = document.getElementById("become-impactmaker-form");
  if (!form) return;

  const panel = document.getElementById("become-impactmaker-panel");
  const errorEl = document.getElementById("become-impactmaker-error");
  const submitBtn = document.getElementById("become-impactmaker-submit");

  // prefill the name from the logged-in account, never overwrite typing
  function prefillName() {
    const user = getCurrentUser();
    if (user && !form.fullName.value) form.fullName.value = user.name;
  }
  prefillName();
  subscribe(prefillName);

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
      fullName: value("fullName"),
      sdg: value("sdg"),
      role: value("role"),
      organisation: value("organisation"),
      location: value("location"),
      since: value("since"),
      bio: value("bio"),
      stats: {
        projects: value("statProjects"),
        hours: value("statHours"),
        communities: value("statCommunities"),
      },
      contributions: CONTRIBUTION_SLOTS.map((n) => ({
        year: value(`contribYear${n}`),
        title: value(`contribTitle${n}`),
        description: value(`contribDescription${n}`),
      })).filter((c) => c.year || c.title || c.description),
      skills: value("skills")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      linkedin: value("linkedin"),
      website: value("website"),
      consent: form.elements.consent.checked,
    };
  }

  function showDone(message) {
    panel.innerHTML = `
      <div class="become-impactmaker__done" role="status">
        <h2>Application received</h2>
        <p>${escapeHtml(message)}</p>
        <p>
          To add a photo to your profile, email it to
          <a href="mailto:${escapeHtml(CONTACT.email)}">${escapeHtml(CONTACT.email)}</a>
          with your full name.
        </p>
        <div class="become-impactmaker__done-actions">
          <a href="/impactmakers.html" class="become-impactmaker__done-btn">See the network</a>
          <a href="/" class="become-impactmaker__done-btn become-impactmaker__done-btn--ghost">Back to home</a>
        </div>
      </div>
    `;
  }

  async function send(payload) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting…";

    try {
      const res = await fetch("/api/impactmakers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 401) throw new Error("Please log in to submit your application.");
      if (!res.ok) throw new Error(data.error || "Could not submit your application. Try again.");

      showDone(data.message || "Thanks! We'll review your application soon.");
    } catch (err) {
      showError(err.message || "Something went wrong. Try again.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit application";
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    hideError();

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
  How a new person joins the impactmakers network. Same shape as
  list-project.js: anyone can fill the form in, submitting goes
  through auth.js's requireAuth(), and the answers captured before
  login are sent automatically after sign-in. The server enforces the
  login again (POST /api/impactmakers returns 401 without a session).

  REVIEW STEP: submissions are saved with status "pending" and are
  invisible until a person approves them (for now: set status to
  "approved" in TablePlus). One application per account is allowed.

  PHOTOS: there is no upload system yet. Photos are files in
  public/impactmakers/<slug>.jpg that you add by hand after approving
  someone, then redeploy. The success message asks applicants to email
  their photo. A real upload (e.g. object storage) is the next step
  when this stops being a prototype.

  Stats are self-reported and unverified, which is another reason for
  the review step.

  Duplication note: the field styles in become-impactmaker.css match
  list-project.css. With two forms that's cheaper than a shared
  stylesheet; extract one when a third form appears.

  Class names follow BEM where "become-impactmaker" is the block.

  BLOCKS DEFINITIONS:
  ① CONFIG               — how many contribution slots, and the year cap.
  ② RENDERING — PIECES   — SDG dropdown options and one contribution group.
  ③ RENDERING — PAGE     — the header and the full form.
  ④ INITIALIZATION       — name prefill, error display, payload
                           building, the login-gated submit, and the
                           success panel.

  CLASS NAME GLOSSARY:
  .become-impactmaker            The <main> element.
  .become-impactmaker__wrap      Reading-width wrapper.
  .become-impactmaker__header    Title + intro.
  .become-impactmaker__panel     The bordered box holding the form (or
                                 the success message afterwards).
  .become-impactmaker__form      The form.
  .become-impactmaker__row       Fields side by side on wide screens.
  .become-impactmaker__row--three  Modifier — three columns (the stats).
  .become-impactmaker__row--year   Modifier — narrow year + wide title.
  .become-impactmaker__field     One labelled input/select/textarea.
  .become-impactmaker__group     Bordered fieldset around one contribution.
  .become-impactmaker__consent   The agree checkbox row.
  .become-impactmaker__error     Inline error message, hidden by default.
  .become-impactmaker__submit    The submit button.
  .become-impactmaker__done      Success panel.
  .become-impactmaker__done-actions  Row of buttons in the success panel.
  .become-impactmaker__done-btn      One button there.
  .become-impactmaker__done-btn--ghost  Modifier — outlined version.
*/
