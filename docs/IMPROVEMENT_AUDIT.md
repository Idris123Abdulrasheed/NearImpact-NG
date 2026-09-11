# NearImpact Nigeria — Improvement Audit

A full pass across all 46 files, organized by priority. Items in **🔴 High-value fixes** are things I actually noticed while rewriting your files — real bugs or gaps, not generic advice. Everything after that is more standard "next steps as you grow" guidance.

---

## 🔴 High-value fixes (found while reading every file)

### 1. Dark mode is completely unreachable on desktop
`user-menu.css` only shows `.user-menu` via `.nav.menu-open .user-menu`, and `.nav.menu-open` only gets applied by the hamburger button — which is itself `display: none` above 850px (see `nav.css`'s `@media (max-width:850px)` block). That means the avatar dropdown (and therefore the dark mode toggle) **only exists on mobile widths**. Anyone on desktop has no way to switch themes at all. Worth deciding: either give desktop its own always-visible toggle, or make the avatar menu visible at all breakpoints.

### 2. Two disconnected data sources
Your `/api/search` endpoint (`search-api.js`) queries a real MySQL database. But the main "Nearby Impacts Found" grid, the map, and the opportunities list all read from **hardcoded arrays** in `projects.js` and `opportunities.js` — completely separate from the database the search bar hits. So today, a project could exist in your database and be findable via search, but never show up on the map or in the main grid (and vice versa). This is the single biggest thing standing between "prototype" and "MVP" — the core browsing experience needs to read from the same source of truth as search.

### 3. Newsletter signup does nothing
In `footer.js`, the Subscribe button is `type="button"` with no click handler — it's decorative. Either wire it to a real endpoint (Mailchimp, ConvertKit, your own API) or remove it so it's not misleading.

### 4. "Log In" is a dead link
`nav.js`'s `.nav__login-btn` points to `href="#"` with no behavior. Combined with `auth.js`'s stub, there's currently no way for a real user to create an account or log in at all — worth at minimum a "Coming soon" state so it doesn't look broken.

### 5. Fabricated people presented as real
`testimonials.js` (6 named people with quotes and roles) and `community.js` (9 "impactmakers" with names and photos) are placeholder data — but nothing in the UI signals that to a visitor. Presenting invented names/quotes as real testimonials is a real credibility/trust risk once this goes in front of actual users, even unintentionally. Either get real testimonials/community members before launch, or hold this section back.

### 6. Hardcoded copyright year
`footer.js` has `© 2026 NearImpact Nigeria` as a literal string. Small thing, but it'll silently go stale — swap for `new Date().getFullYear()`.

### 7. Three pre-existing bugs already flagged in the code comments
These were already in the codebase before the documentation pass (I preserved them exactly and left notes in the relevant `DEVELOPERS NOTE` blocks rather than silently fixing them, since that would've changed behavior mid-refactor):
- `hero.css` — `gap: 26x` in the 480px media query (should likely be `26px`).
- `location-filter.js` — calls `icon("location")`, but `icons.js` only defines `"locate"`, so it silently falls back to the default pin icon.
- `projects.css` — badge colors are only defined for `volunteer`/`training`/`fellowship`/`project` types. `internship`, `job`, and `grant` project-type badges render with no background color at all.

---

## Architecture & code quality

- **No real backend for the core loop.** `auth.js`, the "requires auth" gate in `project-list.js`, and the login button are all stubs. This is fine for a prototype but is the main blocker to calling it an MVP (see the naming discussion above).
- **No content management.** Projects, opportunities, testimonials, partners, and impactmakers are all hardcoded JS arrays. Every content update currently requires a developer to edit and redeploy code. Even a lightweight admin panel or a headless CMS (Sanity, Contentful, or just a simple internal dashboard writing to your MySQL DB) would remove that bottleneck.
- **Global `window` functions in `nav.js`.** `openSidebar`, `closeSidebar`, and `handleHomeClick` are attached to `window` so inline `onclick="..."` attributes in the template strings can reach them. It works, but it's a step away from standard practice — migrating to `addEventListener` calls in `initNav()` would remove the need to pollute the global scope at all. Not urgent, just worth knowing it's there.
- **No automated tests anywhere** in the 46 files reviewed. Even a handful of tests around `projects-query.js`'s filtering/sorting logic (it's pure, no DOM — very testable) and the `/api/search` validation logic would catch regressions cheaply.
- **No linting/formatting config visible.** Consider ESLint + Prettier (or Biome, which does both) so style stays consistent as the codebase grows past one contributor.
- **No environment variable validation.** `db.js` reads `DB_HOST`/`DB_USER`/etc. straight from `process.env` with no check that they're actually set — if one's missing in production, you'll get a cryptic connection error instead of a clear "missing DB_HOST" message at startup.

## Security

- **No rate limiting on `/api/search`.** Right now it can be hit as fast as a client wants. Worth adding basic rate limiting (even a simple in-memory or Redis-backed limiter) before this is public-facing at scale.
- **LIKE wildcard characters aren't escaped.** A search term containing `%` or `_` will be interpreted as a SQL wildcard rather than a literal character (e.g., searching for `100%` would behave oddly). Low risk, but worth escaping those two characters before building the `%${query}%` pattern.
- **Auth enforcement is 100% client-side today.** `requireAuth()` in `project-list.js` and `auth.js` is a UI gate only — nothing stops someone from bypassing it via devtools. Not a problem right now since there's nothing sensitive behind it, but once real accounts/data exist, every "requires auth" action needs server-side enforcement too, not just a client-side check.
- **No security headers configured** (CSP, X-Frame-Options, etc.) in anything I reviewed — worth adding once you're on a real hosting setup, via whatever your platform (Vercel, etc.) supports.

## Performance

- **Seven full-size hero background images** loaded for the slideshow (`hero.js`). Only the first is visible on load; the other six load immediately too since there's no lazy-loading logic for them. Consider: lazy-loading images beyond the first, serving responsive `srcset` sizes, and converting to WebP/AVIF if they aren't already.
- **No code splitting** — `main.js` imports every component's CSS and JS regardless of what's actually needed on the page. Fine for a single-page site at this size; worth revisiting if the site grows into multiple pages/routes.

## Accessibility

- **No skip-to-content link** — keyboard/screen-reader users have to tab through the entire nav before reaching main content.
- **Newsletter input has no `<label>`**, only a placeholder (`footer.js`) — placeholders aren't a reliable substitute for labels for assistive tech.
- **Desktop dark-mode inaccessibility** (see High-value fix #1) is also an accessibility issue, not just a UX one, for anyone who relies on dark mode for visual comfort.
- Good news: focus-visible states, alt text on images, aria-labels on icon-only buttons, and the native `<details>` FAQ accordion are all already handled well — this isn't a from-scratch accessibility problem, just a few gaps.

## SEO & metadata

I didn't have visibility into your `index.html`, so I can't confirm what's already there — but worth double-checking you have: a descriptive `<title>` and meta description, Open Graph / Twitter Card tags (especially important since this is a platform people will want to share), a `sitemap.xml` and `robots.txt`, and structured data (schema.org `Organization` or `NGO` markup) given the nonprofit/impact-platform nature of the site.

## Content & data

- **Impact Hours stat is explicitly a placeholder** (`impact-stats.js` even has a `// TODO: confirm the real Impact Hours figure` comment) — get a real number before this goes live publicly.
- **Only 3 of 8 partner logo slots are real** (`partners.js`) — the rest were deliberately left as clean placeholders rather than unconfirmed NGO names, which is the right call, but worth tracking as an open item.
- **`.env` credentials** — confirmed these are read from environment variables correctly in `db.js`, not hardcoded. Good practice already in place.

---

## Suggested priority order

If I were sequencing this, I'd tackle it roughly:

1. Fix the desktop dark-mode bug (quick, isolated)
2. Decide: newsletter form and login button — wire them up or visibly mark them "coming soon"
3. Connect the main project/opportunity list to your real database (the biggest architectural gap)
4. Replace or clearly label placeholder testimonials/impactmakers
5. Basic rate limiting + LIKE-escaping on the search API
6. Real auth (this unlocks a lot — saved projects that persist, real profile pages, server-enforced gating)
7. Accessibility pass (skip link, form labels)
8. SEO/metadata pass before any public launch push