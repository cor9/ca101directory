
-- Add secondary_locations column to listings table
alter table listings
add column if not exists secondary_locations jsonb default '[]'::jsonb;

-- Create GIN index for efficient JSONB searching
create index if not exists idx_listings_secondary_locations
on listings using gin (secondary_locations);

-- Comment explaining the structure
comment on column listings.secondary_locations is 'Array of additional locations: [{city, state, zip}]';
