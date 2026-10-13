import "./styles/testimonials.css";
// Two rows of testimonial cards drifting in opposite directions.
// Each row is a real scrollable strip: JS nudges it along, and stops
// nudging while the visitor touches, hovers, focuses or scrolls it.
// DEVELOPERS NOTE at the bottom.

// ① CONFIG:
// After the visitor stops touching or scrolling a row, it waits this long
// before drifting again, so a half-read card isn't snatched away.
const HOLD_RESUME_MS = 1500;
// Seconds to drift one full set of cards (the old CSS loop times).
const LOOP_SECONDS = { forward: 48, reverse: 54 };
// A long gap between frames (tab in background) must not cause a jump.
const MAX_FRAME_MS = 64;
// Three identical copies: the visitor can swipe either way from the middle
// copy, and the position is wrapped silently so there is never an edge.
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

// ④ DRIFT + FREE SCROLL:
// One loop per row, running only while that row is on screen. Each frame it
// either FOLLOWS the visitor (paused: copy scrollLeft into `pos`) or DRIFTS
// (advance `pos`, write scrollLeft). Following first means a resumed drift
// always starts exactly where the visitor left the row.
function driveRow(row) {
  const firstSet = row.querySelector(".testimonials__set");
  const direction = row.classList.contains("testimonials__row--reverse") ? -1 : 1;
  const seconds = direction === 1 ? LOOP_SECONDS.forward : LOOP_SECONDS.reverse;

  let setWidth = 0; // width of ONE copy; every copy is identical, so it is the loop length
  let pos = 0; // float position (scrollLeft alone is rounded by some browsers)
  let lastSet = 0; // scrollLeft we last wrote, to tell our scrolls from the visitor's
  let lastTime = 0;
  let frameId = null;

  // reasons the row must not drift
  let touching = false;
  let hovering = false;
  let focused = false;
  let holdUntil = 0;

  // Keep pos inside the middle copy [setWidth, 2 * setWidth). The copies are
  // identical, so jumping by exactly one set width is invisible.
  const wrap = (value) => {
    if (!setWidth) return value;
    let v = value;
    while (v >= setWidth * 2) v -= setWidth;
    while (v < setWidth) v += setWidth;
    return v;
  };

  const measure = () => {
    const width = firstSet.offsetWidth;
    if (!width) return;
    const firstTime = setWidth === 0;
    setWidth = width;
    if (firstTime) {
      row.scrollLeft = setWidth; // start in the middle copy
    } else {
      row.scrollLeft = wrap(row.scrollLeft); // card size changed (resize)
    }
    pos = lastSet = row.scrollLeft;
  };

  const tick = (now) => {
    const dt = Math.min(now - lastTime, MAX_FRAME_MS);
    lastTime = now;

    const paused = touching || hovering || focused || now < holdUntil;
    if (paused) {
      pos = row.scrollLeft;
    } else if (setWidth) {
      pos = wrap(pos + (direction * (setWidth / seconds) * dt) / 1000);
      row.scrollLeft = pos;
      lastSet = row.scrollLeft;
    }
    frameId = requestAnimationFrame(tick);
  };

  const start = () => {
    if (frameId !== null) return;
    lastTime = performance.now();
    frameId = requestAnimationFrame(tick);
  };

  const stop = () => {
    if (frameId === null) return;
    cancelAnimationFrame(frameId);
    frameId = null;
  };

  const holdFromNow = () => {
    holdUntil = performance.now() + HOLD_RESUME_MS;
  };

  // touch / pen: hold while a finger is down, then wait before moving again.
  // pointercancel fires when the browser takes over for a swipe, so it counts
  // as "finger lifted"; the scroll listener below keeps extending the wait
  // while the swipe (and its momentum) is still moving the row.
  row.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse") touching = true;
  });
  const endTouch = (e) => {
    if (e.pointerType === "mouse") return;
    touching = false;
    holdFromNow();
  };
  row.addEventListener("pointerup", endTouch);
  row.addEventListener("pointercancel", endTouch);

  // mouse: hold while hovering
  row.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "mouse") hovering = true;
  });
  row.addEventListener("pointerleave", (e) => {
    if (e.pointerType === "mouse") hovering = false;
  });

  // keyboard: hold while focused with the keyboard. :focus-visible on purpose,
  // so a plain tap that focuses the row doesn't leave it frozen.
  row.addEventListener("focusin", (e) => {
    if (e.target.matches(":focus-visible")) focused = true;
  });
  row.addEventListener("focusout", () => {
    focused = false;
    holdFromNow();
  });

  // any scroll we didn't cause (swipe momentum, trackpad, arrow keys) extends the wait
  row.addEventListener(
    "scroll",
    () => {
      if (Math.abs(row.scrollLeft - lastSet) > 1) holdFromNow();
    },
    { passive: true }
  );

  measure();
  if ("ResizeObserver" in window) new ResizeObserver(measure).observe(firstSet);

  // run the loop only while the row is on screen
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop())).observe(row);
  } else {
    start();
  }
}

export function initTestimonials() {
  // Reduced motion: no drift at all. The rows stay plain, swipeable strips.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll(".testimonials__row").forEach(driveRow);
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The "What people are saying" section: two rows of equal-size cards
  that drift sideways in opposite directions. Each row is a real
  horizontally scrollable strip (overflow-x: auto, scrollbar hidden), so
  a visitor can swipe, drag with a trackpad or use the arrow keys at any
  time. The drifting is a small requestAnimationFrame loop that moves the
  strip's scrollLeft.

  WHAT CHANGED (free scrolling): this used to be a pure CSS transform
  animation, same idea as partners.js's marquee. A transform can't be
  dragged by a finger, so a paused row could not be moved. Moving
  scrollLeft instead lets the browser handle swiping and momentum
  natively. Trade-off: motion now needs JS (partners.js stays CSS-only
  because nobody needs to scroll the logos).

  CARD STRUCTURE (top to bottom): a bold one-line OUTCOME, a short
  quote (cut at three lines on desktop, four on phones), a divider, then
  the person. A round quote badge sits on the card's top-right corner.

  THE LOOP: the track holds the story list COPIES (3) times. The loop
  keeps scrollLeft inside the middle copy and, when it passes either
  end, jumps by exactly one copy's width. Copies are identical, so the
  jump is invisible. Three copies (not two) give the visitor room to
  swipe in BOTH directions. A swipe can run past the middle copy; the
  next drift frame wraps it back. It needs one copy to be at least as
  wide as the screen (about 2,900px with eight stories).

  PAUSING: a row holds still while it is touched, hovered with a mouse,
  keyboard-focused (:focus-visible only, so a tap doesn't freeze it), or
  while the visitor is scrolling it. After a touch ends or a scroll
  stops, it waits HOLD_RESUME_MS before moving again. Scrolls we caused
  ourselves are told apart by comparing scrollLeft with what we last
  wrote. Each row decides on its own, so the other keeps moving.

  The loop only runs while the row is on screen (IntersectionObserver).
  With prefers-reduced-motion nothing drifts at all.

  The STORIES array is the single source of truth. Row two is the same
  list rotated by half its length. The last two stories are placeholders.

  BLOCKS DEFINITIONS:
  ① CONFIG        — resume delay, loop times, frame cap, copy count.
  ② STORIES DATA  — outcome, quote, initials, name, role, avatar colour.
  ③ RENDERING     — QUOTE_SVG is the badge icon; cardHtml() builds one
                    card; renderRow() repeats the list COPIES times in a
                    focusable row; renderTestimonials() builds the
                    heading and both rows.
  ④ DRIFT + FREE SCROLL — driveRow() runs one row's loop and listeners;
                    initTestimonials() starts every row.

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