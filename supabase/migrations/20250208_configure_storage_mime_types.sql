-- Configure storage bucket MIME type restrictions
-- Ensures WebP support is enabled for all image upload buckets
-- Run this in your Supabase SQL Editor

-- 1. Configure listing-images bucket (profile images, gallery images)
UPDATE storage.buckets
SET
  file_size_limit = 10485760, -- 10MB (matches API route limit)
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic']
WHERE name = 'listing-images';

-- 2. Configure category_icons bucket (if it exists)
UPDATE storage.buckets
SET
  file_size_limit = 2097152, -- 2MB
  allowed_mime_types = ARRAY['image/png', 'image/svg+xml', 'image/webp']
WHERE name = 'category_icons';

-- 3. Configure badge_docs bucket (badge application documents)
-- Supports PDFs and images (including WebP) for testimonials, references, credentials
UPDATE storage.buckets
SET
  file_size_limit = 10485760, -- 10MB
  allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp']
WHERE name = 'badge_docs';

-- Note: If buckets don't exist yet, this will silently do nothing
-- The buckets should be created separately (e.g., via Supabase dashboard or other migrations)
