-- Run once against the Aiven database (TablePlus SQL editor).
-- The `users` table must already exist.
-- This is a NEW table. search.js used to read a table called `impactmakers`;
-- it now reads impactmaker_profiles instead (see the search.js edits).
CREATE TABLE IF NOT EXISTS impactmaker_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,                       -- who applied; NULL for seeded people
  slug VARCHAR(100) NOT NULL,             -- also the photo file name
  full_name VARCHAR(100) NOT NULL,
  role VARCHAR(100) NULL,
  organisation VARCHAR(150) NULL,
  sdg TINYINT UNSIGNED NOT NULL,          -- SDG number, 1-17
  location VARCHAR(100) NULL,
  since SMALLINT UNSIGNED NULL,           -- year they joined
  bio VARCHAR(600) NULL,
  stat_projects INT UNSIGNED NULL,
  stat_hours INT UNSIGNED NULL,
  stat_communities INT UNSIGNED NULL,
  skills VARCHAR(300) NULL,               -- 'a,b,c'
  contributions TEXT NULL,                -- JSON: [{year,title,description}]
  links TEXT NULL,                        -- JSON: [{label,href}]
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_profile_slug (slug),
  UNIQUE KEY uq_profile_user (user_id),   -- one application per account (NULLs allowed)
  INDEX idx_profile_status (status),
  CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- The nine people who used to be hardcoded. INSERT IGNORE makes this
-- safe to re-run (existing slugs are skipped).
INSERT IGNORE INTO impactmaker_profiles (slug, full_name, sdg, status) VALUES
  ('favour-adeyemi',     'Favour Adeyemi',     5,  'approved'),
  ('chidera-james-edeh', 'Chidera James-Edeh', 3,  'approved'),
  ('idris-abdulrasheed', 'Idris Abdulrasheed', 4,  'approved'),
  ('musa-mubarak',       'Musa Mubarak',       13, 'approved'),
  ('omeiza-christianah', 'Omeiza Christianah', 7,  'approved'),
  ('fatima-al-hassan',   'Fatima Al-Hassan',   6,  'approved'),
  ('iloke-emmanuel',     'Iloke Emmanuel',     10, 'approved'),
  ('bankole-oluwakemi',  'Bankole Oluwakemi',  8,  'approved'),
  ('tunde-balogun',      'Tunde Balogun',      15, 'approved');
