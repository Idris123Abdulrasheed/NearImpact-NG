// Just an icon lookup table producing raw SVG strings — no CSS
// classes live in this file itself. DEVELOPERS NOTE at the bottom
// explains why inline SVG was chosen over emoji.

// ① SVG WRAPPER:
const wrap = (inner, viewBox = "0 0 24 24") => `
  <svg viewBox="${viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em">
    ${inner}
  </svg>
`;

// ② ICON DEFINITIONS:
export const ICONS = {
  // location / state / lga field icons
  mapOutline: wrap(`<path d="M9 4L4 6v14l5-2 6 2 5-2V4l-5 2-6-2z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 4v14M15 6v14" stroke="currentColor" stroke-width="1.6"/>`),
  pin: wrap(`<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="9.5" r="2.4" stroke="currentColor" stroke-width="1.6"/>`),

  // clear button
  refresh: wrap(`<path d="M4 4v5h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.6 15A8 8 0 1 0 6 7.3L4 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`),

  // map credit badge — globe
  globe: wrap(`<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3z" stroke="currentColor" stroke-width="1.6"/>`),

  // small scroll-hint chevron
  chevronRight: wrap(`<path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`),

  // ratings / people (card meta)
  star: wrap(`<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.9L12 3.5z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>`),
  people: wrap(`<circle cx="8.5" cy="8" r="2.6" stroke="currentColor" stroke-width="1.5"/><circle cx="16" cy="9" r="2.1" stroke="currentColor" stroke-width="1.5"/><path d="M3.5 19c.6-3 2.6-4.6 5-4.6s4.4 1.6 5 4.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M14.5 14.6c2 .2 3.6 1.7 4 4.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`),

  // save / like toggle
  heartOutline: wrap(`<path d="M12 20s-7-4.4-9.3-9C1.2 7.6 3 4.5 6.3 4.5c1.9 0 3.4 1 4.7 2.6C12.3 5.5 13.8 4.5 15.7 4.5 19 4.5 20.8 7.6 19.3 11 17 15.6 12 20 12 20z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>`),
  heartFilled: wrap(`<path d="M12 20s-7-4.4-9.3-9C1.2 7.6 3 4.5 6.3 4.5c1.9 0 3.4 1 4.7 2.6C12.3 5.5 13.8 4.5 15.7 4.5 19 4.5 20.8 7.6 19.3 11 17 15.6 12 20 12 20z" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>`),

  // opportunity types
  leaf: wrap(`<path d="M5 19c8 1 14-5 14-14-9 0-15 6-14 14z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M5 19c3-4 6-7 10-10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`),
  laptop: wrap(`<rect x="4" y="5" width="16" height="10" rx="1.4" stroke="currentColor" stroke-width="1.6"/><path d="M2 19h20" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`),
  megaphone: wrap(`<path d="M3 10v4h3l6 4V6l-6 4H3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M17 9.5a3 3 0 0 1 0 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`),
  cap: wrap(`<path d="M12 4l10 4.5L12 13 2 8.5 12 4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M6 10.8V15c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`),
  briefcase: wrap(`<rect x="3" y="7.5" width="18" height="11" rx="1.6" stroke="currentColor" stroke-width="1.6"/><path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" stroke="currentColor" stroke-width="1.6"/>`),
  coin: wrap(`<circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.6"/><path d="M12 7.5v9M9.3 9.5c0-1.1 1.2-2 2.7-2s2.7.7 2.7 1.7c0 2.3-5.4 1.2-5.4 3.5 0 1 1.2 1.8 2.7 1.8s2.7-.9 2.7-2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>`),
  sparkle: wrap(`<path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>`),

  moon: wrap(`<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>`),


  hourglass: wrap(`
    <path d="M6 3h12M6 21h12M7 3v3.5a5 5 0 0 0 5 5 5 5 0 0 0 5-5V3M17 21v-3.5a5 5 0 0 0-5-5 5 5 0 0 0-5 5V21"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"/>`),

  location: wrap(`
    <path d="M12 21s-6-5.65-6-10a6 6 0 1 1 12 0c0 4.35-6 10-6 10z"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"/>
    <circle cx="12" cy="11" r="2"
      stroke="currentColor"
      stroke-width="1.6"/>`),

  userPlus: wrap(`
    <circle cx="10" cy="8" r="3.2"
      stroke="currentColor"
      stroke-width="1.6"/>
    <path d="M3.5 19.5c.8-3.2 3.1-5 6.5-5"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"/>
    <path d="M18 14v6M15 17h6"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"/>`),



  user: wrap(`
    <circle cx="12" cy="8" r="3.2"
    stroke="currentColor"
    stroke-width="1.6"/>
    <path d="M5.5 19.5c.8-3.2 3.1-5 6.5-5s5.7 1.8 6.5 5"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"/>`),
  
  logout: wrap(`
    <path d="M14 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H14"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"/>
    <path d="M11 12h9M17 8l4 4-4 4"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"/>`),
    
  login: wrap(`
    <path d="M10 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H10"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"/>
    <path d="M13 12H5M16 8l4 4-4 4"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"/>`),

  linkedin: wrap(`<rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="9" r="1.1" fill="currentColor"/><path d="M8 11.5v6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M12.5 11.5v6M12.5 14.2c0-1.5 1-2.5 2.2-2.5 1.2 0 2 .9 2 2.4v3.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`),
  facebook: wrap(`<path d="M14.5 8.5h2V5.3c-.35-.05-1.55-.15-2.95-.15-2.92 0-4.92 1.78-4.92 5.05V13H6v3.5h2.63V21h3.6v-4.5h2.52l.4-3.5h-2.92v-2.3c0-1 .27-1.7 1.77-1.7Z" fill="currentColor"/>`),
  instagram: wrap(`<rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6"/><circle cx="16.8" cy="7.2" r="1.1" fill="currentColor"/>`),
  whatsapp: wrap(`<path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.1 8.1 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1s-.7.8-.9 1c-.2.2-.3.2-.6.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.6-1.3.1-.2 0-.3 0-.4l-.7-1.7c-.2-.4-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-1 2.3c0 1.3 1 2.6 1.1 2.8.1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.5-.3Z" fill="currentColor"/>`),
  xTwitter: wrap(`<path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>`),
  
  
  // password toggle: eyes closed = hidden, eyes open = visible
  monkeyClosed: wrap(`<path d="M5.4 10.2A2.7 2.7 0 1 0 5.4 14.8M18.6 10.2A2.7 2.7 0 1 1 18.6 14.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="12.5" r="7" stroke="currentColor" stroke-width="1.5"/><ellipse cx="12" cy="14.6" rx="4.2" ry="3" stroke="currentColor" stroke-width="1.5"/><path d="M8.4 10.8q1 1 2 0M13.6 10.8q1 1 2 0M10.8 15.6q1.2.9 2.4 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`),

  monkeyOpen: wrap(`<path d="M5.4 10.2A2.7 2.7 0 1 0 5.4 14.8M18.6 10.2A2.7 2.7 0 1 1 18.6 14.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="12.5" r="7" stroke="currentColor" stroke-width="1.5"/><ellipse cx="12" cy="14.6" rx="4.2" ry="3" stroke="currentColor" stroke-width="1.5"/><circle cx="9.4" cy="10.8" r="1" fill="currentColor"/><circle cx="14.6" cy="10.8" r="1" fill="currentColor"/><path d="M10.8 15.6q1.2.9 2.4 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`),

    // carousel arrows: bold, drawn dead-centre in a 24x24 box so they sit centred in a round button
  arrowLeft: wrap(`<path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`),
  arrowRight: wrap(`<path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`),
      
};

// ③ LOOKUP HELPER:
export function icon(name) {
  return ICONS[name] || ICONS.pin;
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  Single source of truth for every icon used across the app. Emoji
  render inconsistently across OS/browser (different weight, style,
  sometimes a missing glyph entirely); inline SVG doesn't have that
  problem, and stroke="currentColor" means every icon automatically
  inherits whatever text color its CONTAINER sets, including dark
  mode, with zero extra CSS. 

  This file defines ZERO CSS classes of its own; icon() just returns
  a raw <svg>...</svg> string with no class attribute at all. Every
  class you see applied to an icon (project-list__card-image-icon,
  location-filter__field-icon, etc.) is added by whichever CALLER
  wraps the icon() output in its own markup ; check that caller's own
  file for what that wrapping class actually looks like.

  BLOCKS DEFINITIONS:
  ① SVG WRAPPER       — wrap() is the one place that assembles the
                        actual <svg> tag and every entry in ICONS 
                        calls it once with its own path data. Sized
                        via 1em/1em so every icon scales with whatever
                        font-size its container sets, rather than
                        needing its own explicit width/height.
  ② ICON DEFINITIONS   — our actual icon library, loosely grouped by
                        what they're used for (location fields, the
                        use-location/clear buttons, the map credit
                        badge, ratings, save/like, opportunity types).
                        
  ③ LOOKUP HELPER      — icon(name) is the only way anything else in
                        the app should read from ICONS; it falls back
                        to the pin icon for any unrecognized name, so
                        a typo'd icon key renders SOMETHING reasonable
                        instead of crashing.


*/