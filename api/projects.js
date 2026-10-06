import { getPool } from "../lib/db.js";

// GET /api/projects              -> filtered, sorted, paginated list of APPROVED projects
// GET /api/projects?id=p001      -> one approved project (id here is the public slug)
// DEVELOPERS NOTE at the bottom has the response shape and the id/slug explanation.

// ① CONFIG:
const TYPES = ["volunteer", "internship", "training", "fellowship", "job", "grant", "project"];
const DEFAULT_PAGE_SIZE = 6;
const MAX_PAGE_SIZE = 24;
const MAX_STATE_LENGTH = 60;
const MAX_LGA_LENGTH = 80;
const MAX_SLUG_LENGTH = 60;

// Whitelist: the user picks a KEY, the SQL text comes from here, never from the request.
const SORTS = {
  popular: "volunteers DESC, id ASC",
  rating: "rating DESC, id ASC",
  newest: "created_at DESC, id ASC",
};

// Column aliases make the JSON match the field names the frontend card already uses.
const LIST_COLUMNS = `slug AS id, title AS name, organisation AS orgName, state, lga, lat, lng,
  types, sdgs, volunteers, rating, benefits, image`;
const DETAIL_COLUMNS = `${LIST_COLUMNS}, description`;

// ② HELPERS:
function first(value) {
  return Array.isArray(value) ? value[0] : value;
}

function clampInt(value, fallback, min, max) {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(Math.max(n, min), max);
}

function splitList(value) {
  return value ? value.split(",").map((s) => s.trim()).filter(Boolean) : [];
}

// DECIMAL columns arrive from mysql2 as strings, so numbers are converted here.
function shapeRow(row) {
  return {
    ...row,
    types: splitList(row.types),
    sdgs: splitList(row.sdgs).map(Number).filter(Number.isInteger),
    rating: Number(row.rating),
    volunteers: Number(row.volunteers),
  };
}

// ③ DETAIL:
async function handleDetail(slug, res) {
  if (!slug || slug.length > MAX_SLUG_LENGTH) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const [rows] = await getPool().query(
      `SELECT ${DETAIL_COLUMNS} FROM projects WHERE slug = ? AND status = 'approved' LIMIT 1`,
      [slug]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }
    return res.status(200).json({ item: shapeRow(rows[0]) });
  } catch (err) {
    console.error("Project lookup failed:", err);
    return res.status(500).json({ error: "Could not load project" });
  }
}

// ④ LIST:
async function handleList(req, res) {
  const type = String(first(req.query.type) ?? "").trim();
  const state = String(first(req.query.state) ?? "").trim();
  const lga = String(first(req.query.lga) ?? "").trim();
  const sdgRaw = String(first(req.query.sdg) ?? "").trim();
  const sort = String(first(req.query.sort) ?? "").trim() || "popular";
  const page = clampInt(first(req.query.page), 1, 1, 100000);
  const pageSize = clampInt(first(req.query.pageSize), DEFAULT_PAGE_SIZE, 1, MAX_PAGE_SIZE);

  if (type && !TYPES.includes(type)) {
    return res.status(400).json({ error: "Invalid type" });
  }
  if (!Object.hasOwn(SORTS, sort)) {
    return res.status(400).json({ error: "Invalid sort" });
  }
  if (state.length > MAX_STATE_LENGTH || lga.length > MAX_LGA_LENGTH) {
    return res.status(400).json({ error: "Invalid location" });
  }
  let sdg = null;
  if (sdgRaw) {
    sdg = Number(sdgRaw);
    if (!Number.isInteger(sdg) || sdg < 1 || sdg > 17) {
      return res.status(400).json({ error: "Invalid sdg" });
    }
  }

  const where = ["status = 'approved'"];
  const params = [];
  if (type) { where.push("FIND_IN_SET(?, types) > 0"); params.push(type); }
  if (state) { where.push("state = ?"); params.push(state); }
  if (lga) { where.push("lga = ?"); params.push(lga); }
  if (sdg) { where.push("FIND_IN_SET(?, sdgs) > 0"); params.push(String(sdg)); }
  const whereSql = where.join(" AND ");

  try {
    const pool = getPool();
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM projects WHERE ${whereSql}`,
      params
    );

    const [rows] = await pool.query(
      `SELECT ${LIST_COLUMNS} FROM projects
       WHERE ${whereSql}
       ORDER BY ${SORTS[sort]}
       LIMIT ? OFFSET ?`,
      [...params, pageSize, (page - 1) * pageSize]
    );

    return res.status(200).json({
      items: rows.map(shapeRow),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (err) {
    console.error("Projects list failed:", err);
    return res.status(500).json({ error: "Could not load projects" });
  }
}

// ⑤ REQUEST HANDLING:
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const idParam = first(req.query.id);
  if (idParam !== undefined) return handleDetail(String(idParam).trim(), res);
  return handleList(req, res);
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  Read-only endpoint behind the all-projects page and the project
  detail page. Same discipline as api/opportunities.js: method guard
  first, validate every query value, then touch the database. Filters
  are whitelisted or range-checked and reach MySQL as ? parameters.
  Sorting is a lookup (SORTS): the request chooses a key, the SQL text
  always comes from this file. Only status = 'approved' rows are ever
  returned.

  WHY "slug AS id": the table has an internal numeric id, but the
  public id in URLs and cards is the slug ("p001"), the same ids the
  mock list uses. That way a card on the homepage (still mock) and the
  same project from the database open the same detail page. New rows
  need a slug set by hand for now.

  RESPONSE SHAPE COUPLING: list -> { items, total, page, pageSize,
  totalPages }; detail -> { item }. Each item has id, name, orgName,
  state, lga, lat, lng, types[], sdgs[], volunteers, rating, benefits,
  image (detail adds description): the SAME fields as the mock projects,
  so ui/project-card.js and detail.js work with either source. Rename a
  field here and those files change in the same edit.

  BLOCKS DEFINITIONS:
  ① CONFIG           — whitelists, sort map, page limits, column lists.
  ② HELPERS          — query-string normalising, row shaping (types and
                       sdgs become arrays, DECIMAL becomes a number).
  ③ DETAIL           — GET ?id=<slug>.
  ④ LIST             — validation, WHERE building, count + page query.
  ⑤ REQUEST HANDLING — method guard, then picks detail or list.

  CLASS NAME GLOSSARY:
  No CSS here — server file.
*/
