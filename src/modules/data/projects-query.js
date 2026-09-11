import { PROJECTS } from "./projects.js";
import { STATE_CENTROIDS, haversineKm } from "./geo.js";

// The rule-precedence order below might not be obvious from the code alone
// Check DEVELOPERS NOTE at the bottom to spell it out step by step.

// ① QUERY:
export function getFilteredSortedProjects(storeState) {
  let list = [...PROJECTS];

  const effectiveCoords =
    storeState.selectedCoords ||
    (storeState.selectedState ? STATE_CENTROIDS[storeState.selectedState] : null);

  // location filter (state/lga hard filter, or fall back to default-featured)
  if (storeState.selectedState) {
    list = list.filter((p) => p.state === storeState.selectedState);
    if (storeState.selectedLga) {
      list = list.filter((p) => p.lga === storeState.selectedLga);
    }
  } else if (!storeState.selectedCoords) {
    list = list.filter((p) => p.isDefaultFeatured);
  }

  // type filter (applied after location, on whatever survives it)
  if (storeState.filterType && storeState.filterType !== "all") {
    list = list.filter((p) => p.types.includes(storeState.filterType));
  }

  // distance calculation, only if we have some coordinate to measure from
  if (effectiveCoords) {
    list = list.map((p) => ({
      ...p,
      distanceKm: haversineKm(effectiveCoords.lat, effectiveCoords.lng, p.lat, p.lng)
    }));
  }

  // sort
  switch (storeState.sortBy) {
    case "nearest":
      if (effectiveCoords) list.sort((a, b) => a.distanceKm - b.distanceKm);
      else list.sort((a, b) => b.volunteers - a.volunteers); // no location -> fall back to popularity
      break;
    case "popular":
      list.sort((a, b) => b.volunteers - a.volunteers);
      break;
    case "rating":
      list.sort((a, b) => b.rating - a.rating);
      break;
  }

  return list;
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  A "service" function in the same sense you would find in a real backend
  later: it takes inputs, applies business rules and returns data.
  No CSS, no rendering; this file's only job is turning raw PROJECTS
  data + current store state into the correctly filtered, sorted list
  every caller should be showing.

  RULE PRECEDENCE (the actual order matters, and isn't obvious from
  reading the code top-to-bottom without this note):
    1. If a State is selected -> hard filter to that state (+ LGA too,
       if one is also chosen).
    2. Else if geolocation coords exist -> no hard filter applied (we
       don't know their state), just sort by real distance from where
       they actually are.
    3. Else (nothing selected at all) -> show only the small curated
       set of isDefaultFeatured projects, so a first-time visitor
       isn't shown all 12 mock projects nationwide with no context.
  The type filter (volunteer/internship/etc) always applies AFTER
  whichever of the above ran, on top of whatever survived it and never
  the other way around.

  BLOCKS DEFINITIONS:
  ① QUERY  — the whole thing lives in one function since every step
             (location filter, type filter, distance calc, sort)
             depends on decisions made by the step before it; split
             with inline comments per step instead of separate
             numbered sections, since it's really one continuous
             pipeline, not independent concerns.


*/