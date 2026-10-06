import { mountPage } from "./page-shell.js";
import { renderImpactmakersPage, initImpactmakersPage } from "../modules/impactmakers-page.js";
// Entry for impactmakers.html; layout and logic live in modules/impactmakers-page.js.

mountPage({
  title: "Impactmakers",
  html: renderImpactmakersPage(),
  onMounted: initImpactmakersPage,
});
