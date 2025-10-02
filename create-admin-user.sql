-- Create Admin User for Child Actor 101 Directory
-- Run this in your Supabase SQL Editor

-- First, create the user in Supabase Auth (you'll need to do this through the Supabase dashboard)
-- Go to Authentication > Users > Add User
-- Email: admin@childactor101.com
-- Password: admin123
-- Auto Confirm User: Yes

-- Then run this SQL to create the profile with admin role
-- Replace 'USER_UUID_HERE' with the actual UUID from the auth.users table

-- Step 1: Find the user ID (run this first to get the UUID)
-- SELECT id, email FROM auth.users WHERE email = 'admin@childactor101.com';

-- Step 2: Insert the profile (replace USER_UUID_HERE with the UUID from step 1)
INSERT INTO profiles (id, email, name, role, created_at, updated_at)
VALUES (
  'USER_UUID_HERE', -- Replace with actual UUID from step 1
  'admin@childactor101.com',
  'Admin User',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  updated_at = NOW();

-- Alternative: If you want to update an existing user to admin
-- UPDATE profiles SET role = 'admin' WHERE email = 'admin@childactor101.com';

-- Verify the admin user was created
SELECT id, email, name, role, created_at FROM profiles WHERE role = 'admin';
