ALTER TABLE listings
ADD COLUMN IF NOT EXISTS is_approved boolean DEFAULT false;

ALTER TABLE listings
ADD COLUMN IF NOT EXISTS background_check_provider text;

ALTER TABLE listings
ALTER COLUMN trust_level SET DEFAULT 'unverified';
