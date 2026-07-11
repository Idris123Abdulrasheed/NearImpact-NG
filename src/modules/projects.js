import "../styles/projects.css";

export function renderProjects() {
  return `
    <section class="projects-section" id="discover">
      <div class="projects-wrap">

        <!-- Section header -->
        <div class="projects-header">
          <div>
            <div class="projects-eyebrow">📍 Near You in Akure</div>
            <h2>Sustainability Projects Nearby</h2>
            <p>
              Community-verified opportunities within 25 km of your location.
            </p>
          </div>

          <a href="#map" class="projects-map-btn">View map </a>
        </div>

        <!-- Project cards grid -->
        <div class="projects-grid">

          <article class="project-card">
            <div class="project-image soft-green">
              <span class="project-type volunteer">Volunteer</span>
              <button class="save-btn">♡</button>
<img
  class="project-illustration"
  src="/projects/tree-planting.png"
  alt="Urban Tree Planting"/>            
            </div>

            <div class="project-content">
              <div class="project-meta">
                <span>📍 1.8 km</span>
                <span>⭐ 3.9</span>
              </div>

              <h3>Urban Tree Planting</h3>
              <p>Green Ondo Network · Akure South</p>

              <div class="project-footer">
                <div class="sdg-tags">
                  <span>13</span>
                  <span>15</span>
                  <span>11</span>
                </div>

                <div class="volunteers">👥 142 volunteers</div>
              </div>
            </div>
          </article>

          <article class="project-card">
            <div class="project-image soft-yellow">
              <span class="project-type project">Project</span>
              <button class="save-btn">♡</button>
<img
  class="project-illustration"
  src="/projects/solar-grid.jpeg"
  alt="Solar Micro Grid"
/>            </div>

            <div class="project-content">
              <div class="project-meta">
                <span>📍 3.4 km</span>
                <span>⭐ 4.4</span>
              </div>

              <h3>Solar Micro-Grid for Rural Schools</h3>
              <p>SolarAfrica Initiative · Owo, Ondo State</p>

              <div class="project-footer">
                <div class="sdg-tags">
                  <span>7</span>
                  <span>4</span>
                  <span>1</span>
                </div>

                <div class="volunteers">👥 38 volunteers</div>
              </div>
            </div>
          </article>

          <article class="project-card">
            <div class="project-image soft-blue">
              <span class="project-type volunteer">Volunteer</span>
              <button class="save-btn">♡</button>
<img
  class="project-illustration"
  src="/projects/ocean-cleanup.png"
  alt="Ocean Cleanup"
/>            </div>

            <div class="project-content">
              <div class="project-meta">
                <span>📍 3.2 km</span>
                <span>⭐ 5.0</span>
              </div>

              <h3>Ocean Plastic Cleanup Drive</h3>
              <p>Clean Gutters Nigeria · Stateline, FUTA South </p>

              <div class="project-footer">
                <div class="sdg-tags">
                  <span>14</span>
                  <span>12</span>
                  <span>13</span>
                </div>

                <div class="volunteers">👥 289 volunteers</div>
              </div>
            </div>
          </article>

          <article class="project-card">
            <div class="project-image soft-pink">
              <span class="project-type training">Training</span>
              <button class="save-btn">♡</button>
<img
  class="project-illustration"
  src="/projects/climate-training.png"
  alt="Climate Training"
/>            </div>

            <div class="project-content">
              <div class="project-meta">
                <span>📍 8.5 km</span>
                <span>⭐ 4.7</span>
              </div>

              <h3>Youth Climate Advocacy Training</h3>
              <p>African Climate Foundation · Oja, Akure</p>

              <div class="project-footer">
                <div class="sdg-tags">
                  <span>13</span>
                  <span>4</span>
                  <span>16</span>
                </div>

                <div class="volunteers">👥 67 volunteers</div>
              </div>
            </div>
          </article>

          <article class="project-card">
            <div class="project-image soft-cream">
              <span class="project-type volunteer">Volunteer</span>
              <button class="save-btn">♡</button>
<img
  class="project-illustration"
  src="/projects/community-garden.jpeg"
  alt="Community Garden"
/>            </div>

            <div class="project-content">
              <div class="project-meta">
                <span>📍 6.1 km</span>
                <span>⭐ 4.2</span>
              </div>

              <h3>Community Food Garden Network</h3>
              <p>Urban Food Co-op Ondo · Owo</p>

              <div class="project-footer">
                <div class="sdg-tags">
                  <span>2</span>
                  <span>3</span>
                  <span>11</span>
                </div>

                <div class="volunteers">👥 204 volunteers</div>
              </div>
            </div>
          </article>

          <article class="project-card">
            <div class="project-image soft-red">
              <span class="project-type fellowship">Fellowship</span>
              <button class="save-btn">♡</button>
<img
  class="project-illustration"
  src="/projects/clean-energy.jpeg"
  alt="Women in Clean Energy"
/>            </div>

            <div class="project-content">
              <div class="project-meta">
                <span>📍 14 km</span>
                <span>⭐ 3.3</span>
              </div>

              <h3>Women in Clean Energy</h3>
              <p>PowerHer Foundation · Akure, Ondo</p>

              <div class="project-footer">
                <div class="sdg-tags">
                  <span>5</span>
                  <span>7</span>
                  <span>8</span>
                </div>

                <div class="volunteers">👥 91 volunteers</div>
              </div>
            </div>
          </article>

        </div>
      </div>
    </section>
  `;
}