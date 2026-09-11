import "./styles/cta.css";
// Static section, no interactivity. DEVELOPERS NOTE at the bottom

// ① RENDERING:
export function renderCta() {
  return `
    <section class="cta">
      <div class="cta__wrap">
        <div class="cta__box">

          <span class="cta__badge">Join the Movement</span>

          <h2>Ready to Make a Difference?</h2>

          <p>
            Join thousands of Nigerians already working alongside
            NearImpact to build greener, more educated communities.
          </p>

          <div class="cta__actions">
            <a href="#discover" class="cta__btn--primary">
              List Your Project
            </a>
            <a href="#community" class="cta__btn--secondary">
              Join Community
            </a>
          </div>

        </div>
      </div>
    </section>
  `;
}


/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  A single static call-to-action banner with no state, no interactivity,
  just one exported function that returns markup for main.js to drop
  onto the page. There's no initCta() because there's nothing here
  that needs wiring up after render. Hope you understand that?

  Class names follow BEM where "cta" is the block. One modifier pair:
  .cta__btn--primary / .cta__btn--secondary, since both buttons play
  the exact same role (a call-to-action link) but with different
  visual emphasis

  
  BLOCKS DEFINITIONS:
  ① RENDERING  — the whole section in one function: badge, heading,
                supporting copy, and the two action buttons.

  CLASS NAME GLOSSARY:
  .cta__wrap          Width-constrained inner wrapper.
  .cta__box           The actual colored card containing everything.
  .cta__badge         The small "Join the Movement" pill.
  .cta__actions       Row holding the two buttons.
  .cta__btn--primary  The filled/high-emphasis button.
  .cta__btn--secondary  The outlined/low-emphasis button.


*/