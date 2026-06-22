import "../styles/faq.css";

/*
========================================
Frequently Asked Questions
========================================
*/

export function renderFaq() {
  return `
    <section class="faq-section" id="faq">

      <div class="faq-wrap">

        <div class="faq-header">

          <div class="faq-eyebrow">
            ❓ Frequently Asked Questions
          </div>

          <h2>
            Questions to get you started
          </h2>

          
        </div>

        <div class="faq-grid">

          <details class="faq-item" open>
            <summary>What is NearImpact Nigeria?</summary>
            <p>
              NearImpact Nigeria is a platform that helps people discover
              sustainability projects, volunteer opportunities, grants,
              fellowships, internships, and changemakers working on
              meaningful impact across communities.
            </p>
          </details>

          <details class="faq-item">
            <summary>Can I list my own project?</summary>
            <p>
              Yes. NGOs, startups, schools, community groups,
              and individuals can list projects so others can
              learn from them, volunteer, collaborate,
              or provide support.
            </p>
          </details>

          <details class="faq-item">
            <summary>How do users find projects near them?</summary>
            <p>
              Users can browse nearby projects using location,
              SDG categories, project type, distance,
              and available opportunities.
            </p>
          </details>

          <details class="faq-item">
            <summary>Who are Impactmakers?</summary>
            <p>
              Impactmakers are people actively contributing to impact work,
              including volunteers, project leaders, researchers,
              educators, social entrepreneurs, and community organisers.
            </p>
          </details>

          <details class="faq-item">
            <summary>Is NearImpact only for Nigeria?</summary>
            <p>
              NearImpact currently focuses on Nigeria,
              but the platform is designed to support
              impact communities across Africa over time.
            </p>
          </details>

          <details class="faq-item">
            <summary>Do I need to pay to join?</summary>
            <p>
              No. Users can explore projects, learn about SDGs,
              discover opportunities, and connect with changemakers
              completely free.
            </p>
          </details>

          <details class="faq-item">
            <summary>Who can partner with NearImpact?</summary>
            <p>
              NearImpact welcomes partnerships with NGOs,
              schools, universities, youth networks,
              foundations, social enterprises,
              development organisations,
              and SDG-focused initiatives.
            </p>
          </details>

          <details class="faq-item">
            <summary>Can organisations publish opportunities?</summary>
            <p>
              Yes. Organisations can publish volunteer roles,
              internships, grants, fellowships,
              training programs, events,
              and community projects for people to discover.
            </p>
          </details>

          <details class="faq-item">
            <summary>How does NearImpact support the SDGs?</summary>
            <p>
              Every project and opportunity can be linked to
              one or more Sustainable Development Goals,
              helping users understand the impact areas
              being addressed.
            </p>
          </details>

        </div>

      </div>

    </section>
  `;
}