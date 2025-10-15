-- Fix listing status constraint to include 'Archived' status
-- This resolves the "Database Error: Failed to update listing" issue

-- Drop the existing constraint
ALTER TABLE listings 
DROP CONSTRAINT IF EXISTS valid_listing_status;

-- Add the updated constraint with 'Archived' status
ALTER TABLE listings 
ADD CONSTRAINT valid_listing_status 
CHECK (status = ANY (ARRAY['Live'::text, 'Pending'::text, 'Rejected'::text, 'Draft'::text, 'Archived'::text]));

-- Verify the constraint is working
SELECT 
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'listings'::regclass 
AND conname = 'valid_listing_status';
