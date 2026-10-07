// Local sample opportunities for the HOMEPAGE section and the detail-page fallback.
// DEVELOPERS NOTE at the bottom.

// ① MOCK DATA:
// Same order and ids as db/opportunities-seed.sql (ids 1-15).
// closesInDays: null = open / rolling, otherwise "this many days from today".
const MOCK = [
  { id: 1, type: "fellowship", title: "Climate Fellowship '26", location: "Africa", state: null, sdgs: [13, 17], reward: "$500 Grant", closesInDays: 45, description: "A fellowship for young people building climate solutions in their communities." },
  { id: 2, type: "fellowship", title: "Young SDG Leaders Program", location: "Africa", state: null, sdgs: [17, 4], reward: "12 Months", closesInDays: null, description: "A 12-month leadership programme connecting young people to SDG-focused work." },
  { id: 3, type: "fellowship", title: "Global Leaders Fellowship", location: "Abuja", state: "FCT", sdgs: [16, 17], reward: "$1,200 Stipend", closesInDays: 60, description: "A stipend-backed fellowship for emerging leaders in governance and development." },
  { id: 4, type: "fellowship", title: "Women in Tech Fellowship", location: "Lagos", state: "Lagos", sdgs: [5, 9], reward: "₦300k Stipend", closesInDays: 90, description: "Supports women building careers in technology for social good." },

  { id: 5, type: "grant", title: "Youth Impact Fund", location: "Nigeria", state: null, sdgs: [8, 4], reward: "$14,000 Funding", closesInDays: 30, description: "Funding for youth-led projects with measurable community impact." },
  { id: 6, type: "grant", title: "Community Innovation Challenge", location: "Nigeria", state: null, sdgs: [11, 9], reward: "₦1.7M Fund", closesInDays: 40, description: "A challenge fund for practical ideas that improve life in local communities." },
  { id: 7, type: "grant", title: "Clean Water Access Grant", location: "Ondo", state: "Ondo", sdgs: [6], reward: "₦2.3M Fund", closesInDays: 75, description: "Grants for boreholes, filtration and water-safety education." },
  { id: 8, type: "grant", title: "Renewable Energy Grant", location: "Kano", state: "Kano", sdgs: [7], reward: "$8,000 Funding", closesInDays: 120, description: "Funding for small renewable-energy projects serving schools and clinics." },

  { id: 9, type: "internship", title: "SDGs Research Intern", location: "Lagos", state: "Lagos", sdgs: [17], reward: "₦150k / month", closesInDays: null, description: "Support research mapping local projects to the Sustainable Development Goals." },
  { id: 10, type: "internship", title: "Climate Data Intern", location: "Abuja", state: "FCT", sdgs: [13], reward: "₦120k / month", closesInDays: null, description: "Collect, clean and visualise climate data for partner organisations." },
  { id: 11, type: "internship", title: "Environmental Policy Intern", location: "Port Harcourt", state: "Rivers", sdgs: [13, 16], reward: "₦100k / month", closesInDays: 50, description: "Assist with environmental policy briefs and stakeholder engagement." },
  { id: 12, type: "internship", title: "Green Design Intern", location: "Enugu", state: "Enugu", sdgs: [11, 12], reward: "₦130k / month", closesInDays: 65, description: "Design sustainable products and materials with a small impact team." },

  { id: 13, type: "job", title: "Program Coordinator", location: "Abuja", state: "FCT", sdgs: [17], reward: "Full-time", closesInDays: 25, description: "Coordinate programme delivery, partners and reporting." },
  { id: 14, type: "job", title: "Field Operations Manager", location: "Akure", state: "Ondo", sdgs: [11], reward: "Full-time", closesInDays: 55, description: "Lead field teams delivering community projects across the state." },
  { id: 15, type: "job", title: "Communications Officer", location: "Lagos", state: "Lagos", sdgs: [17], reward: "Full-time", closesInDays: 70, description: "Tell the stories of impact projects across web, social and print." },
];

// ② DEADLINE HELPER:
// Returns "YYYY-MM-DD" in the visitor's local time (or null), the same format
// the API sends, so ui/opportunity-card.js can't tell the difference.
function dateInDays(days) {
  if (days === null) return null;
  const date = new Date();
  date.setDate(date.getDate() + days);
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// ③ PUBLIC API:
// Items have the SAME shape as api/opportunities.js, so renderers work with either source.
function shape(item) {
  const { closesInDays, ...rest } = item;
  return { ...rest, organisation: "", closesOn: dateInDays(closesInDays), applyUrl: null };
}

export function getMockOpportunities() {
  return MOCK.map(shape);
}

// id may be a string from the URL ("3").
export function getMockOpportunity(id) {
  const item = MOCK.find((o) => o.id === Number(id));
  return item ? shape(item) : null;
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The homepage opportunities section's local data, the same idea as
  data/projects.js for projects: no network, so the homepage always
  shows everything, even when /api is down. The ids (1-15) and fields
  match db/opportunities-seed.sql, so a homepage card and the same row
  from the database open the same detail page; detail.js asks the API
  first and falls back to getMockOpportunity().

  Deadlines are stored as "closesInDays" and turned into real dates on
  each visit, so the sample cards never go stale. The cost: the
  database keeps the dates from the day the seed ran, so a card and
  its detail page can differ by a few days. Items are shaped exactly
  like the API's (closesOn, sdgs[], applyUrl), so nothing downstream
  has to know which source it got.

  Known cost: two sources of truth. Rejecting or deleting a row in the
  database does NOT remove it from here; edit this file too. This goes
  away when the homepage moves to the API.

  BLOCKS DEFINITIONS:
  ① MOCK DATA       — the 15 sample opportunities, in seed order.
  ② DEADLINE HELPER — dateInDays() makes a local "YYYY-MM-DD" string.
  ③ PUBLIC API      — getMockOpportunities() and getMockOpportunity(id).

  CLASS NAME GLOSSARY:
  No CSS here — data file.
*/