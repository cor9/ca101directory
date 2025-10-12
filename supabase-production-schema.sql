-- SUPABASE PRODUCTION SCHEMA: Complete production-ready database schema
-- Run this in Supabase SQL Editor for production deployment

-- 1. Enable required extensions
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- 2. Create ENUM types
create type plan_type as enum ('Free', 'Basic', 'Pro', 'Premium');
create type listing_status as enum ('Pending', 'Live', 'Rejected', 'Inactive');
create type review_status as enum ('pending', 'approved', 'rejected');
create type claim_status as enum ('pending', 'approved', 'rejected');
create type user_role as enum ('guest', 'parent', 'vendor', 'admin');

-- 3. Profiles table (extends Supabase auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text,
  role user_role default 'guest',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Plans table
create table if not exists plans (
  id uuid primary key default gen_random_uuid(),
  plan_name plan_type not null,
  monthly_price numeric(10,2) default 0,
  annual_price numeric(10,2) default 0,
  stripe_price_id text,
  features jsonb default '{}',
  max_listings integer default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. Categories table
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  category_name text not null unique,
  description text,
  icon text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 6. Listings table
create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  listing_name text not null,
  what_you_offer text,
  who_is_it_for text,
  why_is_it_unique text,
  format text,
  extras_notes text,
  ca_performer_permit boolean default false,
  bonded_for_advanced_fees boolean default false,
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
  approved_101_badge boolean default false,
  profile_image text,
  gallery text,
  plan plan_type default 'Free',
  status listing_status default 'Pending',
  active boolean default false,
  claimed boolean default false,
  claimed_by_email text,
  date_claimed timestamptz,
  verification_status text default 'Pending',
  owner_id uuid references profiles(id) on delete set null,
  plan_id uuid references plans(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 7. Submissions table
create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  form_data jsonb not null,
  status listing_status default 'Pending',
  reviewed boolean default false,
  approved boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 8. Claims table
create table if not exists claims (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  message text,
  status claim_status default 'pending',
  approved boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 9. Favorites table
create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  listing_id uuid references listings(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, listing_id)
);

-- 10. Reviews table
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  stars integer check (stars >= 1 and stars <= 5) not null,
  text text not null,
  status review_status default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, listing_id)
);

-- 11. Vendor Suggestions table
create table if not exists vendor_suggestions (
  id uuid primary key default gen_random_uuid(),
  vendor_name text not null,
  website text,
  category text,
  city text,
  state text,
  region text,
  notes text,
  suggested_by text,
  status text default 'pending',
  created_at timestamptz default now()
);

-- 12. Stripe Customers table
create table if not exists stripe_customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade unique,
  stripe_customer_id text unique not null,
  email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 13. Stripe Subscriptions table
create table if not exists stripe_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text unique not null,
  stripe_price_id text,
  status text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 14. Create indexes for performance
create index if not exists idx_listings_slug on listings (slug);
create index if not exists idx_listings_status on listings (status);
create index if not exists idx_listings_owner_id on listings (owner_id);
create index if not exists idx_listings_plan on listings (plan);
create index if not exists idx_listings_city on listings (city);
create index if not exists idx_listings_state on listings (state);
create index if not exists idx_listings_region on listings (region);
create index if not exists idx_listings_active on listings (active);

create index if not exists idx_submissions_listing_id on submissions (listing_id);
create index if not exists idx_submissions_user_id on submissions (user_id);
create index if not exists idx_submissions_status on submissions (status);

create index if not exists idx_claims_listing_id on claims (listing_id);
create index if not exists idx_claims_user_id on claims (user_id);
create index if not exists idx_claims_status on claims (status);

create index if not exists idx_favorites_user_id on favorites (user_id);
create index if not exists idx_favorites_listing_id on favorites (listing_id);

create index if not exists idx_reviews_listing_id on reviews (listing_id);
create index if not exists idx_reviews_user_id on reviews (user_id);
create index if not exists idx_reviews_status on reviews (status);

create index if not exists idx_profiles_email on profiles (email);
create index if not exists idx_profiles_role on profiles (role);

create index if not exists idx_stripe_customers_user_id on stripe_customers (user_id);
create index if not exists idx_stripe_subscriptions_user_id on stripe_subscriptions (user_id);

-- 15. Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 16. Create triggers for updated_at
create trigger update_profiles_updated_at before update on profiles
  for each row execute function update_updated_at_column();

create trigger update_listings_updated_at before update on listings
  for each row execute function update_updated_at_column();

create trigger update_submissions_updated_at before update on submissions
  for each row execute function update_updated_at_column();

create trigger update_claims_updated_at before update on claims
  for each row execute function update_updated_at_column();

create trigger update_reviews_updated_at before update on reviews
  for each row execute function update_updated_at_column();

create trigger update_stripe_customers_updated_at before update on stripe_customers
  for each row execute function update_updated_at_column();

create trigger update_stripe_subscriptions_updated_at before update on stripe_subscriptions
  for each row execute function update_updated_at_column();

-- 17. Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 'guest');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- 18. Create trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 19. Create public views for backward compatibility
create or replace view listings_public as
select
  id,
  slug,
  listing_name,
  what_you_offer,
  who_is_it_for,
  why_is_it_unique,
  format,
  extras_notes,
  ca_performer_permit,
  bonded_for_advanced_fees,
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
  gallery,
  plan,
  status,
  active,
  claimed,
  claimed_by_email,
  date_claimed,
  verification_status,
  owner_id,
  plan_id,
  created_at,
  updated_at
from listings;

create or replace view plans_public as
select
  id,
  plan_name,
  monthly_price,
  annual_price,
  stripe_price_id,
  features,
  max_listings,
  created_at,
  updated_at
from plans;

create or replace view categories_public as
select
  id,
  category_name,
  description,
  icon,
  created_at,
  updated_at
from categories;

-- 20. Insert default data
insert into plans (plan_name, monthly_price, annual_price, max_listings, features) values
('Free', 0, 0, 1, '{"basic_listing": true, "contact_info": true}'),
('Basic', 25, 250, 1, '{"basic_listing": true, "contact_info": true, "logo_display": true}'),
('Pro', 50, 500, 3, '{"basic_listing": true, "contact_info": true, "logo_display": true, "featured_placement": true, "analytics": true}'),
('Premium', 90, 900, 5, '{"basic_listing": true, "contact_info": true, "logo_display": true, "featured_placement": true, "analytics": true, "101_badge": true, "priority_support": true}')
on conflict (plan_name) do nothing;

insert into categories (category_name, description) values
('Acting Coaches', 'Professional acting coaches and instructors'),
('Headshot Photographers', 'Professional photographers specializing in headshots'),
('Voice Coaches', 'Voice and speech coaches for actors'),
('Dance Instructors', 'Dance instructors and choreographers'),
('Singing Coaches', 'Vocal coaches and singing instructors'),
('Agents & Managers', 'Talent agents and managers'),
('Casting Directors', 'Casting directors and casting services'),
('Production Companies', 'Film and television production companies')
on conflict (category_name) do nothing;

-- 21. Enable Row Level Security
alter table profiles enable row level security;
alter table listings enable row level security;
alter table submissions enable row level security;
alter table claims enable row level security;
alter table favorites enable row level security;
alter table reviews enable row level security;
alter table vendor_suggestions enable row level security;
alter table stripe_customers enable row level security;
alter table stripe_subscriptions enable row level security;

-- 22. RLS Policies will be added in the next step
-- (See rls-policies.sql for complete RLS setup)

-- 23. Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant execute on all functions in schema public to anon, authenticated;

-- 24. Create function to generate slug from listing name
create or replace function generate_slug(name text)
returns text as $$
begin
  return lower(regexp_replace(name, '[^a-zA-Z0-9\s]', '', 'g'))
         |> regexp_replace('\s+', '-', 'g')
         |> substring(1, 50);
end;
$$ language plpgsql;

-- 25. Create function to ensure unique slug
create or replace function ensure_unique_slug()
returns trigger as $$
declare
  base_slug text;
  final_slug text;
  counter integer := 0;
begin
  base_slug := generate_slug(new.listing_name);
  final_slug := base_slug;
  
  while exists (select 1 from listings where slug = final_slug and id != coalesce(new.id, gen_random_uuid())) loop
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  end loop;
  
  new.slug := final_slug;
  return new;
end;
$$ language plpgsql;

-- 26. Create trigger for automatic slug generation
create trigger ensure_unique_slug_trigger
  before insert or update on listings
  for each row execute function ensure_unique_slug();

-- Production schema setup complete!
-- Next: Run rls-policies.sql to set up Row Level Security
