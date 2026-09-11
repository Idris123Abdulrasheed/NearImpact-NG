import mysql from "mysql2/promise";

// One shared connection pool for the whole serverless app; check
// DEVELOPERS NOTE at the bottom for why this has to be a singleton
// in a serverless environment specifically.

// ① CONNECTION POOL:
let pool;

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 5,
      ssl: { rejectUnauthorized: true },
    });
  }
  return pool;
}





/*
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣
  ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣DEVELOPERS NOTE▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣

  ARCHITECTURE OVERVIEW:
  A single shared MySQL connection pool, lazily created on first use
  and reused after that. This file exists purely so every serverless
  function (currently just search.js) calls the SAME getPool()
  instead of each one creating its own pool; creating a new pool per
  request would exhaust the database's limit almost immediately under real traffic.

  The lazy singleton pattern (the `if (!pool)` check) matters
  specifically because of HOW serverless platforms reuse warm
  function instances between invocations: module-level state like
  `pool` here persists across requests handled by the same warm
  instance, so the pool only actually gets created once per instance,
  not once per request;  getPool() on a warm instance just returns
  the already-created pool immediately.

  WARM INSTANCE is already created and running instance that we reuse/recall immediately 
  COLD INSTANCE is always shutdown and first request wake it up with 1 - 5 secs delay.

  connectionLimit is deliberately kept low (5) since this same
  ceiling applies PER function instance, and serverless platforms can
  spin up many instances in parallel.

  ssl: { rejectUnauthorized: true } enforces a verified TLS
  connection to the database — this should stay enabled for anything
  talking to a real hosted database over the network.

  All actual credentials come from environment variables
  (DB_HOST/DB_PORT/DB_USER/DB_PASS/DB_NAME) and not hardcoded, so this 
  file is still safe for pushing.

  BLOCKS DEFINITIONS:
  ① CONNECTION POOL  — getPool() is the ONLY way anything else in the
                       app should get a database connection. First
                       call creates the pool; every call after that
                       (on the same warm instance) just returns the
                       existing one.

*/