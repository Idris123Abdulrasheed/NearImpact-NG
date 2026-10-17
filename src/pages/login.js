import { mountPage } from "./page-shell.js";
import { renderLoginPage, initLoginPage } from "../modules/login-page.js";
// Entry for login.html; layout and logic live in modules/login-page.js.

mountPage({
  title: "Log In",
  html: renderLoginPage(),
  onMounted: initLoginPage,
});
