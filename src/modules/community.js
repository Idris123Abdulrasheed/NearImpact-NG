import "./styles/community.css";
import { escapeHtml } from "./ui/escape-html.js";
import { icon } from "./data/icons.js";
// The homepage carousel of impactmakers, rendered from the LOCAL array
// below (no API call), the same way the homepage project list renders
// from projects.js. DEVELOPERS NOTE at the bottom has the full story.

// ① IMPACTMAKERS DATA:
// `slug` is the JOIN KEY with the database: it must match the photo
// filename in public/impactmakers/<slug>.jpg AND the slug of the same
// person in the impactmaker_profiles table (see db/impactmaker-profiles.sql),
// so a card here opens the same profile the directory page shows.
const IMPACTMAKERS = [
  { slug: "favour-adeyemi",     name: "Favour Adeyemi",     sdg: "Gender Equality" },
  { slug: "chidera-james-edeh", name: "Chidera James-Edeh", sdg: "Good Health and Well-being" },
  { slug: "idris-abdulrasheed", name: "Idris Abdulrasheed", sdg: "Quality Education" },
  { slug: "musa-mubarak",       name: "Musa Mubarak",       sdg: "Climate Action" },
  { slug: "omeiza-christianah", name: "Omeiza Christianah", sdg: "Affordable and Clean Energy" },
  { slug: "fatima-al-hassan",   name: "Fatima Al-Hassan",   sdg: "Clean Water and Sanitation" },
  { slug: "iloke-emmanuel",     name: "Iloke Emmanuel",     sdg: "Reduced Inequalities" },
  { slug: "bankole-oluwakemi",  name: "Bankole Oluwakemi",  sdg: "Decent Work and Economic Growth" },
  { slug: "tunde-balogun",      name: "Tunde Balogun",      sdg: "Life on Land" },
];

// Fallback image (generic silhouette/avatar) shown if a real photo is missing or fails to load.
const FALLBACK_PHOTO = "/impactmakers/placeholder.jpg";

// ② RENDERING — CARD:
// Each card is a plain link to that person's profile page.
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
            <button class="community__arrow" data-direction="prev" aria-label="Previous impactmakers">${icon("arrowLeft")}</button>
            <button class="community__arrow" data-direction="next" aria-label="Next impactmakers">${icon("arrowRight")}</button>
          </div>
        </div>

        <div class="community__track" id="impactmakers-track" aria-label="Impactmakers carousel">
          ${IMPACTMAKERS.map(makerCard).join("")}
        </div>

        <div class="community__footer">
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
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The "People Behind the Impacts" carousel: a horizontal scroll of
  impactmaker cards (photo, name, SDG focus). It follows the same
  pattern as the homepage project list: it renders from a LOCAL array
  and never calls the API, so it always shows the featured people even
  if /api is down. The full, database-backed list lives on
  impactmakers.html ("See the whole network").

  THE LINK BETWEEN LOCAL AND DATABASE: each card links to
  impactmaker.html?slug=<slug>, and the profile page loads that slug
  from the database (approved profiles only). So `slug` here MUST equal
  the slug of the same person in impactmaker_profiles. The nine people
  below are seeded there as approved by db/impactmaker-profiles.sql.
  If a slug is missing or not approved, the profile page shows its
  "Impactmaker not found" view; it deliberately does not fall back to
  this local data (see the "Slug fallback" decision in
  CODING_STANDARDS.md).

  TRADE-OFF TO KNOW: because this list is local, a newly approved
  impactmaker appears in the directory but NOT in this carousel until
  you add them to the array. Likewise, hiding someone in the database
  does not remove their card here; remove them from the array too.

  Cards are plain links; there is no login gate on them, because
  profiles are public.

  Class names follow BEM where "community" is the block, and the file
  keeps that name even though the visible heading text says
  "Impactmakers", since the block name tracks the filename.

  BLOCKS DEFINITIONS:
  ① IMPACTMAKERS DATA  — the featured people (slug, name, SDG) and the
                         fallback photo path used when a real photo is
                         missing or fails to load.
  ② RENDERING — CARD    — makerCard() builds one card, linked to the
                         person's profile page.
  ③ RENDERING — SHELL    — renderCommunity() builds the section's outer
                         shell: heading, prev/next arrows, the
                         scrollable card track, and the two footer links.
  ④ CAROUSEL CONTROL     — wires up the prev/next arrow buttons (native
                         scrollBy, matching the track's own gap value).

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
