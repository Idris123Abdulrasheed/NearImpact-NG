import "../styles/more-link.css";
import { icon } from "../data/icons.js";
import { escapeHtml } from "./escape-html.js";
// ONE "see more" text link with an arrow, shared by every section that
// leads on to a full page and by the "back to" links on inner pages.
// DEVELOPERS NOTE at the bottom.

// ① RENDERING:
// direction "forward" (default): label, then a right arrow. For links that lead on.
// direction "back": a left arrow, then the label. For links that return.
// id and hidden are optional: the homepage lists find the link by id and
// flip its hidden state (project-list.js), or change its href (opportunities.js).
export function renderMoreLink({ href, label, id = "", hidden = false, direction = "forward" }) {
  const back = direction === "back";
  const arrow = `<span class="more-link__icon" aria-hidden="true">${icon(back ? "arrowLeft" : "arrowRight")}</span>`;
  const text = `<span class="more-link__label">${escapeHtml(label)}</span>`;

  return `
    <a class="more-link${back ? " more-link--back" : ""}"${id ? ` id="${escapeHtml(id)}"` : ""} href="${escapeHtml(href)}"${hidden ? " hidden" : ""}>
      ${back ? arrow + text : text + arrow}
    </a>
  `;
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  Four homepage sections (projects, opportunities, SDGs, community) each
  had their own button-styled "Show More" link, in four stylesheets. This
  replaces them with one text link: coloured text, a thin underline and an
  arrow. It is a link, not a button, because it navigates; that also keeps
  middle-click and "open in new tab" working. Callers keep their own
  wrapper (.xxx__footer, .detail__back) for position and spacing; this
  file styles only the link.

  BACK LINKS: direction "back" puts the arrow on the left (arrowLeft from
  icons.js) and nudges it left on hover. A page that shows the link on a
  surface the default colour can't read (the always-dark detail band)
  recolours it from its OWN stylesheet; never add page rules here.

  Any code that needs the element later (project-list.js hides it,
  opportunities.js changes its href) finds it by the id passed in.

  BLOCKS DEFINITIONS:
  ① RENDERING — renderMoreLink({ href, label, id?, hidden?, direction? }).

  CLASS NAME GLOSSARY:
  .more-link          The link.
  .more-link--back    Modifier: arrow on the left, nudges left on hover.
  .more-link__label   The underlined text.
  .more-link__icon    The arrow; slides on hover.
*/