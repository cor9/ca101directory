-- Fix Database Schema for Child Actor 101 Directory
-- Run this in Supabase SQL Editor

-- 1. Create profiles table (extends Supabase auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text,
  role text default 'guest',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Create favorites table
create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid not null references listings(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, listing_id)
);

-- 3. Create reviews table (if not exists)
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  stars integer not null check (stars >= 1 and stars <= 5),
  text text not null,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Create categories_public view
create or replace view categories_public as
select
  id,
  "Category Name" as category_name,
  description,
  icon,
  "Created Time" as created_at,
  "Created Time" as updated_at
from categories;

-- 5. Enable Row Level Security
alter table profiles enable row level security;
alter table favorites enable row level security;
alter table reviews enable row level security;

-- 6. Create RLS policies for profiles
create policy "Users can view their own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on profiles
  for update using (auth.uid() = id);

create policy "Users can insert their own profile" on profiles
  for insert with check (auth.uid() = id);

-- 7. Create RLS policies for favorites
create policy "Users can view their own favorites" on favorites
  for select using (auth.uid() = user_id);

create policy "Users can manage their own favorites" on favorites
  for all using (auth.uid() = user_id);

-- 8. Create RLS policies for reviews
create policy "Anyone can view approved reviews" on reviews
  for select using (status = 'approved');

create policy "Users can view their own reviews" on reviews
  for select using (auth.uid() = user_id);

create policy "Users can create reviews" on reviews
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own reviews" on reviews
  for update using (auth.uid() = user_id and status = 'pending');

-- 9. Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant select on categories_public to anon, authenticated;
grant select on listings to anon, authenticated;
grant all on profiles to authenticated;
grant all on favorites to authenticated;
grant all on reviews to authenticated;

-- 10. Create indexes for performance
create index if not exists idx_favorites_user_id on favorites(user_id);
create index if not exists idx_favorites_listing_id on favorites(listing_id);
create index if not exists idx_reviews_listing_id on reviews(listing_id);
create index if not exists idx_reviews_user_id on reviews(user_id);
create index if not exists idx_reviews_status on reviews(status);
