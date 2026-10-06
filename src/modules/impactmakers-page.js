import "./styles/impactmakers-page.css";
import { fetchImpactmakers, FALLBACK_PHOTO } from "./data/impactmakers.js";
import { escapeHtml } from "./ui/escape-html.js";
// The full impactmakers directory: a grid of everyone approved, each
// card linking to that person's profile. DEVELOPERS NOTE at the bottom.

// ① RENDERING — CARD:
function makerCard({ slug, name, sdg }) {
  return `
    <a href="/impactmaker.html?slug=${encodeURIComponent(slug)}" class="impactmakers-page__card">
      <div class="impactmakers-page__photo">
        <img
          src="/impactmakers/${encodeURIComponent(slug)}.jpg"
          alt="${escapeHtml(name)}"
          loading="lazy"
          onerror="this.onerror=null; this.src='${FALLBACK_PHOTO}';"
        />
      </div>
      <h2>${escapeHtml(name)}</h2>
      <p>${escapeHtml(sdg)}</p>
    </a>
  `;
}

// ② RENDERING — PAGE:
export function renderImpactmakersPage() {
  return `
    <main class="impactmakers-page">
      <div class="impactmakers-page__wrap">

        <header class="impactmakers-page__header">
          <h1>The People Behind the Impacts</h1>
          <p>
            Meet the volunteers, project leaders and organisers building
            sustainable communities across Africa.
          </p>
          <p class="impactmakers-page__count" id="impactmakers-count" aria-live="polite"></p>
          <a class="impactmakers-page__join" href="/become-impactmaker.html">Become an impactmaker</a>
        </header>

        <div class="impactmakers-page__grid" id="impactmakers-grid">
          <p class="impactmakers-page__status" role="status">Loading impactmakers…</p>
        </div>

      </div>
    </main>
  `;
}

// ③ INITIALIZATION:
export async function initImpactmakersPage() {
  const grid = document.getElementById("impactmakers-grid");
  const count = document.getElementById("impactmakers-count");
  if (!grid || !count) return;

  try {
    const makers = await fetchImpactmakers();

    if (makers.length === 0) {
      grid.innerHTML = `<p class="impactmakers-page__status">No impactmakers yet. Be the first to apply.</p>`;
      return;
    }

    grid.innerHTML = makers.map(makerCard).join("");
    count.textContent = `${makers.length} impactmaker${makers.length === 1 ? "" : "s"}`;
  } catch (err) {
    console.error("Failed to load impactmakers:", err);
    grid.innerHTML = `<p class="impactmakers-page__status">Couldn't load impactmakers right now. Please try again later.</p>`;
  }
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The destination of the homepage's "See the whole network" link and
  the CTA's "Join Community" button. A responsive grid of every
  APPROVED impactmaker. The page shell renders at once with a loading
  line; initImpactmakersPage() fetches the list (data/impactmakers.js)
  and fills the grid, with empty and error messages.

  Each card is a plain link to impactmaker.html?slug=<slug>. The
  "Become an impactmaker" link leads to the application form.

  The card markup is deliberately NOT shared with community.js: that
  card is styled by community.css as part of a horizontal carousel,
  and reaching into another component's classes would couple the two
  stylesheets. The small duplication is the cheaper trade for now.

  The grid loads everything the API returns (capped at 200 there).
  Add paging or an SDG filter when the network outgrows one screen.

  Class names follow BEM where "impactmakers-page" is the block.

  BLOCKS DEFINITIONS:
  ① RENDERING — CARD  — one escaped person card.
  ② RENDERING — PAGE  — title block, count, join link, grid shell.
  ③ INITIALIZATION    — fetch, then fill the grid and the count.

  CLASS NAME GLOSSARY:
  .impactmakers-page          The <main> element.
  .impactmakers-page__wrap    Width-constrained wrapper.
  .impactmakers-page__header  Title, intro, count, join link.
  .impactmakers-page__count   "9 impactmakers" line.
  .impactmakers-page__join    The "Become an impactmaker" button-link.
  .impactmakers-page__grid    The responsive card grid.
  .impactmakers-page__status  Loading / empty / error line inside the grid.
  .impactmakers-page__card    One person (a link to their profile).
  .impactmakers-page__photo   Photo frame inside a card.
*/
