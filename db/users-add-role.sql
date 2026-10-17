-- Adds the role people pick on Create Account (student, volunteer, ...).
-- Run ONCE on Aiven before deploying the new register.js.
-- Existing accounts keep NULL, which is fine.
ALTER TABLE users
  ADD COLUMN role VARCHAR(30) NULL AFTER email;
