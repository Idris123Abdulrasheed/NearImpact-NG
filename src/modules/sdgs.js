import "./styles/sdgs.css";

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
    { id: 18, title: "Turning Global Goals into Local Actions" }
  ];

  return `
    <section class="sdgs-section" id="sdgs">

      <div class="sdgs-wrap">

        <div class="sdgs-header">

          <div>

            <div class="sdgs-eyebrow">
              Sustainable Development Goals
            </div>

            <h2>Explore the 17 Global Goals</h2>

            <p>
              Every project on NearImpact contributes to one or more of the
              United Nations Sustainable Development Goals. Browse the goals,
              learn their purpose, and discover impact opportunities aligned
              with each mission.
            </p>

          </div>

          <a href="#" class="sdgs-learn-btn">
            Explore Projects 
          </a>

        </div>

        <div class="sdg-grid">

          ${sdgs
            .map(
              (sdg) => `
              <div class="sdg-card">

  <img
    class="sdg-image"
    src="/sdgs/sdg${sdg.id}.png"
    alt="SDG ${sdg.id} - ${sdg.title}"
  >

</div>
            `
            )
            .join("")}

        </div>

      </div>

    </section>
  `;
}