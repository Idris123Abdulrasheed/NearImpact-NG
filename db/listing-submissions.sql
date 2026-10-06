-- Run once against the Aiven database (TablePlus SQL editor).
-- The `users` table must already exist.
CREATE TABLE IF NOT EXISTS listing_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('project','volunteer','internship','training','fellowship','job','grant') NOT NULL,
  title VARCHAR(150) NOT NULL,
  organisation VARCHAR(150) NOT NULL,
  state VARCHAR(50) NOT NULL,
  lga VARCHAR(100) NULL,
  description TEXT NOT NULL,
  sdgs VARCHAR(20) NOT NULL,            -- e.g. '13,15,11'
  benefits VARCHAR(150) NULL,
  deadline DATE NULL,
  apply_url VARCHAR(255) NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(30) NULL,
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_listing_status (status),
  CONSTRAINT fk_listing_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
