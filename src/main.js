// The composition root where every component gets assembled.
// DEVELOPERS NOTE at the bottom explains the render-then-init split
// and the one bit of markup this file builds itself.

// ① STYLE IMPORTS:
import "./modules/styles/base.css";
import "./modules/styles/nav.css";
import "./modules/styles/hero.css";
import "./modules/styles/impact-stats.css";
import "./modules/styles/projects.css";
import "./modules/styles/map.css";
import "./modules/styles/opportunities.css";
import "./modules/styles/sdgs.css";
import "./modules/styles/community.css";
import "./modules/styles/testimonials.css";
import "./modules/styles/cta.css";
import "./modules/styles/faq.css";
import "./modules/styles/partners.css";
import "./modules/styles/footer.css";
import "./modules/styles/auth-modal.css";

// ② COMPONENT IMPORTS:
import { renderNav, initNav } from "./modules/nav.js";
import { renderHero, initHeroSlideshow } from "./modules/hero.js";
import { renderImpactStats, initImpactStats } from "./modules/impact-stats.js";
import { renderMapHeader, renderMapBody, initMap } from "./modules/map.js";
import { renderLocationFilter, initLocationFilter } from "./modules/location-filter.js";
import { renderProjectList, initProjectList } from "./modules/project-list.js";
import { renderOpportunities, initOpportunities } from "./modules/opportunities.js";
import { renderSdgs } from "./modules/sdgs.js";
import { renderCommunity, initCommunityCarousel } from "./modules/community.js";
import { renderTestimonials, initTestimonials } from "./modules/testimonials.js";
import { renderCta } from "./modules/cta.js";
import { renderFaq } from "./modules/faq.js";
import { renderPartners } from "./modules/partners.js";
import { renderFooter, initFooter } from "./modules/footer.js";
import { renderAuthModal, initAuthModal } from "./modules/auth-modal.js";
import { initSearch } from "./modules/search.js";
import { initTheme } from "./modules/theme.js";
import { initUserMenu } from "./modules/user-menu.js";
import { initAuth } from "./modules/auth.js";

// ③ PAGE ASSEMBLY:
document.querySelector("#app").innerHTML = `
${renderNav()}
${renderHero()}
${renderImpactStats()}
${renderMapHeader()}
<section class="explore">
  <div class="explore__wrap">
    ${renderMapBody()}
    ${renderLocationFilter()}
  </div>
</section>
${renderProjectList()}
${renderOpportunities()}
${renderSdgs()}
${renderCommunity()}
${renderTestimonials()}
${renderCta()}
${renderFaq()}
${renderPartners()}
${renderFooter()}
${renderAuthModal()}
`;

// ④ INITIALIZATION:
initSearch();
initNav();
initUserMenu();
initHeroSlideshow();
initTheme();

initMap();
initLocationFilter();
initProjectList();
initOpportunities();
initCommunityCarousel();
initTestimonials();
initFooter();
initImpactStats();
initAuthModal();

// Fire-and-forget: checks for an existing session cookie and, if valid,
// notifies every subscriber (user-menu.js, anything else that ever
// subscribes to auth.js) once it resolves. Placed last since nothing
// above depends on knowing login state synchronously — components that
// care react to the subscription instead of waiting on this.
initAuth();







/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The entry point: imports every component's styles and render/init
  functions, builds the entire page in one innerHTML assignment, then
  calls every init function afterward.

  This file owns exactly ONE piece of markup itself: the small
  <section class="explore"> wrapper around renderMapBody() +
  renderLocationFilter(). That wrapper doesn't belong inside map.js or
  location-filter.js because it's not really part of either
  component; it's a layout decision specific to how THIS page
  chooses to present them together as one visual card.

  renderAuthModal() is assembled here too, same as every other
  section, even though it's not something the person "scrolls to" —
  it just starts hidden (see auth-modal.css) and toggles open from
  anywhere in the app via the "ni:open-auth-modal" event. It's placed
  last in the HTML string purely so it paints on top of everything
  else by DOM order as a fallback, though its z-index already
  guarantees that regardless of position.

  initAuth() runs after every other init(), not before — it's an
  async network call, and nothing else in this file needs to block on
  its result. Components that care about login state (user-menu.js)
  already subscribed to auth.js during their own init() call above,
  so whenever initAuth() resolves, they react to it the same way
  they'd react to a real-time login/logout.

  BLOCKS DEFINITIONS:
  ① STYLE IMPORTS       — every component's CSS file, imported once
                          here so bundlers pick them all up regardless
                          of which components a given page actually
                          renders.
  ② COMPONENT IMPORTS    — every render()/init() pair this page needs,
                          one line per component.
  ③ PAGE ASSEMBLY        — the actual innerHTML build. Order here is
                          the literal top-to-bottom order sections
                          appear on the page (renderAuthModal() is the
                          one exception, as explained above).
  ④ INITIALIZATION       — every init() call, run only after step ③'s
                          innerHTML assignment has fully completed,
                          plus the one async call (initAuth()) that
                          doesn't block anything else.

  CLASS NAME GLOSSARY:
  .explore        The shared card wrapper around the map + location
                  filter.
  .explore__wrap  The inner width-constrained wrapper inside it.


*/