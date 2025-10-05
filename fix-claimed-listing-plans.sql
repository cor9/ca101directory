-- Fix claimed listings that still show as "Free" plan
-- This backfills the listing plan from the user's profile subscription plan

UPDATE listings 
SET plan = profiles.subscription_plan,
    updated_at = NOW()
FROM profiles 
WHERE listings.owner_id = profiles.id 
  AND listings.claimed = true 
  AND (listings.plan IS NULL OR listings.plan = 'free' OR listings.plan = '')
  AND profiles.subscription_plan IS NOT NULL 
  AND profiles.subscription_plan != 'free';

-- Show the results
SELECT 
  l.listing_name,
  l.plan as listing_plan,
  p.subscription_plan as profile_plan,
  l.claimed,
  l.owner_id
FROM listings l
JOIN profiles p ON l.owner_id = p.id  
WHERE l.claimed = true
ORDER BY l.updated_at DESC
LIMIT 10;
