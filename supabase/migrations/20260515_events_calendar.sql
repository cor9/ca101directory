-- Industry Calendar / Events MVP

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  title text not null,
  slug text unique,
  event_type text,
  category text,
  description text,
  short_description text,
  audience text,
  age_min int,
  age_max int,
  price_type text default 'paid',
  price_amount numeric,
  price_display text,
  event_url text,
  registration_url text,
  is_online boolean default false,
  location_name text,
  address text,
  city text,
  state text,
  zip text,
  country text default 'United States',
  start_date date not null,
  end_date date,
  start_time time,
  end_time time,
  timezone text default 'America/Los_Angeles',
  image_url text,
  status text default 'pending',
  rejection_reason text,
  is_featured boolean default false,
  featured_until timestamptz,
  boost_level text default 'none',
  boost_starts_at timestamptz,
  boost_ends_at timestamptz,
  submitted_at timestamptz default now(),
  approved_at timestamptz,
  approved_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint events_status_check check (
    status in ('draft', 'pending', 'approved', 'rejected', 'expired', 'cancelled')
  ),
  constraint events_price_type_check check (
    price_type in ('free', 'paid', 'donation', 'varies')
  ),
  constraint events_boost_level_check check (
    boost_level in ('none', 'featured', 'homepage', 'newsletter', 'premium')
  ),
  constraint events_age_check check (
    (age_min is null or age_min >= 0)
    and (age_max is null or age_max <= 21)
    and (age_min is null or age_max is null or age_min <= age_max)
  ),
  constraint events_date_check check (
    end_date is null or end_date >= start_date
  )
);

create index if not exists events_listing_id_idx
on public.events(listing_id);

create index if not exists events_status_idx
on public.events(status);

create index if not exists events_start_date_idx
on public.events(start_date);

create index if not exists events_category_idx
on public.events(category);

create index if not exists events_city_state_idx
on public.events(city, state);

create index if not exists events_featured_idx
on public.events(is_featured, featured_until);

create index if not exists events_active_listing_idx
on public.events(listing_id, status, start_date, end_date)
where status in ('pending', 'approved');

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_events_updated_at on public.events;
create trigger set_events_updated_at
before update on public.events
for each row
execute function public.set_updated_at();

create or replace function public.active_event_count_for_listing(p_listing_id uuid)
returns integer
language sql
stable
as $$
  select count(*)::integer
  from public.events
  where listing_id = p_listing_id
    and status in ('pending', 'approved')
    and (
      (end_date is null and start_date >= current_date)
      or (end_date >= current_date)
    );
$$;

alter table public.events enable row level security;

drop policy if exists "Public can read approved events" on public.events;
create policy "Public can read approved events"
on public.events
for select
using (
  status = 'approved'
  and (
    (end_date is null and start_date >= current_date)
    or (end_date >= current_date)
  )
);

drop policy if exists "Listing owners can read their events" on public.events;
create policy "Listing owners can read their events"
on public.events
for select
to authenticated
using (
  created_by = (select auth.uid())
  or exists (
    select 1
    from public.listings
    where listings.id = events.listing_id
      and listings.owner_id = (select auth.uid())
  )
);

drop policy if exists "Listing owners can create events" on public.events;
create policy "Listing owners can create events"
on public.events
for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and exists (
    select 1
    from public.listings
    where listings.id = events.listing_id
      and listings.owner_id = (select auth.uid())
  )
);

drop policy if exists "Listing owners can update draft or pending events" on public.events;
create policy "Listing owners can update draft or pending events"
on public.events
for update
to authenticated
using (
  status in ('draft', 'pending', 'rejected')
  and exists (
    select 1
    from public.listings
    where listings.id = events.listing_id
      and listings.owner_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.listings
    where listings.id = events.listing_id
      and listings.owner_id = (select auth.uid())
  )
);

drop policy if exists "Admins can manage events" on public.events;
create policy "Admins can manage events"
on public.events
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
  )
);
