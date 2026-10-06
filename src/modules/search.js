 //Our Live search dropdown. Wires up the search inputs rendered by nav.js 
 //DEVELOPERS NOTE at the buttom

import { escapeHtml } from "./ui/escape-html.js";

// ① CONFIG:
const DEBOUNCE_MS = 300;
const MIN_CHARS = 2;
const RESULT_SELECTOR = ".search-dropdown__result";

// ② HELPERS:
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
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
    <a href="/#discover" class="search-dropdown__result">
      <strong>${escapeHtml(p.title)}</strong>
      <span>${escapeHtml(p.organisation || "")}${p.location ? " · " + escapeHtml(p.location) : ""}</span>
    </a>
  `);

  const opportunities = renderGroup("Opportunities", data.opportunities, (o) => `
    <a href="/#opportunities" class="search-dropdown__result">
      <strong>${escapeHtml(o.title)}</strong>
      <span>${escapeHtml(o.type || "")}${o.location ? " · " + escapeHtml(o.location) : ""}</span>
    </a>
  `);

  const impactmakers = renderGroup("Impactmakers", data.impactmakers, (m) => `
    <a href="/impactmaker.html?slug=${encodeURIComponent(m.slug)}" class="search-dropdown__result">
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
function wireSearchInput({ inputId, resultsId, clearId }) {
  const input = document.getElementById(inputId);
  const resultsBox = document.getElementById(resultsId);
  const clearBtn = document.getElementById(clearId);

  if (!input || !resultsBox) return; // defensive: don't crash if markup changes later

  const field = input.parentElement; // holds the input, clear button and dropdown
  let controller = null; // lets a newer search cancel an older request

  const hideResults = () => {
    resultsBox.hidden = true;
  };

  const showResults = (html) => {
    resultsBox.innerHTML = html;
    resultsBox.hidden = false;
  };

  const getResultLinks = () => [...resultsBox.querySelectorAll(RESULT_SELECTOR)];

  const runSearch = debounce(async (term) => {
    if (term !== input.value.trim()) return; // the person kept typing; a newer call is coming

    controller?.abort();
    controller = new AbortController();

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Search request failed: ${response.status}`);
      }

      const data = await response.json();
      if (term !== input.value.trim()) return; // stale answer, drop it
      showResults(renderResults(data));
    } catch (err) {
      if (err.name === "AbortError") return; // cancelled on purpose, not an error
      console.error("Search error:", err);
      showResults(`<div class="search-dropdown__empty">Something went wrong. Try again.</div>`);
    }
  }, DEBOUNCE_MS);

  input.addEventListener("input", () => {
    const term = input.value.trim();
    if (clearBtn) clearBtn.hidden = input.value === "";

    if (term.length < MIN_CHARS) {
      controller?.abort();
      resultsBox.innerHTML = "";
      hideResults();
      return;
    }

    showResults(`<div class="search-dropdown__loading">Searching…</div>`);
    runSearch(term);
  });

  // Coming back to the box re-opens what was already found
  input.addEventListener("focus", () => {
    if (resultsBox.innerHTML && input.value.trim().length >= MIN_CHARS) {
      resultsBox.hidden = false;
    }
  });

  // Keyboard: ↓ enters the list, Enter opens the first result, Esc closes.
  input.addEventListener("keydown", (e) => {
    const links = getResultLinks();
    const open = !resultsBox.hidden && links.length > 0;

    if (e.key === "ArrowDown" && open) {
      e.preventDefault();
      links[0].focus();
    } else if (e.key === "Enter" && open) {
      e.preventDefault();
      links[0].click();
    } else if (e.key === "Escape" && !resultsBox.hidden) {
      hideResults();
      e.stopPropagation(); // first Esc closes the list only; nav.js keeps its overlay
    }
  });

  resultsBox.addEventListener("keydown", (e) => {
    const links = getResultLinks();
    const i = links.indexOf(document.activeElement);
    if (i === -1) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      links[Math.min(i + 1, links.length - 1)].focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (i === 0) input.focus();
      else links[i - 1].focus();
    } else if (e.key === "Escape") {
      e.stopPropagation();
      hideResults();
      input.focus();
    }
  });

  resultsBox.addEventListener("click", (e) => {
    if (e.target.closest(RESULT_SELECTOR)) hideResults();
  });

  clearBtn?.addEventListener("click", () => {
    input.value = "";
    clearBtn.hidden = true;
    controller?.abort();
    resultsBox.innerHTML = "";
    hideResults();
    input.focus();
  });

  // Close dropdown when clicking outside it (standard type-ahead behavior)
  document.addEventListener("click", (e) => {
    if (!field.contains(e.target)) hideResults();
  });
}

// ⑤ INITIALIZATION:
export function initSearch() {
  wireSearchInput({
    inputId: "nav-search-input",
    resultsId: "nav-search-results",
    clearId: "nav-search-clear",
  });
  wireSearchInput({
    inputId: "sidebar-search-input",
    resultsId: "sidebar-search-results",
    clearId: "sidebar-search-clear",
  });
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  Wires up BOTH search boxes nav.js renders (the nav bar one and the
  one inside the hamburger drawer) with the exact same logic, using
  different id sets rather than duplicating code.

  SPLIT OF JOBS WITH nav.js: this file owns everything about typing,
  fetching, results and the clear button. nav.js owns opening and
  closing the phone search BAR and the drawer. They meet in two places:
  the shared ids, and Escape (first press closes the result list here
  and stops there; a second press reaches nav.js, which closes the bar).

  IMPORTANT: this file does NOT own the "search-dropdown" block; it
  lives in nav.css. This file only fills the container's innerHTML with
  the SAME class names nav.css expects: search-dropdown__group,
  __group-label, __result, __loading, __empty. If those change in
  nav.css, change them here in the same edit.

  ESCAPING: every piece of API text goes through escapeHtml() from
  ui/escape-html.js (it also escapes quotes, unlike the old local copy).

  SPEED + CORRECTNESS: typing is debounced; a newer search aborts the
  older request (AbortController); and an answer is dropped if the box
  no longer holds the term it was for, so slow replies can't overwrite
  fresh ones.

  BLOCKS DEFINITIONS:
  ① CONFIG        — debounce delay, minimum characters, result selector.
  ② HELPERS       — debounce().
  ③ RENDERING     — renderGroup() builds one labeled group;
                    renderResults() assembles all three or the empty
                    message.
  ④ WIRING        — wireSearchInput() is the whole pipeline for ONE
                    input: loading state, debounced fetch, render,
                    keyboard navigation, clear button, outside click.
  ⑤ INITIALIZATION — wires the nav bar box and the drawer box.

  CLASS NAME GLOSSARY:
  This file doesn't own any classes, it only emits the
  search-dropdown__* classes that belong to nav.css.
*/
