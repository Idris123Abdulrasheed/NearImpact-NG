import "./styles/sdgs.css";
import { ALL_GOALS, goalUrl } from "./data/sdg-data.js";
// Homepage SDG teaser. Every card is a real link to its goal page, and
// the old Show More toggle is now a "View more" link to the full SDG
// page. DEVELOPERS NOTE at the bottom has the full story.

// ① CONFIG:
const INITIAL_VISIBLE = 10; // ~2 rows at the 5-col desktop breakpoint

// ② RENDERING:
function sdgCard(goal, index) {
  const extra = index >= INITIAL_VISIBLE ? " sdgs__card--extra" : "";
  const label = goal.id === 18 ? "The Global Goals: what can I do?" : `Goal ${goal.id}: ${goal.name}`;
  return `
    <a class="sdgs__card${extra}" href="${goalUrl(goal.id)}" aria-label="${label}">
      <img class="sdgs__card-image" src="/sdgs/sdg${goal.id}.png" alt="SDG ${goal.id} - ${goal.name}">
    </a>
  `;
}

export function renderSdgs() {
  return `
    <section class="sdgs" id="sdgs">
      <div class="sdgs__wrap">

        <div class="sdgs__header">
          <div>
            <h2>Explore the Global Goals</h2>
            <p>
              Every project on NearImpact connects to one or more of the UN Sustainable Development Goals.
              Open any goal to learn its purpose, see the facts, and find projects and opportunities aligned
              with it. The last card shows what you can do to help.
            </p>
          </div>
        </div>

        <div class="sdgs__grid" id="sdg-grid">
          ${ALL_GOALS.map(sdgCard).join("")}
        </div>

        <div class="sdgs__toggle-wrap">
          <a class="sdgs__toggle-btn" href="/sdgs.html">View more</a>
        </div>

      </div>
    </section>
  `;
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The homepage SDG grid. Cards were dead images; each is now an <a>
  to sdg.html?n=<id>, so keyboard, middle-click and "open in new tab"
  work with no JavaScript. That is why initSdgsToggle() is gone: with
  links and a "View more" link there is nothing left to wire. Remove
  its import and call from main.js.

  Goal data (titles, ids) comes from data/sdg-data.js, replacing the
  titles that used to live inline here. INITIAL_VISIBLE still hides
  cards past the first 10 (sdgs__card--extra); the rest are one click
  away on /sdgs.html.

  BLOCKS DEFINITIONS:
  ① CONFIG     — how many cards show before "View more".
  ② RENDERING  — sdgCard() builds one link card; renderSdgs() builds the
                 section shell and the View more link.

  CLASS NAME GLOSSARY:
  Unchanged from before. .sdgs__toggle-btn is now an <a>, not a button.
*/
