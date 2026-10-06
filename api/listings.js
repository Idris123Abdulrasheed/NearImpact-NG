import { getPool } from "../lib/db.js";
import { getSessionToken, verifyToken } from "../lib/auth.js";

// POST /api/listings — stores a project/opportunity submission as
// "pending" for review. Validation order: method, login, field checks,
// THEN the database. DEVELOPERS NOTE at the bottom.

// ① CONSTANTS:
const TYPES = ["project", "volunteer", "internship", "training", "fellowship", "job", "grant"];
const MAX_SDGS = 3;

// ② HELPERS:
const text = (value) => (typeof value === "string" ? value.trim() : "");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidWebUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function isValidDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

// Returns an error message string, or null if everything is fine.
function validate(f) {
  if (!TYPES.includes(f.type)) return "Choose what you are listing";
  if (f.title.length < 3 || f.title.length > 150) return "Title must be 3 to 150 characters";
  if (f.organisation.length < 2 || f.organisation.length > 150) return "Enter your organisation or name";
  if (f.state.length < 2 || f.state.length > 50) return "Enter the state";
  if (f.lga.length > 100) return "LGA or town is too long";
  if (f.description.length < 20 || f.description.length > 1500) {
    return "Description must be 20 to 1500 characters";
  }
  if (f.sdgs.length < 1 || f.sdgs.length > MAX_SDGS) return `Pick 1 to ${MAX_SDGS} SDGs`;
  if (f.benefits.length > 150) return "Benefits line is too long";
  if (f.deadline && !isValidDate(f.deadline)) return "Enter a valid closing date";
  if (f.applyUrl && (f.applyUrl.length > 255 || !isValidWebUrl(f.applyUrl))) {
    return "Enter a valid link starting with https://";
  }
  if (f.contactEmail.length > 255 || !isValidEmail(f.contactEmail)) return "Enter a valid contact email";
  if (f.contactPhone.length > 30) return "Contact phone is too long";
  return null;
}

// ③ REQUEST HANDLING:
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = getSessionToken(req);
  const session = token ? verifyToken(token) : null;
  if (!session) {
    return res.status(401).json({ error: "Please log in to submit a listing" });
  }

  const body = req.body || {};

  // sdgs: whole numbers 1-17, no duplicates
  const rawSdgs = Array.isArray(body.sdgs) ? body.sdgs.map(Number) : [];
  const sdgs = [...new Set(rawSdgs)];
  if (!sdgs.every((n) => Number.isInteger(n) && n >= 1 && n <= 17)) {
    return res.status(400).json({ error: "Invalid SDG selection" });
  }

  const fields = {
    type: text(body.type),
    title: text(body.title),
    organisation: text(body.organisation),
    state: text(body.state),
    lga: text(body.lga),
    description: text(body.description),
    sdgs,
    benefits: text(body.benefits),
    deadline: text(body.deadline),
    applyUrl: text(body.applyUrl),
    contactEmail: text(body.contactEmail).toLowerCase(),
    contactPhone: text(body.contactPhone),
  };

  const problem = validate(fields);
  if (problem) {
    return res.status(400).json({ error: problem });
  }

  const pool = getPool();

  try {
    await pool.query(
      `INSERT INTO listing_submissions
         (user_id, type, title, organisation, state, lga, description, sdgs,
          benefits, deadline, apply_url, contact_email, contact_phone)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        session.userId,
        fields.type,
        fields.title,
        fields.organisation,
        fields.state,
        fields.lga || null,
        fields.description,
        fields.sdgs.join(","),
        fields.benefits || null,
        fields.deadline || null,
        fields.applyUrl || null,
        fields.contactEmail,
        fields.contactPhone || null,
      ]
    );

    return res.status(201).json({
      message: "Thanks! Your listing has been received and will appear on NearImpact once we've reviewed it.",
    });
  } catch (err) {
    console.error("Listing submission failed:", err);
    return res.status(500).json({ error: "Could not submit your listing. Try again." });
  }
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  The serverless function behind POST /api/listings, called by
  list-project.js. Same discipline as search.js and register.js:
  cheap checks first, database last.

  LOGIN IS ENFORCED HERE, not just in the browser. The client opens
  the login modal for convenience; this endpoint is what actually
  refuses a request without a valid session cookie. The submitter's id
  comes from the verified token, never from the request body, so
  nobody can submit "as" someone else.

  WHY A SEPARATE listing_submissions TABLE: search.js reads the public
  `projects` / `opportunities` tables. Writing user input straight into
  them would put unreviewed content on a public site. Submissions wait
  here as "pending" until a person approves them.

  Every length limit matches a column in listing-submissions.sql. The query is
  parameterized; nothing from the request is built into the SQL text.

  KNOWN GAP: there is no rate limit yet, so a logged-in user could
  submit many listings. Fine for a prototype; add one before a public
  launch.

  BLOCKS DEFINITIONS:
  ① CONSTANTS         — allowed listing types and the SDG cap.
  ② HELPERS           — small format checks and validate(), which
                        returns one error message or null.
  ③ REQUEST HANDLING  — method guard, session check, normalising the
                        body, validation, then the INSERT.
*/
