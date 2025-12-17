-- Add listing_type enum + column to listings table
-- Run this on your CA101 Directory Supabase project

-- 1) Create enum type (idempotent)
do $$ begin
  create type public.listing_type as enum (
    'SERVICE_VENDOR',
    'INDUSTRY_PRO',
    'REGULATED_PRO'
  );
exception
  when duplicate_object then null;
end $$;

-- 2) Add column (default SERVICE_VENDOR)
alter table public.listings
add column if not exists listing_type public.listing_type not null default 'SERVICE_VENDOR';

comment on column public.listings.listing_type is
  'High-level listing type: SERVICE_VENDOR, INDUSTRY_PRO (agents/managers), REGULATED_PRO (set teachers/child advocates)';

-- 3) Backfill (best-effort)
-- Uses categories[] (TEXT[]) if present; falls back to no-op otherwise.
-- If your schema uses category_slug or a categories join table, adapt as needed.
update public.listings
set listing_type =
  case
    when categories @> array['Talent Agents']::text[]
      or categories @> array['Talent Managers']::text[]
      or categories @> array['Talent Agent']::text[]
      or categories @> array['Talent Manager']::text[]
      then 'INDUSTRY_PRO'::public.listing_type
    when categories @> array['Set Teachers']::text[]
      or categories @> array['Child Advocacy']::text[]
      then 'REGULATED_PRO'::public.listing_type
    else 'SERVICE_VENDOR'::public.listing_type
  end
where categories is not null;

-- 4) Index (for filtering)
create index if not exists listings_listing_type_idx
on public.listings (listing_type);


