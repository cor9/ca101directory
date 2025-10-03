-- Fix plan types to match actual form submission values
-- Run this in your Supabase SQL Editor

-- 1. Drop the existing enum constraint
ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_plan_check;
ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_status_check;

-- 2. Update the plan_type enum to include all actual plan names
DROP TYPE IF EXISTS plan_type CASCADE;

-- 3. Create new enum with correct values
CREATE TYPE plan_type AS ENUM (
  'Free',
  'Standard',
  'Pro',
  'Founding Standard',
  'Founding Pro'
);

-- 4. Create new listing_status enum with correct values
DROP TYPE IF EXISTS listing_status CASCADE;
CREATE TYPE listing_status AS ENUM (
  'Pending',
  'Live', 
  'Rejected',
  'Inactive'
);

-- 5. Update listings table to use new enums
ALTER TABLE listings 
ALTER COLUMN plan TYPE plan_type USING plan::plan_type;

ALTER TABLE listings 
ALTER COLUMN status TYPE listing_status USING status::listing_status;

-- 6. Add foreign key constraint for owner_id if it doesn't exist
ALTER TABLE listings 
ADD CONSTRAINT listings_owner_id_fkey 
FOREIGN KEY (owner_id) REFERENCES profiles(id) ON DELETE SET NULL;

-- 7. Update any existing data to match
UPDATE listings SET plan = 'Free' WHERE plan = 'Basic' OR plan = 'basic';
UPDATE listings SET plan = 'Standard' WHERE plan = 'Basic' OR plan = 'basic'; 
UPDATE listings SET status = 'Pending' WHERE status = 'pending';
UPDATE listings SET status = 'Live' WHERE status = 'published';
