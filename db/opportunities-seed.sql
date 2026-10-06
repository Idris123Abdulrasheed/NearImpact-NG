-- SAMPLE DATA ONLY (the 15 cards from the old mock array). Run ONCE, after opportunities.sql.
-- Running it twice creates duplicates. Replace with real listings when you have them.
INSERT INTO opportunities (title, type, location, state, sdgs, reward, closes_on, description, status) VALUES
('Climate Fellowship ''26','fellowship','Africa',NULL,'13,17','$500 Grant',DATE_ADD(CURDATE(), INTERVAL 45 DAY),'A fellowship for young people building climate solutions in their communities.','approved'),
('Young SDG Leaders Program','fellowship','Africa',NULL,'17,4','12 Months',NULL,'A 12-month leadership programme connecting young people to SDG-focused work.','approved'),
('Global Leaders Fellowship','fellowship','Abuja','FCT','16,17','$1,200 Stipend',DATE_ADD(CURDATE(), INTERVAL 60 DAY),'A stipend-backed fellowship for emerging leaders in governance and development.','approved'),
('Women in Tech Fellowship','fellowship','Lagos','Lagos','5,9','₦300k Stipend',DATE_ADD(CURDATE(), INTERVAL 90 DAY),'Supports women building careers in technology for social good.','approved'),
('Youth Impact Fund','grant','Nigeria',NULL,'8,4','$14,000 Funding',DATE_ADD(CURDATE(), INTERVAL 30 DAY),'Funding for youth-led projects with measurable community impact.','approved'),
('Community Innovation Challenge','grant','Nigeria',NULL,'11,9','₦1.7M Fund',DATE_ADD(CURDATE(), INTERVAL 40 DAY),'A challenge fund for practical ideas that improve life in local communities.','approved'),
('Clean Water Access Grant','grant','Ondo','Ondo','6','₦2.3M Fund',DATE_ADD(CURDATE(), INTERVAL 75 DAY),'Grants for boreholes, filtration and water-safety education.','approved'),
('Renewable Energy Grant','grant','Kano','Kano','7','$8,000 Funding',DATE_ADD(CURDATE(), INTERVAL 120 DAY),'Funding for small renewable-energy projects serving schools and clinics.','approved'),
('SDGs Research Intern','internship','Lagos','Lagos','17','₦150k / month',NULL,'Support research mapping local projects to the Sustainable Development Goals.','approved'),
('Climate Data Intern','internship','Abuja','FCT','13','₦120k / month',NULL,'Collect, clean and visualise climate data for partner organisations.','approved'),
('Environmental Policy Intern','internship','Port Harcourt','Rivers','13,16','₦100k / month',DATE_ADD(CURDATE(), INTERVAL 50 DAY),'Assist with environmental policy briefs and stakeholder engagement.','approved'),
('Green Design Intern','internship','Enugu','Enugu','11,12','₦130k / month',DATE_ADD(CURDATE(), INTERVAL 65 DAY),'Design sustainable products and materials with a small impact team.','approved'),
('Program Coordinator','job','Abuja','FCT','17','Full-time',DATE_ADD(CURDATE(), INTERVAL 25 DAY),'Coordinate programme delivery, partners and reporting.','approved'),
('Field Operations Manager','job','Akure','Ondo','11','Full-time',DATE_ADD(CURDATE(), INTERVAL 55 DAY),'Lead field teams delivering community projects across the state.','approved'),
('Communications Officer','job','Lagos','Lagos','17','Full-time',DATE_ADD(CURDATE(), INTERVAL 70 DAY),'Tell the stories of impact projects across web, social and print.','approved');
