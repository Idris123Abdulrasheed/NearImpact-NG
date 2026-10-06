import { clearSessionCookie } from "../../lib/auth.js";

// POST /api/auth/logout — no database call needed, since JWTs aren't
// stored server-side; clearing the cookie is the whole operation.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  clearSessionCookie(res);
  return res.status(200).json({ ok: true });
}