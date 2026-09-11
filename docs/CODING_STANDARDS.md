# NearImpact Nigeria CODING STANDARDS

This document describes how we actually write code in this repo, not what we might 
adopt someday. Read it once, then use it as a reference, not a rulebook to memorize.

The goal: anyone can open a file they didn't write and immediately
understand what it does and why it's built that way.

---

## 1. What we're actually building on

- **Frontend:** Vite + plain JavaScript. No React, no Vue, no JSX. Pages
  are assembled from `render*()` functions that return HTML as template
  literal strings, which `main.js` drops into `#app`.
- **Styling:** Plain CSS, one stylesheet per module, all pulling from a
  shared set of design tokens (colors, fonts) defined in `base.css`;
  the "Canopy & Contour" palette. No Tailwind, no CSS-in-JS.
- **Backend:** Still undecided; see the README. The current experiment
  is serverless JS functions on Vercel (`api/`, `lib/db.js`). PHP is the
  other option on the table. Don't write backend conventions here as if
  either is final; Section 11 covers what applies regardless.
- **Deployment:** Vercel.

If any of this changes; a framework gets introduced, the backend gets
decided; update this document in the same PR. Don't let it drift.

---

## 2. General principles

Standard practice, nothing exotic:

1. Write for the next person reading it, not for yourself right now.
2. Prefer the boring, obvious solution over the clever one.
3. Don't duplicate logic that can reasonably be shared.
4. One file, one job.
5. Let names do the explaining — comments are a backup, not the plan.
6. Keep functions small enough to hold in your head.
7. Don't add a dependency because it's convenient; add it because
   there's a real gap it fills.
8. No debug code, dead code, secrets, or commented-out blocks in commits.
9. Match the existing pattern before inventing a new one.
10. When two approaches are both reasonable, pick whichever matches
    what's already in the codebase.

---

## 3. Project structure

Current, real layout:

```
src/
├── assets/           
├── modules/
│   ├── nav.js
│   ├── hero.js
│   ├── project-list.js
│   ├── map.js
│   ├── opportunities.js
│   ├── sdgs.js
│   ├── community.js
│   ├── testimonials.js
│   ├── cta.js
│   ├── faq.js
│   ├── footer.js
│   └── styles/
│       ├── base.css      → design tokens + resets
│       ├── nav.css
│       ├── hero.css
│       └── ... one CSS file per module, same name as its JS file
└── main.js             → imports every module + its CSS, assembles the page
```

Each homepage section is a **module**: one `.js` file exporting a single
`render<Section>()` function, paired with one `.css` file of the same
name. `main.js` is the only file that knows the *order* sections appear
in — modules don't know or care about each other.

As the app grows past a single homepage (multiple pages, shared
components used in more than one place, real API calls), that's the
point to introduce `pages/`, `components/`, and `services/` directories.
Don't create them preemptively — YAGNI applies to folders too. When we
do split it out, `hero.js`, `nav.js`, etc. become the first occupants of
`components/`, and a router or multi-entry Vite config handles `pages/`.

---

## 4. File naming

Lowercase kebab-case, every time, no exceptions:

```
nav.js
project-card.js      
format-date.js
map.css
```

Not:

```
Nav.js
project_card.js
projectCard.js
```

This avoids case-sensitivity bugs when a repo moves between
macOS/Windows (case-insensitive) and Linux (case-sensitive) — a real
class of bug that shows up in CI.

---

## 5. JavaScript naming conventions

### 5.1 Variables & functions — camelCase

```js
const projectName = "Clean Campus";
const studentCount = 120;
const isAuthenticated = true;

function fetchProjects() { }
function calculateImpactScore() { }
```

### 5.2 Render functions

Every module exports exactly one `render<SectionName>()` function that
returns a template literal string — a templating/view-function pattern,
not a React convention (there's no lifecycle or props here). Lowercase
camelCase, prefixed with `render`:

```js
export function renderHero() { ... }
export function renderProjectList() { ... }
```

Internal helpers that build a *piece* of a module's markup (like
`renderBrand()` inside `nav.js`) follow the same pattern but stay
unexported — only the top-level section function is public.

### 5.3 Booleans read like yes/no questions

```js
const isLoading = true;
const hasPermission = true;
const canEdit = false;
```

Not `loading`, `permission` — those read as data, not state.

### 5.4 Constants

`UPPER_SNAKE_CASE` for values that are fixed and meaningful across the
whole app:

```js
const MAX_PROJECT_TITLE_LENGTH = 100;
const DEFAULT_PAGE_SIZE = 20;
```

A `const` that's just a local, one-off value stays camelCase:

```js
const projectName = "Clean Campus";
```

Don't shout-case something just because it's declared with `const`.

### 5.5 Collections vs. single items

```js
const projects = [];      // plural = collection
const project = {};       // singular = one item
```

---

## 6. JavaScript style

Standard across most JS style guides — these prevent specific, real bugs:

**`const` by default, `let` only on reassignment, never `var`.**
`var` is function-scoped and hoists in ways that cause bugs; `const`/`let`
are block-scoped and predictable.

**Strict equality, always (`===` / `!==`).**
`==` does type coercion that produces surprising results
(`"" == 0` is `true`). Not worth the ambiguity.

**Early returns over nested conditionals:**

```js
function submitProject(project) {
  if (!project) return;
  if (!project.title) return;

  // submit
}
```

Reads top-to-bottom instead of requiring you to track indentation depth.

**Name magic numbers:**

```js
const MAX_PROJECTS_PER_PAGE = 20;

if (projects.length > MAX_PROJECTS_PER_PAGE) { ... }
```

If you can't tell what a number *means* from reading it, it needs a name.

---

## 7. CSS & BEM

We use **BEM** (Block, Element, Modifier) — the actual naming
methodology, not a general kebab-case rule. Every CSS file pairs 1:1
with a JS module, and the module's section name is the block.

```css
.nav { }                 /* block */
.nav__brand { }           /* element — only makes sense inside .nav */
.nav__brand-mark { }
```

Modifiers (`--variant`) are for genuine style variants (a card that
comes in a "featured" and "default" look, say) — don't invent one just
because it feels thorough.

**State classes are the one deliberate exception.** Classes JavaScript
toggles at runtime — `is-open`, `menu-open`, `no-scroll` — stay plain,
not BEM'd. They're behavioral flags, not structural names, and keeping
them visually distinct from `.block__element` makes it obvious at a
glance which one JS is going to be adding or removing.

```css
.nav__sidebar.is-open { }   /* fine — is-open is a flag, not an element */
```

**Design tokens live in `base.css`.** Colors, fonts, spacing — reference
the CSS custom properties defined there (`var(--canopy)`, `var(--ink)`,
etc.) rather than hardcoding hex values in module stylesheets. If a
module genuinely needs a new token, add it to `base.css`, not inline.

**Mobile-first, always.** Base styles target the smallest screen; media
queries add complexity for wider viewports, not the other way around.

---

## 8. Comments & documentation

Every JS file in this repo follows the same structure. This is the
standard going forward for new files too.

**Top of file:** a short, human line pointing to the DEVELOPERS NOTE at
the bottom, so nobody reverse-engineers something that's already
explained.

**Numbered section markers** break the file into logical chunks:

```js
// ① DOM REFERENCE:
// ② STATE MANAGEMENT:
// ③ RENDERING:
```

One marker per section, nothing else on that line. No JSDoc blocks above
individual functions — the section marker carries the context. Exception:
if a single render function bundles several visually distinct pieces
(three unrelated buttons in one return, say), a short inline comment per
piece is fine. Skip this for anything already single-purpose.

**Bottom of file:** a `DEVELOPERS NOTE` banner containing, in order —
architecture overview (what the file does, how it fits the app, which
conventions it's using and why), a one-line definition per numbered
section, a class-name glossary matching the real classes in the file,
and, if the file uses any, a short note on why state classes are
deliberately not BEM'd.

CSS files get a lighter version: a short pointer to the paired JS file,
inline comments only where a rule needs explaining (a reusable
sub-component, or a rule that only exists to support a JS-toggled
state), and an `EXPLANATIONS` block at the bottom instead of the full
banner — listing the blocks in that file and linking back to the JS
file's DEVELOPERS NOTE for the "why."

Two files, two halves of the same story — each should say so explicitly.

**Beyond structure, the content rule is the classic one:** comments
explain *why*, not *what*.

```js
// Bad — restates the code
// Increment counter by one
counter += 1;

// Good — explains a decision the code can't explain itself
// Start from page 1 because the API uses 1-based pagination.
let currentPage = 1;
```

If code needs a comment to justify how convoluted it is, that's a signal
to simplify the code, not write a better comment.

**TODOs** are fine, but need to name a specific task:

```js
// TODO: Replace temporary mock data with the projects API.
```

Not `// TODO: fix everything`.

---

## 9. Error handling & console usage

Never swallow an error silently:

```js
// Bad
try {
  await fetchProjects();
} catch (error) {}

// Better
try {
  await fetchProjects();
} catch (error) {
  console.error("Failed to fetch projects:", error);
}
```

Don't leak internals to end users — log the real error, show something
sensible on screen.

No stray `console.log(data)` debugging statements in committed code. If
a log genuinely belongs there, make it meaningful:

```js
console.error("Failed to load project data:", error);
```

---

## 10. Accessibility & responsive design

This is a public-facing platform, not an internal tool — these aren't
optional polish:

- Every interactive element (`onclick` handlers on `<div>`s especially)
  needs a real accessible name — `aria-label`, or use a `<button>` in
  the first place.
- Toggling UI state (sidebar open/closed, menu expanded) should update
  `aria-expanded` / `aria-hidden`, as `nav.js` already does — keep that
  pattern everywhere similar UI shows up.
- Layouts are designed mobile-first and tested at mobile, tablet, and
  desktop widths before a feature is considered done.

---

## 11. Backend & API communication

Once backend endpoints exist — whatever the stack ends up being — the
frontend should talk to them through dedicated modules, not scattered
`fetch()` calls inside render functions:

```js
// Bad
// inside project-list.js
const res = await fetch("/api/projects");

// Better — a dedicated module the render function calls into
export async function fetchProjects() {
  const response = await fetch("/api/projects");
  if (!response.ok) throw new Error("Failed to fetch projects");
  return response.json();
}
```

This keeps the frontend decoupled from backend implementation details —
it doesn't need to know whether a given endpoint is a plain script or
something more structured.

Stack-specific conventions (routing approach, input validation, prepared
statements, password hashing, session handling, folder structure) get
documented here once the backend architecture is actually decided,
rather than guessed at now.

---

## 12. Environment variables & secrets

Never commit:

- API keys
- database credentials
- tokens or service credentials of any kind

Use `.env` / `.env.local` for real values, and `.env.example` for
placeholders only:

```
VITE_API_BASE_URL=
```

Only variables genuinely meant to reach the browser get Vite's public
env-variable prefix. Everything else stays server-side. `.gitignore`
must cover local env files.

---

## 13. Git — Conventional Commits

We follow [Conventional Commits](https://www.conventionalcommits.org/),
which keeps history and changelogs scannable.

Format: `type: short description`

| Type | Use for |
|---|---|
| `feat` | a new feature |
| `fix` | a bug fix |
| `docs` | documentation only |
| `style` | formatting/visual change, no logic change |
| `refactor` | restructuring without changing behavior |
| `test` | adding or changing tests |
| `chore` | maintenance (deps, config, tooling) |

```
feat: add opportunity filtering
fix: resolve login redirect issue
refactor: extract project validation
```

Not:

```
update
fixed stuff
final final
```

**Keep commits focused** — one logical change per commit. Easier to
review, easier to revert.

**Branch naming:** `type/short-description` — `feat/opportunity-system`,
`fix/auth-redirect`. Not `my-branch`, `test`, `final-version`.

---

## 14. Before opening a PR

- App runs, no console errors.
- No debug code, no leftover `console.log`s.
- Checked at mobile, tablet, and desktop widths.
- No secrets committed.
- File/CSS naming and comment format match this document.
- PR title and description explain *what* changed and *why*.
- One meaningful change per PR where practical.

---

## 15. What to avoid

- **Vague names** — `const x = getData()` instead of
  `const projects = getProjects()`.
- **Giant functions** doing several unrelated things.
- **Giant modules** — if a `render*()` function gets hard to follow,
  split it into smaller internal helper functions the way `nav.js`
  already does (`renderBrand`, `renderNavLinks`, etc.).
- **Duplicate logic** — extract it into a shared utility once it shows
  up more than once with real overlap.
- **Dead code** — no unused functions, imports, or commented-out blocks
  sitting in committed files.
- **Premature abstraction** — don't build a generic system for two
  things that merely look similar today.

---

## 16. The one rule that overrides the rest

Consistency beats personal preference. If someone new opening the codebase 
would reasonably expect a file to follow the existing pattern,
follow it; even if you'd have done it differently on a blank page. If
a pattern genuinely needs to change, raise it and update this document
in the same PR, rather than quietly diverging.