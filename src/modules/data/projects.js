// Pure mock data in here; schema's documented below, full field
// list is in the DEVELOPERS NOTE at the bottom if you need more detail.


// ① PROJECT SCHEMA:
// Every object in PROJECTS below must match this shape 

// ② PROJECT DATA:
export const PROJECTS = [
  {
    id: "p001",
    name: "Urban Tree Planting",
    orgName: "Green Ondo Network",
    state: "Ondo",
    lga: "Akure South",
    lat: 7.2571,
    lng: 5.2058,
    types: ["volunteer"],
    sdgs: [13, 15, 11],
    volunteers: 142,
    rating: 3.9,
    benefits: "Certificate of participation",
    benefitTags: ["certificate"],
    image: "/projects/tree-planting.png",
    description: "Community tree-planting drives across Akure to restore green cover.",
    isDefaultFeatured: true,
    requiresAuth: true
  },
  {
    id: "p002",
    name: "Solar Micro-Grid for Rural Schools",
    orgName: "SolarAfrica Initiative",
    state: "Ondo",
    lga: "Owo",
    lat: 7.1944,
    lng: 5.5833,
    types: ["project", "internship"],
    sdgs: [7, 4, 1],
    volunteers: 38,
    rating: 4.4,
    benefits: "Technical mentorship + stipend",
    benefitTags: ["mentorship", "stipend"],
    image: "/projects/solar-grid.jpeg",
    description: "Installing solar micro-grids to power rural school classrooms.",
    isDefaultFeatured: true,
    requiresAuth: true
  },
  {
    id: "p003",
    name: "Ocean Plastic Cleanup Drive",
    orgName: "Clean Gutters Nigeria",
    state: "Ondo",
    lga: "Akure South",
    lat: 7.2500,
    lng: 5.1950,
    types: ["volunteer"],
    sdgs: [14, 12, 13],
    volunteers: 289,
    rating: 5.0,
    benefits: "Free branded gear",
    benefitTags: ["goods"],
    image: "/projects/ocean-cleanup.png",
    description: "Coastal and waterway cleanup exercises near FUTA South.",
    isDefaultFeatured: true,
    requiresAuth: true
  },
  {
    id: "p004",
    name: "Youth Climate Advocacy Training",
    orgName: "African Climate Foundation",
    state: "Ondo",
    lga: "Akure South",
    lat: 7.2650,
    lng: 5.2100,
    types: ["training"],
    sdgs: [13, 4, 16],
    volunteers: 67,
    rating: 4.7,
    benefits: "Certification + networking",
    benefitTags: ["certificate", "mentorship"],
    image: "/projects/climate-training.png",
    description: "Advocacy and public-speaking training for young climate leaders.",
    isDefaultFeatured: false,
    requiresAuth: true
  },
  {
    id: "p005",
    name: "Community Food Garden Network",
    orgName: "Urban Food Co-op Ondo",
    state: "Ondo",
    lga: "Owo",
    lat: 7.2000,
    lng: 5.5900,
    types: ["volunteer"],
    sdgs: [2, 3, 11],
    volunteers: 204,
    rating: 4.2,
    benefits: "Take-home produce",
    benefitTags: ["goods"],
    image: "/projects/community-garden.jpeg",
    isDefaultFeatured: false,
    requiresAuth: true
  },
  {
    id: "p006",
    name: "Women in Clean Energy",
    orgName: "PowerHer Foundation",
    state: "Ondo",
    lga: "Akure North",
    lat: 7.3200,
    lng: 5.2300,
    types: ["fellowship"],
    sdgs: [5, 7, 8],
    volunteers: 91,
    rating: 3.3,
    benefits: "12-month paid fellowship",
    benefitTags: ["stipend", "employment"],
    image: "/projects/clean-energy.jpeg",
    description: "Fellowship placing women in clean-energy technical roles.",
    isDefaultFeatured: false,
    requiresAuth: true
  },
  {
    id: "p007",
    name: "Lagos Lagoon Restoration Project",
    orgName: "Blue Water Collective",
    state: "Lagos",
    lga: "Eti-Osa",
    lat: 6.4500,
    lng: 3.4700,
    types: ["volunteer", "internship"],
    sdgs: [14, 15, 6],
    volunteers: 312,
    rating: 4.6,
    benefits: "Transport stipend",
    benefitTags: ["stipend"],
    image: "/projects/lagos-lagoon.jpeg",
    description: "Mangrove replanting and water-quality monitoring in the lagoon.",
    isDefaultFeatured: true,
    requiresAuth: true
  },
  {
    id: "p008",
    name: "Tech for Good Internship",
    orgName: "Impact Builders Lab",
    state: "Lagos",
    lga: "Yaba",
    lat: 6.5095,
    lng: 3.3711,
    types: ["internship"],
    sdgs: [8, 9, 17],
    volunteers: 54,
    rating: 4.5,
    benefits: "₦120k/month stipend",
    benefitTags: ["stipend"],
    image: "/projects/tech-intenship.jpeg",
    description: "Building digital tools for NGOs and social enterprises.",
    isDefaultFeatured: true,
    requiresAuth: true
  },
  {
    id: "p009",
    name: "Abuja Clean Water Initiative",
    orgName: "Clean Water Collective",
    state: "FCT",
    lga: "Municipal Area Council",
    lat: 9.0765,
    lng: 7.3986,
    types: ["volunteer", "grant"],
    sdgs: [3, 6, 12],
    volunteers: 178,
    rating: 4.1,
    benefits: "Grant funding available",
    benefitTags: ["grant"],
    image: "/projects/abuja-water.jpeg",
    description: "Borehole installation and water-safety education in Abuja communities.",
    isDefaultFeatured: true,
    requiresAuth: true
  },
  {
    id: "p010",
    name: "Kano Youth Solar Jobs",
    orgName: "SolarAfrica Initiative",
    state: "Kano",
    lga: "Nassarawa",
    lat: 12.0022,
    lng: 8.5920,
    types: ["job"],
    sdgs: [7, 8, 1],
    volunteers: 22,
    rating: 4.0,
    benefits: "Full-time employment",
    benefitTags: ["employment"],
    image: "/projects/kano-solar.jpeg",
    description: "Solar panel installation and maintenance jobs for local youth.",
    isDefaultFeatured: false,
    requiresAuth: true
  },
  {
    id: "p011",
    name: "Rivers State Mangrove Watch",
    orgName: "Green Futures Africa",
    state: "Rivers",
    lga: "Port Harcourt",
    lat: 4.8156,
    lng: 7.0498,
    types: ["volunteer"],
    sdgs: [13, 14, 15],
    volunteers: 96,
    rating: 4.3,
    benefits: "Field gear provided",
    benefitTags: ["goods"],
    image: "/projects/rivers-mangrove.jpeg",
    description: "Monitoring and replanting mangrove ecosystems along the Niger Delta.",
    isDefaultFeatured: true,
    requiresAuth: true
  },
  {
    id: "p012",
    name: "Enugu Girls in STEM Fellowship",
    orgName: "Youth SDG Hub",
    state: "Enugu",
    lga: "Enugu East",
    lat: 6.4413,
    lng: 7.4986,
    types: ["fellowship"],
    sdgs: [4, 5, 9],
    volunteers: 41,
    rating: 4.8,
    benefits: "Laptop + mentorship",
    benefitTags: ["goods", "mentorship"],
    image: "/projects/clean-energy.jpeg",
    description: "STEM mentorship fellowship for secondary school girls.",
    isDefaultFeatured: false,
    requiresAuth: true
  }
];

// ③ LGA REFERENCE:
// So the State -> LGA dropdown doesn't depend only on which LGAs
// happen to show up in the mock data above.
export const STATE_LGAS = {
  Ondo: ["Akure South", "Akure North", "Owo", "Ondo West", "Ile-Oluji"],
  Lagos: ["Eti-Osa", "Yaba", "Ikeja", "Lekki", "Surulere"],
  FCT: ["Municipal Area Council", "Gwagwalada", "Kuje", "Bwari"],
  Kano: ["Nassarawa", "Fagge", "Dala", "Gwale"],
  Rivers: ["Port Harcourt", "Obio-Akpor", "Eleme"],
  Enugu: ["Enugu East", "Enugu North", "Nsukka"]
};





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  Pure mock data — our eventual real backend/database is expected to
  replace this file wholesale, so nothing here does any logic. Every
  consumer (projects-query.js, and through it map.js and
  project-list.js) only ever reads PROJECTS and STATE_LGAS; nothing
  mutates them.



  BLOCKS DEFINITIONS:
  ① PROJECT SCHEMA  — documents the shape every object in PROJECTS
                      must match. Full field list:
                        id                string   unique id, e.g. "p001"
                        name              string   project title
                        orgName           string   organisation running it
                        state             string   Nigerian state, e.g. "Ondo"
                        lga               string   Local Government Area
                        lat, lng          number   coordinates for map
                                                    placement + distance calc
                        types             array    opportunity kind(s):
                                                    "volunteer" | "internship" |
                                                    "grant" | "job" | "training" |
                                                    "fellowship"
                        sdgs              array    SDG numbers this project
                                                    maps to, e.g. [13, 15, 11]
                        volunteers        number   headcount — social proof +
                                                    "popular" sort
                        rating            number   0-5
                        benefits          string   short line on what the user
                                                    gets, DISPLAY only, free text
                        benefitTags       array    structured tags for a FUTURE
                                                    benefits module: "stipend" |
                                                    "grant" | "certificate" |
                                                    "mentorship" | "goods" |
                                                    "employment" (kept for later
                                                    use, not currently filtered
                                                    on anywhere)
                        image             string|null  path under /public for
                                                    the card photo. null is
                                                    valid — the card falls back
                                                    to a colored panel + icon.
                        description       string   1-2 sentences
                        isDefaultFeatured boolean  shown when the user hasn't
                                                    picked a state/LGA yet (the
                                                    "popular nationwide" set)
                        requiresAuth      boolean  true = clicking View/Apply
                                                    triggers the login gate
  ② PROJECT DATA    — the actual mock project records, matching the
                      schema above.
  ③ LGA REFERENCE   — the State -> LGA lookup used by location-filter.js's
                      dropdown. Kept independent from PROJECTS so the
                      dropdown always shows every LGA option for a
                      state, even ones with no mock project in them yet.


*/