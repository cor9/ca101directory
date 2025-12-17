-- Add faceted taxonomy fields to listings table

ALTER TABLE listings
ADD COLUMN IF NOT EXISTS technique_focus TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS beginner_friendly BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS union_status TEXT NULL;

COMMENT ON COLUMN listings.technique_focus IS 'Technique focus areas (e.g., Meisner, Method, Improv)';
COMMENT ON COLUMN listings.beginner_friendly IS 'Whether provider works with beginners';
COMMENT ON COLUMN listings.union_status IS 'Union/franchise status (sag_aftra, non_union, both, null)';

