import { getPool } from "../lib/db.js";

// GET /api/opportunities            -> filtered, paginated list of APPROVED listings
// GET /api/opportunities?id=7        -> one approved listing (404 if missing/not approved)
// DEVELOPERS NOTE at the bottom has the response shape and why it is coupled to the frontend.

// ① CONFIG:
const TYPES = ["fellowship", "grant", "internship", "job"];
const STATUSES = ["open", "closed"];
const DEFAULT_PAGE_SIZE = 6;
const MAX_PAGE_SIZE = 24;
const MAX_STATE_LENGTH = 60;

// Static SQL fragments only; every VALUE reaches MySQL through a ? placeholder.
const LIST_COLUMNS = `id, title, type, organisation, location, state, sdgs, reward,
  DATE_FORMAT(closes_on, '%Y-%m-%d') AS closesOn`;
const DETAIL_COLUMNS = `${LIST_COLUMNS}, description, apply_url AS applyUrl`;

// ② HELPERS:
function first(value) {
  return Array.isArray(value) ? value[0] : value;
}

function clampInt(value, fallback, min, max) {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(Math.max(n, min), max);
}

function shapeRow(row) {
  const sdgs = row.sdgs
    ? row.sdgs.split(",").map((s) => Number(s.trim())).filter(Number.isInteger)
    : [];
  return { ...row, sdgs };
}

// ③ DETAIL:
async function handleDetail(idParam, res) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const [rows] = await getPool().query(
      `SELECT ${DETAIL_COLUMNS} FROM opportunities WHERE id = ? AND status = 'approved' LIMIT 1`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Opportunity not found" });
    }
    return res.status(200).json({ item: shapeRow(rows[0]) });
  } catch (err) {
    console.error("Opportunity lookup failed:", err);
    return res.status(500).json({ error: "Could not load opportunity" });
  }
}

// ④ LIST:
async function handleList(req, res) {
  const type = String(first(req.query.type) ?? "").trim();
  const state = String(first(req.query.state) ?? "").trim();
  const status = String(first(req.query.status) ?? "").trim();
  const sdgRaw = String(first(req.query.sdg) ?? "").trim();
  const page = clampInt(first(req.query.page), 1, 1, 100000);
  const pageSize = clampInt(first(req.query.pageSize), DEFAULT_PAGE_SIZE, 1, MAX_PAGE_SIZE);

  if (type && !TYPES.includes(type)) {
    return res.status(400).json({ error: "Invalid type" });
  }
  if (status && !STATUSES.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  if (state.length > MAX_STATE_LENGTH) {
    return res.status(400).json({ error: "Invalid state" });
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
  if (type) { where.push("type = ?"); params.push(type); }
  if (state) { where.push("state = ?"); params.push(state); }
  if (sdg) { where.push("FIND_IN_SET(?, sdgs) > 0"); params.push(String(sdg)); }
  if (status === "open") where.push("(closes_on IS NULL OR closes_on >= CURDATE())");
  if (status === "closed") where.push("closes_on < CURDATE()");
  const whereSql = where.join(" AND ");

  try {
    const pool = getPool();
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM opportunities WHERE ${whereSql}`,
      params
    );

    const [rows] = await pool.query(
      `SELECT ${LIST_COLUMNS} FROM opportunities
       WHERE ${whereSql}
       ORDER BY (closes_on IS NOT NULL AND closes_on < CURDATE()) ASC, created_at DESC, id ASC
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
    console.error("Opportunities list failed:", err);
    return res.status(500).json({ error: "Could not load opportunities" });
  }
}

// ⑤ REQUEST HANDLING:
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const idParam = first(req.query.id);
  if (idParam !== undefined) return handleDetail(idParam, res);
  return handleList(req, res);
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  Read-only endpoint behind the landing-page opportunities preview,
  the all-opportunities page and the detail page. Same discipline as
  search.js: method guard first, then validate every query value, and
  only then call getPool(). Filters are validated against whitelists
  (type, status) or ranges (sdg, page) and reach MySQL as ? parameters,
  never string-built into SQL. Only status = 'approved' rows are ever
  returned; pending/rejected listings stay invisible until you approve
  them in TablePlus.

  RESPONSE SHAPE COUPLING: list -> { items, total, page, pageSize,
  totalPages }; detail -> { item }. Each row has id, title, type,
  organisation, location, state, sdgs (array of numbers), reward,
  closesOn ("YYYY-MM-DD" or null); detail adds description and
  applyUrl. data/opportunities.js, ui/opportunity-card.js and
  detail.js read exactly these names. Rename one here and those files
  change in the same edit. DATE_FORMAT in SQL keeps the date a plain
  string, so no timezone shift can move a deadline by a day.

  The sdgs column is a comma-separated string with no spaces because
  FIND_IN_SET needs that. It is simple and enough for now; a join
  table would be the upgrade if SDG filtering gets heavier.

  BLOCKS DEFINITIONS:
  ① CONFIG           — whitelists, page-size limits, column lists.
  ② HELPERS          — query-string normalising and row shaping.
  ③ DETAIL           — GET ?id= for one approved listing.
  ④ LIST             — validation, WHERE building, count + page query.
  ⑤ REQUEST HANDLING — method guard, then picks detail or list.

  CLASS NAME GLOSSARY:
  No CSS here — server file.
*/
