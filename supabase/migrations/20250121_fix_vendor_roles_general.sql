-- Fix vendor roles for profiles who have claimed listings but don't have vendor role
-- This catches cases where payment succeeded but role wasn't updated

-- Step 1: Update profiles to vendor role if they own any listings
UPDATE profiles p
SET role = 'vendor'
WHERE p.role IN ('guest', 'parent')
  AND EXISTS (
    SELECT 1 
    FROM listings l 
    WHERE l.owner_id = p.id
  );

-- Step 2: Update profiles who have listings with their email but aren't linked yet
UPDATE profiles p
SET role = 'vendor'
WHERE p.role IN ('guest', 'parent')
  AND EXISTS (
    SELECT 1 
    FROM listings l 
    WHERE (l.email = p.email OR l.claimed_by_email = p.email)
      AND l.is_claimed = true
  );

-- Step 3: Link listings to profiles where email matches but owner_id is not set
UPDATE listings l
SET owner_id = p.id,
    is_claimed = true,
    date_claimed = COALESCE(l.date_claimed, NOW())
FROM profiles p
WHERE (l.email = p.email OR l.claimed_by_email = p.email)
  AND l.is_claimed = true
  AND (l.owner_id IS NULL OR l.owner_id != p.id);
