import { mountPage } from "./page-shell.js";
import { renderDetail, initDetail } from "../modules/detail.js";

// Entry for /detail.html?type=opportunity|project&id=...
// DEVELOPERS NOTE at the bottom.

// ① MOUNT:
mountPage({
  title: "Details",
  html: renderDetail(),
  onMounted: initDetail,
});





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  Thin page entry, same pattern as the other src/pages/*.js files. The
  real work is in src/modules/detail.js. detail.html must be listed in
  vite.config.js under build.rollupOptions.input.

  BLOCKS DEFINITIONS:
  ① MOUNT — one mountPage() call.

  CLASS NAME GLOSSARY:
  No CSS here — page entry file.
*/
