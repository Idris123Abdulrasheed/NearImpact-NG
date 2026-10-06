import { getPool } from "../lib/db.js";

// This is our serverless handler behind. Check the DEVELOPERS NOTE at the
// bottom which covers the validation order and the response shape our 
// frontend search.js expects back.

// ① REQUEST HANDLING:
export default async function handler(req, res) {
  // method guard
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const query = (req.query.q || "").trim();

  // empty query; short-circuit incase if user did not search anything
  if (query === "") {
    return res.status(200).json({ projects: [], opportunities: [], impactmakers: [] });
  }

  // length guard; rejects unnecessary long input to avoid hitting db with junks
  if (query.length > 100) {
    return res.status(400).json({ error: "Query too long" });
  }

  const like = `%${query}%`;
  const limit = 5;
  const pool = getPool();

  // the three parallel searches; one per result category
  try {
    const [projects] = await pool.query(
      `SELECT id, title, organisation, location FROM projects
       WHERE (title LIKE ? OR organisation LIKE ? OR location LIKE ?) AND status = 'approved'
       LIMIT ?`,
      [like, like, like, limit]
    );

    const [opportunities] = await pool.query(
      `SELECT id, title, type, location FROM opportunities
       WHERE (title LIKE ? OR type LIKE ? OR location LIKE ?) AND status = 'approved'
       LIMIT ?`,
      [like, like, like, limit]
    );

    const [impactmakers] = await pool.query(
     `SELECT id, slug, full_name, role,  organisation FROM impactmaker_profiles

   WHERE status = 'approved'
     AND (full_name LIKE ? OR role LIKE ? OR organisation LIKE ?)
   LIMIT ?`,
  [like, like, like, limit]
  );

    return res.status(200).json({ projects, opportunities, impactmakers });
  } catch (err) {
    console.error("Search query failed:", err);
    return res.status(500).json({ error: "Search failed" });
  }
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The serverless function behind GET /api/search. This is what the
  frontend's search.js (the one wiring up nav.js's search boxes) is
  actually calling with `fetch(\`/api/search?q=${term}\`)`. Gets its
  database connection from db.js's shared pool rather than creating
  its own; visit db.js's own DEVELOPERS NOTE for why that matters in our
  serverless environment.

  VALIDATION ORDER matters here: 
  1. method check and reject anything that isn't GET before proceeding, 
  2. then an empty-query short-circuit (returns empty results ASAP, without 
  ever touching the database; an empty search shouldn't cost a query), 
  3. then a length guard; rejects unreasonably long input
  BEFORE it's used to build a query. Only after all three checks
  pass does this function ever call getPool() or touch the database.

  All three searches use parameterized queries (the `?` placeholders
  + the values array) rather than string-interpolating the search
  term directly into SQL, this is done to prevents SQL injection.

  RESPONSE SHAPE COUPLING: the JSON shape returned here; three keys
  (projects/opportunities/impactmakers), each an array of rows with
  the exact field names selected in each query (title/organisation/
  location for projects, title/type/location for opportunities,
  full_name/role/organisation for impactmakers). Changing a
  SELECTed column name or the top-level key structure here means that
  file's rendering code needs to change too, in the same edit; same
  kind of cross-file coupling as type-meta.js's badge/img fields
  feeding project-list.js's CSS classes.

  BLOCKS DEFINITIONS:
  ① REQUEST HANDLING  — the whole handler in one function, since every
                        step (method guard, empty-query shortcut,
                        length guard, then the three actual searches)
                        runs in a strict sequence where each step
                        gates whether the next one happens at all —
                        split with inline comments per step rather
                        than separate numbered sections, since it's
                        one continuous request-handling pipeline, not
                        independent concerns.


*/




