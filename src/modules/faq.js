import "./styles/faq.css";
// Native <details>/<summary> accordion DEVELOPERS NOTE at the bottom 
// explains why it is our deliberate choice.

// ① FAQ DATA:
const faqItems = [
  {
    q: "What is NearImpact Nigeria?",
    a: "NearImpact Nigeria is a platform that helps people discover sustainability projects, volunteer opportunities, grants, fellowships, internships and impactmakers working on meaningful impact across communities."
  },
  {
    q: "Who are Impactmakers?",
    a: "Impactmakers are people actively contributing to impact work, including volunteers, project leaders, researchers, educators, social entrepreneurs and community organisers."
  },
  {
    q: "How do I find projects near me?",
    a: "Using the search and map; users can search nearby projects using location, SDG categories, project type, distance and available opportunities."
  },
  {
    q: "Is there any fees to get started?",
    a: "No. Users can explore projects, learn about SDGs, discover opportunities, and connect with impactmakers for completely free."
  },
  {
    q: "Do we support the UN SDGs?",
    a: "Yes. Every project and opportunity in this platform can be linked to one or more Sustainable Development Goals, helping users understand the impact areas being addressed."
  },
  {
    q: "Can I list my own project?",
    a: "Yes. NGOs, startups, schools, community groups and individuals can list projects so others can learn from them, volunteer, collaborate, or provide support."
  },
  {
    q: "Is NearImpact only for Nigeria?",
    a: "Currently NearImpact Nigeria focuses on Nigeria, but the platform is designed to impact communities across Africa as we grow."
  },
  {
    q: "Can I partner with NearImpact?",
    a: "NearImpact welcomes partnerships with NGOs, schools, universities, foundations, social enterprises, development organisations and SDG-focused initiatives."
  },
  {
    q: "Who can publish opportunities?",
    a: "Anyone can publish volunteer roles, internships, grants, fellowships, training programs, events and community projects for people to discover."
  }
];

// ② RENDERING:
export function renderFaq() {
  return `
    <section class="faq" id="faq">
      <div class="faq__wrap">

        <div class="faq__header">
          <h2>Frequently Asked Questions</h2>
          <p>Find answers to common questions about NearImpact and how to get involved.</p>
        </div>

        <div class="faq__list">
          ${faqItems
            .map(
              (item, i) => `
              <details class="faq__item" name="faq-group" ${i === 0 ? "open" : ""}>
                <summary>
                  <span>${item.q}</span>
                  <svg class="faq__chevron" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                    <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </summary>
                <div class="faq__answer">
                  <p>${item.a}</p>
                </div>
              </details>
            `
            )
            .join("")}
        </div>

      </div>
    </section>
  `;
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The FAQ accordion. No initFaq() here on purpose; this uses native
  HTML <details>/<summary> elements, which already handle open/close
  behavior, and the toggle state entirely on their own. That's "let the browser do it" 
  the same philosophy behind partners.js's pure-CSS marquee, so there's zero JS needed for the
  interactive part at all.

  The name="faq-group" attribute on every <details> is what makes
  them behave like an accordion (opening one auto-closes any other
  with the same name) which is native browser behavior too, not
  something this file implements.

  Class names follow BEM where "faq" is the block. Note that [open] in
  faq.css is an HTML ATTRIBUTE selector, not a CSS class i.e we have nothing to BEM-ify here, 
  since it's not something this file ever adds or removes itself.

  BLOCKS DEFINITIONS:
  ① FAQ DATA    — the question/answer pairs. First item opens by
                  default (i === 0 check below in RENDERING) so the
                  accordion doesn't look empty on first load.
  ② RENDERING    — builds the full list of <details> elements from
                  faqItems.

  CLASS NAME GLOSSARY:
  .faq          The whole section.
  .faq__wrap    Width-constrained inner wrapper.
  .faq__header  Heading + intro text block.
  .faq__list    Container holding every FAQ item.
  .faq__item    One <details> element (one question/answer pair).
  .faq__chevron The small arrow icon that rotates on open/close.
  .faq__answer  The answer text wrapper inside an item.


*/