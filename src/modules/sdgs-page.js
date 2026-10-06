import "./styles/sdgs-page.css";
import { ALL_GOALS, SDGS, goalUrl } from "./data/sdg-data.js";
import { PROJECTS } from "./data/projects.js";
import { escapeHtml } from "./ui/escape-html.js";
// The full "Global Goals" page: a designed grid of every goal. See the
// DEVELOPERS NOTE at the bottom.

// ① HELPERS:
function projectCount(goalId) {
  return PROJECTS.filter((p) => Array.isArray(p.sdgs) && p.sdgs.includes(goalId)).length;
}

// ② RENDERING:
function tileHtml(goal) {
  const isLast = goal.id === 18;
  const count = projectCount(goal.id);
  const meta = isLast
    ? "What can I do?"
    : count > 0
      ? `${count} project${count === 1 ? "" : "s"} on NearImpact`
      : "Opportunities and facts";
  return `
    <a class="sdgs-page__tile${isLast ? " sdgs-page__tile--wide" : ""}" href="${goalUrl(goal.id)}"
       style="--sdg-color:${goal.color}">
      <img class="sdgs-page__tile-image" src="/sdgs/sdg${goal.id}.png" alt="SDG ${goal.id} - ${escapeHtml(goal.name)}" loading="lazy">
      <span class="sdgs-page__tile-body">
        <strong>${escapeHtml(goal.tagline)}</strong>
        <span>${escapeHtml(meta)}</span>
      </span>
    </a>
  `;
}

export function renderSdgsPage() {
  return `
    <main class="sdgs-page">
      <nav class="sdgs-page__crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a> <span aria-hidden="true">/</span> <span>Global Goals</span>
      </nav>

      <header class="sdgs-page__hero">
        <p class="sdgs-page__eyebrow">United Nations 2030 Agenda</p>
        <h1>The ${SDGS.length} Global Goals</h1>
        <p class="sdgs-page__lead">
          In 2015, leaders from 193 countries agreed on 17 goals to achieve three extraordinary things by 2030:
          end extreme poverty, fight inequality and injustice, and tackle climate change. Pick a goal to explore
          the facts, what you can do, and the projects and opportunities on NearImpact that support it.
        </p>
        <ul class="sdgs-page__stats">
          <li><strong>193</strong><span>countries agreed</span></li>
          <li><strong>17</strong><span>goals</span></li>
          <li><strong>169</strong><span>targets</span></li>
          <li><strong>2030</strong><span>deadline</span></li>
        </ul>
      </header>

      <section class="sdgs-page__grid" aria-label="All Global Goals">
        ${ALL_GOALS.map(tileHtml).join("")}
      </section>

      <section class="sdgs-page__note">
        <h2>Where does the world stand?</h2>
        <p>
          The UN's 2025 progress report found that only 35% of targets with data are on track or moving at a moderate
          pace, while 18% have gone backwards. The Goals are still within reach, but they need local action. That is
          what NearImpact is for.
        </p>
        <a class="sdgs-page__cta" href="/all-opportunities.html">Browse opportunities</a>
      </section>
    </main>
  `;
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The destination of the homepage "View more" link (/sdgs.html). Pure
  render, no init: tiles are plain links, so there is nothing to wire.
  Project counts come from the same mock PROJECTS array the homepage
  uses; when projects move to the database, swap projectCount() for an
  API call (that is the only place that needs to change).

  Every goal colour is passed in as an inline --sdg-color custom
  property so one CSS rule styles all tiles; see sdgs-page.css.

  BLOCKS DEFINITIONS:
  ① HELPERS    — projectCount() counts projects tagged with a goal.
  ② RENDERING  — tileHtml() builds one tile; renderSdgsPage() builds
                 breadcrumb, hero, stats, grid and the closing note.

  CLASS NAME GLOSSARY:
  .sdgs-page                The whole page body.
  .sdgs-page__crumbs        Breadcrumb row.
  .sdgs-page__hero          Intro block (eyebrow, h1, lead, stats).
  .sdgs-page__eyebrow       Small mono label above the title.
  .sdgs-page__lead          Intro paragraph.
  .sdgs-page__stats         Row of four headline numbers.
  .sdgs-page__grid          Grid of goal tiles.
  .sdgs-page__tile          One goal tile (link).
  .sdgs-page__tile--wide    Modifier: the goal 18 tile spans the row.
  .sdgs-page__tile-image    The official goal image.
  .sdgs-page__tile-body     Caption under the image.
  .sdgs-page__note          Closing progress note + call to action.
  .sdgs-page__cta           The button-style link in that note.
*/
