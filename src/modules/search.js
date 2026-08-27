/**
 * Live search dropdown.
 *
 * Responsibility: wire up the search inputs rendered by nav.js —
 * debounce keystrokes, call the search API, render results.
 * nav.js stays responsible for markup only; this file owns behavior.
 *
 * The fetch URL below is a relative path (/api/search) rather than
 * a full localhost URL. Because the frontend and the /api serverless
 * function deploy to the SAME Vercel project/domain, "same origin"
 * applies in both local dev (`vercel dev`) and production — no CORS
 * headers or environment-specific base URL needed.
 */

const DEBOUNCE_MS = 300;
const MIN_CHARS = 2;

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

function renderGroup(label, items, renderItem) {
  if (!items || items.length === 0) return "";
  return `
    <div class="search-group">
      <span class="search-group-label">${label}</span>
      ${items.map(renderItem).join("")}
    </div>
  `;
}

function renderResults(data) {
  const projects = renderGroup("Projects", data.projects, (p) => `
    <a href="#discover" class="search-result">
      <strong>${escapeHtml(p.title)}</strong>
      <span>${escapeHtml(p.organisation || "")}${p.location ? " · " + escapeHtml(p.location) : ""}</span>
    </a>
  `);

  const opportunities = renderGroup("Opportunities", data.opportunities, (o) => `
    <a href="#opportunities" class="search-result">
      <strong>${escapeHtml(o.title)}</strong>
      <span>${escapeHtml(o.type || "")}${o.location ? " · " + escapeHtml(o.location) : ""}</span>
    </a>
  `);

  const impactmakers = renderGroup("Impactmakers", data.impactmakers, (m) => `
    <a href="#community" class="search-result">
      <strong>${escapeHtml(m.full_name)}</strong>
      <span>${escapeHtml(m.role || "")}${m.organisation ? " · " + escapeHtml(m.organisation) : ""}</span>
    </a>
  `);

  const hasAnyResults = projects || opportunities || impactmakers;

  if (!hasAnyResults) {
    return `<div class="search-empty">No results found.</div>`;
  }

  return projects + opportunities + impactmakers;
}

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
    resultsBox.innerHTML = `<div class="search-loading">Searching…</div>`;

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
      resultsBox.innerHTML = `<div class="search-empty">Something went wrong. Try again.</div>`;
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

export function initSearch() {
  wireSearchInput("nav-search-input", "nav-search-results");
  wireSearchInput("sidebar-search-input", "sidebar-search-results");
}