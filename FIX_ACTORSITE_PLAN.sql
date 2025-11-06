-- =====================================================
-- FIX ACTORSITE LISTING PLAN
-- Run this in Supabase SQL Editor if needed
-- =====================================================

-- Option 1: If plan shows as "Free" instead of "Pro", update it
UPDATE listings
SET
  plan = 'Pro',
  comped = false
WHERE id = 'da084a22-5f0a-4a7b-8de7-1b05f6479667'
  AND plan != 'Pro';

-- Option 2: Alternative - just comp the listing to give Pro features
UPDATE listings
SET comped = true
WHERE id = 'da084a22-5f0a-4a7b-8de7-1b05f6479667';

-- Verify the changes
SELECT
  id,
  listing_name,
  plan,
  comped,
  status,
  is_active,
  is_claimed,
  owner_id
FROM listings
WHERE id = 'da084a22-5f0a-4a7b-8de7-1b05f6479667';

-- =====================================================
-- EXPLANATION
-- =====================================================
-- The listing currently shows plan = "Pro" which SHOULD work.
--
-- If ActorSite still sees "Free" in their dashboard:
-- 1. It might be a caching issue - have them log out and back in
-- 2. The admin might need to manually set comped = true
-- 3. They might be looking at the wrong listing
--
-- Gallery upload should work if:
-- - plan = 'Pro' OR
-- - plan = 'Founding Pro' OR
-- - comped = true

