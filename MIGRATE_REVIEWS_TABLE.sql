-- =====================================================
-- MIGRATE REVIEWS TABLE TO NEW SCHEMA
-- Run this in your Supabase SQL Editor
-- =====================================================

-- This will update the existing reviews table to match the new schema
-- that the parent dashboard code expects

-- 1. RENAME AND ADD COLUMNS
-- =====================================================

-- Rename vendor_id to listing_id (reviews are for listings, not vendors)
ALTER TABLE reviews RENAME COLUMN vendor_id TO listing_id;

-- Rename parent_id to user_id (more generic, works for any user role)
ALTER TABLE reviews RENAME COLUMN parent_id TO user_id;

-- Rename rating to stars (to match code expectations)
ALTER TABLE reviews RENAME COLUMN rating TO stars;

-- Rename review_text to text (to match code expectations)
ALTER TABLE reviews RENAME COLUMN review_text TO text;

-- Add status column (converting from approved boolean)
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Add updated_at column
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. MIGRATE DATA: Convert approved boolean to status text
-- =====================================================
UPDATE reviews 
SET status = CASE 
  WHEN approved = true THEN 'approved'
  WHEN approved = false THEN 'pending'
  ELSE 'pending'
END
WHERE status = 'pending'; -- Only update rows that haven't been migrated

-- 3. DROP OLD APPROVED COLUMN (after data is migrated)
-- =====================================================
ALTER TABLE reviews DROP COLUMN IF EXISTS approved;

-- 4. ADD CONSTRAINTS
-- =====================================================

-- Add check constraint for stars (1-5 rating)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'reviews_stars_check'
  ) THEN
    ALTER TABLE reviews ADD CONSTRAINT reviews_stars_check CHECK (stars >= 1 AND stars <= 5);
  END IF;
END $$;

-- Add check constraint for status
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'reviews_status_check'
  ) THEN
    ALTER TABLE reviews ADD CONSTRAINT reviews_status_check CHECK (status IN ('pending', 'approved', 'rejected'));
  END IF;
END $$;

-- Add unique constraint (one review per user per listing)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'reviews_user_listing_unique'
  ) THEN
    ALTER TABLE reviews ADD CONSTRAINT reviews_user_listing_unique UNIQUE (user_id, listing_id);
  END IF;
END $$;

-- Make text column NOT NULL (reviews must have text)
ALTER TABLE reviews ALTER COLUMN text SET NOT NULL;

-- 5. UPDATE FOREIGN KEY REFERENCES
-- =====================================================

-- Drop old foreign keys if they exist
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_vendor_id_fkey;
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_parent_id_fkey;
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_listing_id_fkey;
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;

-- Add new foreign keys
ALTER TABLE reviews ADD CONSTRAINT reviews_listing_id_fkey 
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE;

ALTER TABLE reviews ADD CONSTRAINT reviews_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- 6. CREATE/UPDATE RLS POLICIES
-- =====================================================

-- Enable RLS if not already enabled
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON reviews;
DROP POLICY IF EXISTS "Users can view own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update own pending reviews" ON reviews;

-- Create new policies
CREATE POLICY "Anyone can view approved reviews" 
ON reviews FOR SELECT 
USING (status = 'approved');

CREATE POLICY "Users can view own reviews" 
ON reviews FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create reviews" 
ON reviews FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending reviews" 
ON reviews FOR UPDATE 
USING (auth.uid() = user_id AND status = 'pending');

-- 7. CREATE/UPDATE INDEXES
-- =====================================================

-- Drop old indexes
DROP INDEX IF EXISTS idx_reviews_vendor_id;
DROP INDEX IF EXISTS idx_reviews_parent_id;

-- Create new indexes
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_listing_id ON reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check the new schema
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'reviews'
ORDER BY ordinal_position;

-- Check constraints
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public' AND table_name = 'reviews';

-- Check indexes
SELECT indexname 
FROM pg_indexes 
WHERE schemaname = 'public' AND tablename = 'reviews';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
SELECT 'Reviews table successfully migrated to new schema!' AS message;

