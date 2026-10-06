// API client for /api/projects. DEVELOPERS NOTE at the bottom.
// (data/projects.js is still the mock list the homepage and map use.)

// ① REQUEST HELPER:
const ENDPOINT = "/api/projects";

async function request(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });

  const response = await fetch(`${ENDPOINT}?${query.toString()}`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || "Request failed");
    error.status = response.status;
    throw error;
  }
  return data;
}

// ② PUBLIC API:
// filters: { type, state, lga, sdg, sort, page, pageSize } — all optional.
export function fetchProjects(filters = {}) {
  return request(filters);
}

// id is the public slug, e.g. "p001".
export function fetchProject(id) {
  return request({ id });
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The only place the frontend talks to /api/projects, same pattern as
  data/opportunities.js and data/impactmakers.js. It is named
  projects-api.js because data/projects.js is already taken by the mock
  list. When the homepage and map move to the database too, the mock
  file can be retired and this one renamed. Empty filter values are
  dropped before the request; failed responses throw an Error with the
  server's message and HTTP status.

  BLOCKS DEFINITIONS:
  ① REQUEST HELPER — builds the query string, fetches, throws on !ok.
  ② PUBLIC API     — fetchProjects() for lists, fetchProject() for one.

  CLASS NAME GLOSSARY:
  No CSS here — data file.
*/
