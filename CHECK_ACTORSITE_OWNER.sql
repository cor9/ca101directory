-- =====================================================
-- CHECK ACTORSITE OWNER
-- Run this in Supabase SQL Editor
-- =====================================================

-- Check who owns the ActorSite listing
SELECT
  l.id,
  l.listing_name,
  l.owner_id,
  l.is_claimed,
  l.claimed_by_email,
  p.email as owner_email,
  p.role as owner_role
FROM listings l
LEFT JOIN profiles p ON l.owner_id = p.id
WHERE l.id = 'da084a22-5f0a-4a7b-8de7-1b05f6479667';

-- Search for Amber Bohac in profiles
SELECT
  id,
  email,
  role,
  created_at
FROM profiles
WHERE email ILIKE '%amber%bohac%'
   OR email ILIKE '%bohac%'
ORDER BY created_at DESC;

-- Check if Amber Bohac owns any listings
SELECT
  l.id,
  l.listing_name,
  l.plan,
  p.email as owner_email
FROM listings l
JOIN profiles p ON l.owner_id = p.id
WHERE p.email ILIKE '%amber%'
   OR p.email ILIKE '%bohac%'
ORDER BY l.created_at DESC;

