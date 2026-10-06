import "./styles/all-projects.css";
import { STATE_LGAS } from "./data/projects.js";
import { fetchProjects } from "./data/projects-api.js";
import { getTypeMeta, TYPE_META } from "./data/type-meta.js";
import { renderProjectCard, bindProjectCardActions } from "./ui/project-card.js";
import { renderPagination } from "./ui/pagination.js";
import { escapeHtml } from "./ui/escape-html.js";
// The full /all-projects.html page behind the homepage "Show More".
// Filters are a plain GET form, so the URL IS the state. DEVELOPERS NOTE at the bottom.

// ① CONFIG:
const PAGE_SIZE = 6;
const PAGE_PATH = "/all-projects.html";
const DEFAULT_SORT = "popular";
const TYPE_OPTIONS = Object.keys(TYPE_META).map((key) => [key, getTypeMeta(key).label]);
const STATE_OPTIONS = Object.keys(STATE_LGAS).map((state) => [state, state]);
const SDG_OPTIONS = Array.from({ length: 17 }, (_, i) => [String(i + 1), `SDG ${i + 1}`]);
const SORT_OPTIONS = [
  ["popular", "Most volunteers"],
  ["rating", "Top rated"],
  ["newest", "Newest"],
];

// "Liked" hearts, kept for this page visit only (same behaviour as the homepage list).
const savedIds = new Set();

// ② FILTERS FROM THE URL:
function readFilters() {
  const params = new URLSearchParams(window.location.search);
  const page = Number.parseInt(params.get("page"), 10);
  return {
    type: params.get("type") || "",
    state: params.get("state") || "",
    lga: params.get("lga") || "",
    sdg: params.get("sdg") || "",
    sort: params.get("sort") || DEFAULT_SORT,
    page: page > 0 ? page : 1,
  };
}

function pageHref(filters, page) {
  const params = new URLSearchParams();
  ["type", "state", "lga", "sdg"].forEach((key) => {
    if (filters[key]) params.set(key, filters[key]);
  });
  if (filters.sort && filters.sort !== DEFAULT_SORT) params.set("sort", filters.sort);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${PAGE_PATH}?${query}` : PAGE_PATH;
}

// ③ RENDERING — SHELL:
function optionsHtml(options, selected) {
  return options
    .map(
      ([value, text]) =>
        `<option value="${escapeHtml(value)}"${value === selected ? " selected" : ""}>${escapeHtml(text)}</option>`
    )
    .join("");
}

function renderSelect({ name, label, placeholder, options, selected, disabled = false }) {
  return `
    <label class="all-projects__field">
      <span>${label}</span>
      <select name="${name}" id="ap-${name}"${disabled ? " disabled" : ""}>
        ${placeholder ? `<option value="">${placeholder}</option>` : ""}
        ${optionsHtml(options, selected)}
      </select>
    </label>
  `;
}

export function renderAllProjects() {
  const filters = readFilters();
  const lgaOptions = (STATE_LGAS[filters.state] || []).map((lga) => [lga, lga]);

  return `
    <section class="all-projects">

      <div class="all-projects__banner">
        <div class="all-projects__banner-wrap">
          <h1>Projects</h1>
          <p>Every approved sustainability project across Nigeria. Filter by type, place or SDG.</p>
        </div>
      </div>

      <div class="all-projects__wrap">

        <form class="all-projects__filters" method="get" action="${PAGE_PATH}">
          <h2 class="all-projects__filters-title">Filter projects</h2>
          <div class="all-projects__filters-row">
            ${renderSelect({ name: "type", label: "Type", placeholder: "All types", options: TYPE_OPTIONS, selected: filters.type })}
            ${renderSelect({ name: "state", label: "State", placeholder: "All states", options: STATE_OPTIONS, selected: filters.state })}
            ${renderSelect({
              name: "lga",
              label: "LGA / Area",
              placeholder: filters.state ? `All of ${escapeHtml(filters.state)}` : "Pick a state first",
              options: lgaOptions,
              selected: filters.lga,
              disabled: !filters.state,
            })}
            ${renderSelect({ name: "sdg", label: "SDG", placeholder: "All SDGs", options: SDG_OPTIONS, selected: filters.sdg })}
            ${renderSelect({ name: "sort", label: "Sort by", options: SORT_OPTIONS, selected: filters.sort })}
          </div>
          <div class="all-projects__filters-actions">
            <button type="submit" class="all-projects__apply">Apply Filters</button>
            <a href="${PAGE_PATH}" class="all-projects__clear">Clear</a>
          </div>
          <p class="all-projects__map-hint">
            Want a visual search? <a href="/#map">Open the map</a> to find projects near you.
          </p>
        </form>

        <p class="all-projects__count" id="ap-count" aria-live="polite">Loading…</p>
        <div class="all-projects__grid" id="ap-grid"></div>
        <nav class="pagination" id="ap-pagination" aria-label="Pagination" hidden></nav>

      </div>
    </section>
  `;
}

// ④ STATE → LGA DROPDOWN:
// Same rule as the homepage location filter: LGA options belong to the chosen state.
function wireLocationSelects() {
  const stateSelect = document.getElementById("ap-state");
  const lgaSelect = document.getElementById("ap-lga");
  if (!stateSelect || !lgaSelect) return;

  stateSelect.addEventListener("change", () => {
    const state = stateSelect.value;
    if (!state) {
      lgaSelect.innerHTML = `<option value="">Pick a state first</option>`;
      lgaSelect.disabled = true;
      return;
    }
    const lgas = (STATE_LGAS[state] || []).map((lga) => [lga, lga]);
    lgaSelect.innerHTML = `<option value="">All of ${escapeHtml(state)}</option>${optionsHtml(lgas, "")}`;
    lgaSelect.disabled = false;
  });
}

// ⑤ INITIALIZATION:
export async function initAllProjects() {
  const grid = document.getElementById("ap-grid");
  const count = document.getElementById("ap-count");
  const pagination = document.getElementById("ap-pagination");
  if (!grid || !count || !pagination) return;

  wireLocationSelects();
  const filters = readFilters();

  try {
    const data = await fetchProjects({ ...filters, pageSize: PAGE_SIZE });

    if (data.items.length === 0) {
      count.textContent = "No projects found";
      grid.innerHTML = `
        <p class="all-projects__message">
          Nothing matches these filters yet. Try clearing them, or use the
          <a href="/#map">map</a> to browse by location.
        </p>`;
      return;
    }

    const from = (data.page - 1) * data.pageSize + 1;
    const to = from + data.items.length - 1;
    count.textContent = `Showing ${from}–${to} of ${data.total} project${data.total === 1 ? "" : "s"}`;
    grid.innerHTML = data.items
      .map((project) => renderProjectCard(project, { saved: savedIds.has(project.id) }))
      .join("");
    bindProjectCardActions(grid, { savedIds });

    if (data.totalPages > 1) {
      pagination.innerHTML = renderPagination(data.page, data.totalPages, (n) => pageHref(filters, n));
      pagination.hidden = false;
    }
  } catch (err) {
    console.error("Failed to load projects:", err);
    count.textContent = "";
    grid.innerHTML = `<p class="all-projects__message">Couldn't load projects. Please try again later.</p>`;
  }
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The all-projects page: banner, filter panel, card grid, numbered
  pagination. It is the twin of all-opportunities.js and follows the
  same idea: filters are a plain <form method="get"> and page numbers
  are plain links, so the URL (?state=Lagos&lga=Yaba&type=volunteer)
  holds the state. That is how the homepage hands its filters over:
  project-list.js builds a link with the visitor's current type, state,
  LGA and sort, and this page reads them back in readFilters() and
  pre-selects the dropdowns. Anyone arriving from another link simply
  gets the page unfiltered with the same panel available.

  Location filtering mirrors the homepage's State -> LGA dropdowns, but
  there is no "use my location" or "nearest" here on purpose: the page
  points visitors to the map for visual / near-me search instead.
  Distance is not computed, so cards show the LGA.

  Data comes from /api/projects (approved rows only). The homepage list
  and the map still use the mock list in data/projects.js; the seed SQL
  uses the same slugs so both point at the same detail pages.

  BLOCKS DEFINITIONS:
  ① CONFIG        — page size, option lists, session-only savedIds.
  ② FILTERS       — readFilters() parses the URL; pageHref() builds a
                    link to another page with the same filters.
  ③ RENDERING — SHELL — banner, filter form (with map hint), count,
                    grid, pagination.
  ④ STATE → LGA   — repopulates the LGA select when the state changes.
  ⑤ INITIALIZATION — fetches the current page and fills count, grid and
                    pagination (or an empty / error message).

  CLASS NAME GLOSSARY:
  .all-projects                  The whole page body.
  .all-projects__banner          Dark title band.
  .all-projects__banner-wrap     Width-constrained inner wrapper.
  .all-projects__wrap            Width-constrained content area.
  .all-projects__filters         The filter panel (a form).
  .all-projects__filters-title   "FILTER PROJECTS" label.
  .all-projects__filters-row     Grid holding the selects.
  .all-projects__field           One labelled select.
  .all-projects__filters-actions Row with Apply + Clear.
  .all-projects__apply           Apply Filters button.
  .all-projects__clear           Clear link.
  .all-projects__map-hint        "Want a visual search? Open the map" line.
  .all-projects__count           "Showing 1–6 of 12 projects" line.
  .all-projects__grid            Card grid (1 / 2 / 3 columns).
  .all-projects__message         Empty / error text inside the grid.
  Pagination uses the shared "pagination" block (ui/pagination.js).
  Cards use the "project-list" block (ui/project-card.js).
*/
