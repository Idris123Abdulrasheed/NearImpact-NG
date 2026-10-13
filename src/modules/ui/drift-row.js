// Makes a scrollable row drift sideways by itself, while still letting the
// visitor swipe, drag or arrow-key it at any time. DEVELOPERS NOTE at the bottom.

// ① CONFIG:
// A long gap between frames (tab in the background) must not cause a jump.
const MAX_FRAME_MS = 64;

// ② DRIFT:
// Expects: row (overflow-x: auto) > track > 3 identical copies, each one
// matching `setSelector`. Every copy must be at least as wide as the screen.
//   seconds       time to drift one full copy
//   direction     1 = content moves left, -1 = moves right
//   holdResumeMs  wait after the visitor stops touching/scrolling
export function driveRow(row, { setSelector, seconds, direction = 1, holdResumeMs = 1500 }) {
  const firstSet = row.querySelector(setSelector);
  if (!firstSet) return;

  let setWidth = 0; // width of ONE copy = the loop length
  let pos = 0; // float position (scrollLeft alone is rounded by some browsers)
  let lastSet = 0; // scrollLeft we last wrote, to tell our scrolls from the visitor's
  let lastTime = 0;
  let frameId = null;

  // reasons the row must not drift
  let touching = false;
  let hovering = false;
  let focused = false;
  let holdUntil = 0;

  // Keep pos inside the middle copy [setWidth, 2 * setWidth). Copies are
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
    row.scrollLeft = firstTime ? setWidth : wrap(row.scrollLeft);
    pos = lastSet = row.scrollLeft;
  };

  const tick = (now) => {
    const dt = Math.min(now - lastTime, MAX_FRAME_MS);
    lastTime = now;

    const paused = touching || hovering || focused || now < holdUntil;
    if (paused) {
      pos = row.scrollLeft; // follow the visitor, so drift resumes from where they left it
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
    holdUntil = performance.now() + holdResumeMs;
  };

  // touch / pen: hold while a finger is down, then wait before moving again
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

  // keyboard: :focus-visible only, so a plain tap doesn't leave the row frozen
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





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The shared "drifting but swipeable row" behaviour. A CSS transform
  animation can't be dragged by a finger, so the row is a normal
  overflow-x: auto strip and this file moves its scrollLeft every frame.
  The browser then handles swiping and momentum natively. partners.js is
  the first caller. testimonials.js still has its own identical copy of
  this logic (known debt: switch it to this helper).

  MARKUP CONTRACT: row > track > three identical copies. The loop keeps
  scrollLeft inside the middle copy and jumps by exactly one copy's width
  when it leaves it. That needs each copy to be at least as wide as the
  screen, and each item to use margin (not flex gap) so a copy's width is
  exact. The caller must also hide the loop from screen readers and skip
  this helper when prefers-reduced-motion is set.

  PAUSING: the row holds still while touched, hovered with a mouse,
  keyboard-focused (:focus-visible only) or being scrolled. After a touch
  ends or a scroll stops it waits holdResumeMs. Scrolls we caused are
  told apart from the visitor's by comparing scrollLeft with the value we
  last wrote. The loop only runs while the row is on screen.

  BLOCKS DEFINITIONS:
  ① CONFIG  — frame-time cap.
  ② DRIFT   — driveRow(row, options): measure, per-frame tick, input
              listeners, start/stop by visibility.

  CLASS NAME GLOSSARY:
  No CSS here — behaviour only; the caller owns every class.
*/