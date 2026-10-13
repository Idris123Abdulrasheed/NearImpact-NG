import "../styles/projects.css";
import "../styles/project-list-controls.css";
import { icon } from "../data/icons.js";
import { getTypeMeta } from "../data/type-meta.js";
import { escapeHtml } from "./escape-html.js";
// ONE project card shared by the homepage list and the all-projects
// page. DEVELOPERS NOTE at the bottom.

// ① HELPERS:
export function projectDetailUrl(id) {
  return `/detail.html?type=project&id=${encodeURIComponent(id)}`;
}

// ② RENDERING — CARD:
// project.distanceKm exists only on the homepage when a location is set.
export function renderProjectCard(project, { selected = false } = {}) {
  const meta = getTypeMeta(project.types[0]);
  // "Eti-Osa, Lagos": the state tells visitors where an unfamiliar LGA is.
  const placeLabel = `${escapeHtml(project.lga)}, ${escapeHtml(project.state)}`;
  const distanceMarkup =
    typeof project.distanceKm === "number"
      ? `<span class="project-list__card-distance">${project.distanceKm.toFixed(1)} km</span>`
      : "";

  const imageMarkup = project.image
    ? `<img class="project-list__card-illustration" src="${escapeHtml(project.image)}" alt="${escapeHtml(project.name)}" loading="lazy">`
    : `<span class="project-list__card-image-icon" aria-hidden="true">${icon(meta.icon)}</span>`;

  const id = escapeHtml(project.id);

  return `
    <article class="project-list__card ${selected ? "is-selected" : ""}" data-id="${id}">
      <div class="project-list__card-image project-list__card-image--${meta.img}">
        ${imageMarkup}
        <span class="project-list__card-type project-list__card-type--${meta.badge}">${escapeHtml(meta.label)}</span>
      </div>

      <div class="project-list__card-content">
        <div class="project-list__card-meta">
          ${icon("pin")}
          <span class="project-list__card-place" title="${placeLabel}">${placeLabel}</span>
          ${distanceMarkup}
        </div>

        <h3 title="${escapeHtml(project.name)}">${escapeHtml(project.name)}</h3>
        <p title="${escapeHtml(project.orgName)}">${escapeHtml(project.orgName)}</p>

        <div class="project-list__card-footer">
          <div class="project-list__card-sdg-tags" aria-label="Sustainable Development Goals">
            ${project.sdgs.map((s) => `<span>${escapeHtml(String(s))}</span>`).join("")}
          </div>
          <div class="project-list__card-volunteers">${icon("people")} ${escapeHtml(String(project.volunteers))} volunteers</div>
        </div>

        <button type="button" class="project-list__view-btn" data-id="${id}">
          View Project
        </button>
      </div>
    </article>
  `;
}

// ③ EVENT WIRING:
// Call after the cards are in the DOM. onSelect is optional (homepage only).
export function bindProjectCardActions(grid, { onSelect } = {}) {
  grid.querySelectorAll(".project-list__card").forEach((card) => {
    card.addEventListener("click", () => onSelect?.(card.dataset.id));
  });

  grid.querySelectorAll(".project-list__view-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      window.location.href = projectDetailUrl(btn.dataset.id);
    });
  });
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The project card shared by the homepage list and the all-projects
  page, so both render identical markup (DRY). It imports both project
  stylesheets itself, so any page using the card gets its styles.

  WHAT CHANGED: the heart (save) button and the star rating are gone,
  so the card takes no "saved" option and the binder needs no savedIds
  Set. Every row of the card is ONE line: place ("LGA, State", so
  visitors who don't know an LGA still see where it is), project name,
  organisation, and the SDG/volunteers footer. Anything too long for
  its line is cut with an ellipsis, and the full text is kept in a
  title attribute (hover tooltip). When a location is set, the distance
  sits at the right end of the place row in its own non-shrinking span,
  so the ellipsis never eats it. The "rating" field still exists in the
  project data; it just isn't displayed.

  Every value goes through escapeHtml() because the data will come from
  a database. View Project navigates to the public detail page.

  The card keeps the "project-list__" class names on purpose: renaming
  them would mean rewriting two stylesheets for no visible change.

  BLOCKS DEFINITIONS:
  ① HELPERS          — projectDetailUrl() builds the detail link once.
  ② RENDERING — CARD — renderProjectCard(project, {selected}).
  ③ EVENT WIRING     — bindProjectCardActions(): optional card select
                       and View Project navigation.

  CLASS NAME GLOSSARY:
  All classes belong to the "project-list" block; see the glossary in
  project-list.js.
*/