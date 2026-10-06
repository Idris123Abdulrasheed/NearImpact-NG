import { mountPage } from "./page-shell.js";
import { renderListProject, initListProject } from "../modules/list-project.js";
// Entry for list-project.html; layout and logic live in modules/list-project.js.

mountPage({
  title: "List Your Project",
  html: renderListProject(),
  onMounted: initListProject,
});
