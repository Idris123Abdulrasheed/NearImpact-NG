import { getPool } from "../../lib/db.js";
import { hashPassword, signToken, setSessionCookie } from "../../lib/auth.js";

// POST /api/auth/register — creates a user and logs them in immediately
// (signs + sets the cookie in the same request), so registering reads
// as one step instead of "register, then separately log in." Check the
// DEVELOPERS NOTE at the bottom for validation order.

// ① VALIDATION HELPERS:
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 72; 
 // bcrypt ignores everything past 72 bytes
const MAX_NAME_LENGTH = 100;   
 // matches users.name VARCHAR(100)

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ② REQUEST HANDLING:
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name: rawName, email: rawEmail, password } = req.body || {};


const email = (rawEmail || "").trim().toLowerCase();
  // Name is optional at signup. If missing, derive one from the email
  // ("ada.obi@x.com" -> "ada obi") so users.name stays NOT NULL and
  // the avatar initials still work.
  const name =
    (rawName || "").trim() ||
    email.split("@")[0].replace(/[._-]+/g, " ").slice(0, MAX_NAME_LENGTH);


  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not set");
    return res.status(500).json({ error: "Registration failed" });
  }

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Enter a valid email address" });
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return res
      .status(400)
      .json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
  }

  if (password.length > MAX_PASSWORD_LENGTH || name.length > MAX_NAME_LENGTH) {
  return res.status(400).json({ error: "Name or password is too long" });
}

  const pool = getPool();

  try {
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: "An account with that email already exists" });
    }

    const passwordHash = await hashPassword(password);
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, passwordHash]
    );

    const user = { id: result.insertId, name, email };
    const token = signToken({ userId: user.id });
    setSessionCookie(res, token);

    return res.status(201).json({ user });
  } catch (err) {
    console.error("Registration failed:", err);
    return res.status(500).json({ error: "Registration failed" });
  }
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  Mirrors search.js's own validation-order discipline: method guard,
  then presence checks, then format checks (email shape, password
  length) — all BEFORE anything touches the database. The email
  uniqueness check and the INSERT are two separate queries rather than
  relying only on the DB's UNIQUE constraint, so a taken email returns
  a clean 409 with a real message instead of a raw MySQL duplicate-key
  error leaking to the client. The UNIQUE constraint in schema.sql
  still stays as the actual guarantee — this check is just for a
  better error message, not the only thing preventing duplicates.

  BLOCKS DEFINITIONS:
  ① VALIDATION HELPERS  — isValidEmail() and the minimum password
                          length, kept as named constants/functions
                          rather than inline magic values.
  ② REQUEST HANDLING     — the whole handler in one function, same
                          "one continuous pipeline" reasoning search.js
                          already documents for itself.

*/