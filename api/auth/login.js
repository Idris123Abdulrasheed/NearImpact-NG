import { getPool } from "../../lib/db.js";
import { verifyPassword, signToken, setSessionCookie } from "../../lib/auth.js";

// POST /api/auth/login

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email:rawEmail, password } = req.body || {};

  const email = (rawEmail || "").trim().toLowerCase();

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const pool = getPool();

  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    // Same generic message whether the email doesn't exist or the
    // password's wrong — never reveal which one it was, that's a
    // user-enumeration leak (lets an attacker confirm which emails
    // have accounts here).
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const account = rows[0];
    const passwordMatches = await verifyPassword(password, account.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = { id: account.id, name: account.name, email: account.email };
    const token = signToken({ userId: user.id });
    setSessionCookie(res, token);

    return res.status(200).json({ user });
  } catch (err) {
    console.error("Login failed:", err);
    return res.status(500).json({ error: "Login failed" });
  }
}
