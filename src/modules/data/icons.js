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

  // use-location button (crosshair / target)
  locate: wrap(`<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`),

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
  sparkle: wrap(`<path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>`)
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