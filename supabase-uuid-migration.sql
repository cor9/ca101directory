-- SUPABASE UUID MIGRATION: Create tables with UUID primary keys and foreign key relationships
-- Run this in Supabase SQL Editor

-- 1. Enable UUID generation (if not already)
create extension if not exists "pgcrypto";

-- 2. Listings table
drop table if exists listings cascade;

create table listings (
  id uuid primary key default gen_random_uuid(),
  listing_name text,
  what_you_offer text,
  who_is_it_for text,
  why_is_it_unique text,
  format text,
  extras_notes text,
  permit boolean,
  bonded boolean,
  bond_number text,
  website text,
  email text,
  phone text,
  region text,
  city text,
  state text,
  zip text,
  age_range text,
  categories text,
  approved_101_badge boolean,
  profile_image text,
  stripe_plan_id text,
  plan text,
  active boolean,
  claimed boolean,
  claimed_by_email text,
  date_claimed timestamptz,
  verification_status text,
  gallery text,
  status text,
  owner_id uuid references profiles(id) on delete set null,
  plan_id uuid references plans(id) on delete set null,
  category_id uuid references categories(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Submissions table
drop table if exists submissions cascade;

create table submissions (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete cascade,
  form_submitted boolean,
  reviewed boolean,
  approved boolean,
  status text,
  converted_paid_listing text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Vendor Suggestions
drop table if exists vendor_suggestions cascade;

create table vendor_suggestions (
  id uuid primary key default gen_random_uuid(),
  vendor_name text,
  website text,
  category text,
  city text,
  state text,
  region text,
  notes text,
  suggested_by text,
  status text,
  created_time timestamptz default now()
);

-- 5. Plans
drop table if exists plans cascade;

create table plans (
  id uuid primary key default gen_random_uuid(),
  plan text,
  monthly_price numeric,
  annual_price numeric,
  semi_annual_price numeric,
  listings text,
  stripe_plan_id text,
  listings_2 text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 6. Categories
drop table if exists categories cascade;

create table categories (
  id uuid primary key default gen_random_uuid(),
  category_name text,
  listings text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 7. Claims table (if not exists)
drop table if exists claims cascade;

create table claims (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete cascade,
  vendor_id uuid references profiles(id) on delete cascade,
  message text,
  approved boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 8. Reviews table (if not exists)
drop table if exists reviews cascade;

create table reviews (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references profiles(id) on delete cascade,
  parent_id uuid references profiles(id) on delete cascade,
  listing_id uuid references listings(id) on delete cascade,
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  approved boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 9. Create indexes for performance
create index if not exists idx_listings_status on listings (status);
create index if not exists idx_listings_owner_id on listings (owner_id);
create index if not exists idx_listings_plan_id on listings (plan_id);
create index if not exists idx_listings_category_id on listings (category_id);
create index if not exists idx_listings_city on listings (city);
create index if not exists idx_listings_state on listings (state);
create index if not exists idx_listings_region on listings (region);
create index if not exists idx_submissions_listing_id on submissions (listing_id);
create index if not exists idx_claims_listing_id on claims (listing_id);
create index if not exists idx_claims_vendor_id on claims (vendor_id);
create index if not exists idx_reviews_listing_id on reviews (listing_id);
create index if not exists idx_reviews_vendor_id on reviews (vendor_id);
create index if not exists idx_reviews_parent_id on reviews (parent_id);

-- 10. Enable RLS
alter table listings enable row level security;
alter table submissions enable row level security;
alter table vendor_suggestions enable row level security;
alter table plans enable row level security;
alter table categories enable row level security;
alter table claims enable row level security;
alter table reviews enable row level security;

-- 11. RLS Policies

-- Listings: Read access for everyone, write access for owners and admins
create policy "listings_read_all" on listings for select using (true);
create policy "listings_update_owner" on listings for update 
  using (owner_id = auth.uid() or auth.jwt() ->> 'role' = 'admin');
create policy "listings_insert_admin" on listings for insert 
  with check (auth.jwt() ->> 'role' = 'admin');

-- Submissions: Read access for admins, insert access for authenticated users
create policy "submissions_read_admin" on submissions for select 
  using (auth.jwt() ->> 'role' = 'admin');
create policy "submissions_insert_auth" on submissions for insert 
  with check (auth.uid() is not null);

-- Vendor Suggestions: Read access for admins, insert access for authenticated users
create policy "vendor_suggestions_read_admin" on vendor_suggestions for select 
  using (auth.jwt() ->> 'role' = 'admin');
create policy "vendor_suggestions_insert_auth" on vendor_suggestions for insert 
  with check (auth.uid() is not null);

-- Plans: Read access for everyone
create policy "plans_read_all" on plans for select using (true);

-- Categories: Read access for everyone
create policy "categories_read_all" on categories for select using (true);

-- Claims: Read access for admins, insert/update access for authenticated users
create policy "claims_read_admin" on claims for select 
  using (auth.jwt() ->> 'role' = 'admin');
create policy "claims_insert_auth" on claims for insert 
  with check (auth.uid() is not null);
create policy "claims_update_owner" on claims for update 
  using (vendor_id = auth.uid() or auth.jwt() ->> 'role' = 'admin');

-- Reviews: Read access for everyone (approved only), insert access for authenticated users
create policy "reviews_read_approved" on reviews for select 
  using (approved = true);
create policy "reviews_insert_auth" on reviews for insert 
  with check (auth.uid() is not null);
create policy "reviews_update_admin" on reviews for update 
  using (auth.jwt() ->> 'role' = 'admin');

-- 12. Create updated views for backward compatibility
create or replace view listings_public as
select
  id,
  listing_name,
  what_you_offer,
  who_is_it_for,
  why_is_it_unique,
  format,
  extras_notes,
  permit as ca_performer_permit,
  bonded as bonded_for_advanced_fees,
  bond_number,
  website,
  email,
  phone,
  region,
  city,
  state,
  zip,
  age_range,
  categories,
  approved_101_badge,
  profile_image,
  stripe_plan_id,
  plan,
  active,
  claimed,
  claimed_by_email,
  date_claimed,
  verification_status,
  gallery,
  status,
  owner_id,
  plan_id,
  category_id,
  created_at,
  updated_at
from listings;

create or replace view plans_public as
select
  id,
  plan,
  monthly_price,
  annual_price,
  semi_annual_price,
  listings,
  stripe_plan_id,
  listings_2,
  created_at,
  updated_at
from plans;

create or replace view categories_public as
select
  id,
  category_name,
  listings,
  created_at,
  updated_at
from categories;

create or replace view submissions_public as
select
  id,
  listing_id,
  form_submitted,
  reviewed,
  approved,
  status,
  converted_paid_listing,
  created_at,
  updated_at
from submissions;

create or replace view vendor_suggestions_public as
select
  id,
  vendor_name,
  website,
  category,
  city,
  state,
  region,
  notes,
  suggested_by,
  status,
  created_time
from vendor_suggestions;
