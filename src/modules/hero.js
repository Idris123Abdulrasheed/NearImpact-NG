import "./styles/hero.css";
import heroBackground from "../assets/hero/hero-image.png";

export function renderHero() {
  return `
    <section
      class="hero"
      style="background-image: linear-gradient(to right,
      rgba(248,250,252,0.98) 0%,
      rgba(248,250,252,0.95) 24%,
      rgba(248,250,252,0.82) 38%,
      rgba(248,250,252,0.30) 52%,
      rgba(255,255,255,0) 66%),
      url(${heroBackground});"
    >

      <div class="hero-overlay">

        <div class="hero-content">

          <!--<div class="hero-pill">
            <span></span>
            Africa's Sustainability Discovery Platform
          </div>-->

          <h1>
            <span class="line-one">
              Your <em>Impact</em>
            </span>

            <span class="line-two">
              Starts Nearby..
            </span>
          </h1>

          <p>
            Find sustainability projects and opportunities around you,
            connect with impactmakers, and explore SDG-aligned projects
            across Nigeria.
          </p>

          <div class="hero-actions">
            <a href="#opportunities" class="hero-primary">
              Explore Opportunities
            </a>

            <a href="#community" class="hero-secondary">
              Join NearImpact
            </a>
          </div>

          <div class="hero-stats">

            <!--<div class="stat-item">
              <strong>900+</strong>
              <span>Opportunities</span>
            </div>-->

            <!--<div class="stat-item">
              <strong>400+</strong>
              <span>Organizations</span>
            </div>-->

            <!--<div class="stat-item">
              <strong>36</strong>
              <span>States</span>
            </div>-->

            <!--<div class="stat-item">
              <strong>17</strong>
              <span>SDGs</span>
            </div>-->

            <div class="stat-item">
              <strong>108+</strong>
              <span>Active Projects</span>
            </div>

            <div class="stat-item">
              <strong>650+</strong>
              <span>Impact Makers</span>
            </div>

          </div>

        </div>

      </div>

    </section>
  `;
}