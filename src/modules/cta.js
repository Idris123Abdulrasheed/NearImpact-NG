import "../styles/cta.css";

export function renderCta() {
  return `
    <section class="cta-section">
      <div class="wrap">
        <div class="cta-box">

          <!-- Upper CTA feature -->
          <div class="cta-feature">
            <div class="cta-badge">🚀 Join the Movement</div>

            <h2>
              Your Impact Starts Nearby.
            </h2>
          </div>

          <!-- Lower CTA text and buttons like your screenshot -->
          <div class="cta-bottom">
            <p>
              Explore projects & meet Impact Makers. You can also list your own project so
              others can learn from it, join in or support your work.
            </p>

            <div class="cta-actions">
              <a href="#discover" class="btn-primary">
                Explore Projects
              </a>

              <a href="#community" class="btn-secondary">
                List Your Project
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  `;
}