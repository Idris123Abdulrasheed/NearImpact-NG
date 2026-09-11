import "./styles/community.css";
import { requireAuth } from "./auth.js";
// Card clicks are gated behind requireAuth() since profile pages
// don't exist yet. DEVELOPERS NOTE at the bottom has the full story.

// ① IMPACTMAKERS DATA:
// `slug` must match the photo filename in public/impactmakers/<slug>.jpg
const IMPACTMAKERS = [
  { slug: "favour-adeyemi",     name: "Favour Adeyemi",     sdg: "Gender Equality" },
  { slug: "chidera-james-edeh", name: "Chidera James-Edeh", sdg: "Good Health and Well-being" },
  { slug: "idris-abdulrasheed", name: "Idris Abdulrasheed", sdg: "Quality Education" },
  { slug: "musa-mubarak",       name: "Musa Mubarak",       sdg: "Climate Action" },
  { slug: "omeiza-christianah", name: "Omeiza Christianah", sdg: "Affordable and Clean Energy" },
  { slug: "fatima-al-hassan",   name: "Fatima Al-Hassan",   sdg: "Clean Water and Sanitation" },
  { slug: "iloke-emmanuel",       name: "Iloke Emmanuel",       sdg: "Reduced Inequalities" },
  { slug: "bankole-oluwakemi",  name: "Bankole Oluwakemi",  sdg: "Decent Work and Economic Growth" },
  { slug: "tunde-balogun",      name: "Tunde Balogun",      sdg: "Life on Land" },
];

// Fallback image(generic silhouette/avatar) shown if a real photo is missing or fails to load.
const FALLBACK_PHOTO = "/impactmakers/placeholder.jpg";

// ② RENDERING — CARD:
function makerCard({ slug, name, sdg }) {
  return `
    <a href="#" class="community__card" data-maker-slug="${slug}">
      <div class="community__card-photo">
        <img
          src="/impactmakers/${slug}.jpg"
          alt="${name}"
          loading="lazy"
          onerror="this.onerror=null; this.src='${FALLBACK_PHOTO}';"
        />
        <span class="community__card-badge" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M7 17 17 7M9 7h8v8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </div>
      <h3>${name}</h3>
      <p class="community__card-sdg">${sdg}</p>
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
          ${IMPACTMAKERS.map(makerCard).join("")}
        </div>

        <div class="community__footer">
          <a href="#" class="community__view-all">See the whole network</a>
        </div>
      </div>
    </section>
  `;
}

// ④ CAROUSEL CONTROL:
export function initCommunityCarousel() {
  const track = document.getElementById("impactmakers-track");
  if (!track) return;

  // arrow scroll buttons
  document.querySelectorAll(".community__arrow").forEach((btn) => {
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

  // card click — auth gate (no profile pages yet)
  track.addEventListener("click", (e) => {
    const card = e.target.closest(".community__card");
    if (!card) return;
    e.preventDefault();
    requireAuth(() => {
      // No profile pages yet, we will wire real navigation here once they exist.
      window.location.href = `#profile-${card.dataset.makerSlug}`;
    });
  });
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The "People Behind the Impacts" carousel which is a horizontal scroll of
  impactmaker cards (photo, name, SDG focus). Clicking a card is
  gated behind requireAuth() (see auth.js) since profile pages don't
  exist yet. This just tells anonymous users to log in and remembers
  where to send them back to once login exists. 

  The data is a placeholder set of 9; each entry's `slug` has to match a real 
  photo filename dropped into public/impactmakers/, or the onerror handler falls
  back to a generic placeholder avatar instead of a broken image icon.

  Class names follow BEM where "community" is the block, and the file
  keeps that name even though the visible heading text says "Impactmakers," 
  since the block name is meant to track the filename/component, not the copy.

  BLOCKS DEFINITIONS:
  ① IMPACTMAKERS DATA  — the placeholder person records + the fallback
                        photo path used when a real one is missing or
                        fails to load.
  ② RENDERING — CARD    — makerCard() builds one impactmaker card:
                        photo (with fallback), a small checkmark
                        badge, name, and SDG focus line.
  ③ RENDERING — SHELL    — renderCommunity() builds the section's outer
                        shell: heading, prev/next arrows, the
                        scrollable card track, and the "see whole
                        network" footer link.
  ④ CAROUSEL CONTROL     — wires up the prev/next arrow buttons (native
                        scrollBy, matching the track's own gap value)
                        and the auth gate on card clicks.

  CLASS NAME GLOSSARY:
  .community            The whole section.
  .community__wrap      Width-constrained inner wrapper.
  .community__header    Heading + intro text + arrow controls row.
  .community__nav       Wrapper around the prev/next arrow buttons.
  .community__arrow      One arrow button. Both prev and next share
                        this exact same class 
  .community__track     The horizontally-scrolling row of cards.
  .community__card       One impactmaker card.
  .community__card-photo Image container inside a card (photo +
                        fallback + badge).
  .community__card-badge The small checkmark badge overlaid on a
                        card's photo.
  .community__card-sdg   The SDG focus line under a card's name.
  .community__footer     Wrapper around the "see whole network" link.
  .community__view-all   The link itself.


*/