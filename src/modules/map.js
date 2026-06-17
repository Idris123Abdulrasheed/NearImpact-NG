import "../styles/map.css";

/*
  Impact Around You Map Section

  This section shows:
  1. A list of nearby impact projects on the left.
  2. A visual map preview on the right.
  3. A button to open the full map later.
*/

export function renderMap() {
  return `
    <section class="impact-map-section" id="map">
      <div class="impact-map-wrap">

        <!-- Section heading -->
        <div class="impact-map-header">
          <div>
            <div class="impact-map-eyebrow">🗺 Explore the Map</div>
            <h2>Impact Around You</h2>
            <p>
              Every pin is a project, organisation, or opportunity helping communities grow.
            </p>
          </div>

          <a href="#" class="impact-map-button">Open full map →</a>
        </div>

        <!-- Main content area -->
        <div class="impact-map-grid">

          <!-- Left side: nearby project list -->
          <div class="nearby-panel">
            <div class="nearby-panel-top">
              <strong>Nearby Projects</strong>
              <span>18 within 25km</span>
            </div>

            <div class="nearby-list">
              <article class="nearby-item active">
                <div class="nearby-icon">🌳</div>
                <div>
                  <h3>Urban Tree Planting</h3>
                  <p>Green Lagos</p>
                  <span>📍 1.8 km away</span>
                </div>
              </article>

              <article class="nearby-item">
                <div class="nearby-icon blue">🌊</div>
                <div>
                  <h3>Ocean Plastic Cleanup</h3>
                  <p>Clean Coasts NG</p>
                  <span>📍 3.2 km away</span>
                </div>
              </article>

              <article class="nearby-item">
                <div class="nearby-icon yellow">☀️</div>
                <div>
                  <h3>Solar School Grid</h3>
                  <p>SolarAfrica</p>
                  <span>📍 8.4 km away</span>
                </div>
              </article>

              <article class="nearby-item">
                <div class="nearby-icon pink">📣</div>
                <div>
                  <h3>Youth Climate Camp</h3>
                  <p>ACF Lagos</p>
                  <span>📍 8.5 km away</span>
                </div>
              </article>

              <article class="nearby-item">
                <div class="nearby-icon green">🥬</div>
                <div>
                  <h3>Community Garden</h3>
                  <p>Urban Food Co-op</p>
                  <span>📍 6.1 km away</span>
                </div>
              </article>

              <article class="nearby-item">
                <div class="nearby-icon orange">⚡</div>
                <div>
                  <h3>Women in Energy Hub</h3>
                  <p>PowerHer Foundation</p>
                  <span>📍 14 km away</span>
                </div>
              </article>
            </div>
          </div>

          <!-- Right side: visual map preview -->
          <div class="city-map-preview">
            <div class="road road-one"></div>
            <div class="road road-two"></div>
            <div class="water-strip"></div>

            <span class="city-pin pin-green">🌳</span>
            <span class="city-pin pin-red">📍</span>
            <span class="city-pin pin-blue">🌊</span>
            <span class="city-pin pin-yellow">☀️</span>
            <span class="city-pin pin-orange">⚡</span>

            <div class="map-credit">NearImpact Map · Lagos, Nigeria</div>
          </div>

        </div>
      </div>
    </section>
  `;
}