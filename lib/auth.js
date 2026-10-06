import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Shared server-side auth helpers so every endpoint (register, login,
// logout, me) hashes/signs/reads sessions the exact same way, instead
// of each one reimplementing it slightly differently. Same reasoning
// db.js gives for the shared pool: one place to get it right, not four
// places that can quietly drift apart. DEVELOPERS NOTE at the bottom
// has the full story.

// ① CONSTANTS:
const SALT_ROUNDS = 12;
const TOKEN_TTL = "7d";
export const COOKIE_NAME = "ni_session";

// ② PASSWORD HASHING:
export async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

export async function verifyPassword(plainPassword, hash) {
  return bcrypt.compare(plainPassword, hash);
}

// ③ TOKEN SIGNING / VERIFICATION:
export function signToken(payload) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: TOKEN_TTL });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    // expired, tampered, or garbage token — treat all three the same:
    // "not a valid session," never leak which one it was.
    return null;
  }
}

// ④ COOKIE HELPERS:
export function setSessionCookie(res, token) {
  const isProd = process.env.NODE_ENV === "production";
  const parts = [
    `${COOKIE_NAME}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${7 * 24 * 60 * 60}`, // 7 days, matches TOKEN_TTL above
  ];
  if (isProd) parts.push("Secure");
  res.setHeader("Set-Cookie", parts.join("; "));
}

export function clearSessionCookie(res) {
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`
  );
}

export function getSessionToken(req) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));

  return match ? match.slice(COOKIE_NAME.length + 1) : null;
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  Auth is stateless JWT-in-a-cookie, not server-side sessions. On a
  serverless platform there's no single long-lived process to hold a
  session store in memory, and adding a separate session store (Redis,
  a sessions table) just to avoid a signed cookie isn't justified at
  this project's current size. The cookie itself carries everything
  needed to verify a request (see verifyToken()), so any function
  instance, warm or cold, can check a session without touching the
  database — the same "don't assume shared in-memory state" lesson
  db.js's DEVELOPERS NOTE already spells out for the connection pool.

  Trade-off worth naming: revoking a single session early (e.g. "log
  out everywhere") is harder with stateless JWTs than with server-side
  sessions, since the token stays valid until it expires no matter
  what the server does. Acceptable for a prototype; revisit if a real
  "log out all devices" feature is ever needed.

  Every cookie flag in setSessionCookie()/clearSessionCookie() matters:
  HttpOnly keeps the token out of reach of any injected script,
  SameSite=Strict stops it being sent on cross-site requests, and
  Secure (production only, since local dev isn't HTTPS) stops it being
  sent over plain HTTP.

  BLOCKS DEFINITIONS:
  ① CONSTANTS               — salt rounds, token lifetime, cookie name.
  ② PASSWORD HASHING        — hashPassword()/verifyPassword(), thin
                              wrappers around bcrypt so nothing else in
                              the app imports bcrypt directly.
  ③ TOKEN SIGNING/VERIFICATION — signToken() requires JWT_SECRET to
                              exist (fails loudly rather than silently
                              signing with `undefined`); verifyToken()
                              returns null for anything invalid instead
                              of throwing, so callers can just check
                              truthiness.
  ④ COOKIE HELPERS          — set/clear/read the session cookie. Kept
                              here, not duplicated in each endpoint, so
                              a flag can't be forgotten in one place.

*/