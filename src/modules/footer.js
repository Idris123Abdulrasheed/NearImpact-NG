import "../styles/footer.css";

export function renderFooter() {
  return `
    <footer class="footer">
      <div class="footer-wrap">

        <div class="footer-grid">

          <div class="footer-brand">
            <div class="footer-logo">
              <img src="/logo.png" alt="NearImpact" />
            </div>

            <p>
              Connecting people, projects, opportunities & communities to sustainable impact near them.
            </p>

            <form class="newsletter">
              <input type="email" placeholder="Enter your email" />
              <button type="button">Subscribe</button>
            </form>
          </div>

          <div class="footer-col">
            <h3>Quick Links</h3>
            <a href="#">Home</a>
            <a href="#discover">Projects</a>
            <a href="#opportunities">Opportunities</a>
            <a href="#sdgs">SDGs</a>
            <a href="#community">Community</a>
          </div>

          <div class="footer-col">
            <h3>Resources</h3>
            <a href="#faq">FAQ</a>
            <a href="#">Contact</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms</a>
          </div>

          <div class="footer-col">
            <h3>Social Links</h3>
            <a href="#">LinkedIn</a>
            <a href="#">X</a>
            <a href="#">Instagram</a>
          </div>

        </div>

        <div class="footer-partners-row">

          <div class="footer-partners">
            <h3>In Support & Partnership With</h3>

            <div class="footer-partner-cards">
              <div class="footer-partner-card">
                <img src="/partners/sdgs.png" alt="SDGs logo" />
              </div>

              <div class="footer-partner-card">
                <img src="/partners/ngo.jpg" alt="NGO logo" />
              </div>

              <div class="footer-partner-card">
                <img src="/partners/leap.png" alt="LEAP logo" />
              </div>
            </div>
          </div>

          <div class="footer-impact">
            <h3>IMPACT IN NUMBERS</h3>

            <div class="footer-impact-cards">
              <div class="footer-impact-card">
                <strong>12K+</strong>
                <small>Active Projects</small>
              </div>

              <div class="footer-impact-card">
                <strong>48K+</strong>
                <small>Impact Makers</small>
              </div>

              <div class="footer-impact-card">
                <strong>2.1M</strong>
                <small>Impact Hours</small>
              </div>

              <div class="footer-impact-card">
                <strong>$3.8M</strong>
                <small>Grants Matched</small>
              </div>
            </div>
          </div>

        </div>

        <div class="footer-bottom">
          <p>© 2026 NearImpact Nigeria. All rights reserved.</p>
          <p>Built for local action and global goals.</p>
        </div>

      </div>
    </footer>
  `;
}