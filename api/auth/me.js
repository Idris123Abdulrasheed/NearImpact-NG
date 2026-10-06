import { getPool } from "../../lib/db.js";
import { getSessionToken, verifyToken } from "../../lib/auth.js";

// GET /api/auth/me — the frontend calls this once on page load to
// find out whether an existing cookie from a previous visit is still
// a valid session. Returns the user if so, 401 if not; the frontend
// never has to guess.

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = getSessionToken(req);
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const pool = getPool();

  try {
    const [rows] = await pool.query(
      "SELECT id, name, email FROM users WHERE id = ? LIMIT 1",
      [payload.userId]
    );

    if (rows.length === 0) {
      // Token's valid but the account behind it is gone — treat as
      // logged out rather than erroring.
      return res.status(401).json({ error: "Not authenticated" });
    }

    return res.status(200).json({ user: rows[0] });
  } catch (err) {
    console.error("Session check failed:", err);
    return res.status(500).json({ error: "Session check failed" });
  }
}