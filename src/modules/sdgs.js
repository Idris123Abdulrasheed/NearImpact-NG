import "./styles/sdgs.css";
// The file contain straightforward show-more grid,
// The DEVELOPERS NOTE at the bottom might be helpful as well.

// ① SDG DATA:
const INITIAL_VISIBLE = 10; // ~2 rows at the 5-col desktop breakpoint

// ② RENDERING:
export function renderSdgs() {
  const sdgs = [
    { id: 1, title: "No Poverty" },
    { id: 2, title: "Zero Hunger" },
    { id: 3, title: "Good Health & Well-being" },
    { id: 4, title: "Quality Education" },
    { id: 5, title: "Gender Equality" },
    { id: 6, title: "Clean Water & Sanitation" },
    { id: 7, title: "Affordable & Clean Energy" },
    { id: 8, title: "Decent Work & Economic Growth" },
    { id: 9, title: "Industry, Innovation & Infrastructure" },
    { id: 10, title: "Reduced Inequalities" },
    { id: 11, title: "Sustainable Cities & Communities" },
    { id: 12, title: "Responsible Consumption & Production" },
    { id: 13, title: "Climate Action" },
    { id: 14, title: "Life Below Water" },
    { id: 15, title: "Life on Land" },
    { id: 16, title: "Peace, Justice & Strong Institutions" },
    { id: 17, title: "Partnerships for the Goals" },
    { id: 18, title: "The Global Goals" }
  ];

  return `
    <section class="sdgs" id="sdgs">

      <div class="sdgs__wrap">

        <div class="sdgs__header">

          <div>
            <h2>Explore the 17 Global Goals</h2>

            <p>
              Every project on NearImpact connects to one or more of the UN Sustainable Development Goals. Learn their purpose and discover impacts or opportunities aligned
              with each mission.
            </p>
          </div>

        </div>

        <div class="sdgs__grid" id="sdg-grid">

          ${sdgs
            .map(
              (sdg, index) => `
              <div class="sdgs__card${index >= INITIAL_VISIBLE ? " sdgs__card--extra" : ""}">

  <img
    class="sdgs__card-image"
    src="/sdgs/sdg${sdg.id}.png"
    alt="SDG ${sdg.id} - ${sdg.title}"
  >

</div>
            `
            )
            .join("")}

        </div>

        <div class="sdgs__toggle-wrap">
          <button
            class="sdgs__toggle-btn"
            id="sdgs-toggle-btn"
            type="button"
          >
            Show More
          </button>
        </div>

      </div>

    </section>
  `;
}

// ③ INITIALIZATION:
export function initSdgsToggle() {
  const grid = document.getElementById("sdg-grid");
  const button = document.getElementById("sdgs-toggle-btn");

  if (!grid || !button) return;

  const extraCount = grid.querySelectorAll(".sdgs__card--extra").length;
  if (extraCount === 0) {
    button.style.display = "none";
    return;
  }

  button.addEventListener("click", () => {
    const isExpanded = grid.classList.contains("is-expanded");

    if (isExpanded) {
      grid.classList.remove("is-expanded");
      button.textContent = "Show More";
    } else {
      grid.classList.add("is-expanded");
      button.textContent = "Show Less";
    }
  });
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The "Explore the 17 Global Goals" grid: Our static list of SDG cards
  with a Show More toggle that reveals everything past the first
  INITIAL_VISIBLE. 

  Class names follow BEM where "sdgs" is the block. 

  BLOCKS DEFINITIONS:
  ① SDG DATA        — just the INITIAL_VISIBLE cutoff. The actual SDG
                      titles live inline inside renderSdgs() rather
                      than as a separate constant, since this data
                      never needs to be filtered/sorted/reused
                      elsewhere the way project or opportunity data
                      does.
  ② RENDERING        — builds the full grid, marking any card past
                      INITIAL_VISIBLE with the --extra modifier so
                      CSS can hide it by default.
  ③ INITIALIZATION   — initSdgsToggle() checks whether there are any
                      --extra cards at all — if the grid is short
                      enough that nothing's hidden, the toggle button
                      just hides itself entirely rather than sitting
                      there uselessly. 

  CLASS NAME GLOSSARY:
  .sdgs               The whole section.
  .sdgs__wrap         Width-constrained inner wrapper.
  .sdgs__header       Heading + intro paragraph block.
  .sdgs__grid         The grid container holding every SDG card.
  .sdgs__card         One SDG card.
  .sdgs__card--extra  Modifier on any card past INITIAL_VISIBLE;
                      hidden until Show More is pressed.
  .sdgs__card-image   The SDG artwork inside a card.
  .sdgs__toggle-wrap  Wrapper around the toggle button.
  .sdgs__toggle-btn   The Show More/Show Less button itself.

  State class "is-expanded" (on the grid) is deliberately not
  BEM-ified; initSdgsToggle() flips it on and off directly in
  response to the button click, so it's a flag, not a permanent
  structural name.
*/