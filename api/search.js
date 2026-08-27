import { getPool } from "../lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const query = (req.query.q || "").trim();

  if (query === "") {
    return res.status(200).json({ projects: [], opportunities: [], impactmakers: [] });
  }

  if (query.length > 100) {
    return res.status(400).json({ error: "Query too long" });
  }

  const like = `%${query}%`;
  const limit = 5;
  const pool = getPool();

  try {
    const [projects] = await pool.query(
      `SELECT id, title, organisation, location FROM projects
       WHERE title LIKE ? OR organisation LIKE ? OR location LIKE ?
       LIMIT ?`,
      [like, like, like, limit]
    );

    const [opportunities] = await pool.query(
      `SELECT id, title, type, location FROM opportunities
       WHERE title LIKE ? OR type LIKE ? OR location LIKE ?
       LIMIT ?`,
      [like, like, like, limit]
    );

    const [impactmakers] = await pool.query(
      `SELECT id, full_name, role, organisation FROM impactmakers
       WHERE full_name LIKE ? OR role LIKE ? OR organisation LIKE ?
       LIMIT ?`,
      [like, like, like, limit]
    );

    return res.status(200).json({ projects, opportunities, impactmakers });
  } catch (err) {
    console.error("Search query failed:", err);
    return res.status(500).json({ error: "Search failed" });
  }
}