-- SUPABASE MIGRATION: Create views to normalize Airtable column names
-- Run this in Supabase SQL Editor

-- VIEWS: give the frontend clean, snake_case fields while your tables keep the Airtable headers

create or replace view listings_public as
select
  id,
  "Listing Name"                               as listing_name,
  "What You Offer?"                            as what_you_offer,
  "Who Is It For?"                             as who_is_it_for,
  "Why Is It Unique?"                          as why_is_it_unique,
  "Format (In-person/Online/Hybrid)"           as format,
  "Extras/Notes"                               as extras_notes,
  "California Child Performer Services Permit " as ca_performer_permit,
  "Bonded For Advanced Fees"                   as bonded_for_advanced_fees,
  "Bond#"                                      as bond_number,
  "Website"                                    as website,
  "Email"                                      as email,
  "Phone"                                      as phone,
  "Region"                                     as region,
  "City"                                       as city,
  "State"                                      as state,
  "Zip"                                        as zip,
  "Age Range"                                  as age_range,
  "Categories"                                 as categories,
  -- The Airtable badge column had quote/number issues; if you renamed it, alias it here
  coalesce(nullif("Approved 101 Badge", ''), null) as approved_101_badge,
  "Profile Image"                              as profile_image,
  "Stripe Plan ID"                             as stripe_plan_id,
  "Plan"                                       as plan,
  "Active"                                     as active,
  "Claimed?"                                   as claimed,
  "Claimed by? (Email)"                        as claimed_by_email,
  "Date Claimed"                               as date_claimed,
  "Verification Status"                        as verification_status,
  "Gallery"                                    as gallery,
  "Plan."                                      as plan_dot,
  "Submissions"                                as submissions,
  "Status"                                     as status
from listings;

create or replace view plans_public as
select
  id,
  "Plan"              as plan,
  "Monthly Price"     as monthly_price,
  "Annual Price"      as annual_price,
  "Semi Annual Price" as semi_annual_price,
  "Listings"          as listings,
  "Stripe Plan ID"    as stripe_plan_id,
  "Listings 2"        as listings_2
from plans;

create or replace view categories_public as
select
  id,
  "Category Name" as category_name
from categories;

create or replace view submissions_public as
select
  id,
  coalesce("listing_name","Listing Name")       as listing_name,
  coalesce("status","Status")                   as status,
  coalesce("Form Submitted", null)              as form_submitted,
  coalesce("Reviewed", null)                    as reviewed,
  coalesce("Approved", null)                    as approved,
  coalesce("Converted Paid Listing", null)      as converted_paid_listing
from submissions;

create or replace view vendor_suggestions_public as
select
  id,
  "Vendor Name"  as vendor_name,
  "Website"      as website,
  "Category"     as category,
  "City"         as city,
  "State"        as state,
  "Region"       as region,
  "Notes"        as notes,
  "Suggested By" as suggested_by,
  "Status"       as status,
  "Created Time" as created_time
from vendor_suggestions;

-- Minimal indexes for common filters
create index if not exists idx_listings_public_state  on listings ("State");
create index if not exists idx_listings_public_city   on listings ("City");
create index if not exists idx_listings_public_region on listings ("Region");
create index if not exists idx_listings_public_status on listings ("Status");

-- RLS: allow read for everyone; writes are restricted
alter table listings enable row level security;
alter table plans enable row level security;
alter table categories enable row level security;
alter table submissions enable row level security;
alter table vendor_suggestions enable row level security;

-- Read-only to everyone (the views read from these tables)
create policy "read_listings_all" on listings for select using (true);
create policy "read_plans_all" on plans for select using (true);
create policy "read_categories_all" on categories for select using (true);
create policy "read_submissions_all" on submissions for select using (true);
create policy "read_vendor_suggestions_all" on vendor_suggestions for select using (true);

-- Allow authenticated to insert vendor suggestions / submissions
create policy "insert_vendor_suggestions_auth" on vendor_suggestions
  for insert to authenticated with check (true);

create policy "insert_submissions_auth" on submissions
  for insert to authenticated with check (true);

-- Allow vendors to update ONLY their claimed listing by email (quick win)
-- If column "Claimed by? (Email)" isn't populated yet, this will effectively block updates.
create policy "update_own_listing_by_email" on listings
  for update to authenticated
  using ("Claimed by? (Email)" = auth.jwt()->>'email')
  with check ("Claimed by? (Email)" = auth.jwt()->>'email');

-- Add slug column for better routing (nice-to-have)
alter table listings add column if not exists slug text;
update listings set slug = lower(regexp_replace("Listing Name", '[^a-zA-Z0-9]+', '-', 'g'));
create index if not exists idx_listings_slug on listings (slug);
