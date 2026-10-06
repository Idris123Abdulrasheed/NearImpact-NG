import { getPool } from "../lib/db.js";

// POST /api/newsletter — stores a subscriber email. Mirrors search.js's
// validation order: method, presence, format/length, THEN the database.
// DEVELOPERS NOTE at the bottom explains the choices.

const MAX_EMAIL_LENGTH = 255; // matches newsletter_subscribers.email VARCHAR(255)

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const email = ((req.body || {}).email || "").trim().toLowerCase();

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  if (email.length > MAX_EMAIL_LENGTH || !isValidEmail(email)) {
    return res.status(400).json({ error: "Enter a valid email address" });
  }

  const pool = getPool();

  try {
    // INSERT IGNORE: a repeat email is silently skipped by the UNIQUE
    // constraint instead of throwing.
    await pool.query("INSERT IGNORE INTO newsletter_subscribers (email) VALUES (?)", [email]);

    // Same reply for new and repeat emails, so nobody can use this
    // endpoint to check who is already subscribed.
    return res.status(200).json({ message: "Thanks for subscribing!" });
  } catch (err) {
    console.error("Newsletter signup failed:", err);
    return res.status(500).json({ error: "Subscription failed. Try again." });
  }
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The serverless function behind POST /api/newsletter, called by
  footer.js's initFooter(). Gets its connection from db.js's shared
  pool, same as search.js and the auth endpoints.

  Uniqueness is enforced by the UNIQUE index on email (see
  newsletter.sql), not by a SELECT-then-INSERT check. That avoids a
  race where two requests both see "not found" and both insert.

  Both new and repeat emails get the same 200 reply on purpose; see
  the comment above the query.

  WHEN MAILCHIMP ARRIVES: keep the INSERT as the source of truth and
  add the Mailchimp call after it, so a Mailchimp outage never loses a
  signup.

  Parameterized query only; the email is never interpolated into SQL.
*/
