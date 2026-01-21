-- Fix vendor roles for users who have claimed listings but don't have VENDOR role
-- This catches cases where payment succeeded but role wasn't updated

-- Update users to VENDOR role if they own any listings
UPDATE users u
SET role = 'VENDOR'
WHERE u.role = 'USER'
  AND EXISTS (
    SELECT 1 
    FROM listings l 
    WHERE l.owner_id = u.id
  );

-- Also update users who have listings with their email but aren't linked
UPDATE users u
SET role = 'VENDOR'
WHERE u.role = 'USER'
  AND EXISTS (
    SELECT 1 
    FROM listings l 
    WHERE (l.email = u.email OR l.claimed_by_email = u.email)
      AND l.is_claimed = true
  );

-- Link listings to users where email matches but owner_id is not set
UPDATE listings l
SET owner_id = u.id,
    is_claimed = true,
    date_claimed = COALESCE(l.date_claimed, NOW())
FROM users u
WHERE (l.email = u.email OR l.claimed_by_email = u.email)
  AND l.is_claimed = true
  AND (l.owner_id IS NULL OR l.owner_id != u.id);
