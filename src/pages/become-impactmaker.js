import { mountPage } from "./page-shell.js";
import { renderBecomeImpactmaker, initBecomeImpactmaker } from "../modules/become-impactmaker.js";
// Entry for become-impactmaker.html; layout and logic live in modules/become-impactmaker.js.

mountPage({
  title: "Become an Impactmaker",
  html: renderBecomeImpactmaker(),
  onMounted: initBecomeImpactmaker,
});
