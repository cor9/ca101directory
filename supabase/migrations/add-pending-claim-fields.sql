-- Add fields to track pending claims from paid users who haven't signed up yet
ALTER TABLE listings
ADD COLUMN IF NOT EXISTS pending_claim_email TEXT,
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;

-- Add comment for documentation
COMMENT ON COLUMN listings.pending_claim_email IS 'Email of user who paid but hasn''t created account yet';
COMMENT ON COLUMN listings.stripe_session_id IS 'Stripe session ID for pending claim verification';

