import "./styles/base.css";
import "./styles/nav.css";
import "./styles/hero.css";
import "./styles/projects.css";
import "./styles/map.css";
import "./styles/opportunities.css";
import "./styles/sdgs.css";
import "./styles/community.css";
import "./styles/testimonials.css";
import "./styles/cta.css";
import "./styles/faq.css";
import "./styles/footer.css";

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