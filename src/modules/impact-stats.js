import "./styles/impact-stats.css";

// If the "replay every scroll" behavior or the WeakMap below seems
// like overkill, the DEVELOPERS NOTE at the bottom explains why.

// ① STATS DATA:
const STATS = [
  { value: 108, suffix: "+", label: "Active Projects" },
  { value: 650, suffix: "+", label: "Impact Makers", format: "compact" },
  // TODO: confirm the real Impact Hours figure -- 45,000 is a placeholder.
  { value: 45000, suffix: "+", label: "Impact Hours", format: "compact" },
];

// ② RENDERING:
export function renderImpactStats() {
  return `
    <section class="impact-stats" id="impact">
      <div class="impact-stats__wrap">
       <!-- <h2>Impact So Far</h2>
        <p>Real numbers from real projects, growing every week across Nigeria.</p>-->

        <div class="impact-stats__row">
          ${STATS.map(
            (stat, i) => `
            <div
              class="impact-stats__stat"
              data-target="${stat.value}"
              data-suffix="${stat.suffix}"
              data-format="${stat.format || ""}"
            >
              <strong class="impact-stats__stat-value">0${stat.suffix}</strong>
              <span>${stat.label}</span>
            </div>
            ${i < STATS.length - 1 ? '<span class="impact-stats__stat-divider"></span>' : ""}
          `
          ).join("")}
        </div>
      </div>
    </section>
  `;
}

// ③ NUMBER FORMATTING:
function formatDisplay(current, format) {
  if (format === "compact") {
    if (current >= 1000000) return (current / 1000000).toFixed(1) + "M";
    if (current >= 1000) return (current / 1000).toFixed(1) + "K";
  }
  return Math.round(current).toString();
}

// ④ COUNT-UP ANIMATION:
// Tracks which animation "run" currently owns each stat element,
const runTokens = new WeakMap();

function animateStat(el) {
  const target = Number(el.dataset.target);
  const suffix = el.dataset.suffix || "";
  const format = el.dataset.format;
  const valueEl = el.querySelector(".impact-stats__stat-value");
  const duration = 900; // faster count, since it replays on every pass
  const start = performance.now();
  const token = Symbol();
  runTokens.set(el, token);

  valueEl.textContent = "0" + suffix; // snap back to 0 so each pass reads as a fresh count

  function tick(now) {
    if (runTokens.get(el) !== token) return; // a newer run has taken over
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = target * eased;
    valueEl.textContent = formatDisplay(current, format) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ⑤ INITIALIZATION:
export function initImpactStats() {
  const section = document.querySelector(".impact-stats");
  if (!section) return;

  const statEls = section.querySelectorAll(".impact-stats__stat");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    statEls.forEach((el) => {
      const valueEl = el.querySelector(".impact-stats__stat-value");
      valueEl.textContent = formatDisplay(Number(el.dataset.target), el.dataset.format) + el.dataset.suffix;
    });
    return;
  }

  // No hasRun flag and no disconnect(): the section is meant
  // to recount every time it scrolls into view, not just the first.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          statEls.forEach(animateStat);
        }
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(section);
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The three big numbers ("Active Projects", "Impact Makers", "Impact
  Hours") shown right after the Hero. These used to be in
  the footer's "Impact in Numbers" block we moved it up here so a
  first-time visitor actually sees the platform's social proof
  before deciding whether to keep scrolling.

 

  The animation is deliberately NOT one-shot: every time this section
  scrolls back into view, the numbers recount from 0. That's why
  there's no "hasRun" flag and the IntersectionObserver is never
  disconnected it was our deliberate choice, not an oversight.
  Because of that, animateStat() needed a way to stop an OLD count-up
  from fighting a NEW one if someone scrolls past the section
  repeatedly and re-triggers it mid-animation, that's what the
  runTokens WeakMap solves: each new run gets a unique token, and a
  rAF loop bails out the instant it notices a newer token has taken
  over its element.

  Class names follow BEM where "impact-stats" is the block, and 
  everything else is impact-stats__something.

  BLOCKS DEFINITIONS:
  ① STATS DATA           — the three numbers this section displays,
                           plus a flagged placeholder (Impact Hours
                           isn't a real figure yet).
  ② RENDERING             — builds the section's markup from the
                           STATS array.
  ③ NUMBER FORMATTING     — formatDisplay() turns a raw number into
                           its displayed form — "45.0K" instead of
                           "45000" for stats flagged "compact".
  ④ COUNT-UP ANIMATION    — animateStat() runs the actual 0-to-target
                           count-up via requestAnimationFrame; WeakMap is 
                           what keeps repeated scroll from racing each other
  ⑤ INITIALIZATION        — sets up the IntersectionObserver that
                           triggers animateStat() on every scroll into
                           view, with a reduced-motion fallback that
                           just snaps straight to the final numbers.

  CLASS NAME GLOSSARY:
  .impact-stats             The whole section.
  .impact-stats__wrap       Width-constrained inner wrapper.
  .impact-stats__row        Flex row holding all three stats side by
                             side.
  .impact-stats__stat       One stat block (number + label). Carries
                             the data-target/data-suffix/data-format
                             attributes animateStat() reads from.
  .impact-stats__stat-value The actual number text that counts up.
  .impact-stats__stat-divider  The thin vertical line between two
                             stats.

*/