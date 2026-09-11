import "./styles/opportunities.css";
// If the "index >= 4" our logic looks arbitrary, the DEVELOPERS NOTE below explains in detail.

// ① OPPORTUNITIES DATA:
const opportunities = [
  { badge: "fellowship", label: "Fellowship", title: "Climate Fellowship '26", location: "📍 Africa", closes: "⏳ Closes Jul 30", reward: "$500 Grant" },
  { badge: "fellowship", label: "Fellowship", title: "Young SDG Leaders Program", location: "📍 Africa", closes: "⏳ Rolling", reward: "12 Months" },
  { badge: "fellowship", label: "Fellowship", title: "Global Leaders Fellowship", location: "📍 Abuja", closes: "⏳ Closes Sep 5", reward: "$1,200 Stipend" },
  { badge: "fellowship", label: "Fellowship", title: "Women in Tech Fellowship", location: "📍 Lagos", closes: "⏳ Closes Oct 10", reward: "₦300k Stipend" },

  { badge: "grant", label: "Grant", title: "Youth Impact Fund", location: "📍 Nigeria", closes: "⏳ Closes Aug 12", reward: "$14,000 Funding" },
  { badge: "grant", label: "Grant", title: "Community Innov. Challenge", location: "📍 Nigeria", closes: "⏳ Closes Aug 20", reward: "₦1.7M Fund" },
  { badge: "grant", label: "Grant", title: "Clean Water Access Grant", location: "📍 Ondo", closes: "⏳ Closes Sep 15", reward: "₦2.3M Fund" },
  { badge: "grant", label: "Grant", title: "Renewable Energy Grant", location: "📍 Kano", closes: "⏳ Closes Nov 1", reward: "$8,000 Funding" },

  { badge: "internship", label: "Internship", title: "SDGs Research Intern", location: "📍 Lagos", closes: "⏳ Open Now", reward: "₦150k / month" },
  { badge: "internship", label: "Internship", title: "Climate Data Intern", location: "📍 Abuja", closes: "⏳ Open Now", reward: "₦120k / month" },
  { badge: "internship", label: "Internship", title: "Environmental Policy Intern", location: "📍 Port Harcourt", closes: "⏳ Closes Aug 30", reward: "₦100k / month" },
  { badge: "internship", label: "Internship", title: "Green Design Intern", location: "📍 Ibadan", closes: "⏳ Closes Sep 10", reward: "₦130k / month" },

  { badge: "job", label: "Job", title: "Program Coordinator", location: "📍 Abuja", closes: "⏳ Closes Jul 18", reward: "Full-time" },
  { badge: "job", label: "Job", title: "Field Operations Manager", location: "📍 Akure", closes: "⏳ Closes Aug 25", reward: "Full-time" },
  { badge: "job", label: "Job", title: "Communications Officer", location: "📍 Lagos", closes: "⏳ Closes Sep 1", reward: "Full-time" },
];

// ② DATA HELPERS:
function getByCategory(category) {
  return category === "all"
    ? opportunities
    : opportunities.filter((opp) => opp.badge === category);
}

// ③ RENDERING — CARD:
function renderOppCard(opp, index) {
  const extraModifier = index >= 4 ? " opportunities__card--extra" : "";
  return `
    <article class="opportunities__card${extraModifier}">
      <div class="opportunities__card-content">
        <span class="opportunities__badge opportunities__badge--${opp.badge}">${opp.label}</span>
        <h3>${opp.title}</h3>

        <div class="opportunities__card-details">
          <span>${opp.location}</span>
          <span>${opp.closes}</span>
        </div>

        <div class="opportunities__card-footer">
          <strong>${opp.reward}</strong>
          <a href="#">Apply</a>
        </div>
      </div>
    </article>
  `;
}

// ④ RENDERING — GRID:
function renderGridHTML(category) {
  return getByCategory(category).map(renderOppCard).join("");
}

// ⑤ RENDERING — SHELL:
export function renderOpportunities() {
  return `
    <section class="opportunities" id="opportunities">
      <div class="opportunities__wrap">

        <div class="opportunities__header">
          <h2>Opportunities for Impactmakers</h2>
          <p>
            Discover fellowships, grants, internships, jobs and leadership opportunities.
          </p>
        </div>

        <div class="opportunities__tabs-scroll">
          <div class="opportunities__tabs">
            <button class="active" data-category="all">All</button>
            <button data-category="fellowship">Fellowships</button>
            <button data-category="grant">Grants</button>
            <button data-category="internship">Internships</button>
            <button data-category="job">Jobs</button>
          </div>
          <span class="opportunities__tabs-chevron">›</span>
        </div>

        <div class="opportunities__grid" id="opp-grid">
          ${renderGridHTML("all")}
        </div>

        <div class="opportunities__footer">
          <button class="opportunities__show-more" id="opp-show-more" type="button">Show More</button>
        </div>

      </div>
    </section>
  `;
}

// ⑥ INITIALIZATION:
// Switching category re-renders the grid from filtered data and resets
// the show-more state.
export function initOpportunities() {
  const grid = document.getElementById("opp-grid");
  const showMoreBtn = document.getElementById("opp-show-more");
  const tabs = document.querySelectorAll(".opportunities__tabs button");

  function resetShowMore() {
    grid.classList.remove("expanded");
    if (showMoreBtn) showMoreBtn.textContent = "Show More";
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((btn) => btn.classList.remove("active"));
      tab.classList.add("active");
      grid.innerHTML = renderGridHTML(tab.dataset.category);
      resetShowMore();
    });
  });

  if (showMoreBtn && grid) {
    showMoreBtn.addEventListener("click", () => {
      const isExpanded = grid.classList.contains("expanded");
      if (isExpanded) {
        grid.classList.remove("expanded");
        showMoreBtn.textContent = "Show More";
      } else {
        grid.classList.add("expanded");
        showMoreBtn.textContent = "Show Less";
      }
    });
  }
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The "Opportunities for Impactmakers" section: category tabs over a
  card grid, with a Show More toggle that reveals cards beyond the
  first 4. 

  Class names follow BEM where "opportunities" is the block. The one modifier here,
  .opportunities__card--extra, is applied once at render time based
  on a card's POSITION in whatever list is currently showing (4th
  card onward).


  BLOCKS DEFINITIONS:
  ① OPPORTUNITIES DATA  — the local mock data array. Kept separate
                          from markup specifically so filtering by
                          category and slicing to "first 4" are just
                          plain array operations 
  ② DATA HELPERS         — getByCategory() is the one function that
                          actually filters the data. "all" returns
                          everything, anything else filters by badge.
  ③ RENDERING — CARD      — renderOppCard() builds one card. Whether it
                          gets the "extra" modifier depends purely on
                          its index in whatever array it's called
                          against 
  ④ RENDERING — GRID      — renderGridHTML() is the thin glue between
                          the data helper and the card renderer.
  ⑤ RENDERING — SHELL     — renderOpportunities() builds the section's
                          outer shell: heading, tabs, the grid,
                           and the Show More button.
  ⑥ INITIALIZATION        — wires up tab clicks (re-renders the grid
                          from filtered data, resets Show More back to
                          collapsed) and the Show More toggle itself.
                          

  CLASS NAME GLOSSARY:
  .opportunities                The whole section.
  .opportunities__wrap          Width-constrained inner wrapper.
  .opportunities__header        Heading + intro paragraph block.
  .opportunities__tabs-scroll   Horizontally-scrollable container for
                                 the category tab row.
  .opportunities__tabs          The actual row of category tab buttons.
  .opportunities__tabs-chevron  Small chevron hint, mobile only,
                                 signaling there's more to scroll.
  .opportunities__grid          The card grid container.
  .opportunities__card          One opportunity card.
  .opportunities__card--extra   Modifier on any card beyond the first
                                 4 — hidden until Show More is pressed.
  .opportunities__card-content  Padding wrapper inside a card.
  .opportunities__badge         The colored category pill on a card
                                 ("Fellowship", "Grant", etc).
  .opportunities__badge--*      Modifier setting that pill's color per
                                 category (fellowship/grant/internship/job).
  .opportunities__card-details  Row showing location + closing date.
  .opportunities__card-footer   Row holding the reward text + Apply link.
  .opportunities__footer        Wrapper around the Show More button.
  .opportunities__show-more     The Show More/Show Less button itself.

  State classes "active" (on a tab) and "expanded" (on the grid) are
  deliberately not BEM-ified they flips on and off directly in response 
  to clicks, so they're flags, not permanent structural names.

*/