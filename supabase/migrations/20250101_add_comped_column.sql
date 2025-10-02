-- Add comped column to listings table
-- This allows admins to gift Pro/Featured listings without Stripe checkout

ALTER TABLE listings
ADD COLUMN IF NOT EXISTS comped boolean DEFAULT false;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_listings_comped ON listings(comped);

-- Add comment for documentation
COMMENT ON COLUMN listings.comped IS 'Indicates if this listing is comped (gifted) by admin without payment';
