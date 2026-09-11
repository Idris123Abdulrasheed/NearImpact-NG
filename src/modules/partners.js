import "./styles/partners.css";
// Pure CSS marquee, no JS animation loop  
// DEVELOPERS NOTE at the bottom explains why.

// ① PARTNERS DATA:
// Our logo images stay as clean placeholder, no confirmed agreement yet.
const PARTNERS = [
  { name: "SDGs", logo: "/partners/sdgs.png" },
  { name: "ENVIRONMENTAL", logo: "/partners/environmental.png" },
  { name: "GREEN", logo: "/partners/green.png" },
  { name: "CODAF", logo: "/partners/codaf.png" },
  { name: "1PERCENT", logo: "/partners/1percent.png" },

  
];

// ② RENDERING:
function renderTile(p) {
  if (p.placeholder) {
    return `
      <div class="partners__tile partners__tile--placeholder">
        <span>Add Logo</span>
      </div>
    `;
  }
  return `
    <div class="partners__tile">
      <img src="${p.logo}" alt="${p.name}" loading="lazy" />
    </div>
  `;
}

export function renderPartners() {
  // Duplicated once so the marquee can loop seamlessly at -50% translate.
  const loop = [...PARTNERS, ...PARTNERS];

  return `
    <section class="partners" id="partners">
      <div class="partners__wrap">
        <h2>Our Partners &amp; Supporters</h2>
      </div>

      <div class="partners__track-outer">
        <div class="partners__track">
          ${loop.map(renderTile).join("")}
        </div>
      </div>
    </section>
  `;
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  Our scrolling logo marquee: no JS animation loop involved. The scroll itself 
  is a pure CSS (keyframe animation + hover-to-pause), same "let the browser do it" 
  philosophy as faq.js's native accordion. That's why there's no initPartners(), 
  CSS handles everything.

  The PARTNERS list is duplicated once (loop = [...PARTNERS, ...PARTNERS])
  purely so the CSS animation can loop seamlessly at a -50% translateX
  without a visible jump-cut back to the start.


  BLOCKS DEFINITIONS:
  ① PARTNERS DATA  — the actual logo list. Kept intentionally short
                     (5 real placeholder logos) 
  ② RENDERING       — renderTile() builds one tile (real logo or
                     placeholder); renderPartners() builds the section
                     shell and hands it the doubled-up loop array.

  
  Class names follow BEM where "partners" is the block. 
                   
  CLASS NAME GLOSSARY:
  .partners                    The whole section.
  .partners__wrap               Wrapper around the "Our Partners &
                                Supporters" heading.
  .partners__track-outer        Overflow-hidden container that masks
                                the scrolling track's edges.
  .partners__track               The actual scrolling row of tiles.
  .partners__tile                One logo tile.
  .partners__tile--placeholder   Modifier — a tile with no real logo
                                yet, shown as a dashed "Add Logo" box
                                instead.


*/