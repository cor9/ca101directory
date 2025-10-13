-- 101 Approved Badge System Database Setup
-- Run this in your Supabase SQL Editor

-- 1. Create vendor_badge_applications table
CREATE TABLE IF NOT EXISTS vendor_badge_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_info JSONB DEFAULT '{}',
  testimonials TEXT[] DEFAULT '{}',
  references TEXT[] DEFAULT '{}',
  credentials TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create badge_docs storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('badge_docs', 'badge_docs', false, 10485760) -- 10MB limit
ON CONFLICT (id) DO NOTHING;

-- 3. Set up RLS policies for vendor_badge_applications
ALTER TABLE vendor_badge_applications ENABLE ROW LEVEL SECURITY;

-- Policy: Vendors can view and manage their own applications
CREATE POLICY "Vendors can manage own badge applications"
ON vendor_badge_applications
FOR ALL
USING (auth.uid() = vendor_id)
WITH CHECK (auth.uid() = vendor_id);

-- Policy: Admins can view all applications (you'll need to set up admin role)
-- CREATE POLICY "Admins can view all badge applications"
-- ON vendor_badge_applications
-- FOR ALL
-- USING (auth.jwt() ->> 'role' = 'admin');

-- 4. Set up RLS policies for badge_docs storage bucket
CREATE POLICY "Vendors can upload badge documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'badge_docs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Vendors can view own badge documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'badge_docs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Vendors can update own badge documents"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'badge_docs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'badge_docs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Vendors can delete own badge documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'badge_docs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 5. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Create trigger for updated_at
CREATE TRIGGER update_vendor_badge_applications_updated_at
  BEFORE UPDATE ON vendor_badge_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 7. Add badge_approved column to listings table (if it doesn't exist)
-- ALTER TABLE listings ADD COLUMN IF NOT EXISTS badge_approved BOOLEAN DEFAULT FALSE;

-- 8. Create index for better performance
CREATE INDEX IF NOT EXISTS idx_vendor_badge_applications_vendor_id 
ON vendor_badge_applications(vendor_id);

CREATE INDEX IF NOT EXISTS idx_vendor_badge_applications_status 
ON vendor_badge_applications(status);

-- 9. Grant necessary permissions
GRANT ALL ON vendor_badge_applications TO authenticated;
GRANT USAGE ON SCHEMA storage TO authenticated;

-- 10. Optional: Create view for admin dashboard
CREATE OR REPLACE VIEW badge_applications_admin AS
SELECT 
  vba.*,
  p.email,
  p.full_name,
  l.listing_name,
  l.category
FROM vendor_badge_applications vba
LEFT JOIN profiles p ON vba.vendor_id = p.id
LEFT JOIN listings l ON vba.vendor_id = l.owner_id AND l.status = 'live'
ORDER BY vba.created_at DESC;

-- Grant access to the view
GRANT SELECT ON badge_applications_admin TO authenticated;
