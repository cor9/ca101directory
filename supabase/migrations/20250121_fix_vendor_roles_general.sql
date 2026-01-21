-- Fix vendor roles for users who have claimed listings but don't have vendor role
-- This catches cases where payment succeeded but role wasn't updated

-- Update profiles to vendor role if they own any listings
UPDATE profiles p
SET role = 'vendor'
WHERE p.role IN ('guest', 'parent')
  AND EXISTS (
    SELECT 1 
    FROM listings l 
    WHERE l.owner_id = p.id
  );

-- Also update profiles who have listings with their email but aren't linked
UPDATE profiles p
SET role = 'vendor'
WHERE p.role IN ('guest', 'parent')
  AND EXISTS (
    SELECT 1 
    FROM listings l 
    WHERE (l.email = p.email OR l.claimed_by_email = p.email)
      AND l.is_claimed = true
  );

-- Legacy: Also try users table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
    UPDATE users u
    SET role = 'vendor'
    WHERE u.role IN ('guest', 'parent', 'USER')
      AND EXISTS (
        SELECT 1 
        FROM listings l 
        WHERE l.owner_id = u.id
      );
    
    UPDATE users u
    SET role = 'vendor'
    WHERE u.role IN ('guest', 'parent', 'USER')
      AND EXISTS (
        SELECT 1 
        FROM listings l 
        WHERE (l.email = u.email OR l.claimed_by_email = u.email)
          AND l.is_claimed = true
      );
  END IF;
END $$;

-- Link listings to users where email matches but owner_id is not set
UPDATE listings l
SET owner_id = u.id,
    is_claimed = true,
    date_claimed = COALESCE(l.date_claimed, NOW())
FROM users u
WHERE (l.email = u.email OR l.claimed_by_email = u.email)
  AND l.is_claimed = true
  AND (l.owner_id IS NULL OR l.owner_id != u.id);
