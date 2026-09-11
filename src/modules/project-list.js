import "./styles/projects.css";
import "./styles/project-list-controls.css";
import { getFilteredSortedProjects } from "./data/projects-query.js";
import { getState, setState, subscribe } from "./state/map-store.js";
import { getTypeMeta } from "./data/type-meta.js";
import { icon } from "./data/icons.js";
// This re-renders on every store change no matter who triggered it
// see DEVELOPERS NOTE at the bottom if anything seems odd.

// ① CONFIG / LOCAL STATE:
const PAGE_SIZE = 4;
let visibleCount = PAGE_SIZE;

// Local session state, not persisted anywhere just kept as a Set so "is
// this card liked" survives every re-render 
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
          <button type="button" id="pl-view-more" class="project-list__view-more" hidden>
            Show More
          </button>
        </div>

      </div>
    </section>
  `;
}

// ③ RENDERING — CARD:
function cardHtml(project) {
  const meta = getTypeMeta(project.types[0]);
  const distanceLabel =
    typeof project.distanceKm === "number"
      ? `${icon("pin")} ${project.distanceKm.toFixed(1)} km`
      : `${icon("pin")} ${project.lga}`;

  const selected = getState().selectedProjectId === project.id;
  const saved = savedIds.has(project.id);

  const imageMarkup = project.image
    ? `<img class="project-list__card-illustration" src="${project.image}" alt="${project.name}" loading="lazy">`
    : `<span class="project-list__card-image-icon" aria-hidden="true">${icon(meta.icon)}</span>`;

  return `
    <article class="project-list__card ${selected ? "is-selected" : ""}" data-id="${project.id}">
      <div class="project-list__card-image project-list__card-image--${meta.img}">
        ${imageMarkup}
        <span class="project-list__card-type project-list__card-type--${meta.badge}">${meta.label}</span>
        <button
          class="project-list__save-btn ${saved ? "is-saved" : ""}"
          data-id="${project.id}"
          aria-label="${saved ? "Remove from saved" : "Save project"}"
          aria-pressed="${saved}"
        >${icon(saved ? "heartFilled" : "heartOutline")}</button>
      </div>

      <div class="project-list__card-content">
        <div class="project-list__card-meta">
          <span>${distanceLabel}</span>
          <span>${icon("star")} ${project.rating}</span>
        </div>

        <h3>${project.name}</h3>
        <p>${project.orgName} · ${project.lga}, ${project.state}</p>

        <div class="project-list__card-footer">
          <div class="project-list__card-sdg-tags">
            ${project.sdgs.map((s) => `<span>${s}</span>`).join("")}
          </div>
          <div class="project-list__card-volunteers">${icon("people")} ${project.volunteers} volunteers</div>
        </div>

        <button type="button" class="project-list__view-btn" data-id="${project.id}">
          View Project
        </button>
      </div>
    </article>
  `;
}

// ④ RENDERING — GRID:
function renderGrid() {
  const grid = document.getElementById("projects-grid");
  const viewMoreBtn = document.getElementById("pl-view-more");
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
    viewMoreBtn.hidden = true;
    subtitle.textContent = "No matching projects";
    return;
  }

  const visible = results.slice(0, visibleCount);
  grid.innerHTML = visible.map(cardHtml).join("");

  // Use the ACTUAL rendered count, not the raw visibleCount counter, to guards 
  // against the button ever reappearing after every result has already been shown.
  viewMoreBtn.hidden = visible.length >= results.length;
  subtitle.textContent = `Showing ${visible.length} of ${results.length} project${results.length === 1 ? "" : "s"}`;

  grid.querySelectorAll(".project-list__card").forEach((card) => {
    card.addEventListener("click", () => {
      setState({ selectedProjectId: card.dataset.id });
    });
  });

  grid.querySelectorAll(".project-list__view-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const project = results.find((p) => p.id === btn.dataset.id);
      requireAuth(project);
    });
  });

  // Like/save toggle — purely visual state, doesn't touch the store 
  grid.querySelectorAll(".project-list__save-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const nowSaved = !savedIds.has(id);

      if (nowSaved) savedIds.add(id);
      else savedIds.delete(id);

      btn.classList.toggle("is-saved", nowSaved);
      btn.setAttribute("aria-pressed", String(nowSaved));
      btn.setAttribute("aria-label", nowSaved ? "Remove from saved" : "Save project");
      btn.innerHTML = icon(nowSaved ? "heartFilled" : "heartOutline");
    });
  });
}

// ⑤ AUTH GATE:
// Stub there is no real backend yet.
function requireAuth(project) {
  if (!project.requiresAuth) return;
  alert(
    `Log in to view full details and apply for "${project.name}".\n\n` +
      `(Placeholder — once auth exists, this preserves project id "${project.id}" ` +
      `and returns here after login.)`
  );
}

// ⑥ INITIALIZATION:
export function initProjectList() {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  document.getElementById("pl-type-tabs").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-type]");
    if (!btn) return;

    document
      .querySelectorAll("#pl-type-tabs button")
      .forEach((b) => b.classList.toggle("active", b === btn));

    visibleCount = PAGE_SIZE;
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

  document.getElementById("pl-view-more").addEventListener("click", () => {
    visibleCount += PAGE_SIZE;
    renderGrid();
  });

  subscribe(() => renderGrid());
  renderGrid();
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The "Nearby Impacts Found" grid — cards, type/sort tabs, and the
  Show More button. This re-renders on EVERY store change (see map-store.js),
  regardless of whether that change came from this component's own
  tabs, the location filter, or the map. This component doesn't need
  to know which one triggered it. That's the whole point of routing
  everything through the shared store instead of direct imports.

  "visibleCount" (how many cards are currently shown) is intentionally
  kept as local module state, NOT pushed into the shared store; it's
  a pure display concern specific to this component, nothing else
  needs to know about it.

  Class names follow BEM where "project-list" is the block, and the
  card itself stays nested under it (project-list__card) rather than
  becoming its own block, since it's not reused outside this file.
  

  BLOCKS DEFINITIONS:
  ① CONFIG / LOCAL STATE  — pagination size + current visible count,
                            the savedIds Set tracking "liked" cards
                            across re-renders, and the sort/filter
                            option lists that drive the tab buttons.
  ② RENDERING — SHELL      — renderProjectList() builds the section's
                            outer shell: heading, tabs, an EMPTY grid
                            container, and the footer. The grid itself
                            stays empty here but renderGrid() fills it in
                            separately, since it needs to re-run on its
                            own every time the store changes.
  ③ RENDERING — CARD       — cardHtml() builds one project card. Split
                            into inline-commented chunks (image block,
                            content block) since it bundles several
                            visually distinct pieces in one function.
  ④ RENDERING — GRID       — renderGrid() is the one function that
                            actually queries the store, filters/sorts
                            via projects-query.js, and rebuilds the
                            grid's innerHTML.
  ⑤ AUTH GATE              — requireAuth() is a placeholder for a real
                            backend that doesn't exist yet — see
                            auth.js for the equivalent stub used
                            elsewhere in the app
  ⑥ INITIALIZATION         — wires up the type tabs, sort tabs, and
                            view-more button, then subscribes to the
                            store so renderGrid() re-runs on every
                            change, including changes from OTHER
                            components entirely.

  CLASS NAME GLOSSARY:
  .project-list                    The whole "Nearby Impacts" section.
  .project-list__wrap              Width-constrained inner wrapper.
  .project-list__header            Heading + subtitle row.
  .project-list__controls          Row holding the type tabs and sort
                                    tabs together.
  .project-list__type-tabs-scroll  Horizontally-scrollable container
                                    for the type tab row (All,
                                    Volunteer, Internship, etc).
  .project-list__type-tabs         The actual row of type tab buttons.
  .project-list__scroll-hint       Small chevron hinting there's more
                                    to scroll, mobile only.
  .project-list__sort-tabs         The Nearest / Top Rated tab row.
  .project-list__grid              The grid container cards get
                                    inserted into.
  .project-list__card              One project card.
  .project-list__card-image        The image/color-panel area at the
                                    top of a card.
  .project-list__card-image--*     Modifier setting that panel's
                                    background color when there's no
                                    photo (soft-green, soft-yellow,
                                    etc. Its value comes from type-meta.js).
  .project-list__card-illustration The actual photo, when a project has
                                    one.
  .project-list__card-image-icon   Fallback icon shown instead of a
                                    photo.
  .project-list__card-type         The colored type label pill
                                    ("Volunteer", "Fellowship", etc).
  .project-list__card-type--*      Modifier setting that pill's color
                                    per project type (value from
                                    type-meta.js).
  .project-list__save-btn          The heart-shaped save/like toggle.
  .project-list__card-content      The text area below the image.
  .project-list__card-meta         Row showing distance + rating.
  .project-list__card-footer       Row holding SDG tags + volunteer
                                    count, above the View button.
  .project-list__card-sdg-tags     The small SDG number pills.
  .project-list__card-volunteers   The volunteer headcount line.
  .project-list__view-btn          The "View Project" button.
  .project-list__footer            Wrapper around the Show More button.
  .project-list__view-more         The Show More button itself.
  .project-list__empty             The "No projects found" placeholder
                                    shown when a filter matches nothing.

  State classes "is-selected" (on a card) and "is-saved" (on the save
  button) are deliberately not BEM-ified. This file flips them on and
  off in direct response to store changes or clicks, so they're flags,
  not permanent structural names.
*/