-- Add link column to profiles table
-- This is needed for user profile links in update-link.ts

ALTER TABLE public.profiles 
ADD COLUMN link TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.link IS 'User profile link/website URL';
