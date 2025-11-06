-- =====================================================
-- CREATE PARENT DASHBOARD TABLES
-- Run this in your Supabase SQL Editor
-- =====================================================

-- 1. CREATE FAVORITES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- 2. CREATE REVIEWS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stars INTEGER NOT NULL CHECK (stars >= 1 AND stars <= 5),
  text TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, listing_id),
  CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- 3. ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 4. CREATE RLS POLICIES FOR FAVORITES
-- =====================================================
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can manage own favorites" ON favorites;

-- Create new policies
CREATE POLICY "Users can view own favorites"
ON favorites FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own favorites"
ON favorites FOR ALL
USING (auth.uid() = user_id);

-- 5. CREATE RLS POLICIES FOR REVIEWS
-- =====================================================
-- Drop existing policies if they exist
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

-- 6. CREATE INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_listing_id ON favorites(listing_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_listing_id ON reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);

-- 7. GRANT PERMISSIONS
-- =====================================================
GRANT ALL ON favorites TO authenticated;
GRANT ALL ON reviews TO authenticated;
GRANT SELECT ON favorites TO anon;
GRANT SELECT ON reviews TO anon;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify everything was created correctly:

-- Check if tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('favorites', 'reviews');

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('favorites', 'reviews');

-- Check policies were created
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename IN ('favorites', 'reviews')
ORDER BY tablename, policyname;

-- Check indexes were created
SELECT tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('favorites', 'reviews')
ORDER BY tablename, indexname;

-- =====================================================
-- SUCCESS!
-- =====================================================
-- If all verification queries return results, the parent
-- dashboard features are now fully functional!
--
-- Next steps:
-- 1. Redeploy your app (or wait for automatic deployment)
-- 2. Sign up as a parent user
-- 3. Test favorites and reviews features
-- =====================================================

