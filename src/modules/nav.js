import "./styles/nav.css";
import logo from "../assets/brand/logo.png";

window.showSidebar = function () {
  document.querySelector(".sidebar").style.display = "flex";
};

window.hideSidebar = function () {
  document.querySelector(".sidebar").style.display = "none";
};

window.goHome = function (event) {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
  const sidebar = document.querySelector(".sidebar");
  if (sidebar && sidebar.style.display === "flex") {
    hideSidebar();
  }
};

export function renderNav() {
  return `
    <header class="nav">
      <div class="nav-inner">

        <!-- Logo -->
        <a href="#" class="brand" onclick="goHome(event)" aria-label="NearImpact Nigeria home">
          <div class="brand-mark">
            <img src="${logo}" alt="NearImpact Nigeria logo" />
          </div>

          <div class="brand-text">
            <strong>Near<span>Impact</span></strong>
            <small>Nigeria</small>
          </div>
        </a>

        <!-- Desktop Search -->
        <div class="nav-search">
          <span>⌕</span>
          <input
            type="text"
            id="nav-search-input"
            placeholder="Search projects, places..."
            autocomplete="off"
          />
          <div id="nav-search-results" class="search-dropdown" hidden></div>
        </div>

        <!-- Desktop Navigation -->
        <nav class="nav-links">
          <a href="#discover">Discover</a>
          <a href="#map">View Map</a>
          <a href="#opportunities">Opportunities</a>
          <a href="#sdgs">Learn SDGs</a>
        </nav>

        <!-- Right Side -->
        <div class="nav-actions">

          <a href="#" class="login-btn">Log In</a>

          <button class="menu-button" onclick="showSidebar()">
            <svg xmlns="http://www.w3.org/2000/svg"
                 height="26"
                 viewBox="0 96 960 960"
                 width="26">
              <path d="M120 816v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z"/>
            </svg>
          </button>

        </div>

        <!-- Sidebar -->
        <nav class="sidebar">

          <div class="close-btn" onclick="hideSidebar()">
            <svg xmlns="http://www.w3.org/2000/svg"
                 height="26"
                 viewBox="0 96 960 960"
                 width="26">
              <path d="m249 849-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"/>
            </svg>
          </div>

          <div class="sidebar-search">
            <span>⌕</span>
            <input
              type="text"
              id="sidebar-search-input"
              placeholder="Search projects, places..."
              autocomplete="off"
            />
            <div id="sidebar-search-results" class="search-dropdown" hidden></div>
          </div>

          <a href="#discover" onclick="hideSidebar()">Discover</a>
          <a href="#map" onclick="hideSidebar()">View Map</a>
          <a href="#opportunities" onclick="hideSidebar()">Opportunities</a>
          <a href="#sdgs" onclick="hideSidebar()">Learn SDGs</a>

        </nav>

      </div>
    </header>
  `;
}