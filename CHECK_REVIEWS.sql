-- =====================================================
-- CHECK REVIEWS TABLE DATA
-- Run this in Supabase SQL Editor to see what reviews exist
-- =====================================================

-- 1. Check all reviews in the table
SELECT
  id,
  listing_id,
  user_id,
  stars,
  LEFT(text, 50) as review_preview,
  status,
  created_at
FROM reviews
ORDER BY created_at DESC;

-- 2. Check if listing_id references exist in listings table
SELECT
  r.id as review_id,
  r.listing_id,
  r.status,
  l.id as listing_exists,
  l.listing_name
FROM reviews r
LEFT JOIN listings l ON r.listing_id = l.id
ORDER BY r.created_at DESC;

-- 3. Check if user_id references exist in profiles table
SELECT
  r.id as review_id,
  r.user_id,
  r.status,
  p.id as profile_exists,
  p.name,
  p.email
FROM reviews r
LEFT JOIN profiles p ON r.user_id = p.id
ORDER BY r.created_at DESC;

-- 4. Check foreign key constraints
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'reviews'
  AND tc.constraint_type = 'FOREIGN KEY';

-- 5. Simple count by status
SELECT
  status,
  COUNT(*) as count
FROM reviews
GROUP BY status;

