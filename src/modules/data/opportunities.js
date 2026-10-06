// API client for /api/opportunities. DEVELOPERS NOTE at the bottom.

// ① REQUEST HELPER:
const ENDPOINT = "/api/opportunities";

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
// filters: { type, state, sdg, status, page, pageSize } — all optional.
export function fetchOpportunities(filters = {}) {
  return request(filters);
}

export function fetchOpportunity(id) {
  return request({ id });
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The only place the frontend talks to /api/opportunities, same
  pattern as data/impactmakers.js. Components never call fetch for
  this data themselves. Empty filter values are dropped before the
  request, so callers can pass a whole filters object without
  cleaning it first. Failed responses throw an Error carrying the
  server's message and the HTTP status (404 means "not found").

  BLOCKS DEFINITIONS:
  ① REQUEST HELPER — builds the query string, fetches, throws on !ok.
  ② PUBLIC API     — fetchOpportunities() for lists, fetchOpportunity()
                     for one item. The response shape is documented in
                     api/opportunities.js.

  CLASS NAME GLOSSARY:
  No CSS here — data file.
*/
