-- =====================================================
-- CHECK ACTORSITE LISTING
-- Run this in Supabase SQL Editor
-- =====================================================

-- Get full details for ActorSite listing
SELECT
  id,
  listing_name,
  plan,
  comped,
  status,
  is_active,
  is_claimed,
  owner_id,
  profile_image,
  gallery,
  created_at
FROM listings
WHERE id = 'da084a22-5f0a-4a7b-8de7-1b05f6479667';

-- Check if this is the correct listing by name
SELECT
  id,
  listing_name,
  plan,
  comped
FROM listings
WHERE listing_name ILIKE '%actorsite%'
ORDER BY created_at DESC;

