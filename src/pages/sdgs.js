import { mountPage } from "./page-shell.js";
import { renderSdgsPage } from "../modules/sdgs-page.js";

// Entry for sdgs.html. See sdgs-page.js for the content.
mountPage({
  title: "The Global Goals",
  html: renderSdgsPage(),
});
