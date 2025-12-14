-- Migration: Update format field to support comma-separated tags
-- The format field now stores comma-separated values like "online, in-person" or "hybrid"
-- instead of single values like "Online" or "In-person"

-- No schema change needed - format is already TEXT which can store comma-separated values
-- This migration documents the change and optionally normalizes existing data

-- Normalize existing single format values to lowercase tag format
UPDATE listings
SET format = CASE
  WHEN format ILIKE '%online%' AND format NOT LIKE '%,%' THEN 'online'
  WHEN format ILIKE '%in-person%' OR format ILIKE '%in person%' THEN 'in-person'
  WHEN format ILIKE '%hybrid%' AND format NOT LIKE '%,%' THEN 'hybrid'
  ELSE LOWER(TRIM(format))
END
WHERE format IS NOT NULL
  AND format != ''
  AND format NOT LIKE '%,%'; -- Only update single values, not already comma-separated

-- Add comment to document the field format
COMMENT ON COLUMN listings.format IS 'Service format tags as comma-separated lowercase values: "online", "in-person", "hybrid", or combinations like "online, in-person"';
