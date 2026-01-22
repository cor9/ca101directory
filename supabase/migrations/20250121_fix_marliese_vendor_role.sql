-- Fix Marliese Marie's vendor role and link her listing
-- User ID: c794f6c8-17da-4e74-898c-3a3199a8efd6
-- Email: marliesecarmona@gmail.com

-- Step 1: Update profile role to vendor (lowercase enum value)
UPDATE profiles
SET role = 'vendor'
WHERE id = 'c794f6c8-17da-4e74-898c-3a3199a8efd6';

-- Step 1b: Ensure her listing has the correct Founding Pro plan
UPDATE listings
SET plan = 'Founding Pro',
    status = 'Live',
    is_active = true
WHERE email = 'marliesecarmona@gmail.com'
   OR claimed_by_email = 'marliesecarmona@gmail.com'
   OR owner_id = 'c794f6c8-17da-4e74-898c-3a3199a8efd6';

-- Step 2: Link any listings with her email to her user account
UPDATE listings
SET owner_id = 'c794f6c8-17da-4e74-898c-3a3199a8efd6',
    is_claimed = true,
    date_claimed = COALESCE(date_claimed, NOW()::text)
WHERE email = 'marliesecarmona@gmail.com'
  AND (owner_id IS NULL OR owner_id != 'c794f6c8-17da-4e74-898c-3a3199a8efd6');

-- Step 3: Also check for claimed_by_email match
UPDATE listings
SET owner_id = 'c794f6c8-17da-4e74-898c-3a3199a8efd6',
    is_claimed = true,
    date_claimed = COALESCE(date_claimed, NOW()::text)
WHERE claimed_by_email = 'marliesecarmona@gmail.com'
  AND (owner_id IS NULL OR owner_id != 'c794f6c8-17da-4e74-898c-3a3199a8efd6');

-- Verify the fix
-- SELECT id, listing_name, owner_id, email, is_claimed, plan, status
-- FROM listings
-- WHERE email = 'marliesecarmona@gmail.com' OR claimed_by_email = 'marliesecarmona@gmail.com';
