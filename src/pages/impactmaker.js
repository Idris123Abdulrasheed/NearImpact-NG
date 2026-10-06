import { mountPage } from "./page-shell.js";
import { fetchImpactmaker } from "../modules/data/impactmakers.js";
import {
  renderImpactmakerProfile,
  renderProfileLoading,
  renderProfileNotFound,
  renderProfileError,
} from "../modules/impactmaker-profile.js";
// Entry for impactmaker.html. The person is chosen by ?slug=<slug> in
// the URL. The page shows a loading view first, then swaps in the
// profile, the not-found view, or the error view.

const slug = new URLSearchParams(window.location.search).get("slug");

mountPage({
  title: "Impactmaker",
  html: renderProfileLoading(),
  onMounted: loadProfile,
});

async function loadProfile() {
  let html;

  try {
    const maker = slug ? await fetchImpactmaker(slug) : null;

    if (maker) {
      document.title = `${maker.name} | NearImpact Nigeria`;
      html = renderImpactmakerProfile(maker);
    } else {
      document.title = "Impactmaker not found | NearImpact Nigeria";
      html = renderProfileNotFound();
    }
  } catch (err) {
    console.error("Failed to load impactmaker:", err);
    html = renderProfileError();
  }

  document.querySelector("main.maker-profile").outerHTML = html;
}
