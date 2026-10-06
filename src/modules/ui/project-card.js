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
export function renderProjectCard(project, { saved = false, selected = false } = {}) {
  const meta = getTypeMeta(project.types[0]);
  const place = escapeHtml(project.lga);
  const distanceLabel =
    typeof project.distanceKm === "number"
      ? `${icon("pin")} ${project.distanceKm.toFixed(1)} km`
      : `${icon("pin")} ${place}`;

  const imageMarkup = project.image
    ? `<img class="project-list__card-illustration" src="${escapeHtml(project.image)}" alt="${escapeHtml(project.name)}" loading="lazy">`
    : `<span class="project-list__card-image-icon" aria-hidden="true">${icon(meta.icon)}</span>`;

  const id = escapeHtml(project.id);

  return `
    <article class="project-list__card ${selected ? "is-selected" : ""}" data-id="${id}">
      <div class="project-list__card-image project-list__card-image--${meta.img}">
        ${imageMarkup}
        <span class="project-list__card-type project-list__card-type--${meta.badge}">${escapeHtml(meta.label)}</span>
        <button
          class="project-list__save-btn ${saved ? "is-saved" : ""}"
          data-id="${id}"
          aria-label="${saved ? "Remove from saved" : "Save project"}"
          aria-pressed="${saved}"
        >${icon(saved ? "heartFilled" : "heartOutline")}</button>
      </div>

      <div class="project-list__card-content">
        <div class="project-list__card-meta">
          <span>${distanceLabel}</span>
          <span>${icon("star")} ${escapeHtml(String(project.rating))}</span>
        </div>

        <h3>${escapeHtml(project.name)}</h3>
        <p>${escapeHtml(project.orgName)} · ${place}, ${escapeHtml(project.state)}</p>

        <div class="project-list__card-footer">
          <div class="project-list__card-sdg-tags">
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
// Call after the cards are in the DOM. savedIds is a Set the CALLER owns, so
// "liked" survives that caller's re-renders. onSelect is optional (homepage only).
export function bindProjectCardActions(grid, { savedIds, onSelect } = {}) {
  grid.querySelectorAll(".project-list__card").forEach((card) => {
    card.addEventListener("click", () => onSelect?.(card.dataset.id));
  });

  grid.querySelectorAll(".project-list__view-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      window.location.href = projectDetailUrl(btn.dataset.id);
    });
  });

  // Like/save toggle — visual, session-only state. Real saved lists need a table later.
  grid.querySelectorAll(".project-list__save-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const nowSaved = !savedIds.has(id);

      if (nowSaved) savedIds.add(id);
      else savedIds.delete(id);

      btn.classList.toggle("is-saved", nowSaved);
      btn.setAttribute("aria-pressed", String(nowSaved));
      btn.setAttribute("aria-label", nowSaved ? "Remove from saved" : "Save project");
      btn.innerHTML = icon(nowSaved ? "heartFilled" : "heartOutline");
    });
  });
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  Your project card, unchanged in look, moved out of project-list.js so
  the homepage list and the all-projects page render identical markup
  (DRY, same idea as ui/opportunity-card.js). It imports both project
  stylesheets itself, so any page using the card gets its styles.

  What changed: every value now goes through escapeHtml() (the old card
  dropped names straight into the template, which is unsafe once the
  data comes from a database); and the View Project button navigates to
  the detail page itself, because that page is public and holds the
  register/login box.

  The card keeps the "project-list__" class names on purpose: renaming
  them would mean rewriting two stylesheets for no visible change.

  BLOCKS DEFINITIONS:
  ① HELPERS          — projectDetailUrl() builds the detail link once.
  ② RENDERING — CARD — renderProjectCard(project, {saved, selected}).
  ③ EVENT WIRING     — bindProjectCardActions(): card select (optional),
                       View Project navigation, save toggle.

  CLASS NAME GLOSSARY:
  All classes belong to the "project-list" block; see the glossary in
  project-list.js.
*/
