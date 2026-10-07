-- Run in the TablePlus SQL editor. Safe to run more than once.
-- Purpose: make sure the nine featured homepage impactmakers exist in
-- impactmaker_profiles AND are approved, so their carousel cards open
-- real profiles and they show in the directory.

-- 1. Add any of the nine that are missing (existing slugs are skipped).
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

-- 2. Approve the SEEDED rows only (user_id IS NULL). A row created by a
--    real applicant is never changed by this script.
UPDATE impactmaker_profiles
SET status = 'approved'
WHERE user_id IS NULL
  AND slug IN ('favour-adeyemi','chidera-james-edeh','idris-abdulrasheed',
               'musa-mubarak','omeiza-christianah','fatima-al-hassan',
               'iloke-emmanuel','bankole-oluwakemi','tunde-balogun');

-- 3. Check. You should see 9 rows, all 'approved'.
--    A row with a user_id and status 'pending' means a real applicant
--    took that slug before the seed ran. If it really is that person,
--    approve it by hand:
--      UPDATE impactmaker_profiles SET status='approved' WHERE slug='their-slug';
SELECT slug, full_name, status, user_id
FROM impactmaker_profiles
WHERE slug IN ('favour-adeyemi','chidera-james-edeh','idris-abdulrasheed',
               'musa-mubarak','omeiza-christianah','fatima-al-hassan',
               'iloke-emmanuel','bankole-oluwakemi','tunde-balogun')
ORDER BY slug;
