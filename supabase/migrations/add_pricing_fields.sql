-- Add pricing fields to listings table

ALTER TABLE listings
ADD COLUMN IF NOT EXISTS price_starting_at NUMERIC NULL,
ADD COLUMN IF NOT EXISTS price_range_min NUMERIC NULL,
ADD COLUMN IF NOT EXISTS price_range_max NUMERIC NULL,
ADD COLUMN IF NOT EXISTS free_consult BOOLEAN DEFAULT false;

COMMENT ON COLUMN listings.price_starting_at IS 'Starting price for services';
COMMENT ON COLUMN listings.price_range_min IS 'Minimum of typical price range';
COMMENT ON COLUMN listings.price_range_max IS 'Maximum of typical price range';
COMMENT ON COLUMN listings.free_consult IS 'Offers free consultation';

