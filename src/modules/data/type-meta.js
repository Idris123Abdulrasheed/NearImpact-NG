// Small lookup table whose values is feed directly into another file's CSS class names;
// DEVELOPERS NOTE at the bottom explains further.


// ① TYPE METADATA:
// "icon" is a KEY into icons.js (not an emoji character) 
export const TYPE_META = {
  volunteer:  { label: "Volunteer",  badge: "volunteer",  img: "soft-green",  icon: "leaf" },
  internship: { label: "Internship", badge: "internship", img: "soft-yellow", icon: "laptop" },
  training:   { label: "Training",   badge: "training",   img: "soft-pink",   icon: "megaphone" },
  fellowship: { label: "Fellowship", badge: "fellowship", img: "soft-cream",  icon: "cap" },
  job:        { label: "Job",        badge: "job",        img: "soft-blue",   icon: "briefcase" },
  grant:      { label: "Grant",      badge: "grant",       img: "soft-red",    icon: "coin" },
  project:    { label: "Project",    badge: "project",     img: "soft-blue",   icon: "sparkle" }
};

export const DEFAULT_TYPE_META = { label: "Opportunity", badge: "volunteer", img: "soft-green", icon: "pin" };

// ② LOOKUP HELPER:
export function getTypeMeta(typeKey) {
  return TYPE_META[typeKey] || DEFAULT_TYPE_META;
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  A single source of truth for opportunity-type metadata, used by
  map.js's marker icons and project-list.js's card fallback icons +
  badges. Whenever either of those needs to know "what should this
  volunteer-type project look like," they call getTypeMeta().

  No CSS, no DOM — just a lookup table and one getter function.
  getTypeMeta() falls back to DEFAULT_TYPE_META for any type key it
  doesn't recognize, so a project with a typo'd or unexpected type
  string still renders something reasonable instead of crashing.

  IMPORTANT COUPLING: the "badge" and "img" fields aren't just display
  labels; project-list.js appends them directly onto BEM modifier
  classes (project-list__card-type--{badge}, project-list__card-image--{img}),
  and projects.css defines the actual colors for exactly those
  modifier suffixes. 

  BLOCKS DEFINITIONS:
  ① TYPE METADATA   — the actual label/badge/img/icon data per
                      opportunity type, plus the fallback used for any
                      unrecognized type key.
  ② LOOKUP HELPER   — getTypeMeta() is the only way anything else in
                      the app should read this data; always go
                      through it rather than reaching into TYPE_META
                      directly, so the fallback behavior stays
                      consistent everywhere.


*/