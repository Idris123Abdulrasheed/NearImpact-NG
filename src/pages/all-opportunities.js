import { mountPage } from "./page-shell.js";
import { renderAllOpportunities, initAllOpportunities } from "../modules/all-opportunities.js";

// Entry for /all-opportunities.html: wraps the page body in the shared
// nav + footer + login modal. DEVELOPERS NOTE at the bottom.

// ① MOUNT:
mountPage({
  title: "Opportunities",
  html: renderAllOpportunities(),
  onMounted: initAllOpportunities,
});





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  Thin page entry, same pattern as the other src/pages/*.js files. All
  real work lives in src/modules/all-opportunities.js. Remember: the
  root all-opportunities.html must be listed in vite.config.js under
  build.rollupOptions.input.

  BLOCKS DEFINITIONS:
  ① MOUNT — one mountPage() call.

  CLASS NAME GLOSSARY:
  No CSS here — page entry file.
*/
