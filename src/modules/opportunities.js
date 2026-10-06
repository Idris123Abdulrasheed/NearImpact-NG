import "./styles/opportunities.css";
import { fetchOpportunities } from "./data/opportunities.js";
import { renderOpportunityCard } from "./ui/opportunity-card.js";
// Landing-page preview: first 4 OPEN opportunities per category, and
// "Show More" is now a link to the full page. DEVELOPERS NOTE below.

// ① CONFIG:
const PREVIEW_COUNT = 4;
const ALL_PAGE = "/all-opportunities.html";

// ② RENDERING — SHELL:
export function renderOpportunities() {
  return `
    <section class="opportunities" id="opportunities">
      <div class="opportunities__wrap">

        <div class="opportunities__header">
          <h2>Opportunities for Impactmakers</h2>
          <p>
            Discover fellowships, grants, internships, jobs and leadership opportunities.
          </p>
        </div>

        <div class="opportunities__tabs-scroll">
          <div class="opportunities__tabs">
            <button class="active" data-category="all">All</button>
            <button data-category="fellowship">Fellowships</button>
            <button data-category="grant">Grants</button>
            <button data-category="internship">Internships</button>
            <button data-category="job">Jobs</button>
          </div>
          <span class="opportunities__tabs-chevron">›</span>
        </div>

        <div class="opportunities__grid" id="opp-grid">
          <p class="opportunities__status">Loading opportunities…</p>
        </div>

        <div class="opportunities__footer">
          <a class="opportunities__show-more" id="opp-show-more" href="${ALL_PAGE}">Show More</a>
        </div>

      </div>
    </section>
  `;
}

// ③ DATA LOADING:
const cache = new Map(); // category -> items, so re-clicking a tab is instant
let latestRequest = 0;   // ignores a slow response if the user already switched tab

async function loadCategory(category) {
  const grid = document.getElementById("opp-grid");
  const showMore = document.getElementById("opp-show-more");
  if (!grid || !showMore) return;

  showMore.href = category === "all" ? ALL_PAGE : `${ALL_PAGE}?type=${category}`;
  const requestId = ++latestRequest;

  try {
    if (!cache.has(category)) {
      grid.innerHTML = `<p class="opportunities__status">Loading opportunities…</p>`;
      const data = await fetchOpportunities({
        type: category === "all" ? "" : category,
        status: "open",
        pageSize: PREVIEW_COUNT,
      });
      cache.set(category, data.items);
    }
    if (requestId !== latestRequest) return;

    const items = cache.get(category);
    grid.innerHTML = items.length
      ? items.map(renderOpportunityCard).join("")
      : `<p class="opportunities__status">No open opportunities in this category yet.</p>`;
  } catch (err) {
    if (requestId !== latestRequest) return;
    console.error("Failed to load opportunities:", err);
    grid.innerHTML = `<p class="opportunities__status">Couldn't load opportunities. Please try again later.</p>`;
  }
}

// ④ INITIALIZATION:
export function initOpportunities() {
  const tabs = document.querySelectorAll(".opportunities__tabs button");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((btn) => btn.classList.remove("active"));
      tab.classList.add("active");
      loadCategory(tab.dataset.category);
    });
  });

  loadCategory("all");
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The "Opportunities for Impactmakers" preview on the homepage. It no
  longer owns any data or card markup: data comes from
  api/opportunities.js (via data/opportunities.js) and the card from
  ui/opportunity-card.js, which the all-opportunities page reuses.
  Each tab asks the API for the first 4 OPEN listings of that type
  (status=open, so a closed deadline never leads the homepage).

  "Show More" used to toggle a CSS class that revealed hidden cards.
  It is now a plain link to /all-opportunities.html; on a tab other
  than All it carries ?type=..., so the full page opens on the same
  category. The old --extra modifier and "expanded" class are gone
  from the CSS too.

  main.js is unchanged: it still imports renderOpportunities and
  initOpportunities.

  BLOCKS DEFINITIONS:
  ① CONFIG             — preview size and the full page's path.
  ② RENDERING — SHELL   — heading, tabs, empty grid (shows "Loading…"
                          until the first response) and the link.
  ③ DATA LOADING        — loadCategory() fetches (or reads the cache),
                          renders the cards, updates the link, and
                          shows a message for loading / empty / error.
                          latestRequest stops a slow, stale response
                          from overwriting a newer tab's cards.
  ④ INITIALIZATION      — wires the tabs, then loads "all".

  CLASS NAME GLOSSARY:
  .opportunities                The whole section.
  .opportunities__wrap          Width-constrained inner wrapper.
  .opportunities__header        Heading + intro paragraph block.
  .opportunities__tabs-scroll   Scrollable container for the tab row.
  .opportunities__tabs          The row of category tab buttons.
  .opportunities__tabs-chevron  Mobile-only "more to scroll" hint.
  .opportunities__grid          The card grid container.
  .opportunities__status        Loading / empty / error message that
                                spans the whole grid. (new)
  .opportunities__card          One card (rendered by opportunity-card.js).
  .opportunities__card-content  Padding wrapper inside a card.
  .opportunities__card-title    The title link inside the card's h3. (new)
  .opportunities__badge         Coloured category pill.
  .opportunities__badge--*      Pill colour per category.
  .opportunities__card-details  Row with location + closing date.
  .opportunities__card-footer   Row with reward text + Apply link.
  .opportunities__footer        Wrapper around the Show More link.
  .opportunities__show-more     The Show More link (styled as a button).

  State class "active" (on a tab) is deliberately not BEM-ified.
*/
