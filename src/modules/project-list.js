import "./styles/projects.css";
import "./styles/project-list-controls.css";
import { getFilteredSortedProjects } from "./data/projects-query.js";
import { getState, setState, subscribe } from "./state/map-store.js";
import { getTypeMeta } from "./data/type-meta.js";
import { icon } from "./data/icons.js";
import { renderProjectCard, bindProjectCardActions } from "./ui/project-card.js";
// This re-renders on every store change no matter who triggered it.
// "Show More" now opens the full /all-projects.html page.
// See DEVELOPERS NOTE at the bottom if anything seems odd.

// ① CONFIG / LOCAL STATE:
const PREVIEW_COUNT = 4;
const ALL_PAGE = "/all-projects.html";

// Local session state, not persisted anywhere, just kept as a Set so "is
// this card liked" survives every re-render.
const savedIds = new Set();

const SORT_OPTIONS = [
  { value: "nearest", label: "Nearest" },
  { value: "rating", label: "Top Rated" },
];

const FILTER_TYPES = ["all", "volunteer", "internship", "training", "fellowship"];

// ② RENDERING — SHELL:
export function renderProjectList() {
  return `
    <section class="project-list" id="discover">
      <div class="project-list__wrap">

        <div class="project-list__header">
          <div>
            <h2>Nearby Impacts Found</h2>
            <p id="projects-subtitle">Showing popular projects across Nigeria</p>
          </div>
        </div>

        <div class="project-list__controls">
          <div class="project-list__type-tabs-scroll">
            <div class="project-list__type-tabs" id="pl-type-tabs">
              ${FILTER_TYPES.map(
                (t) => `
                <button type="button" data-type="${t}" class="${t === "all" ? "active" : ""}">
                  ${t === "all" ? "All" : getTypeMeta(t).label}
                </button>`
              ).join("")}
            </div>
            <span class="project-list__scroll-hint" aria-hidden="true">${icon("chevronRight")}</span>
          </div>

          <div class="project-list__sort-tabs" id="pl-sort-tabs" role="group" aria-label="Sort projects by">
            ${SORT_OPTIONS.map(
              (o, i) => `
              <button type="button" data-sort="${o.value}" class="${i === 0 ? "active" : ""}">
                ${o.label}
              </button>`
            ).join("")}
          </div>
        </div>

        <div class="project-list__grid" id="projects-grid"></div>

        <div class="project-list__footer">
          <a id="pl-view-more" class="project-list__view-more" href="${ALL_PAGE}" hidden>
            Show More
          </a>
        </div>

      </div>
    </section>
  `;
}

// ③ SHOW MORE LINK:
// Carries whatever the visitor has chosen here (type, state, LGA, sort) over to
// the full page. Coordinates ("use my location" / map click) can't be turned
// into a state, so that case opens the page unfiltered; it points to the map.
function allProjectsHref(storeState) {
  const params = new URLSearchParams();
  if (storeState.filterType && storeState.filterType !== "all") {
    params.set("type", storeState.filterType);
  }
  if (storeState.selectedState) {
    params.set("state", storeState.selectedState);
    if (storeState.selectedLga) params.set("lga", storeState.selectedLga);
  }
  if (storeState.sortBy === "rating") params.set("sort", "rating");

  const query = params.toString();
  return query ? `${ALL_PAGE}?${query}` : ALL_PAGE;
}

// ④ RENDERING — GRID:
function renderGrid() {
  const grid = document.getElementById("projects-grid");
  const viewMoreLink = document.getElementById("pl-view-more");
  const subtitle = document.getElementById("projects-subtitle");
  if (!grid) return;

  const storeState = getState();
  const results = getFilteredSortedProjects(storeState);

  if (results.length === 0) {
    grid.innerHTML = `
      <div class="project-list__empty">
        <p><strong>No projects found here yet.</strong></p>
        <p>Try a different LGA, or clear your filters to see popular projects nationwide.</p>
      </div>
    `;
    viewMoreLink.hidden = true;
    subtitle.textContent = "No matching projects";
    return;
  }

  const visible = results.slice(0, PREVIEW_COUNT);
  grid.innerHTML = visible
    .map((project) =>
      renderProjectCard(project, {
        saved: savedIds.has(project.id),
        selected: storeState.selectedProjectId === project.id,
      })
    )
    .join("");

  // Hidden only when this preview already shows everything for the current filters.
  viewMoreLink.hidden = visible.length >= results.length;
  viewMoreLink.href = allProjectsHref(storeState);
  subtitle.textContent = `Showing ${visible.length} of ${results.length} project${results.length === 1 ? "" : "s"}`;

  bindProjectCardActions(grid, {
    savedIds,
    onSelect: (id) => setState({ selectedProjectId: id }),
  });
}

// ⑤ INITIALIZATION:
export function initProjectList() {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  document.getElementById("pl-type-tabs").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-type]");
    if (!btn) return;

    document
      .querySelectorAll("#pl-type-tabs button")
      .forEach((b) => b.classList.toggle("active", b === btn));

    setState({ filterType: btn.dataset.type });
  });

  document.getElementById("pl-sort-tabs").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-sort]");
    if (!btn) return;

    document
      .querySelectorAll("#pl-sort-tabs button")
      .forEach((b) => b.classList.toggle("active", b === btn));

    setState({ sortBy: btn.dataset.sort });
  });

  subscribe(() => renderGrid());
  renderGrid();
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The "Nearby Impacts Found" grid: a preview of the first
  PREVIEW_COUNT projects for the current filters, plus type/sort tabs.
  It re-renders on EVERY store change (see map-store.js), whether that
  came from its own tabs, the location filter, or the map. It still
  reads the mock list through projects-query.js, because "nearest"
  sorting and the map markers depend on it.

  WHAT CHANGED: (1) the card markup moved to ui/project-card.js so the
  new all-projects page shows the identical card; (2) "Show More" used
  to reveal 4 more cards in place and is now a link to
  /all-projects.html, built by allProjectsHref() from the current store
  state, so the visitor's type / state / LGA / sort choices carry over;
  (3) the local visibleCount counter is gone, and the View Project
  navigation moved into the card module (the detail page is public and
  holds the register/login box, so no auth gate is needed here).

  The link is hidden only when this preview already shows everything
  for the current filters, as the old button was.

  Class names follow BEM where "project-list" is the block. The card
  keeps these names even though it now lives in ui/project-card.js.

  BLOCKS DEFINITIONS:
  ① CONFIG / LOCAL STATE — preview size, the all-projects path, the
                            savedIds Set, and the sort/filter option lists.
  ② RENDERING — SHELL      — heading, tabs, EMPTY grid, and the Show More link.
  ③ SHOW MORE LINK         — allProjectsHref() turns store state into a URL.
  ④ RENDERING — GRID       — renderGrid() queries the store, renders the
                            preview cards via renderProjectCard(), updates the
                            link, and wires the card actions.
  ⑤ INITIALIZATION         — wires type + sort tabs, then subscribes to the
                            store so renderGrid() re-runs on every change.

  CLASS NAME GLOSSARY:
  .project-list                    The whole "Nearby Impacts" section.
  .project-list__wrap              Width-constrained inner wrapper.
  .project-list__header            Heading + subtitle row.
  .project-list__controls          Row holding type tabs and sort tabs.
  .project-list__type-tabs-scroll  Scrollable container for the type tabs.
  .project-list__type-tabs         The row of type tab buttons.
  .project-list__scroll-hint       Mobile-only "more to scroll" chevron.
  .project-list__sort-tabs         The Nearest / Top Rated tabs.
  .project-list__grid              The grid cards are inserted into.
  .project-list__card              One project card (ui/project-card.js).
  .project-list__card-image        Image / colour-panel area of a card.
  .project-list__card-image--*     Panel colour when there's no photo.
  .project-list__card-illustration The photo, when a project has one.
  .project-list__card-image-icon   Fallback icon instead of a photo.
  .project-list__card-type         Coloured type pill.
  .project-list__card-type--*      Pill colour per type (from type-meta.js).
  .project-list__save-btn          Heart save/like toggle.
  .project-list__card-content      Text area below the image.
  .project-list__card-meta         Row with distance/LGA + rating.
  .project-list__card-footer       Row with SDG tags + volunteer count.
  .project-list__card-sdg-tags     Small SDG number pills.
  .project-list__card-volunteers   Volunteer headcount line.
  .project-list__view-btn          The "View Project" button.
  .project-list__footer            Wrapper around the Show More link.
  .project-list__view-more         The Show More link (styled as a button).
  .project-list__empty             "No projects found" placeholder.

  State classes "is-selected" (card) and "is-saved" (save button) are
  deliberately not BEM'd; they are flags flipped by store changes/clicks.
*/
