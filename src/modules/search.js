 //Our Live search dropdown. Wires up the search inputs rendered by nav.js 
 //DEVELOPERS NOTE at the buttom
 

// ① CONFIG:
const DEBOUNCE_MS = 300;
const MIN_CHARS = 2;

// ② HELPERS:
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

// ③ RENDERING:
function renderGroup(label, items, renderItem) {
  if (!items || items.length === 0) return "";
  return `
    <div class="search-dropdown__group">
      <span class="search-dropdown__group-label">${label}</span>
      ${items.map(renderItem).join("")}
    </div>
  `;
}

function renderResults(data) {
  const projects = renderGroup("Projects", data.projects, (p) => `
    <a href="#discover" class="search-dropdown__result">
      <strong>${escapeHtml(p.title)}</strong>
      <span>${escapeHtml(p.organisation || "")}${p.location ? " · " + escapeHtml(p.location) : ""}</span>
    </a>
  `);

  const opportunities = renderGroup("Opportunities", data.opportunities, (o) => `
    <a href="#opportunities" class="search-dropdown__result">
      <strong>${escapeHtml(o.title)}</strong>
      <span>${escapeHtml(o.type || "")}${o.location ? " · " + escapeHtml(o.location) : ""}</span>
    </a>
  `);

  const impactmakers = renderGroup("Impactmakers", data.impactmakers, (m) => `
    <a href="#community" class="search-dropdown__result">
      <strong>${escapeHtml(m.full_name)}</strong>
      <span>${escapeHtml(m.role || "")}${m.organisation ? " · " + escapeHtml(m.organisation) : ""}</span>
    </a>
  `);

  const hasAnyResults = projects || opportunities || impactmakers;

  if (!hasAnyResults) {
    return `<div class="search-dropdown__empty">No results found.</div>`;
  }

  return projects + opportunities + impactmakers;
}

// ④ WIRING:
function wireSearchInput(inputId, resultsId) {
  const input = document.getElementById(inputId);
  const resultsBox = document.getElementById(resultsId);

  if (!input || !resultsBox) return; // defensive: don't crash if markup changes later

  const runSearch = debounce(async (term) => {
    if (term.length < MIN_CHARS) {
      resultsBox.hidden = true;
      resultsBox.innerHTML = "";
      return;
    }

    resultsBox.hidden = false;
    resultsBox.innerHTML = `<div class="search-dropdown__loading">Searching…</div>`;

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(term)}`
      );

      if (!response.ok) {
        throw new Error(`Search request failed: ${response.status}`);
      }

      const data = await response.json();
      resultsBox.innerHTML = renderResults(data);
    } catch (err) {
      console.error("Search error:", err);
      resultsBox.innerHTML = `<div class="search-dropdown__empty">Something went wrong. Try again.</div>`;
    }
  }, DEBOUNCE_MS);

  input.addEventListener("input", (e) => runSearch(e.target.value.trim()));

  // Close dropdown when clicking outside it (standard type-ahead behavior)
  document.addEventListener("click", (e) => {
    if (!input.contains(e.target) && !resultsBox.contains(e.target)) {
      resultsBox.hidden = true;
    }
  });
}

// ⑤ INITIALIZATION:
export function initSearch() {
  wireSearchInput("nav-search-input", "nav-search-results");
  wireSearchInput("sidebar-search-input", "sidebar-search-results");
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  Wires up BOTH search boxes nav.js renders (desktop nav bar + mobile
  sidebar) with the exact same debounce/fetch/render logic with different 
  id pairs rather than duplicating the logic per input.

  IMPORTANT: this file does NOT own the "search-dropdown" block it lives in
  nav.js. This file only fills that container's innerHTML using the
  SAME class names nav.css already expects; search-dropdown__group,
  __group-label, __result, __loading, __empty. If those class names
  ever change over in nav.css, they need to change here too, in the
  same edit 

  BLOCKS DEFINITIONS:
  ① CONFIG        — debounce delay and the minimum character count
                    before a search actually fires.
  ② HELPERS         — debounce() delays rapid-fire calls down to one;
                    escapeHtml() sanitizes any text pulled from the
                    API response before it's dropped into innerHTML,
                    so search results can't inject arbitrary markup.
  ③ RENDERING       — renderGroup() builds one labeled result group
                    (Projects/Opportunities/Impactmakers); renderResults()
                    assembles all three groups (or an empty-state
                    message if nothing matched anything).
  ④ WIRING          — wireSearchInput() is the whole pipeline for ONE
                    input: debounced fetch, loading state, render
                    results, and closing the dropdown on an outside
                    click.
  ⑤ INITIALIZATION  — calls wireSearchInput() for both the desktop and
                    mobile search boxes.

  CLASS NAME GLOSSARY:
  This file doesn't own any classes, it only emits the
  search-dropdown__* classes that belong to nav.css's "search-dropdown"
  block. 

 
*/