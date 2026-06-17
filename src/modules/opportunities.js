import "../styles/opportunities.css";

export function renderOpportunities() {
  return `
    <section class="opportunities-section" id="opportunities">
      <div class="opportunities-wrap">

        <div class="opportunities-header">
          <div>
            <div class="opp-eyebrow">🚀 Grow With Purpose</div>
            <h2>Opportunities for Changemakers</h2>
            <p>
              Discover fellowships, grants, internships, jobs and leadership opportunities.
            </p>
          </div>

          <a href="#" class="opp-view-all">View All →</a>
        </div>

        <div class="opp-tabs">
          <button class="active">All</button>
          <button>Fellowships</button>
          <button>Grants</button>
          <button>Internships</button>
          <button>Jobs</button>
        </div>

        <div class="opp-grid">

          <article class="opp-card">
            <div class="opp-badge fellowship">Fellowship</div>

            <h3>African Climate Fellowship 2026</h3>

            <p>
              Build leadership skills while working on real sustainability projects.
            </p>

            <div class="opp-details">
              <span>📍 Africa</span>
              <span>⏳ Closes Jul 30</span>
            </div>

            <div class="opp-footer">
              <strong>$5,000 Grant</strong>
              <a href="#">Apply →</a>
            </div>
          </article>

          <article class="opp-card">
            <div class="opp-badge grant">Grant</div>

            <h3>Youth Impact Fund</h3>

            <p>
              Funding support for innovative community and SDG-focused projects.
            </p>

            <div class="opp-details">
              <span>📍 Nigeria</span>
              <span>⏳ Closes Aug 12</span>
            </div>

            <div class="opp-footer">
              <strong>$10,000 Funding</strong>
              <a href="#">Apply →</a>
            </div>
          </article>

          <article class="opp-card">
            <div class="opp-badge internship">Internship</div>

            <h3>Sustainability Research Intern</h3>

            <p>
              Support environmental research, reporting and impact measurement.
            </p>

            <div class="opp-details">
              <span>📍 Lagos</span>
              <span>⏳ Open Now</span>
            </div>

            <div class="opp-footer">
              <strong>₦150k / month</strong>
              <a href="#">Apply →</a>
            </div>
          </article>

          <article class="opp-card">
            <div class="opp-badge job">Job</div>

            <h3>Program Coordinator</h3>

            <p>
              Coordinate sustainability projects and stakeholder engagement.
            </p>

            <div class="opp-details">
              <span>📍 Abuja</span>
              <span>⏳ Closes Jul 18</span>
            </div>

            <div class="opp-footer">
              <strong>Full-time</strong>
              <a href="#">Apply →</a>
            </div>
          </article>

          <article class="opp-card">
            <div class="opp-badge fellowship">Leadership</div>

            <h3>Young SDG Leaders Program</h3>

            <p>
              Join a network of emerging leaders driving social impact.
            </p>

            <div class="opp-details">
              <span>📍 Africa</span>
              <span>⏳ Rolling</span>
            </div>

            <div class="opp-footer">
              <strong>12 Months</strong>
              <a href="#">Apply →</a>
            </div>
          </article>

          <article class="opp-card">
            <div class="opp-badge grant">Grant</div>

            <h3>Community Innovation Challenge</h3>

            <p>
              Grants for solutions addressing local environmental challenges.
            </p>

            <div class="opp-details">
              <span>📍 Nigeria</span>
              <span>⏳ Aug 20</span>
            </div>

            <div class="opp-footer">
              <strong>₦5M Fund</strong>
              <a href="#">Apply →</a>
            </div>
          </article>

        </div>

      </div>
    </section>
  `;
}