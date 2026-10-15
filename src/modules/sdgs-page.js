import "./styles/sdgs-page.css";
import { ALL_GOALS, SDGS, goalUrl } from "./data/sdg-data.js";
import { PROJECTS } from "./data/projects.js";
import { escapeHtml } from "./ui/escape-html.js";
// The full "Global Goals" page: a cover banner, a short intro with four
// headline numbers, then a designed grid of every goal. See the
// DEVELOPERS NOTE at the bottom.

// ① CONFIG:
// Same image ui/loader.js uses. If that path ever changes, change it here too.
const WHEEL_SRC = "/loaders/sdg-loader.png";

const AGENDA_START = 2015;
const AGENDA_END = 2030;

// Official number of targets under each goal (goal 1 first). Adds up to 169.
const TARGETS_PER_GOAL = [7, 8, 13, 10, 9, 8, 5, 12, 8, 10, 10, 11, 5, 10, 12, 12, 19];

// ② HELPERS:
function projectCount(goalId) {
  return PROJECTS.filter((p) => Array.isArray(p.sdgs) && p.sdgs.includes(goalId)).length;
}

// How far through the 2015-2030 agenda we are, computed from today's date
// so the bar and the "years left" text never need a manual update.
function agendaProgress(year = new Date().getFullYear()) {
  const pct = ((year - AGENDA_START) / (AGENDA_END - AGENDA_START)) * 100;
  return {
    percent: Math.round(Math.min(100, Math.max(0, pct))),
    yearsLeft: Math.max(0, AGENDA_END - year),
  };
}

// ③ RENDERING — COVER:
// Rendered BEFORE <main>, so it runs edge to edge straight under the nav
// (no page padding, no border). Built from text and CSS so it follows
// light/dark mode and stays sharp at any size. The "O" is the wheel image the loader already uses. It is a
// stand-in, not the official UN emblem.
function coverHtml() {
  return `
    <p class="sdgs-page__cover" role="img" aria-label="United Nations Sustainable Development Goals">
      <span class="sdgs-page__cover-un" aria-hidden="true">
        <span>United</span>
        <span>Nations</span>
      </span>
      <span class="sdgs-page__cover-divider" aria-hidden="true"></span>
      <span class="sdgs-page__cover-title" aria-hidden="true">
        <span class="sdgs-page__cover-sub">Sustainable Development</span>
        <span class="sdgs-page__cover-word">G<img class="sdgs-page__cover-o" src="${WHEEL_SRC}" alt="">ALS</span>
      </span>
    </p>
  `;
}

// ④ RENDERING — STATS:
function statHtml({ value, label }) {
  return `
    <li class="sdgs-page__stat">
      <strong class="sdgs-page__stat-value">${value}</strong>
      <span class="sdgs-page__stat-label">${label}</span>
    </li>
  `;
}

function statsHtml() {
  const { yearsLeft } = agendaProgress();
  const goals = ALL_GOALS.filter((g) => g.id <= 17);

  const segments = goals
    .map((g) => `<span style="--sdg-color:${g.color};flex:${TARGETS_PER_GOAL[g.id - 1]}"></span>`)
    .join("");

  const stats = [
    { value: "193", label: "countries agreed" },
    { value: "17", label: "goals" },
    { value: "169", label: "targets" },
    {
      value: String(AGENDA_END),
      label: yearsLeft > 0 ? `${yearsLeft} year${yearsLeft === 1 ? "" : "s"} left` : "deadline reached",
    },
  ];

  return `
    <div class="sdgs-page__panel">
      <span class="sdgs-page__segments" aria-hidden="true">${segments}</span>
      <ul class="sdgs-page__stats">${stats.map(statHtml).join("")}</ul>
    </div>
  `;
}


// ⑤ RENDERING — TILES AND PAGE:
function tileHtml(goal) {
  const isLast = goal.id === 18;
  const count = projectCount(goal.id);
  const meta = isLast
    ? "What can I do?"
    : count > 0
      ? `${count} project${count === 1 ? "" : "s"} on NearImpact`
      : "Opportunities and facts";
  return `
    <a class="sdgs-page__tile" href="${goalUrl(goal.id)}"
       style="--sdg-color:${goal.color}">
      <img class="sdgs-page__tile-image" src="/sdgs/sdg${goal.id}.png" alt="SDG ${goal.id} - ${escapeHtml(goal.name)}" loading="lazy">
      <span class="sdgs-page__tile-body">
        <strong title="${escapeHtml(goal.tagline)}">${escapeHtml(goal.tagline)}</strong>
        <span>${escapeHtml(meta)}</span>
      </span>
    </a>
  `;
}

export function renderSdgsPage() {
  return `
    ${coverHtml()}
    <main class="sdgs-page">
      <header class="sdgs-page__hero">
        <h1>The ${SDGS.length} Global Goals</h1>
        <p class="sdgs-page__lead">
          In 2015, leaders from 193 countries agreed on 17 goals to achieve three extraordinary things by 2030:
          end extreme poverty, fight inequality and injustice, and tackle climate change. Pick a goal to explore
          the facts, what you can do, and the projects and opportunities on NearImpact that support it.
        </p>
        ${statsHtml()}
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

  THE COVER replaces the old "United Nations 2030 Agenda" text label.
  It sits outside <main> so it can span the full width, on a fixed deep
  blue so it stands out from the white nav in light AND dark mode. It is plain markup (no image of its own) with the loader's wheel
  image standing in for the "O" in GOALS. Its wrapper has role="img"
  and one aria-label, and the pieces inside are aria-hidden, so a
  screen reader announces the name once instead of reading the letters.

  THE STATS are four small cards, each with a visual along the bottom
  that means something: a full bar (all 193 countries agreed), 17
  goal-coloured dots, one bar split by each goal's share of the 169
  targets (TARGETS_PER_GOAL), and a 2015 to 2030 bar worked out from
  today's year (agendaProgress()). Numbers use --font-mono, the same
  face as the homepage impact stats.

  GOAL 18 is an ordinary tile like the other 17. With 18 tiles the
  grid is full in 2, 3 and 6 columns, so there is nothing to span or
  fill. (A wide square-image tile is what filled phone screens before.)

  There is no breadcrumb on this page: the cover is the first thing
  under the nav, and the nav already links home.

  BLOCKS DEFINITIONS:
  ① CONFIG      — the wheel image path (shared with ui/loader.js), the
                  agenda start and end years, and targets per goal.
  ② HELPERS     — projectCount() counts projects tagged with a goal;
                  agendaProgress() returns percent done and years left.
  ③ COVER       — coverHtml() builds the full-width wordmark banner.
  ④ STATS       — statHtml() builds one card; statsHtml() assembles the
                  four with their extras.
  ⑤ TILES, PAGE — tileHtml() builds one goal tile; renderSdgsPage()
                  builds breadcrumb, hero, grid and the closing note.

  CLASS NAME GLOSSARY:
  .sdgs-page                The whole page body.
  .sdgs-page__hero          Intro block (h1, lead, stats).
  .sdgs-page__cover         The full-width wordmark banner above <main>
                            (one em-based font size scales every part).
  .sdgs-page__cover-un      "United Nations" stack on the left.
  .sdgs-page__cover-divider The thin vertical line beside it.
  .sdgs-page__cover-title   Right side: small line plus the GOALS word.
  .sdgs-page__cover-sub     "Sustainable Development" line.
  .sdgs-page__cover-word    The large GOALS word.
  .sdgs-page__cover-o       The wheel image used as the letter O.
  .sdgs-page__lead          Intro paragraph.
  .sdgs-page__stats         Grid of four stat cards.
  .sdgs-page__stat          One stat card.
  .sdgs-page__stat-value    The big number.
  .sdgs-page__stat-label    The small description under it.
  .sdgs-page__dots          One-row grid of 17 coloured dots (goals card).
  .sdgs-page__progress      Track of a bar (countries and deadline cards);
                            its inner span is the filled part.
  .sdgs-page__segments      The 169-target bar split into 17 goal colours.
  .sdgs-page__grid          Grid of goal tiles.
  .sdgs-page__tile          One goal tile (link).
  .sdgs-page__tile-image    The official goal image.
  .sdgs-page__tile-body     Caption beside or under the image.
  .sdgs-page__note          Closing progress note + call to action.
  .sdgs-page__cta           The button-style link in that note.
*/
