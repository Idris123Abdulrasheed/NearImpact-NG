import "../styles/community.css";

/*
  Changemakers Network Section

  This section introduces real people users can connect with.
  Homepage shows 6 featured changemakers.
  The "View All" button can later open the full directory.
*/

export function renderCommunity() {
  return `
    <section class="changemakers-section" id="community">
      <div class="changemakers-wrap">

        <div class="changemakers-header">
          <div>
            <div class="changemakers-eyebrow">🤝 Changemakers Network</div>
            <h2>Meet the Changemakers</h2>
            <p>
              Connect with people building sustainable communities, leading projects,
              and creating real impact across Africa.
            </p>
          </div>

          <a href="#" class="view-all-makers">View All →</a>
        </div>

        <div class="changemakers-grid">

          <article class="maker-card">
            <div class="maker-top">
              <div class="maker-avatar">IA</div>
              <span class="verified">✓ Verified</span>
            </div>

            <h3>Idris Abdulrasheed</h3>
            <p>Sustainability Strategist</p>
            <small>NearImpact Nigeria</small>

            <div class="maker-focus">
              <span>SDG 4</span>
              <span>SDG 8</span>
              <span>SDG 13</span>
            </div>

            <div class="maker-stats">
              <div>
                <strong>12</strong>
                <span>Projects</span>
              </div>
              <div>
                <strong>1.4K</strong>
                <span>Hours</span>
              </div>
            </div>

            <button class="connect-btn">Connect</button>
          </article>

          <article class="maker-card">
            <div class="maker-top">
              <div class="maker-avatar green">AO</div>
              <span class="verified">✓ Verified</span>
            </div>

            <h3>Amara Osei</h3>
            <p>Climate Activist</p>
            <small>Green Futures Africa</small>

            <div class="maker-focus">
              <span>SDG 11</span>
              <span>SDG 13</span>
              <span>SDG 15</span>
            </div>

            <div class="maker-stats">
              <div>
                <strong>18</strong>
                <span>Projects</span>
              </div>
              <div>
                <strong>2.1K</strong>
                <span>Hours</span>
              </div>
            </div>

            <button class="connect-btn">Connect</button>
          </article>

          <article class="maker-card">
            <div class="maker-top">
              <div class="maker-avatar orange">FA</div>
              <span class="verified">✓ Verified</span>
            </div>

            <h3>Favour Adeyemi</h3>
            <p>SDG Educator</p>
            <small>Youth SDG Hub</small>

            <div class="maker-focus">
              <span>SDG 4</span>
              <span>SDG 5</span>
              <span>SDG 10</span>
            </div>

            <div class="maker-stats">
              <div>
                <strong>9</strong>
                <span>Projects</span>
              </div>
              <div>
                <strong>870</strong>
                <span>Hours</span>
              </div>
            </div>

            <button class="connect-btn">Connect</button>
          </article>

          <article class="maker-card">
            <div class="maker-top">
              <div class="maker-avatar blue">KA</div>
              <span class="verified">✓ Verified</span>
            </div>

            <h3>Kwame Asante</h3>
            <p>Solar Engineer</p>
            <small>SolarAfrica Initiative</small>

            <div class="maker-focus">
              <span>SDG 7</span>
              <span>SDG 9</span>
              <span>SDG 13</span>
            </div>

            <div class="maker-stats">
              <div>
                <strong>21</strong>
                <span>Projects</span>
              </div>
              <div>
                <strong>3.2K</strong>
                <span>Hours</span>
              </div>
            </div>

            <button class="connect-btn">Connect</button>
          </article>

          <article class="maker-card">
            <div class="maker-top">
              <div class="maker-avatar pink">FH</div>
              <span class="verified">✓ Verified</span>
            </div>

            <h3>Fatima Al-Hassan</h3>
            <p>Water Advocate</p>
            <small>Clean Water Collective</small>

            <div class="maker-focus">
              <span>SDG 3</span>
              <span>SDG 6</span>
              <span>SDG 12</span>
            </div>

            <div class="maker-stats">
              <div>
                <strong>15</strong>
                <span>Projects</span>
              </div>
              <div>
                <strong>1.9K</strong>
                <span>Hours</span>
              </div>
            </div>

            <button class="connect-btn">Connect</button>
          </article>

          <article class="maker-card">
            <div class="maker-top">
              <div class="maker-avatar purple">EO</div>
              <span class="verified">✓ Verified</span>
            </div>

            <h3>Emeka Okafor</h3>
            <p>Social Entrepreneur</p>
            <small>Impact Builders Lab</small>

            <div class="maker-focus">
              <span>SDG 8</span>
              <span>SDG 9</span>
              <span>SDG 17</span>
            </div>

            <div class="maker-stats">
              <div>
                <strong>11</strong>
                <span>Projects</span>
              </div>
              <div>
                <strong>1.2K</strong>
                <span>Hours</span>
              </div>
            </div>

            <button class="connect-btn">Connect</button>
          </article>

        </div>
      </div>
    </section>
  `;
}