-- Phase 2.1 Supabase Migrations
-- Run these in your Supabase SQL editor

-- Reviews table
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references listings(id) on delete cascade,
  parent_id uuid references profiles(id) on delete set null,
  rating int check (rating between 1 and 5),
  comment text,
  approved boolean default false,
  created_at timestamptz default now()
);

-- Vendor suggestions table (Supabase version, long-term replacement for Airtable)
create table if not exists vendor_suggestions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website text,
  email text,
  city text,
  state text,
  region text,
  category text,
  submitted_by uuid references profiles(id),
  created_at timestamptz default now(),
  reviewed boolean default false
);

-- Listings table updates
alter table listings add column if not exists region text;
alter table listings add column if not exists owner_id uuid references profiles(id);
alter table listings add column if not exists claimed boolean default false;

-- Claims table for vendor claim requests
create table if not exists claims (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete cascade,
  vendor_id uuid references profiles(id),
  message text,
  approved boolean default false,
  created_at timestamptz default now()
);

-- Create indexes for better performance
create index if not exists idx_reviews_vendor_id on reviews(vendor_id);
create index if not exists idx_reviews_approved on reviews(approved);
create index if not exists idx_vendor_suggestions_reviewed on vendor_suggestions(reviewed);
create index if not exists idx_listings_owner_id on listings(owner_id);
create index if not exists idx_listings_region on listings(region);
create index if not exists idx_listings_claimed on listings(claimed);
create index if not exists idx_claims_listing_id on claims(listing_id);
create index if not exists idx_claims_vendor_id on claims(vendor_id);
create index if not exists idx_claims_approved on claims(approved);

-- Enable Row Level Security (RLS)
alter table reviews enable row level security;
alter table vendor_suggestions enable row level security;
alter table claims enable row level security;

-- Reviews policies
-- Anyone can read approved reviews
create policy "Anyone can read approved reviews" on reviews
  for select using (approved = true);

-- Parents can insert reviews (but not approve them)
create policy "Parents can insert reviews" on reviews
  for insert with check (
    auth.uid() is not null and
    parent_id = auth.uid()
  );

-- Parents can update their own reviews (before approval)
create policy "Parents can update their own reviews" on reviews
  for update using (
    auth.uid() is not null and
    parent_id = auth.uid() and
    approved = false
  );

-- Admins can do everything with reviews
create policy "Admins can manage all reviews" on reviews
  for all using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Vendor suggestions policies
-- Anyone can insert vendor suggestions
create policy "Anyone can insert vendor suggestions" on vendor_suggestions
  for insert with check (true);

-- Admins can read and update vendor suggestions
create policy "Admins can manage vendor suggestions" on vendor_suggestions
  for all using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Users can read their own suggestions
create policy "Users can read their own suggestions" on vendor_suggestions
  for select using (
    auth.uid() is not null and
    submitted_by = auth.uid()
  );

-- Claims policies
-- Anyone can insert claims
create policy "Anyone can insert claims" on claims
  for insert with check (true);

-- Admins can read and update all claims
create policy "Admins can manage all claims" on claims
  for all using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Users can read their own claims
create policy "Users can read their own claims" on claims
  for select using (
    auth.uid() is not null and
    vendor_id = auth.uid()
  );
