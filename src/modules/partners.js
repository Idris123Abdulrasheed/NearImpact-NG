import "./styles/partners.css";
import { driveRow } from "./ui/drift-row.js";
// Scrolling logo row: drifts by itself, and the visitor can swipe it at any time.
// DEVELOPERS NOTE at the bottom explains the markup and why it changed.

// ① CONFIG:
const COPIES = 3; // identical sets in the track (the visitor can swipe both ways)
const REPEATS = 4; // the logo list repeated inside one set, so a set is wider than any screen
const LOOP_SECONDS = 110; // time to drift one set (about 30px per second)
const HOLD_RESUME_MS = 1500;

// ② PARTNERS DATA:
// Our logo images stay as clean placeholder, no confirmed agreement yet.
const PARTNERS = [
  { name: "SDGs", logo: "/partners/sdgs.png" },
  { name: "ENVIRONMENTAL", logo: "/partners/environmental.png" },
  { name: "GREEN", logo: "/partners/green.png" },
  { name: "CODAF", logo: "/partners/codaf.png" },
  { name: "1PERCENT", logo: "/partners/1percent.png" },
];

// ③ RENDERING:
// Only the very first logo group is announced; every repeat is hidden from
// screen readers (empty alt + aria-hidden) so each partner is read once.
function renderTile(p, isCopy) {
  if (p.placeholder) {
    return `
      <div class="partners__tile partners__tile--placeholder${isCopy ? " partners__tile--copy" : ""}"${isCopy ? ' aria-hidden="true"' : ""}>
        <span>Add Logo</span>
      </div>
    `;
  }
  return `
    <div class="partners__tile${isCopy ? " partners__tile--copy" : ""}"${isCopy ? ' aria-hidden="true"' : ""}>
      <img src="${p.logo}" alt="${isCopy ? "" : p.name}" loading="lazy" />
    </div>
  `;
}

function renderSet(isCopySet) {
  const tiles = Array.from({ length: REPEATS }, (_, r) =>
    PARTNERS.map((p) => renderTile(p, isCopySet || r > 0)).join("")
  ).join("");
  return `<div class="partners__set"${isCopySet ? ' aria-hidden="true"' : ""}>${tiles}</div>`;
}

export function renderPartners() {
  const sets = Array.from({ length: COPIES }, (_, i) => renderSet(i > 0)).join("");

  return `
    <section class="partners" id="partners">
      <div class="partners__wrap">
        <h2>Our Partners &amp; Supporters</h2>
      </div>

      <div class="partners__track-outer" tabindex="0" role="group" aria-label="Partner logos, scroll sideways to see more">
        <div class="partners__track">${sets}</div>
      </div>
    </section>
  `;
}

// ④ INITIALIZATION:
// Reduced motion: nothing drifts; css shows one plain wrapped group of logos.
export function initPartners() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const row = document.querySelector(".partners__track-outer");
  if (!row) return;

  driveRow(row, {
    setSelector: ".partners__set",
    seconds: LOOP_SECONDS,
    holdResumeMs: HOLD_RESUME_MS,
  });
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The scrolling logo row. It used to be a pure CSS marquee (keyframes +
  hover pause, no JS). A CSS transform can't be dragged, so a visitor
  could not move it. It is now a real horizontally scrollable strip, and
  ui/drift-row.js moves it along by itself, pausing whenever the visitor
  touches, hovers or scrolls it. That is why initPartners() exists now
  and main.js must call it. Trade-off: motion needs JS (the old version
  needed none).

  MARKUP: row > track > 3 sets, and each set holds the logo list
  REPEATS (4) times. Five logos are only about 850px wide, narrower than
  a desktop screen, and the endless-loop trick needs one set to be wider
  than the screen. The repeats are hidden from screen readers so each
  partner is announced once. Tiles use margin, not flex gap, so a set's
  width is exact and the wrap jump is invisible. With only five partners
  the same logos repeat visibly; that is expected until there are more.

  SPEED: LOOP_SECONDS is the time for one set. A set is about 3,400px, so
  110s is roughly 30px per second, the old speed. Add partners and the
  set gets longer: raise LOOP_SECONDS in proportion.

  BLOCKS DEFINITIONS:
  ① CONFIG          — copies, repeats, loop time, resume delay.
  ② PARTNERS DATA   — the logo list (placeholders, no agreements yet).
  ③ RENDERING       — renderTile() builds one tile (hidden from screen
                      readers when it is a repeat); renderSet() builds
                      one set; renderPartners() builds the section.
  ④ INITIALIZATION  — initPartners() starts the drift (skipped for
                      reduced motion).

  CLASS NAME GLOSSARY:
  .partners                    The whole section.
  .partners__wrap              Wrapper around the heading.
  .partners__track-outer       The scrollable, edge-faded row (focusable).
  .partners__track             The strip holding every set.
  .partners__set               One copy of the logo group (three per track).
  .partners__tile              One logo tile.
  .partners__tile--copy        Modifier: a repeat of a logo; hidden when
                               motion is reduced.
  .partners__tile--placeholder Modifier: dashed "Add Logo" box.
*/