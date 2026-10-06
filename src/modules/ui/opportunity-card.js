import "../styles/opportunities.css";
import { icon } from "../data/icons.js";
import { getTypeMeta } from "../data/type-meta.js";
import { escapeHtml } from "./escape-html.js";
// ONE card renderer shared by the landing section and the
// all-opportunities page. DEVELOPERS NOTE at the bottom.

// ① HELPERS:
// closesOn is "YYYY-MM-DD" | null. Built from parts (not new Date(string))
// so the browser's timezone can't shift the day.
export function formatClosing(closesOn, { withYear = false } = {}) {
  if (!closesOn) return "Open now";

  const [year, month, day] = closesOn.split("-").map(Number);
  const closing = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (closing < today) return "Closed";

  const label = closing.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    ...(withYear ? { year: "numeric" } : {}),
  });
  return `Closes ${label}`;
}

export function detailUrl(kind, id) {
  return `/detail.html?type=${kind}&id=${encodeURIComponent(id)}`;
}

// ② RENDERING — CARD:
export function renderOpportunityCard(opp) {
  const meta = getTypeMeta(opp.type);
  const url = detailUrl("opportunity", opp.id);

  return `
    <article class="opportunities__card">
      <div class="opportunities__card-content">
        <span class="opportunities__badge opportunities__badge--${escapeHtml(opp.type)}">${escapeHtml(meta.label)}</span>
        <h3><a class="opportunities__card-title" href="${url}">${escapeHtml(opp.title)}</a></h3>

        <div class="opportunities__card-details">
          <span class="align__icon">${icon("location")} ${escapeHtml(opp.location || "Nigeria")}</span>
          <span class="align__icon">${icon("hourglass")} ${escapeHtml(formatClosing(opp.closesOn))}</span>
        </div>

        <div class="opportunities__card-footer">
          <strong>${escapeHtml(opp.reward || "")}</strong>
          <a href="${url}">Apply</a>
        </div>
      </div>
    </article>
  `;
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  Your card design, unchanged, moved out of opportunities.js so the
  landing preview and the all-opportunities page render the exact same
  markup (DRY: change the card once, both places update). It imports
  opportunities.css itself, so any page using the card gets the card
  styles without remembering a second import.

  What changed vs the old card: icons are now added here instead of
  living inside the data (the data holds plain text), every API value
  goes through escapeHtml(), the title is a link, and "Apply" leads to
  the detail page, where the register box lives.

  BLOCKS DEFINITIONS:
  ① HELPERS          — formatClosing() turns a date into "Closes 12 Oct" /
                       "Open now" / "Closed"; detailUrl() builds the
                       detail-page link in one place.
  ② RENDERING — CARD — renderOpportunityCard(opp) returns one article.

  CLASS NAME GLOSSARY:
  All classes belong to the "opportunities" block; see the glossary in
  opportunities.js. New here: .opportunities__card-title (the title link).
*/
