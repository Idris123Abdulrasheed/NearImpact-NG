import "../styles/testimonials.css";

/*
  Success Stories Section

  This section shows how NearImpact helps real users:
  - organisations find volunteers
  - young people discover opportunities
  - project teams explain their SDG impact
*/

export function renderTestimonials() {
  return `
    <section class="stories-section" id="stories">
      <div class="stories-wrap">

        <div class="stories-header">
          <div class="stories-eyebrow">🌟 Success Stories</div>

          <h2>What changed because of NearImpact?</h2>

          <p>
            Stories from people and organisations using local action to create
            measurable progress in their communities.
          </p>
        </div>

        <div class="story-grid">

          <article class="story-card featured-story">
            <div class="quote-mark">“</div>

            <p>
              NearImpact helped us find volunteers within our own community and
              grow our clean-up campaign faster than we expected.
            </p>

            <div class="story-person">
              <div class="avatar">AY</div>
              <div>
                <strong>Amina Yusuf</strong>
                <span>NGO Coordinator, Lagos</span>
              </div>
            </div>
          </article>

          <article class="story-card">
            <div class="quote-mark">“</div>

            <p>
              I found my first sustainability internship through a local project
              listed on the platform.
            </p>

            <div class="story-person">
              <div class="avatar orange">DO</div>
              <div>
                <strong>David Okafor</strong>
                <span>Student Volunteer, Yaba</span>
              </div>
            </div>
          </article>

          <article class="story-card">
            <div class="quote-mark">“</div>

            <p>
              The SDG mapping made it easier for our team to show partners
              where our work fits.
            </p>

            <div class="story-person">
              <div class="avatar blue">KA</div>
              <div>
                <strong>Kemi Adewale</strong>
                <span>Social Founder, Lekki</span>
              </div>
            </div>
          </article>

        </div>

      </div>
    </section>
  `;
}