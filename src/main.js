import "./modules/styles/base.css";
import "./modules/styles/nav.css";
import "./modules/styles/hero.css";
import "./modules/styles/projects.css";
import "./modules/styles/map.css";
import "./modules/styles/opportunities.css";
import "./modules/styles/sdgs.css";
import "./modules/styles/community.css";
import "./modules/styles/testimonials.css";
import "./modules/styles/cta.css";
import "./modules/styles/faq.css";
import "./modules/styles/footer.css";

import { renderNav } from "./modules/nav";
import { renderHero } from "./modules/hero";
import { renderProjects } from "./modules/projects";
import { renderMap } from "./modules/map";
import { renderOpportunities } from "./modules/opportunities";
import { renderSdgs } from "./modules/sdgs";
import { renderCommunity } from "./modules/community";
import { renderTestimonials } from "./modules/testimonials";
import { renderCta } from "./modules/cta";
import { renderFaq } from "./modules/faq.js";
import { renderFooter } from "./modules/footer";
import { initHeroVideo } from "./modules/hero-video";

document.querySelector("#app").innerHTML = `
${renderNav()}
${renderHero()}
${renderProjects()}
${renderMap()}
${renderOpportunities()}
${renderSdgs()}
${renderCommunity()}
${renderTestimonials()}
${renderCta()}
${renderFaq()}
${renderFooter()}
`; 
initHeroVideo();