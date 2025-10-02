-- Check and Fix Admin Access
-- Run this in your Supabase SQL Editor

-- Step 1: Check all users in auth.users
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC;

-- Step 2: Check all profiles
SELECT id, email, name, role, created_at FROM profiles ORDER BY created_at DESC;

-- Step 3: Find users without profiles
SELECT 
  au.id,
  au.email,
  au.created_at as auth_created,
  p.role,
  p.created_at as profile_created
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
ORDER BY au.created_at DESC;

-- Step 4: Create profile for any user without one (replace USER_UUID with actual UUID)
-- INSERT INTO profiles (id, email, name, role, created_at, updated_at)
-- VALUES (
--   'USER_UUID', -- Replace with actual UUID
--   'user@example.com', -- Replace with actual email
--   'User Name', -- Replace with actual name
--   'admin', -- Set to admin
--   NOW(),
--   NOW()
-- );

-- Step 5: Update existing user to admin (replace email with your email)
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';

-- Step 6: Verify admin users
SELECT id, email, name, role, created_at FROM profiles WHERE role = 'admin';
