import "./styles/impactmaker-profile.css";
import { FALLBACK_PHOTO } from "./data/impactmakers.js";
import { escapeHtml } from "./ui/escape-html.js";
// One impactmaker's profile page. Every section except the header is
// optional and appears only when the record has data for it.
// DEVELOPERS NOTE at the bottom.

// ① CONFIG:
const STAT_LABELS = [
  { key: "projects", label: "Projects" },
  { key: "hours", label: "Impact hours" },
  { key: "communities", label: "Communities reached" },
];

// ② RENDERING — SECTIONS:
function renderStats(stats = {}) {
  const shown = STAT_LABELS.filter(({ key }) => typeof stats[key] === "number");
  if (shown.length === 0) return "";

  return `
    <dl class="maker-profile__stats">
      ${shown
        .map(
          ({ key, label }) => `
          <div class="maker-profile__stat">
            <dt>${label}</dt>
            <dd>${stats[key].toLocaleString("en-NG")}</dd>
          </div>`
        )
        .join("")}
    </dl>
  `;
}

function renderContributions(contributions = []) {
  if (contributions.length === 0) {
    return `<p class="maker-profile__empty">Contributions will appear here soon.</p>`;
  }

  return `
    <ol class="maker-profile__timeline">
      ${contributions
        .map(
          (c) => `
          <li class="maker-profile__item">
            <span class="maker-profile__year">${escapeHtml(c.year ?? "")}</span>
            <div>
              <h3>${escapeHtml(c.title)}</h3>
              ${c.description ? `<p>${escapeHtml(c.description)}</p>` : ""}
            </div>
          </li>`
        )
        .join("")}
    </ol>
  `;
}

function renderSkills(skills = []) {
  if (skills.length === 0) return "";
  return `
    <section class="maker-profile__section">
      <h2>Skills and interests</h2>
      <ul class="maker-profile__chips">
        ${skills.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}
      </ul>
    </section>
  `;
}

function renderLinks(links = []) {
  // defence in depth: only ever link to https addresses
  const safe = links.filter((l) => typeof l.href === "string" && l.href.startsWith("https://"));
  if (safe.length === 0) return "";
  return `
    <section class="maker-profile__section">
      <h2>Find them online</h2>
      <ul class="maker-profile__links">
        ${safe
          .map(
            (l) =>
              `<li><a href="${escapeHtml(l.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.label)}</a></li>`
          )
          .join("")}
      </ul>
    </section>
  `;
}

// ③ RENDERING — PAGE:
export function renderImpactmakerProfile(maker) {
  const meta = [maker.role, maker.organisation, maker.location, maker.since ? `Impactmaker since ${maker.since}` : ""]
    .filter(Boolean)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  const bio = maker.bio || `${maker.name} is working on ${maker.sdg} through NearImpact.`;

  return `
    <main class="maker-profile">
      <div class="maker-profile__wrap">

        <a class="maker-profile__back" href="/impactmakers.html">&larr; All impactmakers</a>

        <header class="maker-profile__hero">
          <div class="maker-profile__photo">
            <img
              src="/impactmakers/${encodeURIComponent(maker.slug)}.jpg"
              alt="${escapeHtml(maker.name)}"
              onerror="this.onerror=null; this.src='${FALLBACK_PHOTO}';"
            />
          </div>

          <div class="maker-profile__intro">
            <p class="maker-profile__sdg">${escapeHtml(maker.sdg)}</p>
            <h1>${escapeHtml(maker.name)}</h1>
            ${meta ? `<ul class="maker-profile__meta">${meta}</ul>` : ""}
            <p class="maker-profile__bio">${escapeHtml(bio)}</p>
          </div>
        </header>

        ${renderStats(maker.stats)}

        <section class="maker-profile__section">
          <h2>Impact and contributions</h2>
          ${renderContributions(maker.contributions)}
        </section>

        ${renderSkills(maker.skills)}
        ${renderLinks(maker.links)}

      </div>
    </main>
  `;
}

// ④ RENDERING — NOTICES:
// Loading, not-found and error views. All are a <main class="maker-profile">
// so the page entry can swap one for another by replacing that element.
function renderNotice(content) {
  return `
    <main class="maker-profile">
      <div class="maker-profile__wrap maker-profile__wrap--narrow">${content}</div>
    </main>
  `;
}

export function renderProfileLoading() {
  return renderNotice(`<p class="maker-profile__empty" role="status">Loading profile…</p>`);
}

export function renderProfileNotFound() {
  return renderNotice(`
    <h1>Impactmaker not found</h1>
    <p class="maker-profile__bio">
      We couldn't find that profile. It may have moved, or the link may be incomplete.
    </p>
    <a class="maker-profile__back" href="/impactmakers.html">&larr; See all impactmakers</a>
  `);
}

export function renderProfileError() {
  return renderNotice(`
    <h1>Couldn't load this profile</h1>
    <p class="maker-profile__bio">Something went wrong on our side. Please try again in a moment.</p>
    <a class="maker-profile__back" href="/impactmakers.html">&larr; See all impactmakers</a>
  `);
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  One profile layout for every impactmaker. There are no per-person
  files: impactmaker.html?slug=<slug> loads src/pages/impactmaker.js,
  which fetches that person from the API and hands the record to
  renderImpactmakerProfile(). Adding a person means an approved
  database row, never a page.

  SLOTS: the header always renders (photo, SDG, name, bio). Stats,
  skills and links render only when the record has them. The
  contributions section always shows, with a "coming soon" line while
  empty. A missing bio falls back to a plain sentence built from the
  name and SDG, so nothing invents facts about a person.

  SECURITY: profile text is typed in by visitors, so EVERY value goes
  through escapeHtml() before it enters a template, and links are only
  rendered when they start with https://. The URL's slug is only used
  to look a record up, never printed.

  Class names follow BEM where "maker-profile" is the block.

  BLOCKS DEFINITIONS:
  ① CONFIG               — which stats exist and how they're labelled.
  ② RENDERING — SECTIONS — stats row, contributions timeline, skills
                           chips, links list.
  ③ RENDERING — PAGE     — the full profile.
  ④ RENDERING — NOTICES  — loading, not-found and error views.

  CLASS NAME GLOSSARY:
  .maker-profile               The <main> element.
  .maker-profile__wrap         Width-constrained wrapper.
  .maker-profile__wrap--narrow Modifier — used by the notice views.
  .maker-profile__back         The "back to all impactmakers" link.
  .maker-profile__hero         Photo + intro, side by side on wide screens.
  .maker-profile__photo        Photo frame.
  .maker-profile__intro        SDG label, name, meta line, bio.
  .maker-profile__sdg          The SDG focus label.
  .maker-profile__meta         Role / organisation / location / joined line.
  .maker-profile__bio          The bio paragraph.
  .maker-profile__stats        Row of numbers (projects, hours, ...).
  .maker-profile__stat         One number + label.
  .maker-profile__section      A titled block below the hero.
  .maker-profile__empty        "Coming soon" / loading line.
  .maker-profile__timeline     Ordered list of contributions.
  .maker-profile__item         One contribution.
  .maker-profile__year         The year beside a contribution.
  .maker-profile__chips        Skills as small pills.
  .maker-profile__links        List of outside links.
*/
