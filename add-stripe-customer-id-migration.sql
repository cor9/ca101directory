-- Add stripe_customer_id column to profiles table
-- This is needed for Stripe integration in create-checkout-session.ts

ALTER TABLE public.profiles 
ADD COLUMN stripe_customer_id TEXT;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id 
ON public.profiles(stripe_customer_id);

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.stripe_customer_id IS 'Stripe customer ID for payment processing';
