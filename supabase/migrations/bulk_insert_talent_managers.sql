-- Bulk insert 53 talent managers as Free listings
-- Run this in Supabase SQL Editor
-- All listings set to Free plan, Pending status, unclaimed

BEGIN;

-- Helper function to generate slugs (temporary, only for this migration)
CREATE OR REPLACE FUNCTION generate_slug_temp(name TEXT, uuid TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(name, '\s+', '-', 'g'),
        '[^a-z0-9-]', '', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Insert all 53 talent managers
INSERT INTO listings (
  id,
  slug,
  listing_name,
  website,
  email,
  phone,
  city,
  state,
  region,
  categories,
  plan,
  status,
  is_claimed,
  is_active,
  created_at,
  updated_at
) VALUES
  -- 1. The Zachary Co
  (gen_random_uuid(), 'the-zachary-co', 'The Zachary Co', 'https://www.facebook.com/thezacharyco/', NULL, NULL, 'Los Angeles', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 2. Zero Gravity
  (gen_random_uuid(), 'zero-gravity', 'Zero Gravity', 'https://www.zerogravitymanagement.com/', 'zerogravitytalent@gmail.com', '818-783-3131', 'Los Angeles', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 3. Vanguard Management Group
  (gen_random_uuid(), 'vanguard-management-group', 'Vanguard Management Group', 'https://www.vmgtalent.com/', 'vanguardmgt@gmail.com', '818-264-1020', 'Los Angeles', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 4. TANDM Management
  (gen_random_uuid(), 'tandm-management', 'TANDM Management', 'https://tandmtalent.com/', 'info@tandmtalent.com', '818-888-2137', 'Burbank', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 5. TalentINK
  (gen_random_uuid(), 'talentink', 'TalentINK', 'https://www.talentinkmanagement.com/', 'kari@talentinkmanagement.com', '213-284-6423', 'Los Angeles', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 6. Stein Entertainment Group
  (gen_random_uuid(), 'stein-entertainment-group', 'Stein Entertainment Group', 'http://steinent.com/', 'steinentertainmentgroup@sbcglobal.net', '818-763-3830', 'Los Angeles', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 7. Serendipity Entertainment
  (gen_random_uuid(), 'serendipity-entertainment', 'Serendipity Entertainment', 'https://www.facebook.com/serendipityent/', 'serendipitykids101@gmail.com', NULL, 'Studio City', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 8. Monroe Talent Management
  (gen_random_uuid(), 'monroe-talent-management', 'Monroe Talent Management', 'https://www.monroetm.com/', NULL, '305-985-5500', 'Miami Beach', 'FL', ARRAY['Southeast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 9. Merging Artists
  (gen_random_uuid(), 'merging-artists', 'Merging Artists', 'http://www.mergingartists.com/', 'info@mergingartists.com', '818-262-5656', 'Burbank', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 10. Lil' Angels Unlimited
  (gen_random_uuid(), 'lil-angels-unlimited', 'Lil'' Angels Unlimited', 'https://lilangelskids.com/', 'lilangelsunlimitedinc@gmail.com', '404-394-1800', 'Fayetteville', 'GA', ARRAY['Southeast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 11. Gregg Baker Management
  (gen_random_uuid(), 'gregg-baker-management', 'Gregg Baker Management', 'http://www.gbmmanagement.com/', 'info@gbmmanagement.com', '310-260-0040', 'Los Angeles', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 12. Five Star Talent Management
  (gen_random_uuid(), 'five-star-talent-management', 'Five Star Talent Management', 'https://www.facebook.com/pages/Five-Star-Talent-Management/133799206669990', 'kkupsick@bellsouth.net', '404-667-1021', 'Roswell', 'GA', ARRAY['Southeast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 13. Entertainment Lab
  (gen_random_uuid(), 'entertainment-lab', 'Entertainment Lab', 'https://www.entertainmentlab.com/', 'entertainmentlab@earthlink.net', '818-508-1005', 'Los Angeles', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 14. DWKing Talent
  (gen_random_uuid(), 'dwking-talent', 'DWKing Talent', 'http://www.dwkingtalent.com/', 'office@dwkingtalent.com', '323-965-2603', 'Los Angeles', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 15. Dream Talent Management
  (gen_random_uuid(), 'dream-talent-management', 'Dream Talent Management', 'http://www.dreamtalentmgmt.com/', 'info@dreamtalentmgmt.com', '818-760-4160', 'Burbank', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 16. Discover Management
  (gen_random_uuid(), 'discover-management', 'Discover Management', 'http://www.discovermgmt.com/', 'office@discovermgmt.com', '310-651-1117', 'West Hollywood', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 17. Barney Oldfield
  (gen_random_uuid(), 'barney-oldfield', 'Barney Oldfield', 'http://barneyoldfield.com/', 'barneyoldfield@earthlink.net', '310-274-9174', 'Los Angeles', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 18. Brilliant Talent Management
  (gen_random_uuid(), 'brilliant-talent-management', 'Brilliant Talent Management', 'http://brillianttalent.com/', 'submissions@brillianttalent.com', '818-508-5530', 'Studio City', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 19. Bicoastal Mgmt
  (gen_random_uuid(), 'bicoastal-mgmt', 'Bicoastal Mgmt', 'http://bicoastalmgmt.com/', 'office@bicoastalmgmt.com', '818-752-7400', 'Studio City', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 20. BAM Management
  (gen_random_uuid(), 'bam-management', 'BAM Management', 'http://bam-mgmt.com/', 'submissions@bam-mgmt.com', '323-658-7500', 'Los Angeles', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 21. BAC Talent
  (gen_random_uuid(), 'bac-talent', 'BAC Talent', 'http://www.bactalent.com/', 'bac.talent@gmail.com', '818-760-4113', 'Burbank', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 22. Aspire Talent Management
  (gen_random_uuid(), 'aspire-talent-management', 'Aspire Talent Management', 'http://www.aspire-talent-mgt.com/', 'info@aspire-talent-mgt.com', '424-653-7990', 'Los Angeles', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 23. Apollo Talent Management
  (gen_random_uuid(), 'apollo-talent-management', 'Apollo Talent Management', 'http://www.apollotalent.net/', NULL, '818-850-9933', 'Sherman Oaks', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 24. Apex Talent Group
  (gen_random_uuid(), 'apex-talent-group', 'Apex Talent Group', 'http://www.apextalentgroup.org/', 'talent@apextalentgroup.org', '818-298-6599', 'Burbank', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 25. Ally Taylor Artists
  (gen_random_uuid(), 'ally-taylor-artists', 'Ally Taylor Artists', 'http://www.allytaylorartists.com/', 'clients@allytaylorartists.com', '818-508-3383', 'Burbank', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 26. Agency Talent Group
  (gen_random_uuid(), 'agency-talent-group', 'Agency Talent Group', 'https://www.agencytalentgroup.com/', 'info@agencytalentgroup.com', '310-866-0196', 'Los Angeles', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 27. 5J Management
  (gen_random_uuid(), '5j-management', '5J Management', 'https://www.5jmanagement.com/', 'info@5jmanagement.com', '818-887-1834', 'Burbank', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 28. Adele's Kids
  (gen_random_uuid(), 'adeles-kids', 'Adele''s Kids', 'http://www.adeleskids.com/', 'idelahunt@aol.com', '404-522-8154', 'Atlanta', 'GA', ARRAY['Southeast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 29. Alison Caiola Management
  (gen_random_uuid(), 'alison-caiola-management', 'Alison Caiola Management', 'http://www.alisoncaiola.com/', NULL, '973-366-0333', 'Wayne', 'NJ', ARRAY['Mid-Atlantic'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 30. Anthony & Associates
  (gen_random_uuid(), 'anthony-associates', 'Anthony & Associates', 'http://www.anthonyandassociates.com/', 'anthonyandassoc@verizon.net', '609-737-8882', 'Lawrenceville', 'NJ', ARRAY['Mid-Atlantic'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 31. Breakaway Talent
  (gen_random_uuid(), 'breakaway-talent', 'Breakaway Talent', 'http://breakawaytalent.com/', 'mgmt@breakawaytalent.com', '718-878-1111', 'Brooklyn', 'NY', ARRAY['Mid-Atlantic'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 32. CP Talent Management
  (gen_random_uuid(), 'cp-talent-management', 'CP Talent Management', 'http://www.cptalentmgmt.com/', 'cptalentmgt@aol.com', '818-881-2026', 'Northridge', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 33. CPM Talent Management
  (gen_random_uuid(), 'cpm-talent-management', 'CPM Talent Management', 'https://www.cpmtalentmanagement.com/', 'cpmtalentmanagement@gmail.com', '818-906-3999', 'Van Nuys', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 34. Dream Maker Talent Management
  (gen_random_uuid(), 'dream-maker-talent-management', 'Dream Maker Talent Management', 'http://dreammakertalent.com/', 'dreammakertalent@yahoo.com', '404-394-9933', 'Fayetteville', 'GA', ARRAY['Southeast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 35. Harvest Talent Management
  (gen_random_uuid(), 'harvest-talent-management', 'Harvest Talent Management', 'http://harvesttalentmanagement.com/', 'harvesttalentmanagement@gmail.com', '818-914-7914', 'Van Nuys', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 36. Ingrid French Management
  (gen_random_uuid(), 'ingrid-french-management', 'Ingrid French Management', 'http://www.ingridfrenchtalent.com/', 'ingridfrenchtalent@gmail.com', '818-506-8388', 'Los Angeles', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 37. Ken Park Management
  (gen_random_uuid(), 'ken-park-management', 'Ken Park Management', 'https://www.kenparkmanagement.com/', 'office@kenparkmanagement.com', '818-760-4414', 'Burbank', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 38. Lampiasi Talent Management
  (gen_random_uuid(), 'lampiasi-talent-management', 'Lampiasi Talent Management', 'http://lampiasitalent.com/', 'lampiasitalent@gmail.com', '805-987-3366', 'Camarillo', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 39. Noveaux
  (gen_random_uuid(), 'noveaux', 'Noveaux', 'http://www.noveaux.com/', 'office@noveaux.com', '310-281-1950', 'West Hollywood', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 40. Parkside Talent
  (gen_random_uuid(), 'parkside-talent', 'Parkside Talent', 'http://www.parksidetalent.com/', 'suechildcare@yahoo.com', '818-914-6633', 'Van Nuys', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 41. Persona Management
  (gen_random_uuid(), 'persona-management', 'Persona Management', 'http://www.personamgmt.com/', 'info@personamgmt.com', '818-907-6846', 'Studio City', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 42. Prestige Management Group
  (gen_random_uuid(), 'prestige-management-group', 'Prestige Management Group', 'http://www.pmgkids.com/', 'info@pmgkids.com', '818-884-0700', 'North Hollywood', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 43. RAVE Talent Management
  (gen_random_uuid(), 'rave-talent-management', 'RAVE Talent Management', 'http://www.ravetalentmanagement.com/', 'ravetalentmgmt@mac.com', '818-762-6283', 'Burbank', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 44. Roger Paul
  (gen_random_uuid(), 'roger-paul', 'Roger Paul', 'http://www.rogerpaul.com/', 'rogerpaul@rogerpaul.com', '818-509-1010', 'Studio City', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 45. Rybin Talent Management
  (gen_random_uuid(), 'rybin-talent-management', 'Rybin Talent Management', 'http://rybintalent.com/', 'office@rybintalent.com', '818-380-5677', 'Los Angeles', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 46. SquarePeg Group
  (gen_random_uuid(), 'squarepeg-group', 'SquarePeg Group', 'http://squarepeggroup.com/', 'office@squarepeggroup.com', '818-345-5510', 'Studio City', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 47. Talent Express
  (gen_random_uuid(), 'talent-express', 'Talent Express', 'http://www.talentexpress.net/', 'info@talentexpress.net', '818-883-5650', 'Northridge', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 48. Tannen's Talent
  (gen_random_uuid(), 'tannens-talent', 'Tannen''s Talent', 'http://www.tannenstalent.com/', 'tannenstalent@att.net', '818-762-3191', 'North Hollywood', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 49. Terrific Talent
  (gen_random_uuid(), 'terrific-talent', 'Terrific Talent', 'http://terrifictalent.com/', 'info@terrifictalent.com', '818-789-2002', 'Studio City', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 50. TM Talent
  (gen_random_uuid(), 'tm-talent', 'TM Talent', 'http://www.tmtalent.biz/', 'tmtalent2@aol.com', '818-509-2000', 'Sherman Oaks', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 51. Tsu Tsu Unlimited
  (gen_random_uuid(), 'tsu-tsu-unlimited', 'Tsu Tsu Unlimited', 'http://www.tsutsumgmt.com/', 'mike@tsutsumgmt.com', '818-760-4660', 'Studio City', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 52. WSM Talent
  (gen_random_uuid(), 'wsm-talent', 'WSM Talent', 'http://www.wsmtalent.com/', 'info@wsmtalent.com', '818-760-4545', 'Burbank', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW()),

  -- 53. Zanee Entertainment
  (gen_random_uuid(), 'zanee-entertainment', 'Zanee Entertainment', 'http://www.zaneeent.com/', 'zanee@zaneeent.com', '818-887-1994', 'Burbank', 'CA', ARRAY['West Coast'], ARRAY['Talent Managers'], 'Free', 'Pending', false, true, NOW(), NOW());

-- Drop the temporary helper function
DROP FUNCTION IF EXISTS generate_slug_temp(TEXT, TEXT);

COMMIT;

-- Verification query (run separately after the insert):
-- SELECT COUNT(*) FROM listings WHERE categories @> ARRAY['Talent Managers'] AND plan = 'Free';
-- Should return 53 new listings (plus any existing Free Talent Manager listings)
