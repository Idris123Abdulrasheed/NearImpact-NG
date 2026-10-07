import { SDG_TITLES } from "./sdg-titles.js";
// Fetches impactmakers from /api/impactmakers. Replaces the old
// hardcoded list. DEVELOPERS NOTE at the bottom.

// ① CONSTANTS:
// Generic avatar shown if a real photo is missing or fails to load.
export const FALLBACK_PHOTO = "/impactmakers/placeholder.jpg";

// ② HELPERS:
// The API sends the SDG as a number (1-17); everything on screen wants
// the title, so convert once, here.
function withSdgTitle(maker) {
  return { ...maker, sdg: SDG_TITLES[maker.sdg - 1] ?? "" };
}

// ③ FETCHERS:
// All approved impactmakers: [{ slug, name, sdg }, ...]
export async function fetchImpactmakers() {
  const res = await fetch("/api/impactmakers");
  if (!res.ok) throw new Error(`Impactmakers request failed: ${res.status}`);
  const data = await res.json();
  return data.impactmakers.map(withSdgTitle);
}

// One full profile, or null when that slug doesn't exist.
export async function fetchImpactmaker(slug) {
  const res = await fetch(`/api/impactmakers?slug=${encodeURIComponent(slug)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Impactmaker request failed: ${res.status}`);
  const data = await res.json();
  return withSdgTitle(data.impactmaker);
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  This file used to hold nine hardcoded people. The directory page and
  the profile page now read the database through these two functions
  instead, so a newly approved impactmaker shows up in both without a
  code change. The API only ever returns APPROVED profiles; pending
  ones stay invisible. The homepage carousel (community.js) is the
  exception: it renders from its own local array and never calls
  these functions.

  Callers must handle failure: both functions throw on a network or
  server error, so each page shows its own "couldn't load" message.

  Record shape the API returns for one profile (everything except
  slug, name and sdg may be missing):
    { slug, name, sdg, role, organisation, location, since, bio,
      stats: { projects, hours, communities },
      skills: [], contributions: [{ year, title, description }],
      links: [{ label, href }] }

  BLOCKS DEFINITIONS:
  ① CONSTANTS  — the fallback avatar path.
  ② HELPERS    — withSdgTitle(): number to title.
  ③ FETCHERS   — fetchImpactmakers() for lists, fetchImpactmaker(slug)
                 for one profile (null if not found).
*/
