import { getPool } from "../lib/db.js";
import { getSessionToken, verifyToken } from "../lib/auth.js";

// /api/impactmakers
//   GET              -> all APPROVED impactmakers (slug, name, sdg)
//   GET ?slug=<slug> -> one approved impactmaker, full profile
//   POST             -> a logged-in user applies (saved as "pending")
// DEVELOPERS NOTE at the bottom explains the choices.

// ① CONSTANTS:
const SLUG_PATTERN = /^[a-z0-9-]{1,100}$/;
const LIST_LIMIT = 200;
const MAX_CONTRIBUTIONS = 3;
const MAX_SKILLS = 8;
const MAX_SKILL_LENGTH = 30;
const MAX_STAT = 1000000;

// ② HELPERS — GENERAL:
const text = (value) => (typeof value === "string" ? value.trim() : "");

function parseJson(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function isHttpsUrl(value) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

// Empty -> { ok: true, value: null }. A whole number in range -> its
// value. Anything else -> { ok: false }.
function optionalInt(value, min, max) {
  if (value === undefined || value === null || String(value).trim() === "") {
    return { ok: true, value: null };
  }
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) return { ok: false };
  return { ok: true, value: n };
}

function makeSlug(name) {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return base || "impactmaker";
}

// ③ HELPERS — SHAPING A DATABASE ROW FOR THE FRONTEND:
function toProfile(row) {
  const stats = {};
  if (row.stat_projects !== null) stats.projects = row.stat_projects;
  if (row.stat_hours !== null) stats.hours = row.stat_hours;
  if (row.stat_communities !== null) stats.communities = row.stat_communities;

  return {
    slug: row.slug,
    name: row.full_name,
    sdg: row.sdg,
    role: row.role ?? undefined,
    organisation: row.organisation ?? undefined,
    location: row.location ?? undefined,
    since: row.since ?? undefined,
    bio: row.bio ?? undefined,
    stats,
    skills: row.skills ? row.skills.split(",") : [],
    contributions: parseJson(row.contributions, []),
    links: parseJson(row.links, []),
  };
}

// ④ VALIDATION:
// Returns { error } or { value } where value is clean, ready to insert.
function validateApplication(body) {
  const thisYear = new Date().getFullYear();

  const fullName = text(body.fullName);
  const role = text(body.role);
  const organisation = text(body.organisation);
  const location = text(body.location);
  const bio = text(body.bio);

  if (fullName.length < 2 || fullName.length > 100) return { error: "Enter your full name" };
  if (role.length > 100) return { error: "Role is too long" };
  if (organisation.length > 150) return { error: "Organisation is too long" };
  if (location.length > 100) return { error: "Location is too long" };
  if (bio.length > 600) return { error: "About you must be 600 characters or fewer" };

  const sdg = Number(body.sdg);
  if (!Number.isInteger(sdg) || sdg < 1 || sdg > 17) return { error: "Choose your main SDG focus" };

  if (body.consent !== true) return { error: "Please agree to show your profile publicly" };

  const since = optionalInt(body.since, 2000, thisYear);
  if (!since.ok) return { error: `"Impactmaker since" must be a year between 2000 and ${thisYear}` };

  const rawStats = body.stats && typeof body.stats === "object" ? body.stats : {};
  const projects = optionalInt(rawStats.projects, 0, MAX_STAT);
  const hours = optionalInt(rawStats.hours, 0, MAX_STAT);
  const communities = optionalInt(rawStats.communities, 0, MAX_STAT);
  if (!projects.ok || !hours.ok || !communities.ok) {
    return { error: "Numbers must be whole numbers from 0 to 1,000,000" };
  }

  // skills: stored comma-separated, so a skill can't contain a comma
  const rawSkills = Array.isArray(body.skills) ? body.skills.map(text).filter(Boolean) : [];
  if (rawSkills.length > MAX_SKILLS) return { error: `List at most ${MAX_SKILLS} skills` };
  if (rawSkills.some((s) => s.length > MAX_SKILL_LENGTH || s.includes(","))) {
    return { error: `Each skill must be ${MAX_SKILL_LENGTH} characters or fewer` };
  }

  // contributions: up to 3, each needs a title
  const rawContributions = Array.isArray(body.contributions) ? body.contributions : [];
  if (rawContributions.length > MAX_CONTRIBUTIONS) {
    return { error: `Add at most ${MAX_CONTRIBUTIONS} contributions` };
  }
  const contributions = [];
  for (const item of rawContributions) {
    const title = text(item && item.title);
    const description = text(item && item.description);
    const year = optionalInt(item && item.year, 2000, thisYear + 1);

    if (!title) return { error: "Each contribution needs a title" };
    if (title.length > 120) return { error: "A contribution title is too long" };
    if (description.length > 300) return { error: "A contribution description is too long" };
    if (!year.ok) return { error: "A contribution year is not valid" };

    const entry = { title };
    if (year.value !== null) entry.year = year.value;
    if (description) entry.description = description;
    contributions.push(entry);
  }

  // links: https only
  const links = [];
  for (const [label, raw] of [
    ["LinkedIn", body.linkedin],
    ["Website", body.website],
  ]) {
    const href = text(raw);
    if (!href) continue;
    if (href.length > 255 || !isHttpsUrl(href)) {
      return { error: `${label} link must be a valid address starting with https://` };
    }
    links.push({ label, href });
  }

  return {
    value: {
      fullName,
      role: role || null,
      organisation: organisation || null,
      location: location || null,
      bio: bio || null,
      sdg,
      since: since.value,
      projects: projects.value,
      hours: hours.value,
      communities: communities.value,
      skills: rawSkills.length ? rawSkills.join(",") : null,
      contributions: contributions.length ? JSON.stringify(contributions) : null,
      links: links.length ? JSON.stringify(links) : null,
    },
  };
}

// ⑤ GET:
async function handleGet(req, res) {
  const slug = typeof req.query.slug === "string" ? req.query.slug.trim() : "";
  const pool = getPool();

  try {
    if (slug) {
      if (!SLUG_PATTERN.test(slug)) {
        return res.status(400).json({ error: "Invalid slug" });
      }

      const [rows] = await pool.query(
        `SELECT slug, full_name, role, organisation, sdg, location, since, bio,
                stat_projects, stat_hours, stat_communities,
                skills, contributions, links
         FROM impactmaker_profiles
         WHERE slug = ? AND status = 'approved'
         LIMIT 1`,
        [slug]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: "Impactmaker not found" });
      }

      res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
      return res.status(200).json({ impactmaker: toProfile(rows[0]) });
    }

    const [rows] = await pool.query(
      `SELECT slug, full_name, sdg
       FROM impactmaker_profiles
       WHERE status = 'approved'
       ORDER BY id
       LIMIT ?`,
      [LIST_LIMIT]
    );

    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({
      impactmakers: rows.map((r) => ({ slug: r.slug, name: r.full_name, sdg: r.sdg })),
    });
  } catch (err) {
    console.error("Impactmakers lookup failed:", err);
    return res.status(500).json({ error: "Could not load impactmakers" });
  }
}

// ⑥ POST:
async function handlePost(req, res) {
  const token = getSessionToken(req);
  const session = token ? verifyToken(token) : null;
  if (!session) {
    return res.status(401).json({ error: "Please log in to apply" });
  }

  const result = validateApplication(req.body || {});
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  const v = result.value;
  const baseSlug = makeSlug(v.fullName);
  const pool = getPool();

  try {
    // The UNIQUE keys decide, not a SELECT first, so two simultaneous
    // requests can't both win. A slug clash retries with a number; a
    // user clash means this account already applied.
    for (let attempt = 0; attempt < 3; attempt++) {
      const slug = attempt === 0 ? baseSlug : `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;

      try {
        await pool.query(
          `INSERT INTO impactmaker_profiles
             (user_id, slug, full_name, role, organisation, sdg, location, since, bio,
              stat_projects, stat_hours, stat_communities, skills, contributions, links)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            session.userId,
            slug,
            v.fullName,
            v.role,
            v.organisation,
            v.sdg,
            v.location,
            v.since,
            v.bio,
            v.projects,
            v.hours,
            v.communities,
            v.skills,
            v.contributions,
            v.links,
          ]
        );

        return res.status(201).json({
          message: "Thanks! Your application has been received and your profile will appear once we've reviewed it.",
        });
      } catch (err) {
        if (err.code !== "ER_DUP_ENTRY") throw err;
        if (String(err.sqlMessage).includes("uq_profile_user")) {
          return res.status(409).json({ error: "You've already submitted an impactmaker application" });
        }
        // otherwise the slug was taken: loop and try a numbered one
      }
    }

    return res.status(500).json({ error: "Could not save your application. Try again." });
  } catch (err) {
    console.error("Impactmaker application failed:", err);
    return res.status(500).json({ error: "Could not save your application. Try again." });
  }
}

// ⑦ REQUEST HANDLING:
export default async function handler(req, res) {
  if (req.method === "GET") return handleGet(req, res);
  if (req.method === "POST") return handlePost(req, res);

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  One endpoint for the whole impactmakers feature, split by HTTP
  method, backed by the impactmaker_profiles table (see
  impactmaker-profiles.sql). The frontend reads it through
  src/modules/data/impactmakers.js; the application form posts to it.

  PUBLIC vs PENDING: every GET filters on status = 'approved', so a
  pending or rejected application is never exposed, even by guessing
  its slug. Approving someone is a status change in the database.

  LOGIN: POST requires a valid session cookie, and the applicant's id
  comes from the verified token, never from the request body. A UNIQUE
  key on user_id allows one application per account.

  SLUGS: generated from the name (a-z, 0-9, hyphens) so they are safe
  in URLs and file names (public/impactmakers/<slug>.jpg). Clashes get
  a random 4-digit suffix.

  CACHING: public GET responses carry Cache-Control s-maxage=60, so
  Vercel's edge can serve them for a minute. A newly approved profile
  can take up to a minute to appear; that's the trade for fewer
  database hits.

  Stored as plain text: skills as "a,b,c"; contributions and links as
  JSON strings. Fine at this size. If you ever need to QUERY by skill
  or link, move them into their own tables.

  KNOWN GAPS: no rate limit on POST, and the list is capped at 200
  with no paging. Add both before a public launch.

  All queries are parameterized. Every length and range limit here
  matches a column in impactmaker-profiles.sql.

  BLOCKS DEFINITIONS:
  ① CONSTANTS            — limits and the slug pattern.
  ② HELPERS — GENERAL    — text(), parseJson(), isHttpsUrl(),
                           optionalInt(), makeSlug().
  ③ HELPERS — SHAPING    — toProfile(): database row to the object the
                           frontend expects.
  ④ VALIDATION           — validateApplication(): one error or a clean value.
  ⑤ GET                  — list, or one profile by slug.
  ⑥ POST                 — login check, validate, insert with slug retry.
  ⑦ REQUEST HANDLING     — method routing.
*/
