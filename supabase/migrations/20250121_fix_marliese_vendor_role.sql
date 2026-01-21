-- Fix Marliese Marie's vendor role and link her listing
-- User ID: c794f6c8-17da-4e74-898c-3a3199a8efd6
-- Email: marliesecarmona@gmail.com

-- Step 1: Update the users table constraint to allow VENDOR role
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

-- Step 2: Update user role to VENDOR (uppercase to match constraint)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
    UPDATE users
    SET role = 'VENDOR'
    WHERE id = 'c794f6c8-17da-4e74-898c-3a3199a8efd6'
      AND email = 'marliesecarmona@gmail.com';
  END IF;
END $$;

-- Step 3: Also try profiles table if it exists (production schema)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
    UPDATE profiles
    SET role = 'vendor'
    WHERE id = 'c794f6c8-17da-4e74-898c-3a3199a8efd6'
      AND email = 'marliesecarmona@gmail.com';
  END IF;
END $$;

-- Step 2: Link any listings with this email to this user account
UPDATE listings
SET owner_id = 'c794f6c8-17da-4e74-898c-3a3199a8efd6',
    is_claimed = true,
    date_claimed = COALESCE(date_claimed, NOW())
WHERE email = 'marliesecarmona@gmail.com'
  AND (owner_id IS NULL OR owner_id != 'c794f6c8-17da-4e74-898c-3a3199a8efd6');

-- Step 3: Also check for claimed_by_email match
UPDATE listings
SET owner_id = 'c794f6c8-17da-4e74-898c-3a3199a8efd6',
    is_claimed = true,
    date_claimed = COALESCE(date_claimed, NOW())
WHERE claimed_by_email = 'marliesecarmona@gmail.com'
  AND (owner_id IS NULL OR owner_id != 'c794f6c8-17da-4e74-898c-3a3199a8efd6');

-- Verify the fix
-- SELECT id, listing_name, owner_id, email, is_claimed, plan, status
-- FROM listings
-- WHERE email = 'marliesecarmona@gmail.com' OR claimed_by_email = 'marliesecarmona@gmail.com';
