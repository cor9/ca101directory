-- =====================================================
-- CREATE FAVORITES TABLE
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

-- 2. ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- 3. CREATE RLS POLICIES
-- =====================================================
DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can manage own favorites" ON favorites;

CREATE POLICY "Users can view own favorites" 
ON favorites FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own favorites" 
ON favorites FOR ALL 
USING (auth.uid() = user_id);

-- 4. CREATE INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_listing_id ON favorites(listing_id);

-- 5. GRANT PERMISSIONS
-- =====================================================
GRANT ALL ON favorites TO authenticated;
GRANT SELECT ON favorites TO anon;

-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT 'Favorites table created successfully!' AS message;

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'favorites'
ORDER BY ordinal_position;

