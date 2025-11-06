-- =====================================================
-- HIDE SPECIFIC CATEGORIES
-- Run this in Supabase SQL Editor
-- =====================================================

-- Hide the requested categories by setting hidden = true
UPDATE categories
SET hidden = true
WHERE "Category Name" IN (
  'Hair/Makeup Artists',
  'Speech Therapy',
  'Wardrobe Consultant',
  'Videographers'
);

-- Verify the changes
SELECT 
  "Category Name" as category_name,
  hidden,
  id
FROM categories
WHERE "Category Name" IN (
  'Hair/Makeup Artists',
  'Speech Therapy',
  'Wardrobe Consultant',
  'Videographers'
)
ORDER BY "Category Name";

-- Show all hidden categories
SELECT 
  "Category Name" as category_name,
  hidden
FROM categories
WHERE hidden = true
ORDER BY "Category Name";

