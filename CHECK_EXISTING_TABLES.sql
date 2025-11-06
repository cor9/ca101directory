-- =====================================================
-- CHECK EXISTING TABLES - Run this FIRST
-- =====================================================
-- This will show you what tables already exist and their columns

-- 1. Check if favorites table exists
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'favorites'
ORDER BY ordinal_position;

-- 2. Check if reviews table exists
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'reviews'
ORDER BY ordinal_position;

-- 3. Check existing constraints on reviews table
SELECT
  tc.constraint_name,
  tc.constraint_type,
  cc.check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc
  ON tc.constraint_name = cc.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.table_name = 'reviews';

