-- Tri-Role System Data Models
-- This file contains the SQL schema for the three-role system (guest, parent, vendor, admin)

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users/Profiles table (updated for tri-role system)
DROP TABLE IF EXISTS profiles CASCADE;

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'parent' CHECK (role IN ('guest', 'parent', 'vendor', 'admin')),
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Listings table (updated for tri-role system)
DROP TABLE IF EXISTS listings CASCADE;

CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  listing_name TEXT,
  what_you_offer TEXT,
  who_is_it_for TEXT,
  why_is_it_unique TEXT,
  format TEXT,
  extras_notes TEXT,
  permit BOOLEAN,
  bonded BOOLEAN,
  bond_number TEXT,
  website TEXT,
  email TEXT,
  phone TEXT,
  region TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  age_range TEXT,
  categories TEXT,
  approved_101_badge BOOLEAN,
  profile_image TEXT,
  stripe_plan_id TEXT,
  plan TEXT,
  active BOOLEAN DEFAULT true,
  claimed BOOLEAN DEFAULT false,
  claimed_by_email TEXT,
  date_claimed TIMESTAMPTZ,
  verification_status TEXT,
  gallery TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table (for parent reviews of vendor listings)
DROP TABLE IF EXISTS reviews CASCADE;

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stars INTEGER CHECK (stars >= 1 AND stars <= 5),
  text TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'moderated')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favorites table (for parent bookmarks)
DROP TABLE IF EXISTS favorites CASCADE;

CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- Submissions table (for vendor submissions)
DROP TABLE IF EXISTS submissions CASCADE;

CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  form_submitted BOOLEAN DEFAULT false,
  reviewed BOOLEAN DEFAULT false,
  approved BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending',
  converted_paid_listing TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vendor suggestions table
DROP TABLE IF EXISTS vendor_suggestions CASCADE;

CREATE TABLE vendor_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_name TEXT,
  website TEXT,
  category TEXT,
  city TEXT,
  state TEXT,
  region TEXT,
  notes TEXT,
  suggested_by TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plans table
DROP TABLE IF EXISTS plans CASCADE;

CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan TEXT,
  monthly_price NUMERIC,
  annual_price NUMERIC,
  semi_annual_price NUMERIC,
  listings TEXT,
  stripe_plan_id TEXT,
  listings_2 TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
DROP TABLE IF EXISTS categories CASCADE;

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_name TEXT,
  listings TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_listings_vendor_id ON listings(vendor_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_active ON listings(active);
CREATE INDEX idx_reviews_listing_id ON reviews(listing_id);
CREATE INDEX idx_reviews_author_id ON reviews(author_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_listing_id ON favorites(listing_id);

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_suggestions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Listings policies
CREATE POLICY "Active listings are viewable by everyone" ON listings
  FOR SELECT USING (active = true);

CREATE POLICY "Vendors can manage their own listings" ON listings
  FOR ALL USING (auth.uid() = vendor_id);

-- Reviews policies
CREATE POLICY "Approved reviews are viewable by everyone" ON reviews
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = author_id);

-- Favorites policies
CREATE POLICY "Users can view their own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id);

-- Submissions policies
CREATE POLICY "Vendors can view their own submissions" ON submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM listings 
      WHERE listings.id = submissions.listing_id 
      AND listings.vendor_id = auth.uid()
    )
  );

CREATE POLICY "Vendors can create submissions for their listings" ON submissions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings 
      WHERE listings.id = submissions.listing_id 
      AND listings.vendor_id = auth.uid()
    )
  );

-- Vendor suggestions policies
CREATE POLICY "Anyone can create vendor suggestions" ON vendor_suggestions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all vendor suggestions" ON vendor_suggestions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Comments for documentation
COMMENT ON TABLE profiles IS 'User profiles with role-based access (guest, parent, vendor, admin)';
COMMENT ON TABLE listings IS 'Vendor listings with owner relationships';
COMMENT ON TABLE reviews IS 'Parent reviews of vendor listings';
COMMENT ON TABLE favorites IS 'Parent bookmarks of vendor listings';
COMMENT ON TABLE submissions IS 'Vendor submissions for listing approval';
COMMENT ON TABLE vendor_suggestions IS 'Community suggestions for new vendors';

COMMENT ON COLUMN profiles.role IS 'User role: guest, parent, vendor, or admin';
COMMENT ON COLUMN listings.vendor_id IS 'Owner of the listing (vendor)';
COMMENT ON COLUMN reviews.author_id IS 'Author of the review (parent)';
COMMENT ON COLUMN favorites.user_id IS 'User who favorited the listing (parent)';
