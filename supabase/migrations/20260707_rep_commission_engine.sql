-- Sprint 2: Rep Commission Engine & Stripe Attribution
-- Approved DDL per sprint-2-implementation-spec.md (revised for Free+Pro pricing).
-- NOT APPLIED by the executor: no MCP access to the ca101directory Supabase
-- project was available in this session. Apply via `supabase db push` or the
-- Supabase dashboard SQL editor before Sprint 2's webhook/checkout work ships.

-- 1. rep_codes: human-friendly attribution codes
create table rep_codes (
  code        text primary key check (code ~ '^[a-z0-9-]{3,24}$'),
  rep_id      uuid not null references profiles(id),
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- 2. rep_assignments: who is working which listing
create table rep_assignments (
  id          uuid primary key default gen_random_uuid(),
  rep_id      uuid not null references profiles(id),
  listing_id  uuid not null references listings(id),
  status      text not null default 'active'
              check (status in ('active','released','converted')),
  assigned_at timestamptz not null default now(),
  released_at timestamptz
);
-- exactly one active assignment per listing:
create unique index one_active_assignment_per_listing
  on rep_assignments (listing_id) where (status = 'active');

-- 3. rep_commissions: the money ledger (append-mostly)
create table rep_commissions (
  id                 uuid primary key default gen_random_uuid(),
  rep_id             uuid not null references profiles(id),
  listing_id         uuid not null,
  stripe_event_id    text not null unique,        -- idempotency key
  stripe_session_id  text not null,
  stripe_subscription_id text,                    -- correlates future renewal
                                                   -- events back to this row;
                                                   -- nullable now, always
                                                   -- populated going forward
                                                   -- since checkout is
                                                   -- subscription-mode
  plan               text not null check (plan = 'pro'),  -- only paid plan
  sale_type          text not null default 'new_sale'
                     check (sale_type in ('new_sale','renewal')),
                     -- always 'new_sale' this sprint; column exists now so
                     -- the renewal sprint (2b) doesn't need another migration
  sale_amount_cents  integer not null check (sale_amount_cents >= 0),
  tier_rate          numeric(5,4) not null,       -- snapshot, e.g. 0.2500
  amount_cents       integer not null,            -- may be negative for adjustments
  kind               text not null default 'commission'
                     check (kind in ('commission','adjustment')),
  status             text not null default 'pending'
                     check (status in ('pending','approved','paid','clawed_back')),
  attribution_source text not null check (attribution_source in ('assignment','link')),
  attribution_note   text,
  created_at         timestamptz not null default now(),
  status_changed_at  timestamptz not null default now()
);

alter table rep_codes enable row level security;
alter table rep_assignments enable row level security;
alter table rep_commissions enable row level security;
-- no policies created: deny-all except service role, per architecture decision
