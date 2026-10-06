import { mountPage } from "./page-shell.js";
import { renderAllProjects, initAllProjects } from "../modules/all-projects.js";

// Entry for /all-projects.html: wraps the page body in the shared
// nav + footer + login modal. DEVELOPERS NOTE at the bottom.

// ① MOUNT:
mountPage({
  title: "Projects",
  html: renderAllProjects(),
  onMounted: initAllProjects,
});





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  Thin page entry, same pattern as the other src/pages/*.js files. The
  real work lives in src/modules/all-projects.js. all-projects.html
  must be listed in vite.config.js under build.rollupOptions.input.

  BLOCKS DEFINITIONS:
  ① MOUNT — one mountPage() call.

  CLASS NAME GLOSSARY:
  No CSS here — page entry file.
*/
