import "./styles/community.css";
import { fetchImpactmakers, FALLBACK_PHOTO } from "./data/impactmakers.js";
import { escapeHtml } from "./ui/escape-html.js";
// The homepage carousel of impactmakers, loaded from the database.
// DEVELOPERS NOTE at the bottom has the full story.

// ① CONFIG:
const CAROUSEL_LIMIT = 12; // the full list lives on impactmakers.html

// ② RENDERING — CARD:
function makerCard({ slug, name, sdg }) {
  return `
    <a href="/impactmaker.html?slug=${encodeURIComponent(slug)}" class="community__card">
      <div class="community__card-photo">
        <img
          src="/impactmakers/${encodeURIComponent(slug)}.jpg"
          alt="${escapeHtml(name)}"
          loading="lazy"
          onerror="this.onerror=null; this.src='${FALLBACK_PHOTO}';"
        />
        <span class="community__card-badge" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M7 17 17 7M9 7h8v8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </div>
      <h3>${escapeHtml(name)}</h3>
      <p class="community__card-sdg">${escapeHtml(sdg)}</p>
    </a>
  `;
}

// ③ RENDERING — SHELL:
export function renderCommunity() {
  return `
    <section class="community" id="community">
      <div class="community__wrap">

        <div class="community__header">
          <div>
            <h2>The People Behind the Impacts</h2>
            <p>
              Connect with people building sustainable communities, leading projects,
              and creating real impact across Africa.
            </p>
          </div>

          <div class="community__nav">
            <button class="community__arrow" data-direction="prev" aria-label="Previous impactmakers">←</button>
            <button class="community__arrow" data-direction="next" aria-label="Next impactmakers">→</button>
          </div>
        </div>

        <div class="community__track" id="impactmakers-track" aria-label="Impactmakers carousel">
          <p role="status">Loading impactmakers…</p>
        </div>

        <div class="community__footer">
          <a href="/become-impactmaker.html" class="community__view-all">Become an impactmaker</a>
          <a href="/impactmakers.html" class="community__view-all">See the whole network</a>
        </div>
      </div>
    </section>
  `;
}

// ④ CAROUSEL CONTROL:
export function initCommunityCarousel() {
  const track = document.getElementById("impactmakers-track");
  if (!track) return;

  const arrows = [...document.querySelectorAll(".community__arrow")];
  const prevBtn = arrows.find((b) => b.dataset.direction === "prev");
  const nextBtn = arrows.find((b) => b.dataset.direction === "next");

  // arrows are disabled at either end, like the testimonials carousel
  function updateArrows() {
    const maxScroll = track.scrollWidth - track.clientWidth - 1;
    prevBtn.disabled = track.scrollLeft <= 0;
    nextBtn.disabled = track.scrollLeft >= maxScroll;
  }

  arrows.forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = track.querySelector(".community__card");
      const cardWidth = card?.offsetWidth ?? 220;
      const gap = 20; // keep in sync with .community__track gap in community.css
      track.scrollBy({
        left: btn.dataset.direction === "next" ? cardWidth + gap : -(cardWidth + gap),
        behavior: "smooth",
      });
    });
  });

  track.addEventListener("scroll", updateArrows, { passive: true });
  window.addEventListener("resize", updateArrows);

  // Fire-and-forget: fill the track once the data arrives. Nothing else
  // on the page waits for this.
  loadCards(track).then(updateArrows);
}

async function loadCards(track) {
  try {
    const makers = await fetchImpactmakers();
    track.innerHTML =
      makers.length > 0
        ? makers.slice(0, CAROUSEL_LIMIT).map(makerCard).join("")
        : `<p>No impactmakers yet. <a href="/become-impactmaker.html">Be the first.</a></p>`;
  } catch (err) {
    console.error("Failed to load impactmakers:", err);
    track.innerHTML = `<p>Couldn't load impactmakers right now. Please try again later.</p>`;
  }
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The "People Behind the Impacts" carousel: a horizontal scroll of
  impactmaker cards (photo, name, SDG focus). The shell renders
  instantly with a "Loading…" line; initCommunityCarousel() then
  fetches the approved impactmakers from the database
  (data/impactmakers.js) and swaps the cards in. Only the first
  CAROUSEL_LIMIT are shown; "See the whole network" leads to the full
  directory, and "Become an impactmaker" to the application form.

  What changed: the hardcoded list is gone, and cards are now plain
  links to each person's profile page instead of auth-gated stubs,
  because profile pages exist. To make profiles members-only again,
  bring back requireAuth() in a click handler on the track.

  Every name and SDG goes through escapeHtml() because profile text is
  typed in by visitors.

  Class names follow BEM where "community" is the block, and the file
  keeps that name even though the visible heading text says
  "Impactmakers", since the block name tracks the filename.

  BLOCKS DEFINITIONS:
  ① CONFIG               — how many cards the homepage shows.
  ② RENDERING — CARD      — makerCard() builds one escaped card.
  ③ RENDERING — SHELL     — renderCommunity(): heading, arrows, the
                            track (starts as a loading line), and the
                            two footer links.
  ④ CAROUSEL CONTROL      — arrow scrolling, arrows disabling at the
                            ends, and loadCards(), which fetches and
                            fills the track (with empty and error
                            messages).

  CLASS NAME GLOSSARY:
  .community            The whole section.
  .community__wrap      Width-constrained inner wrapper.
  .community__header    Heading + intro text + arrow controls row.
  .community__nav       Wrapper around the prev/next arrow buttons.
  .community__arrow     One arrow button (prev and next share it).
  .community__track     The horizontally-scrolling row of cards.
  .community__card      One impactmaker card (a link to their profile).
  .community__card-photo  Image container inside a card.
  .community__card-badge  The small arrow badge on a card's photo.
  .community__card-sdg    The SDG focus line under a card's name.
  .community__footer    Wrapper around the two footer links.
  .community__view-all  Both footer links share this style.
*/
