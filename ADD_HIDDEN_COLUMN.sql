-- Add 'hidden' column to categories table
-- Run this in Supabase SQL Editor

ALTER TABLE categories
ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT FALSE;

-- Now hide the specific categories
UPDATE categories
SET hidden = TRUE
WHERE category_name IN (
  'Stunt Training',
  'Modeling/Print Agents',
  'Modeling Portfolios',
  'Lifestyle Photographers',
  'Financial Advisors',
  'Event Calendars',
  'Entertainment Lawyers',
  'Dance Classes',
  'Cosmetic Dentistry',
  'Content Creators',
  'Comedy Coaches'
);

-- Verify the changes
SELECT category_name, hidden
FROM categories
WHERE hidden = TRUE
ORDER BY category_name;

