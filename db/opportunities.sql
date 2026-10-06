-- Opportunities table. Run ONCE in TablePlus (connected to the Aiven database).
-- Column names id/title/type/location match what api/search.js already selects.
CREATE TABLE IF NOT EXISTS opportunities (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(150) NOT NULL,
  type         ENUM('fellowship','grant','internship','job') NOT NULL,
  organisation VARCHAR(150) NULL,
  location     VARCHAR(120) NULL,              -- display text, e.g. 'Abuja'
  state        VARCHAR(60)  NULL,              -- filter value, must match STATE_LGAS keys, e.g. 'FCT'
  sdgs         VARCHAR(60)  NULL,              -- comma-separated numbers, NO spaces: '13,7'
  reward       VARCHAR(80)  NULL,              -- e.g. '$500 Grant', 'Full-time'
  closes_on    DATE         NULL,              -- NULL = open / rolling
  description  TEXT         NULL,              -- blank line = new paragraph
  apply_url    VARCHAR(500) NULL,              -- http(s) link; NULL = applications not open yet
  status       ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_opportunities_status_type (status, type),
  INDEX idx_opportunities_state (state)
) CHARACTER SET utf8mb4;
