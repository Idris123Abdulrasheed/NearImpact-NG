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
const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 100;
// matches users.name VARCHAR(100)

// Keep in sync with ROLES in src/modules/auth-form.js (the dropdown).
const ALLOWED_ROLES = ["student", "volunteer", "organisation", "educator", "professional", "other"];

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ② REQUEST HANDLING:
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name: rawName, email: rawEmail, role, password } = req.body || {};

  const name = String(rawName || "").trim();
  const email = String(rawEmail || "").trim().toLowerCase();

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not set");
    return res.status(500).json({ error: "Registration failed" });
  }

  if (!name || !email || !role || !password) {
    return res.status(400).json({ error: "Name, email, role and password are required" });
  }

  if (name.length < MIN_NAME_LENGTH || name.length > MAX_NAME_LENGTH) {
    return res
      .status(400)
      .json({ error: `Name must be ${MIN_NAME_LENGTH} to ${MAX_NAME_LENGTH} characters` });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Enter a valid email address" });
  }

  if (!ALLOWED_ROLES.includes(role)) {
    return res.status(400).json({ error: "Select a valid role" });
  }

  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
    return res
      .status(400)
      .json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return res.status(400).json({ error: "Password is too long" });
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
      "INSERT INTO users (name, email, role, password_hash) VALUES (?, ?, ?, ?)",
      [name, email, role, passwordHash]
    );

    const user = { id: result.insertId, name, email };
    // a new member stays signed in (30 days), same as ticking Remember me
    const token = signToken({ userId: user.id }, true);
    setSessionCookie(res, token, true);

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
  then presence checks, then format checks (name length, email shape,
  role allow-list, password length) — all BEFORE anything touches the
  database. The email uniqueness check and the INSERT are two separate
  queries rather than relying only on the DB's UNIQUE constraint, so a
  taken email returns a clean 409 with a real message instead of a raw
  MySQL duplicate-key error leaking to the client. The UNIQUE
  constraint on users.email still stays as the actual guarantee; this
  check is just for a better error message.

  CREATE ACCOUNT now takes full name, email, role and password again
  (the earlier email-and-password-only version, which made up a name
  from the email, is gone). The confirm-password box is a browser-side
  check only; the server never receives it. role is stored in
  users.role, added by db/users-add-role.sql. RUN THAT SQL BEFORE
  DEPLOYING THIS FILE, or the INSERT fails. Existing accounts keep a
  NULL role.

  ROLES: the allow-list lives here AND in src/modules/auth-form.js (the
  dropdown). The client list is for the experience, this one is the
  real check, so a hand-made request cannot store any other value.

  BLOCKS DEFINITIONS:
  ① VALIDATION HELPERS  — length limits, ALLOWED_ROLES, isValidEmail(),
                          kept as named constants/functions rather
                          than inline magic values.
  ② REQUEST HANDLING     — the whole handler in one function, same
                          "one continuous pipeline" reasoning search.js
                          already documents for itself.

*/
