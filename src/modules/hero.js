import "../styles/hero.css";
import heroImage from "../assets/hero/hero-image.jpeg";
import HeroMiniImage from "../assets/hero/hero-mini-image.png";

export function renderHero() {
  return `
    <section class="hero">
      <div class="hero-wrap">

        <!-- LEFT SIDE: Hero text, buttons, and statistics -->
        <div class="hero-content">
          <div class="hero-pill">
            <span></span>
            Africa's Sustainability Discovery Platform
          </div>

          <h1>
            <span class="line-one">Discover <em>Impact.</em></span>
            <span class="line-two">Create impact.</span>
          </h1>

          <p>
            Find sustainability opportunities, connect with impactmakers, and explore SDG-aligned projects across Nigeria.
          </p>

          <div class="hero-actions">
            <a href="#opportunities" class="hero-primary">Explore Opportunities </a>
            <a href="#community" class="hero-secondary">Join NearImpact</a>
          </div>

          <!-- Six equal statistic cards: 3 cards up, 3 cards down -->
          <div class="hero-stats">
            <div class="stat-card">
              <!--<div class="stat-icon">🤝</div>-->
              <strong>900+</strong>
              <span>Opportunities</span>
            </div>

            <div class="stat-card">
              <!--<div class="stat-icon">🏢</div>-->
              <strong>400+</strong>
              <span>Organizations</span>
            </div>

            <div class="stat-card">
              <!--<div class="stat-icon">📍</div>-->
              <strong>36</strong>
              <span>States</span>
            </div>

            <div class="stat-card">
              <!--<div class="stat-icon">🌍</div>-->
              <strong>17</strong>
              <span>SDGs</span>
            </div>

            <div class="stat-card">
             <!-- <div class="stat-icon">📈</div>-->
              <strong>108+</strong>
              <span>Active Projects</span>
            </div>

            <div class="stat-card">
              <!--<div class="stat-icon">🌱</div>-->
              <strong>650+</strong>
              <span>Impact Makers</span>
            </div>
          </div>
        </div>

        <!-- RIGHT SIDE: Nigeria map card -->
        <div class="hero-visual">
          <!--<div class="impact-map-card">
            <div class="map-heading">
              <span>NearImpact Nigeria</span>
              <strong>Live Impact Map</strong>
            </div>-->

            <div class="map-stage">
              <img
                src="${heroImage}"
                alt="Nigeria impact map"
                class="nigeria-map-img"
              />
            </div>

            <div class="mini-project-card">

              <div class="mini-project-info">
                 <strong>Nearest Project</strong>
                 <span>📍 Ondo • 1.8 km away</span>
                 <a href="#map">View MAP</a>
              </div>

                <img
                  src="${HeroMiniImage}"
                  alt="Nearest Project"
                  class="mini-project-image"
                />

            </div>
          </div>
        </div>

      </div>
    </section>
  `;
}