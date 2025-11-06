-- =====================================================
-- HIDE SPECIFIC CATEGORIES
-- Run this in Supabase SQL Editor
-- =====================================================

-- Hide the requested categories by setting hidden = true
UPDATE categories
SET hidden = true
WHERE category_name IN (
  'Hair/Makeup Artists',
  'Speech Therapy',
  'Wardrobe Consultant',
  'Videographers'
);

-- Verify the changes
SELECT 
  category_name,
  hidden,
  id
FROM categories
WHERE category_name IN (
  'Hair/Makeup Artists',
  'Speech Therapy',
  'Wardrobe Consultant',
  'Videographers'
)
ORDER BY category_name;

-- Show all hidden categories
SELECT 
  category_name,
  hidden
FROM categories
WHERE hidden = true
ORDER BY category_name;

