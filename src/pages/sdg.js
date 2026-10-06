import { mountPage } from "./page-shell.js";
import { getSdgById } from "../modules/data/sdg-data.js";
import { renderSdgDetail, initSdgDetail } from "../modules/sdg-detail.js";

// Entry for sdg.html?n=<1-18>. The goal id comes from the query string
// (no router on purpose), and an unknown id renders a friendly not-found.
const goal = getSdgById(new URLSearchParams(window.location.search).get("n"));

mountPage({
  title: goal ? `Goal ${goal.id}: ${goal.name}` : "Goal not found",
  html: renderSdgDetail(goal),
  onMounted: () => initSdgDetail(goal),
});
