-- Projects table. Run ONCE in TablePlus (connected to the Aiven database).
-- title / organisation / location match what api/search.js already selects.
CREATE TABLE IF NOT EXISTS projects (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  slug         VARCHAR(60)  NOT NULL UNIQUE,   -- public id in URLs, e.g. 'p001' (set it by hand for new rows)
  title        VARCHAR(150) NOT NULL,
  organisation VARCHAR(150) NOT NULL,
  state        VARCHAR(60)  NOT NULL,          -- must match STATE_LGAS keys, e.g. 'Ondo', 'FCT'
  lga          VARCHAR(80)  NOT NULL,          -- must match STATE_LGAS values, e.g. 'Akure South'
  location     VARCHAR(200) GENERATED ALWAYS AS (CONCAT(lga, ', ', state)) STORED,  -- automatic, used by search.js
  lat          DOUBLE NULL,
  lng          DOUBLE NULL,
  types        VARCHAR(80)  NOT NULL,          -- comma-separated, NO spaces; first is the main type: 'volunteer,internship'
  sdgs         VARCHAR(60)  NULL,              -- comma-separated numbers, NO spaces: '13,15,11'
  volunteers   INT NOT NULL DEFAULT 0,
  rating       DECIMAL(2,1) NOT NULL DEFAULT 0,
  benefits     VARCHAR(200) NULL,
  image        VARCHAR(255) NULL,              -- path under /public, e.g. '/projects/tree-planting.png'
  description  TEXT NULL,                      -- blank line = new paragraph
  status       ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_projects_status_state (status, state)
) CHARACTER SET utf8mb4;
