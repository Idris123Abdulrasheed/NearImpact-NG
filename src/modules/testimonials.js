import "./styles/testimonials.css";
import { driveRow } from "./ui/drift-row.js";
// Two rows of testimonial cards drifting in opposite directions.
// Each row is a real scrollable strip; ui/drift-row.js moves it along and
// stops while the visitor touches, hovers, focuses or scrolls it.
// DEVELOPERS NOTE at the bottom.

// ① CONFIG:
// After the visitor stops touching or scrolling a row, it waits this long
// before drifting again, so a half-read card isn't snatched away.
const HOLD_RESUME_MS = 1500;
// Seconds to drift one full set of cards.
const LOOP_SECONDS = { forward: 48, reverse: 54 };
// Three identical copies: the visitor can swipe either way from the middle
// copy, and ui/drift-row.js wraps the position silently so there is never an edge.
const COPIES = 3;

// ② STORIES DATA:
// "outcome" is the one-line result skimmers read first. Edit these freely.
const STORIES = [
  {
    outcome: "Volunteers found, locally",
    quote: "NearImpact helped us find volunteers in our own community and grow our clean-up campaign faster than we expected.",
    initials: "AY",
    name: "Amina Yusuf",
    role: "NGO Coordinator, Lagos",
    avatarClass: "",
  },
  {
    outcome: "First internship landed",
    quote: "I found my first sustainability internship through a local project listed on the platform.",
    initials: "DO",
    name: "David Okafor",
    role: "Student Volunteer, Yaba",
    avatarClass: "orange",
  },
  {
    outcome: "Impact made clear to partners",
    quote: "The SDG mapping made it easier for our team to show partners where our work fits.",
    initials: "KA",
    name: "Kemi Adewale",
    role: "Social Founder, Lekki",
    avatarClass: "blue",
  },
  {
    outcome: "More steady volunteers",
    quote: "Listing our program here brought in more consistent volunteers than any social post we've run.",
    initials: "TB",
    name: "Tunde Bello",
    role: "Program Lead, Ibadan",
    avatarClass: "clay",
  },
  {
    outcome: "Application finished",
    quote: "The fellowship listings were clear enough that, as a first-time applicant, I actually finished the application.",
    initials: "CN",
    name: "Chiamaka Nwosu",
    role: "Fellowship Applicant, Enugu",
    avatarClass: "plum",
  },
  {
    outcome: "A week of reporting saved",
    quote: "We used the SDG tags to report our impact to funders. It saved us a full week of manual mapping.",
    initials: "HS",
    name: "Halima Suleiman",
    role: "M&E Officer, Kano",
    avatarClass: "rose",
  },
  // PLACEHOLDERS: the last two stories are sample text like the rest. Replace
  // all of them with real, permitted testimonials before launch.
  {
    outcome: "A mentor, ten minutes away",
    quote: "Through NearImpact I met a mentor running a solar project just ten minutes from my campus.",
    initials: "IA",
    name: "Ifeoma Adebayo",
    role: "Student, Akure",
    avatarClass: "orange",
  },
  {
    outcome: "Partners reached out fast",
    quote: "We listed our tree-planting drive on Monday and had three partner schools reach out by Friday.",
    initials: "MI",
    name: "Musa Ibrahim",
    role: "Project Lead, Abuja",
    avatarClass: "blue",
  },
];

// Row two starts halfway round the list so the two rows never show the same card at once.
const ROW_TWO_OFFSET = Math.floor(STORIES.length / 2);

// ③ RENDERING:
// Two solid, rounded quotation marks, drawn to sit tight inside the round badge.
const QUOTE_SVG = `
  <svg viewBox="2 3.5 20.6 15" width="100%" height="100%" aria-hidden="true">
    <path id="q" fill="currentColor" d="M3 14.2C3 9.4 5.8 5.9 10.2 4.6L11 6.4C8.6 7.3 7.5 8.8 7.3 10.6 7.6 10.5 7.9 10.4 8.2 10.4 10.1 10.4 11.6 11.9 11.6 13.9 11.6 16 10 17.6 7.9 17.6 5.1 17.6 3 16.2 3 14.2Z"/>
    <path fill="currentColor" transform="translate(10 0)" d="M3 14.2C3 9.4 5.8 5.9 10.2 4.6L11 6.4C8.6 7.3 7.5 8.8 7.3 10.6 7.6 10.5 7.9 10.4 8.2 10.4 10.1 10.4 11.6 11.9 11.6 13.9 11.6 16 10 17.6 7.9 17.6 5.1 17.6 3 16.2 3 14.2Z"/>
  </svg>
`;

function cardHtml(story) {
  return `
    <article class="testimonials__card">
      <span class="testimonials__quote-mark">${QUOTE_SVG}</span>
      <h3 class="testimonials__outcome">${story.outcome}</h3>
      <p>${story.quote}</p>
      <div class="testimonials__person">
        <div class="testimonials__avatar${story.avatarClass ? " testimonials__avatar--" + story.avatarClass : ""}">${story.initials}</div>
        <div>
          <strong>${story.name}</strong>
          <span>${story.role}</span>
        </div>
      </div>
    </article>
  `;
}

// The track holds the list COPIES times. Only the first copy is announced
// by screen readers; the others are hidden so each story is read once.
// The row is focusable so keyboard users can scroll it with the arrow keys.
function renderRow(stories, modifier = "") {
  const cards = stories.map(cardHtml).join("");
  const sets = Array.from(
    { length: COPIES },
    (_, i) => `<div class="testimonials__set"${i > 0 ? ' aria-hidden="true"' : ""}>${cards}</div>`
  ).join("");

  return `
    <div class="testimonials__row${modifier}" tabindex="0" role="group" aria-label="Testimonials, scroll sideways to read more">
      <div class="testimonials__track">${sets}</div>
    </div>
  `;
}

export function renderTestimonials() {
  const rowTwo = [...STORIES.slice(ROW_TWO_OFFSET), ...STORIES.slice(0, ROW_TWO_OFFSET)];

  return `
    <section class="testimonials" id="stories">
      <div class="testimonials__wrap">
        <div class="testimonials__header">
          <h2>What people are saying</h2>
        </div>
      </div>

      <div class="testimonials__rows">
        ${renderRow(STORIES)}
        ${renderRow(rowTwo, " testimonials__row--reverse")}
      </div>
    </section>
  `;
}

// ④ INITIALIZATION:
// The drifting itself lives in ui/drift-row.js, shared with partners.js.
// Row two carries the --reverse modifier, so it drifts the other way, a touch slower.
// Reduced motion: nothing drifts; the rows stay plain, swipeable strips.
export function initTestimonials() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.querySelectorAll(".testimonials__row").forEach((row) => {
    const reverse = row.classList.contains("testimonials__row--reverse");
    driveRow(row, {
      setSelector: ".testimonials__set",
      seconds: reverse ? LOOP_SECONDS.reverse : LOOP_SECONDS.forward,
      direction: reverse ? -1 : 1,
      holdResumeMs: HOLD_RESUME_MS,
    });
  });
}




/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

   ARCHITECTURE OVERVIEW:
  The "What people are saying" section: two rows of equal-size cards
  that drift sideways in opposite directions. Each row is a real
  horizontally scrollable strip (overflow-x: auto, scrollbar hidden), so
  a visitor can swipe, drag with a trackpad or use the arrow keys at any
  time. The drifting is done by ui/drift-row.js, which moves the strip's
  scrollLeft every frame; partners.js uses the same helper.

  WHAT CHANGED (free scrolling): this used to be a pure CSS transform
  animation. A transform can't be dragged by a finger, so a paused row
  could not be moved. Moving scrollLeft instead lets the browser handle
  swiping and momentum natively. Trade-off: motion now needs JS.

  THE LOOP AND PAUSING: both are owned by ui/drift-row.js (see its
  DEVELOPERS NOTE). This file only supplies the markup it expects: the
  track holds the story list COPIES (3) times, each copy at least as wide
  as the screen (about 2,900px with eight stories), and the row is
  focusable. Each row pauses on its own, so the other keeps moving.

  The STORIES array is the single source of truth. Row two is the same
  list rotated by half its length. The last two stories are placeholders.

  BLOCKS DEFINITIONS:
  ① CONFIG        — resume delay, loop times,copy count.
  ② STORIES DATA  — outcome, quote, initials, name, role, avatar colour.
  ③ RENDERING     — QUOTE_SVG is the badge icon; cardHtml() builds one
                    card; renderRow() repeats the list COPIES times in a
                    focusable row; renderTestimonials() builds the
                    heading and both rows.
  ④ INITIALIZATION — initTestimonials() starts ui/drift-row.js on each row


  CLASS NAME GLOSSARY:
  .testimonials              The whole section.
  .testimonials__wrap        Width-constrained wrapper around the heading.
  .testimonials__header      The heading block.
  .testimonials__rows        Wrapper holding both rows.
  .testimonials__row         One full-width, edge-faded, scrollable row.
  .testimonials__row--reverse  Modifier: this row drifts the other way
                             (read by testimonials.js, no CSS of its own).
  .testimonials__track       The strip holding every copy of the cards.
  .testimonials__set         One copy of the card list (three per track).
  .testimonials__card        One fixed-size testimonial card.
  .testimonials__quote-mark  The round quote badge on the card's corner.
  .testimonials__outcome     The bold one-line result at the top.
  .testimonials__person      Row holding the avatar + name/role.
  .testimonials__avatar      The initials square.
  .testimonials__avatar--*   Avatar colour (orange/blue/clay/plum/rose).
*/