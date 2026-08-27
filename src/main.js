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

import { renderNav } from "./modules/nav.js";
import { renderHero } from "./modules/hero.js";
import { renderProjects } from "./modules/projects.js";
import { renderMap } from "./modules/map.js";
import { renderOpportunities } from "./modules/opportunities.js";
import { renderSdgs } from "./modules/sdgs.js";
import { renderCommunity } from "./modules/community.js";
import { renderTestimonials } from "./modules/testimonials.js";
import { renderCta } from "./modules/cta.js";
import { renderFaq } from "./modules/faq.js";
import { renderFooter } from "./modules/footer.js";
import { initSearch } from "./modules/search.js";


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

initSearch();