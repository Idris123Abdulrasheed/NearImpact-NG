import "./styles/detail.css";
import { icon } from "./data/icons.js";
import { PROJECTS } from "./data/projects.js";
import { fetchOpportunity } from "./data/opportunities.js";
import { getMockOpportunity } from "./data/opportunities-mock.js";
import { getTypeMeta } from "./data/type-meta.js";
import { isLoggedIn, subscribe } from "./auth.js";
import { escapeHtml } from "./ui/escape-html.js";
import { formatClosing } from "./ui/opportunity-card.js";
import { fetchProject } from "./data/projects-api.js";
// ONE public detail page for both kinds of listing, with the
// register / login box on the page. DEVELOPERS NOTE at the bottom.

// ① NORMALISERS:
// Both sources become the same "record" shape, so one renderer serves both.
function fromOpportunity(o) {
  return {
    kind: "opportunity",
    label: getTypeMeta(o.type).label,
    title: o.title,
    organisation: o.organisation || "",
    description: o.description || "",
    sdgs: o.sdgs || [],
    facts: [
      { icon: "location", label: "Location", value: o.location || "Nigeria" },
      { icon: "hourglass", label: "Deadline", value: formatClosing(o.closesOn, { withYear: true }) },
      ...(o.reward ? [{ icon: "coin", label: "Reward", value: o.reward }] : []),
    ],
    applyUrl: o.applyUrl || null,
    backHref: "/all-opportunities.html",
    backLabel: "All opportunities",
  };
}

function fromProject(p) {
  return {
    kind: "project",
    label: getTypeMeta(p.types[0]).label,
    title: p.name,
    organisation: p.orgName,
    description: p.description || "",
    sdgs: p.sdgs || [],
    facts: [
      { icon: "pin", label: "Location", value: `${p.lga}, ${p.state}` },
      { icon: "people", label: "Volunteers", value: String(p.volunteers) },
      { icon: "star", label: "Rating", value: String(p.rating) },
      ...(p.benefits ? [{ icon: "sparkle", label: "You get", value: p.benefits }] : []),
    ],
    applyUrl: null,
    backHref: "/all-projects.html",
    backLabel: "All projects",
  };
}

async function loadRecord(kind, id) {
  if (kind === "opportunity") {
    // Database first; the mock list is the fallback while the homepage still uses it.
    try {
      const { item } = await fetchOpportunity(id);
      return fromOpportunity(item);
    } catch {
      const item = getMockOpportunity(id);
      return item ? fromOpportunity(item) : null;
    }
  }
  
   if (kind === "project") {
    // Database first; tyhe mock list is the fallback while the hompage still uses it
    try{
      const {item} = await fetchProject(id);
      return fromProject(item);
    }
    catch {
      const project = PROJECTS.find((p) => p.id === id);
      return project ? fromProject(project) : null;
    }
  }
  return null;
}

  
// ② RENDERING — RECORD:
function renderParagraphs(text) {
  if (!text.trim()) return "<p>More details will be added soon.</p>";
  return text
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph.trim())}</p>`)
    .join("");
}

function renderRecord(record) {
  const sdgPills = record.sdgs
    .map((n) => `<span class="detail__sdg">SDG ${escapeHtml(String(n))}</span>`)
    .join("");

  const facts = record.facts
    .map(
      (fact) => `
        <li class="detail__fact">
          <span class="detail__fact-icon" aria-hidden="true">${icon(fact.icon)}</span>
          <span class="detail__fact-label">${escapeHtml(fact.label)}</span>
          <span class="detail__fact-value">${escapeHtml(fact.value)}</span>
        </li>`
    )
    .join("");

  return `
    <div class="detail__header">
      <div class="detail__header-wrap">
        <a class="detail__back" href="${record.backHref}">← ${escapeHtml(record.backLabel)}</a>
        <span class="detail__badge">${escapeHtml(record.label)}</span>
        <h1>${escapeHtml(record.title)}</h1>
        ${record.organisation ? `<p class="detail__org">${escapeHtml(record.organisation)}</p>` : ""}
      </div>
    </div>

    <div class="detail__wrap">
      <div class="detail__facts">
        ${sdgPills ? `<div class="detail__sdgs">${sdgPills}</div>` : ""}
        <ul class="detail__facts-list">${facts}</ul>
      </div>

      <div class="detail__about">
        <h2>About this ${record.kind}</h2>
        ${renderParagraphs(record.description)}
      </div>

      <div class="detail__action" id="detail-action">${renderAction(record)}</div>
    </div>
  `;
}

// ③ RENDERING — REGISTER / APPLY BOX:
// Only http(s) links are allowed, so a bad apply_url can never become a javascript: link.
function isSafeUrl(url) {
  return /^https?:\/\//i.test(url);
}

function renderAction(record) {
  if (!isLoggedIn()) {
    const verb = record.kind === "project" ? "Join" : "Apply";
    return `
      <h2>Interested?</h2>
      <p>Create a free account with just your email and a password.</p>
      <div class="detail__action-buttons">
        <button type="button" class="detail__btn detail__btn--primary" data-auth-mode="register">Register &amp; ${verb}</button>
        <button type="button" class="detail__btn detail__btn--secondary" data-auth-mode="login">Log In</button>
      </div>
    `;
  }

  if (record.applyUrl && isSafeUrl(record.applyUrl)) {
    return `
      <h2>You're signed in</h2>
      <p>Ready when you are.</p>
      <div class="detail__action-buttons">
        <a class="detail__btn detail__btn--primary" href="${escapeHtml(record.applyUrl)}" target="_blank" rel="noopener noreferrer">Apply now</a>
      </div>
    `;
  }

  return `
    <h2>You're signed in</h2>
    <p>Applications for this ${record.kind} aren't open yet. Check back soon.</p>
  `;
}

// ④ SHELL + INITIALIZATION:
export function renderDetail() {
  return `
    <section class="detail" id="detail">
      <div id="detail-root"><p class="detail__status">Loading…</p></div>
    </section>
  `;
}

function renderMessage(text) {
  return `<p class="detail__status">${escapeHtml(text)} <a href="/">Back to home</a></p>`;
}

export async function initDetail() {
  const root = document.getElementById("detail-root");
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const kind = params.get("type") || "";
  const id = params.get("id") || "";

  let record = null;
  try {
    record = id ? await loadRecord(kind, id) : null;
  } catch (err) {
    if (err.status !== 404) {
      console.error("Failed to load detail:", err);
      root.innerHTML = renderMessage("Couldn't load this page. Please try again later.");
      return;
    }
  }

  if (!record) {
    root.innerHTML = renderMessage("We couldn't find that listing.");
    return;
  }

  document.title = `${record.title} — NearImpact Nigeria`;
  root.innerHTML = renderRecord(record);

  // One delegated listener: survives the box being re-rendered.
  root.addEventListener("click", (e) => {
    const button = e.target.closest("[data-auth-mode]");
    if (!button) return;
    window.dispatchEvent(
      new CustomEvent("ni:open-auth-modal", { detail: { mode: button.dataset.authMode } })
    );
  });

  // Registering or logging in from the modal flips this box to its signed-in state.
  subscribe(() => {
    const box = document.getElementById("detail-action");
    if (box) box.innerHTML = renderAction(record);
  });
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  /detail.html?type=opportunity&id=3 or ?type=project&id=p001. One page
  template, two data sources: opportunities come from the API, projects
  from the existing mock list (data/projects.js) until projects get a
  table. Both are turned into the same "record" shape first, so the
  renderer never branches on where the data came from. Adding a third
  kind later means one more normaliser, not a third page.

  The page is PUBLIC. The register / login box sits at the bottom
  (like the reference) and just dispatches "ni:open-auth-modal" with
  mode "register" or "login". It reads login state only through
  auth.js (isLoggedIn / subscribe), never its own flag. After the
  modal succeeds, the subscription re-renders the box into the
  signed-in state. A logged-in visitor on a listing with an apply_url
  gets an "Apply now" link; otherwise a short "not open yet" note.

  All listing text goes through escapeHtml(); descriptions are split
  into paragraphs on blank lines instead of being treated as HTML.

  BLOCKS DEFINITIONS:
  ① NORMALISERS       — fromOpportunity(), fromProject(), loadRecord().
  ② RENDERING — RECORD — header band, SDG pills + facts card, about text.
  ③ RENDERING — REGISTER / APPLY BOX — renderAction() for signed-out and
                        signed-in states (+ http(s)-only link check).
  ④ SHELL + INITIALIZATION — renderDetail() returns the loading shell;
                        initDetail() reads the URL, loads, renders, and
                        wires the box.

  CLASS NAME GLOSSARY:
  .detail                 The whole page body.
  .detail__status         Loading / not-found / error message.
  .detail__header         Dark title band.
  .detail__header-wrap    Narrow inner wrapper of the band.
  .detail__back           "← All opportunities" link.
  .detail__badge          Type pill (Grant, Volunteer, ...).
  .detail__org            Organisation line under the title.
  .detail__wrap           Narrow content column.
  .detail__facts          Card with SDG pills + facts list.
  .detail__sdgs           Row of SDG pills.
  .detail__sdg            One SDG pill.
  .detail__facts-list     List of facts.
  .detail__fact           One fact row.
  .detail__fact-icon      Its icon.
  .detail__fact-label     Its small label.
  .detail__fact-value     Its value.
  .detail__about          The description section.
  .detail__action         The register / apply box.
  .detail__action-buttons Row of buttons inside it.
  .detail__btn            Shared button look.
  .detail__btn--primary   Filled button.
  .detail__btn--secondary Outlined button.
*/
