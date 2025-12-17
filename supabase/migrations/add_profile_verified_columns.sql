-- Migration: Add profile_verified columns to listings table
-- Run this on your CA101 Directory Supabase project

ALTER TABLE listings
ADD COLUMN IF NOT EXISTS profile_verified boolean DEFAULT false NOT NULL,
ADD COLUMN IF NOT EXISTS profile_verified_at timestamptz NULL;

-- Optional: Add comment for clarity
COMMENT ON COLUMN listings.profile_verified IS 'Provider claimed listing and reviewed by Child Actor 101 for basic legitimacy';
COMMENT ON COLUMN listings.profile_verified_at IS 'Timestamp when profile was verified';

