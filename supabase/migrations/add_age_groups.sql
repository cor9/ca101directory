-- Migration: Add age_groups array to listings table
-- Run this on your CA101 Directory Supabase project

ALTER TABLE listings
ADD COLUMN IF NOT EXISTS age_groups text[] DEFAULT '{}';

-- Allowed values: tots, tweens, teens, young_adults
COMMENT ON COLUMN listings.age_groups IS 'Target age groups: tots, tweens, teens, young_adults';

