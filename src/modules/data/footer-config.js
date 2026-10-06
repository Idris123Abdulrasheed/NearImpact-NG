// Pure data for the footer. Edit links, contact details and social
// handles HERE; footer.js never needs touching for content changes.
// DEVELOPERS NOTE at the bottom has the details.

// ① QUICK LINKS:
export const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/#discover" },
  { label: "Opportunities", href: "/#opportunities" },
  { label: "SDGs", href: "/#sdgs" },
  { label: "Community", href: "/#community" },
];

// ② RESOURCE LINKS:
// Absolute paths, so the links work from the homepage and sub pages alike.
export const RESOURCE_LINKS = [
  { label: "FAQ", href: "/#faq" },
  { label: "About Us", href: "/about.html" },
  { label: "Contact", href: "mailto:idrisadeizaabdulrasheed@gmail.com" },
  { label: "Privacy Policy", href: "/privacy.html" },
  { label: "Terms", href: "/terms.html" },
];

// ③ CONTACT DETAILS:
export const CONTACT = {
  address: "Opposite Small Market, Oboroke Ihima, Kogi State.",
  // Opens a WhatsApp chat (wa.me wants the number with country code, no + or spaces).
  whatsapp: { label: "+234901 746 2002", href: "https://wa.me/2349017462002" },
  // Plain phone numbers: tapping one opens the dialler.
  phones: [
    { label: "+234816 913 8868", href: "tel:+2348169138868" },
  ],
  email: "idrisadeizaabdulrasheed@gmail.com",
};

// ④ SOCIAL HANDLES:
// `img` is a file in public/socials/. href "#" = placeholder, replace
// with the real profile URL.
export const SOCIALS = [
  { name: "X (Twitter)", href: "https://x.com", img: "/socials/x.svg" },
  { name: "LinkedIn", href: "https://linkedin.com", img: "/socials/linkedin.svg" },
  { name: "Instagram", href: "https://instagram.com", img: "/socials/instagram.svg" },
  { name: "Facebook", href: "https://facebook.com", img: "/socials/facebook.svg" },
];





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  Content for footer.js, kept out of the markup on purpose: same
  idea as projects.js holding project data away from project-list.js.
  Adding a social platform or a link is a one-line change here.

  Phone and email entries carry ready-made tel:/mailto: hrefs, so
  footer.js renders them as clickable links without building URLs.
  Social entries with href "#" render without target="_blank", so
  placeholders don't open empty tabs.

  BLOCKS DEFINITIONS:
  ① QUICK LINKS     — the in-page anchors column.
  ② RESOURCE LINKS  — FAQ, About, Contact, legal.
  ③ CONTACT DETAILS — address, phone numbers, email.
  ④ SOCIAL HANDLES  — name (used for aria-label), href, image path.
*/
