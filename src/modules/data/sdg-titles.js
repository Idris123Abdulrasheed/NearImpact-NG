// The 17 Sustainable Development Goal titles, in order (goal 1 is
// index 0). DEVELOPERS NOTE at the bottom.

// ① SDG TITLES:
export const SDG_TITLES = [
  "No Poverty",
  "Zero Hunger",
  "Good Health & Well-being",
  "Quality Education",
  "Gender Equality",
  "Clean Water & Sanitation",
  "Affordable & Clean Energy",
  "Decent Work & Economic Growth",
  "Industry, Innovation & Infrastructure",
  "Reduced Inequalities",
  "Sustainable Cities & Communities",
  "Responsible Consumption & Production",
  "Climate Action",
  "Life Below Water",
  "Life on Land",
  "Peace, Justice & Strong Institutions",
  "Partnerships for the Goals",
];





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  One shared list, because three places needed it (the listing form,
  the impactmaker form, and the profile data layer). The database
  stores only the goal NUMBER (1-17); the title is looked up here, so
  a spelling fix happens in one file. sdgs.js still has its own inline
  copy with the artwork; it can import this list whenever you next
  touch it.

  BLOCKS DEFINITIONS:
  ① SDG TITLES  — the 17 titles.
*/
