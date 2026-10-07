<!-- Paste this as a new section into docs/CODING_STANDARDS.md -->

## Local data vs database data

Homepage sections and their "see all" pages use two different data sources
on purpose:

- **Homepage section (projects list, impactmakers carousel):** renders from a
  LOCAL array in its own module. It never calls the API, so it always shows its
  featured items even if `/api` is down.
- **"See all" page (all-projects, impactmakers directory) and detail pages:**
  database-backed through an `api/` endpoint and a client in `src/modules/data/`.
  Only `status = 'approved'` records are ever returned.

**The slug is the join key.** A local card links to
`<page>.html?slug=<slug>`, and the detail page loads that slug from the
database. A local slug MUST equal the database slug of the same record. When
you add a featured item locally, add (or approve) it in the database too.

**Slug fallback decision:** if a slug is missing or not approved, the detail page
shows its "not found" view. It does NOT fall back to the local data, because
the database's `approved` status is the single control for whether a record is
public. A local fallback would keep showing a profile that was hidden or
rejected.

**Known trade-off:** a newly approved record appears on the "see all" page but
not on the homepage until it is added to the local array, and hiding a record
in the database does not remove its homepage card.

**Auth:** profile and directory pages are public (no `requireAuth`). Only
actions that create data (List Your Project, Become an Impactmaker) require login.

**Structure update:** `src/modules/community.js` holds its own `IMPACTMAKERS`
array; `src/modules/data/impactmakers.js` is the API client used by the
directory and profile pages only.
