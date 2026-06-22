import "../styles/nav.css";

export function renderNav() {
  return `
    <header class="nav">
      <div class="nav-inner">
        <a href="#" class="brand">
          <div class="brand-mark">
            <img src="/src/assets/brand/logo.png" alt="NearImpact Nigeria logo" />
          </div>

          <div class="brand-text">
            <strong>Near<span>Impact</span></strong>
            <small>Nigeria</small>
          </div>
        </a>

        <div class="nav-search">
          <span>⌕</span>
          <input type="text" placeholder="Search projects...   , SDGs, cities..." />
        </div>

        <nav class="nav-links">
          <a href="#discover">Discover</a>
          <a href="#opportunities">Opportunities</a>
          <a href="#community">Network</a>
          <a href="#sdgs">Learn SDGs</a>
        </nav>

        <div class="nav-actions">
          <a href="#" class="login-btn">Log In</a>
          <a href="#" class="signup-btn">Sign Up</a>
        </div>
      </div>
    </header>
  `;
}