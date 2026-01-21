-- Fix vendor roles for users who have claimed listings but don't have vendor role
-- This catches cases where payment succeeded but role wasn't updated

-- Step 1: Update the users table constraint to allow VENDOR role (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
    -- Drop the old constraint
    ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
    
    -- Add new constraint that includes VENDOR
    ALTER TABLE users ADD CONSTRAINT users_role_check 
      CHECK (role IN ('USER', 'ADMIN', 'VENDOR'));
  END IF;
END $$;

-- Step 2: Update users table if it exists (use VENDOR uppercase)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
    UPDATE users u
    SET role = 'VENDOR'
    WHERE u.role = 'USER'
      AND EXISTS (
        SELECT 1 
        FROM listings l 
        WHERE l.owner_id = u.id
      );
    
    UPDATE users u
    SET role = 'VENDOR'
    WHERE u.role = 'USER'
      AND EXISTS (
        SELECT 1 
        FROM listings l 
        WHERE (l.email = u.email OR l.claimed_by_email = u.email)
          AND l.is_claimed = true
      );
  END IF;
END $$;

-- Step 3: Update profiles table if it exists (use vendor lowercase)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
    UPDATE profiles p
    SET role = 'vendor'
    WHERE p.role IN ('guest', 'parent')
      AND EXISTS (
        SELECT 1 
        FROM listings l 
        WHERE l.owner_id = p.id
      );
    
    UPDATE profiles p
    SET role = 'vendor'
    WHERE p.role IN ('guest', 'parent')
      AND EXISTS (
        SELECT 1 
        FROM listings l 
        WHERE (l.email = p.email OR l.claimed_by_email = p.email)
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
