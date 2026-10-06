import "./styles/all-opportunities.css";
import { STATE_LGAS } from "./data/projects.js";
import { fetchOpportunities } from "./data/opportunities.js";
import { renderOpportunityCard } from "./ui/opportunity-card.js";
import { escapeHtml } from "./ui/escape-html.js";
// The full /all-opportunities.html page. Filters are a plain GET form,
// so the URL IS the state. DEVELOPERS NOTE at the bottom.

// ① CONFIG:
const PAGE_SIZE = 6;
const PAGE_PATH = "/all-opportunities.html";
const TYPE_OPTIONS = [
  ["fellowship", "Fellowships"],
  ["grant", "Grants"],
  ["internship", "Internships"],
  ["job", "Jobs"],
];
const STATUS_OPTIONS = [
  ["open", "Open now"],
  ["closed", "Closed"],
];
const SDG_OPTIONS = Array.from({ length: 17 }, (_, i) => [String(i + 1), `SDG ${i + 1}`]);
const STATE_OPTIONS = Object.keys(STATE_LGAS).map((state) => [state, state]);

// ② FILTERS FROM THE URL:
function readFilters() {
  const params = new URLSearchParams(window.location.search);
  const page = Number.parseInt(params.get("page"), 10);
  return {
    type: params.get("type") || "",
    state: params.get("state") || "",
    sdg: params.get("sdg") || "",
    status: params.get("status") || "",
    page: page > 0 ? page : 1,
  };
}

function pageHref(filters, page) {
  const params = new URLSearchParams();
  ["type", "state", "sdg", "status"].forEach((key) => {
    if (filters[key]) params.set(key, filters[key]);
  });
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${PAGE_PATH}?${query}` : PAGE_PATH;
}

// ③ RENDERING — SHELL:
function renderSelect({ name, label, placeholder, options, selected }) {
  const items = options
    .map(
      ([value, text]) =>
        `<option value="${escapeHtml(value)}"${value === selected ? " selected" : ""}>${escapeHtml(text)}</option>`
    )
    .join("");

  return `
    <label class="all-opportunities__field">
      <span>${label}</span>
      <select name="${name}">
        <option value="">${placeholder}</option>
        ${items}
      </select>
    </label>
  `;
}

export function renderAllOpportunities() {
  const filters = readFilters();

  return `
    <section class="all-opportunities">

      <div class="all-opportunities__banner">
        <div class="all-opportunities__banner-wrap">
          <h1>Opportunities</h1>
          <p>Fellowships, grants, internships and jobs for impactmakers across Nigeria.</p>
        </div>
      </div>

      <div class="all-opportunities__wrap">

        <form class="all-opportunities__filters" method="get" action="${PAGE_PATH}">
          <h2 class="all-opportunities__filters-title">Filter opportunities</h2>
          <div class="all-opportunities__filters-row">
            ${renderSelect({ name: "type", label: "Type", placeholder: "All types", options: TYPE_OPTIONS, selected: filters.type })}
            ${renderSelect({ name: "state", label: "State", placeholder: "All states", options: STATE_OPTIONS, selected: filters.state })}
            ${renderSelect({ name: "sdg", label: "SDG", placeholder: "All SDGs", options: SDG_OPTIONS, selected: filters.sdg })}
            ${renderSelect({ name: "status", label: "Status", placeholder: "All statuses", options: STATUS_OPTIONS, selected: filters.status })}
          </div>
          <div class="all-opportunities__filters-actions">
            <button type="submit" class="all-opportunities__apply">Apply Filters</button>
            <a href="${PAGE_PATH}" class="all-opportunities__clear">Clear</a>
          </div>
        </form>

        <p class="all-opportunities__count" id="ao-count" aria-live="polite">Loading…</p>
        <div class="all-opportunities__grid" id="ao-grid"></div>
        <nav class="all-opportunities__pagination" id="ao-pagination" aria-label="Pagination" hidden></nav>

      </div>
    </section>
  `;
}

// ④ RENDERING — PAGINATION:
// 1 … 4 5 6 … 19 style: first, last, and the current page +/- 1.
function pageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const wanted = [...new Set([1, total, current - 1, current, current + 1])]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);

  const output = [];
  wanted.forEach((n, i) => {
    if (i > 0 && n - wanted[i - 1] > 1) output.push("…");
    output.push(n);
  });
  return output;
}

function renderPagination(filters, current, total) {
  return pageNumbers(current, total)
    .map((n) =>
      n === "…"
        ? `<span class="all-opportunities__page-gap" aria-hidden="true">…</span>`
        : `<a class="all-opportunities__page${n === current ? " is-current" : ""}"
              href="${pageHref(filters, n)}"
              ${n === current ? 'aria-current="page"' : ""}
              aria-label="Page ${n}">${n}</a>`
    )
    .join("");
}

// ⑤ INITIALIZATION:
export async function initAllOpportunities() {
  const grid = document.getElementById("ao-grid");
  const count = document.getElementById("ao-count");
  const pagination = document.getElementById("ao-pagination");
  if (!grid || !count || !pagination) return;

  const filters = readFilters();

  try {
    const data = await fetchOpportunities({ ...filters, pageSize: PAGE_SIZE });

    if (data.items.length === 0) {
      count.textContent = "No opportunities found";
      grid.innerHTML = `<p class="all-opportunities__message">Nothing matches these filters yet. Try different ones, or clear them.</p>`;
      return;
    }

    const from = (data.page - 1) * data.pageSize + 1;
    const to = from + data.items.length - 1;
    count.textContent = `Showing ${from}–${to} of ${data.total} opportunities`;
    grid.innerHTML = data.items.map(renderOpportunityCard).join("");

    if (data.totalPages > 1) {
      pagination.innerHTML = renderPagination(filters, data.page, data.totalPages);
      pagination.hidden = false;
    }
  } catch (err) {
    console.error("Failed to load opportunities:", err);
    count.textContent = "";
    grid.innerHTML = `<p class="all-opportunities__message">Couldn't load opportunities. Please try again later.</p>`;
  }
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The all-opportunities page, laid out like the reference: banner,
  filter panel with Apply/Clear, card grid, numbered pagination. Your
  own card design is reused through ui/opportunity-card.js.

  The filters are a plain <form method="get">, and pagination numbers
  are plain links. So the browser does the "state" work: the URL
  (?type=grant&state=Lagos&page=2) holds the filters, the back button
  works, pages can be shared, and the homepage's "Show More" can open
  this page on a category with just ?type=grant. The cost is a page
  reload when you press Apply, which is fine here and avoids
  hand-written history code ("let the browser do it", like faq.js).

  The state dropdown reuses STATE_LGAS from data/projects.js so the
  site has one list of states; when that list grows, this grows.
  Filter values come from the URL, so they are escaped before landing
  in markup, and the API validates them again on its side.

  BLOCKS DEFINITIONS:
  ① CONFIG       — page size and the option lists for the 4 selects.
  ② FILTERS      — readFilters() parses the URL; pageHref() builds a
                   link to another page with the same filters.
  ③ RENDERING — SHELL — banner, filter form, count, grid, pagination.
  ④ RENDERING — PAGINATION — pageNumbers() picks which numbers to show;
                   renderPagination() builds the links.
  ⑤ INITIALIZATION — fetches the current page and fills count, grid and
                   pagination (or an empty / error message).

  CLASS NAME GLOSSARY:
  .all-opportunities                 The whole page body.
  .all-opportunities__banner         Dark title band at the top.
  .all-opportunities__banner-wrap    Width-constrained inner wrapper.
  .all-opportunities__wrap           Width-constrained content area.
  .all-opportunities__filters        The filter panel (a form).
  .all-opportunities__filters-title  "FILTER OPPORTUNITIES" label.
  .all-opportunities__filters-row    Grid holding the four selects.
  .all-opportunities__field          One labelled select.
  .all-opportunities__filters-actions Row with Apply + Clear.
  .all-opportunities__apply          Apply Filters button.
  .all-opportunities__clear          Clear link.
  .all-opportunities__count          "Showing 1–6 of 15" line.
  .all-opportunities__grid           Card grid (1 / 2 / 3 columns).
  .all-opportunities__message        Empty / error text inside the grid.
  .all-opportunities__pagination     Row of page links.
  .all-opportunities__page           One page-number link.
  .all-opportunities__page-gap       The "…" between page numbers.

  State class "is-current" (on the active page link) is deliberately
  not BEM'd.
*/
