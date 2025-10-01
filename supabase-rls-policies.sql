-- SUPABASE RLS POLICIES: Complete Row Level Security setup for production
-- Run this in Supabase SQL Editor after running supabase-production-schema.sql

-- 1. Profiles policies
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id);

create policy "Admins can view all profiles" on profiles
  for select using (
    exists (
      select 1 from profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- 2. Listings policies
create policy "Public can view live listings" on listings
  for select using (status = 'Live' and active = true);

create policy "Users can view own listings" on listings
  for select using (auth.uid() = owner_id);

create policy "Users can update own listings" on listings
  for update using (auth.uid() = owner_id);

create policy "Users can insert own listings" on listings
  for insert with check (auth.uid() = owner_id);

create policy "Admins can view all listings" on listings
  for select using (
    exists (
      select 1 from profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update all listings" on listings
  for update using (
    exists (
      select 1 from profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Service role can insert listings" on listings
  for insert with check (auth.role() = 'service_role');

-- 3. Submissions policies
create policy "Users can view own submissions" on submissions
  for select using (auth.uid() = user_id);

create policy "Users can insert own submissions" on submissions
  for insert with check (auth.uid() = user_id);

create policy "Admins can view all submissions" on submissions
  for select using (
    exists (
      select 1 from profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update all submissions" on submissions
  for update using (
    exists (
      select 1 from profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- 4. Claims policies
create policy "Users can view own claims" on claims
  for select using (auth.uid() = user_id);

create policy "Users can insert own claims" on claims
  for insert with check (auth.uid() = user_id);

create policy "Users can update own claims" on claims
  for update using (auth.uid() = user_id);

create policy "Admins can view all claims" on claims
  for select using (
    exists (
      select 1 from profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update all claims" on claims
  for update using (
    exists (
      select 1 from profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- 5. Favorites policies
create policy "Users can view own favorites" on favorites
  for select using (auth.uid() = user_id);

create policy "Users can manage own favorites" on favorites
  for all using (auth.uid() = user_id);

-- 6. Reviews policies
create policy "Public can view approved reviews" on reviews
  for select using (status = 'approved');

create policy "Users can view own reviews" on reviews
  for select using (auth.uid() = user_id);

create policy "Users can insert own reviews" on reviews
  for insert with check (auth.uid() = user_id);

create policy "Users can update own reviews" on reviews
  for update using (auth.uid() = user_id);

create policy "Admins can view all reviews" on reviews
  for select using (
    exists (
      select 1 from profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update all reviews" on reviews
  for update using (
    exists (
      select 1 from profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- 7. Vendor Suggestions policies
create policy "Users can insert vendor suggestions" on vendor_suggestions
  for insert with check (auth.uid() is not null);

create policy "Admins can view all vendor suggestions" on vendor_suggestions
  for select using (
    exists (
      select 1 from profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update vendor suggestions" on vendor_suggestions
  for update using (
    exists (
      select 1 from profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- 8. Plans policies (public read access)
create policy "Public can view plans" on plans
  for select using (true);

create policy "Admins can manage plans" on plans
  for all using (
    exists (
      select 1 from profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- 9. Categories policies (public read access)
create policy "Public can view categories" on categories
  for select using (true);

create policy "Admins can manage categories" on categories
  for all using (
    exists (
      select 1 from profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- 10. Stripe Customers policies
create policy "Users can view own stripe customer" on stripe_customers
  for select using (auth.uid() = user_id);

create policy "Service role can manage stripe customers" on stripe_customers
  for all using (auth.role() = 'service_role');

-- 11. Stripe Subscriptions policies
create policy "Users can view own subscriptions" on stripe_subscriptions
  for select using (auth.uid() = user_id);

create policy "Service role can manage subscriptions" on stripe_subscriptions
  for all using (auth.role() = 'service_role');

-- 12. Public views policies
create policy "Public can view listings_public" on listings_public
  for select using (status = 'Live' and active = true);

create policy "Public can view plans_public" on plans_public
  for select using (true);

create policy "Public can view categories_public" on categories_public
  for select using (true);

-- 13. Additional security policies

-- Prevent users from changing their own role
create policy "Users cannot change own role" on profiles
  for update using (
    auth.uid() = id and 
    (old.role = new.role or auth.role() = 'service_role')
  );

-- Prevent users from deleting their own profile
create policy "Users cannot delete own profile" on profiles
  for delete using (auth.role() = 'service_role');

-- Prevent users from deleting listings
create policy "Users cannot delete listings" on listings
  for delete using (auth.role() = 'service_role');

-- 14. Create function to check if user is admin
create or replace function is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from profiles 
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- 15. Create function to check if user owns listing
create or replace function owns_listing(listing_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from listings 
    where id = listing_id and owner_id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- 16. Create function to check if user can review listing
create or replace function can_review_listing(listing_id uuid)
returns boolean as $$
begin
  -- Users can review if they don't already have a review for this listing
  -- and they are not the owner of the listing
  return not exists (
    select 1 from reviews 
    where listing_id = can_review_listing.listing_id and user_id = auth.uid()
  ) and not exists (
    select 1 from listings 
    where id = listing_id and owner_id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- 17. Create function to get user role
create or replace function get_user_role()
returns user_role as $$
begin
  return (
    select role from profiles 
    where id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- 18. Create function to check if user can access admin features
create or replace function can_access_admin()
returns boolean as $$
begin
  return get_user_role() = 'admin';
end;
$$ language plpgsql security definer;

-- 19. Create function to check if user can access vendor features
create or replace function can_access_vendor()
returns boolean as $$
begin
  return get_user_role() in ('vendor', 'admin');
end;
$$ language plpgsql security definer;

-- 20. Create function to check if user can access parent features
create or replace function can_access_parent()
returns boolean as $$
begin
  return get_user_role() in ('parent', 'admin');
end;
$$ language plpgsql security definer;

-- 21. Grant execute permissions on functions
grant execute on function is_admin() to anon, authenticated;
grant execute on function owns_listing(uuid) to anon, authenticated;
grant execute on function can_review_listing(uuid) to anon, authenticated;
grant execute on function get_user_role() to anon, authenticated;
grant execute on function can_access_admin() to anon, authenticated;
grant execute on function can_access_vendor() to anon, authenticated;
grant execute on function can_access_parent() to anon, authenticated;

-- 22. Create indexes for RLS performance
create index if not exists idx_profiles_role on profiles (role);
create index if not exists idx_listings_owner_status on listings (owner_id, status);
create index if not exists idx_reviews_user_status on reviews (user_id, status);
create index if not exists idx_claims_user_status on claims (user_id, status);

-- 23. Create view for admin dashboard stats
create or replace view admin_stats as
select
  (select count(*) from profiles) as total_users,
  (select count(*) from profiles where role = 'parent') as parent_users,
  (select count(*) from profiles where role = 'vendor') as vendor_users,
  (select count(*) from profiles where role = 'admin') as admin_users,
  (select count(*) from listings) as total_listings,
  (select count(*) from listings where status = 'Live') as live_listings,
  (select count(*) from listings where status = 'Pending') as pending_listings,
  (select count(*) from reviews where status = 'pending') as pending_reviews,
  (select count(*) from claims where status = 'pending') as pending_claims,
  (select count(*) from vendor_suggestions where status = 'pending') as pending_suggestions;

-- 24. Create policy for admin stats view
create policy "Admins can view admin stats" on admin_stats
  for select using (can_access_admin());

-- 25. Create view for user dashboard stats
create or replace view user_stats as
select
  auth.uid() as user_id,
  (select count(*) from listings where owner_id = auth.uid()) as user_listings,
  (select count(*) from listings where owner_id = auth.uid() and status = 'Live') as live_user_listings,
  (select count(*) from favorites where user_id = auth.uid()) as user_favorites,
  (select count(*) from reviews where user_id = auth.uid()) as user_reviews,
  (select count(*) from claims where user_id = auth.uid()) as user_claims;

-- 26. Create policy for user stats view
create policy "Users can view own stats" on user_stats
  for select using (auth.uid() = user_id);

-- RLS policies setup complete!
-- Database is now secure and ready for production
