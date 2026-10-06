import "./styles/sdg-detail.css";
import { ALL_GOALS, SDG_SOURCES, getSdgById, goalUrl } from "./data/sdg-data.js";
import { PROJECTS } from "./data/projects.js";
import { getTypeMeta } from "./data/type-meta.js";
import { escapeHtml } from "./ui/escape-html.js";
// One page template for every goal (sdg.html?n=1..18). Goals 1-17 share a
// layout, goal 18 gets the "what can I do" layout. See DEVELOPERS NOTE.

// ① SMALL HELPERS:
const list = (items, cls) =>
  `<ul class="${cls}">${items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`;

function cardGrid(items, cls) {
  return `
    <div class="${cls}">
      ${items.map((i) => `<article><h3>${escapeHtml(i.title)}</h3><p>${escapeHtml(i.text)}</p></article>`).join("")}
    </div>`;
}

// ② RENDERING — SHARED PIECES:
function bannerHtml(goal, headline) {
  return `
    <header class="sdg-detail__banner" style="--sdg-color:${goal.color};--sdg-ink:${goal.ink}">
      <div class="sdg-detail__banner-text">
        <span class="sdg-detail__banner-number" aria-hidden="true">${goal.id}</span>
        <p class="sdg-detail__banner-label">${goal.id === 18 ? "Global Goals" : `Goal ${goal.id}`}</p>
        <h1>${escapeHtml(goal.name)}</h1>
        <p class="sdg-detail__banner-line">${escapeHtml(headline)}</p>
      </div>
      <img class="sdg-detail__banner-tile" src="/sdgs/sdg${goal.id}.png" alt="SDG ${goal.id} - ${escapeHtml(goal.name)}">
    </header>`;
}

function crumbsHtml(goal) {
  return `
    <nav class="sdg-detail__crumbs" aria-label="Breadcrumb">
      <a href="/">Home</a> <span aria-hidden="true">/</span>
      <a href="/sdgs.html">Global Goals</a> <span aria-hidden="true">/</span>
      <span>${goal.id === 18 ? "What can I do?" : `Goal ${goal.id}`}</span>
    </nav>`;
}

function pagerHtml(goal) {
  const i = ALL_GOALS.findIndex((g) => g.id === goal.id);
  const prev = ALL_GOALS[(i - 1 + ALL_GOALS.length) % ALL_GOALS.length];
  const next = ALL_GOALS[(i + 1) % ALL_GOALS.length];
  return `
    <nav class="sdg-detail__pager" aria-label="Other goals">
      <a href="${goalUrl(prev.id)}"><span>Previous</span><strong>${escapeHtml(prev.name)}</strong></a>
      <a href="/sdgs.html" class="sdg-detail__pager-all">All goals</a>
      <a href="${goalUrl(next.id)}"><span>Next</span><strong>${escapeHtml(next.name)}</strong></a>
    </nav>`;
}

function sourcesHtml() {
  return `
    <footer class="sdg-detail__sources">
      <h2>Sources and further reading</h2>
      <ul>${SDG_SOURCES.map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${escapeHtml(s.label)}</a></li>`).join("")}</ul>
      <p>Some figures come from the 2017 Youth4GG guide and the UNDP booklet and may be out of date. Check the UN for the latest numbers.</p>
    </footer>`;
}

// ③ RENDERING — PROJECTS (mock data for now):
function projectsHtml(goal) {
  const matches = PROJECTS.filter((p) => Array.isArray(p.sdgs) && p.sdgs.includes(goal.id));
  if (matches.length === 0) {
    return `<p class="sdg-detail__empty">No NearImpact projects are tagged with this goal yet. <a href="/list-project.html">List one</a>.</p>`;
  }
  return `
    <div class="sdg-detail__links">
      ${matches
        .map(
          (p) => `
        <a class="sdg-detail__link-card" href="/#discover">
          <span class="sdg-detail__badge">${escapeHtml(getTypeMeta(p.types[0]).label)}</span>
          <strong>${escapeHtml(p.name)}</strong>
          <span>${escapeHtml(p.orgName)} · ${escapeHtml(p.lga)}, ${escapeHtml(p.state)}</span>
        </a>`
        )
        .join("")}
    </div>`;
}

// ④ RENDERING — GOALS 1-17:
function renderGoal(goal) {
  return `
    <main class="sdg-detail" style="--sdg-color:${goal.color};--sdg-ink:${goal.ink}">
      ${crumbsHtml(goal)}
      ${bannerHtml(goal, goal.tagline)}

      <section class="sdg-detail__section sdg-detail__intro">
        <h2>Why this matters</h2>
        <p>${escapeHtml(goal.intro)}</p>
        <blockquote class="sdg-detail__official">
          <span>Official UN goal</span>
          ${escapeHtml(goal.official)}
        </blockquote>
      </section>

      <section class="sdg-detail__section">
        <h2>What is it about?</h2>
        ${list(goal.about, "sdg-detail__targets")}
        <a class="sdg-detail__more" href="https://sdgs.un.org/goals/goal${goal.id}" target="_blank" rel="noopener">See every official target on the UN site</a>
      </section>

      <section class="sdg-detail__section">
        <h2>Did you know?</h2>
        <div class="sdg-detail__facts">
          ${goal.facts
            .map((f) => `<figure><blockquote>${escapeHtml(f.text)}</blockquote><figcaption>${escapeHtml(f.source)}</figcaption></figure>`)
            .join("")}
        </div>
      </section>

      <section class="sdg-detail__section">
        <h2>How can you start?</h2>
        <ol class="sdg-detail__actions">
          ${goal.actions
            .map((a) => `<li><h3>${escapeHtml(a.title)}</h3><p>${escapeHtml(a.text)}</p></li>`)
            .join("")}
        </ol>
      </section>

      <section class="sdg-detail__section">
        <h2>Projects linked to this goal</h2>
        ${projectsHtml(goal)}
      </section>

      <section class="sdg-detail__section">
        <h2>Opportunities linked to this goal</h2>
        <div id="sdg-opportunities" class="sdg-detail__links" aria-live="polite">
          <p class="sdg-detail__empty">Loading opportunities…</p>
        </div>
        <a class="sdg-detail__more" href="/all-opportunities.html?sdg=${goal.id}">See all opportunities for Goal ${goal.id}</a>
      </section>

      ${pagerHtml(goal)}
      ${sourcesHtml()}
    </main>`;
}

// ⑤ RENDERING — GOAL 18:
function renderWayForward(goal) {
  return `
    <main class="sdg-detail" style="--sdg-color:${goal.color};--sdg-ink:${goal.ink}">
      ${crumbsHtml(goal)}
      ${bannerHtml(goal, goal.tagline)}

      <section class="sdg-detail__section sdg-detail__intro">
        <h2>The story so far</h2>
        <p>${escapeHtml(goal.intro)}</p>
        ${cardGrid(goal.threeThings, "sdg-detail__cards sdg-detail__cards--three")}
      </section>

      <section class="sdg-detail__section">
        <h2>Start small, then grow</h2>
        ${cardGrid(goal.levels, "sdg-detail__cards sdg-detail__cards--three")}
      </section>

      <section class="sdg-detail__section">
        <h2>Ways to help right now</h2>
        ${cardGrid(goal.waysToHelp, "sdg-detail__cards")}
      </section>

      <section class="sdg-detail__section">
        <h2>If you lead a team or organisation</h2>
        ${cardGrid(goal.organisations, "sdg-detail__cards sdg-detail__cards--three")}
      </section>

      <section class="sdg-detail__section">
        <h2>Do it with NearImpact</h2>
        <div class="sdg-detail__links">
          <a class="sdg-detail__link-card" href="/#discover"><strong>Find projects near you</strong><span>Volunteer, learn or collaborate locally.</span></a>
          <a class="sdg-detail__link-card" href="/all-opportunities.html"><strong>Browse opportunities</strong><span>Fellowships, grants, internships and jobs.</span></a>
          <a class="sdg-detail__link-card" href="/list-project.html"><strong>List your project</strong><span>Let others join, support or learn from it.</span></a>
          <a class="sdg-detail__link-card" href="/#community"><strong>Meet the impactmakers</strong><span>Connect with people building change.</span></a>
        </div>
      </section>

      ${pagerHtml(goal)}
      ${sourcesHtml()}
    </main>`;
}

// ⑥ PUBLIC RENDER:
export function renderSdgDetail(goal) {
  if (!goal) {
    return `
      <main class="sdg-detail">
        <section class="sdg-detail__section">
          <h1>We could not find that goal</h1>
          <p>Pick one of the Global Goals instead.</p>
          <a class="sdg-detail__more" href="/sdgs.html">See all goals</a>
        </section>
      </main>`;
  }
  return goal.id === 18 ? renderWayForward(goal) : renderGoal(goal);
}

// ⑦ OPPORTUNITIES (loaded from the API):
async function loadOpportunities(goal) {
  const box = document.getElementById("sdg-opportunities");
  if (!box) return;
  try {
    const res = await fetch(`/api/opportunities?sdg=${encodeURIComponent(goal.id)}`);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    const data = await res.json();
    const rows = (Array.isArray(data) ? data : data.opportunities || data.items || []).slice(0, 6);
    if (rows.length === 0) {
      box.innerHTML = `<p class="sdg-detail__empty">No open opportunities for this goal right now. Check back soon.</p>`;
      return;
    }
    box.innerHTML = rows
      .map(
        (o) => `
        <a class="sdg-detail__link-card" href="/detail.html?type=opportunity&id=${encodeURIComponent(o.id)}">
          <span class="sdg-detail__badge">${escapeHtml(o.type || "Opportunity")}</span>
          <strong>${escapeHtml(o.title)}</strong>
          <span>${escapeHtml(o.location || "")}</span>
        </a>`
      )
      .join("");
  } catch (err) {
    console.error("SDG opportunities failed:", err);
    box.innerHTML = `<p class="sdg-detail__empty">Could not load opportunities. Try again later.</p>`;
  }
}

// ⑧ INITIALIZATION:
export function initSdgDetail(goal) {
  if (!goal || goal.id === 18) return;
  loadOpportunities(getSdgById(goal.id));
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  A single template drives all 18 goal pages; only data/sdg-data.js
  differs per goal. Goals 1-17 share renderGoal(); goal 18 ("what can I
  do") has its own renderWayForward() because its content is a different
  shape, not a different colour.

  Projects come from the mock PROJECTS array (filtered by sdgs). Opportunities
  come from GET /api/opportunities?sdg=N, which the all-opportunities
  page already uses. loadOpportunities() accepts a bare array or an object
  holding opportunities/items, and reads id, title, type, location from
  each row. If your API returns different keys, change only that function.

  Anything from data files or the API goes through escapeHtml().
  Colours: each goal's official colour is injected as --sdg-color
  (data, not a token); every other colour in the CSS is a token.

  BLOCKS DEFINITIONS:
  ① SMALL HELPERS        — list() and cardGrid() markup builders.
  ② SHARED PIECES        — banner, breadcrumb, prev/next pager, sources.
  ③ PROJECTS             — matching mock projects as link cards.
  ④ GOALS 1-17           — renderGoal().
  ⑤ GOAL 18              — renderWayForward().
  ⑥ PUBLIC RENDER        — renderSdgDetail(), with a not-found fallback.
  ⑦ OPPORTUNITIES        — loadOpportunities() fetch and render.
  ⑧ INITIALIZATION       — initSdgDetail() starts the fetch.

  CLASS NAME GLOSSARY:
  .sdg-detail                 The page body.
  .sdg-detail__crumbs         Breadcrumb row.
  .sdg-detail__banner         Horizontal coloured hero.
  .sdg-detail__banner-text    Left side of the banner.
  .sdg-detail__banner-number  Oversized goal number.
  .sdg-detail__banner-label   "Goal N" label.
  .sdg-detail__banner-line    Short tagline.
  .sdg-detail__banner-tile    Official goal image on the right.
  .sdg-detail__section        One content block.
  .sdg-detail__intro          Modifier: first block.
  .sdg-detail__official       Quote of the official UN wording.
  .sdg-detail__targets        Bullet list of what the goal covers.
  .sdg-detail__facts          Grid of fact cards.
  .sdg-detail__actions        Numbered action cards.
  .sdg-detail__cards          Grid of title and text cards (goal 18).
  .sdg-detail__cards--three   Modifier: three columns on wide screens.
  .sdg-detail__links          Grid of link cards.
  .sdg-detail__link-card      One project or opportunity card.
  .sdg-detail__badge          Small type label on a link card.
  .sdg-detail__empty          Empty, loading and error messages.
  .sdg-detail__more           Text link under a section.
  .sdg-detail__pager          Previous, all, next navigation.
  .sdg-detail__sources        Sources footer.
*/
