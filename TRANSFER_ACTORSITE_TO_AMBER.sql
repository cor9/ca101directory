-- =====================================================
-- TRANSFER ACTORSITE OWNERSHIP TO AMBER BOHAC
-- Run this in Supabase SQL Editor ONLY if you want to transfer ownership
-- =====================================================

-- Step 1: Find Amber Bohac's user ID
SELECT
  id as amber_user_id,
  email,
  role
FROM profiles
WHERE email ILIKE '%amber%bohac%'
   OR email ILIKE '%bohac%';

-- Step 2: Transfer ActorSite listing to Amber (REPLACE 'AMBER_USER_ID' with actual ID from Step 1)
-- IMPORTANT: Only run this if you want to transfer ownership!
UPDATE listings
SET
  owner_id = 'AMBER_USER_ID_HERE',  -- Replace with Amber's actual user ID
  claimed_by_email = 'amber@example.com'  -- Replace with Amber's actual email
WHERE id = 'da084a22-5f0a-4a7b-8de7-1b05f6479667';

-- Step 3: Verify the transfer
SELECT
  l.id,
  l.listing_name,
  l.owner_id,
  l.claimed_by_email,
  p.email as owner_email,
  p.role
FROM listings l
LEFT JOIN profiles p ON l.owner_id = p.id
WHERE l.id = 'da084a22-5f0a-4a7b-8de7-1b05f6479667';

-- =====================================================
-- EXPLANATION
-- =====================================================
-- Current owner: actorsite@actorsite.com (vendor role)
--
-- If Amber Bohac needs to edit this listing, she needs either:
-- 1. Login credentials for actorsite@actorsite.com account, OR
-- 2. Transfer ownership (run the UPDATE above)
--
-- IMPORTANT: Transferring ownership will remove access from the
-- actorsite@actorsite.com account. They won't be able to edit it anymore.

