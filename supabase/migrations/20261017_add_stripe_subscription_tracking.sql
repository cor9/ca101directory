-- Recovery audit, Phase 1C Task 7 (subscription lifecycle handling).
--
-- listings.plan is currently flipped to "Pro" by /api/webhook on
-- checkout.session.completed, but nothing records WHICH Stripe
-- subscription granted that Pro status. Without that, there's no way to
-- find the right listing to downgrade when the subscription is later
-- canceled or fails payment (customer.subscription.deleted/updated) --
-- those events carry a subscription id, not a listing id.
--
-- NOT YET APPLIED to the production project. This file only adds this
-- column once run (via the Supabase CLI, dashboard SQL editor, or
-- mcp__Supabase__apply_migration) -- see the recovery report for why
-- this wasn't applied automatically. The webhook code that reads/writes
-- this column (src/app/api/webhook/route.ts) checks for a Postgres
-- "column does not exist" error and no-ops the lifecycle handling (never
-- 500s / never blocks Pro fulfillment) until this migration has run, so
-- deploying the code ahead of the migration is safe.

alter table public.listings
  add column if not exists stripe_subscription_id text;

comment on column public.listings.stripe_subscription_id is
  'Stripe subscription id that granted this listing''s current Pro plan. '
  'Set by /api/webhook on checkout.session.completed; cleared when the '
  'subscription is canceled/unpaid so a stale id is never matched against '
  'a later, unrelated subscription.';

create index if not exists idx_listings_stripe_subscription_id
  on public.listings (stripe_subscription_id)
  where stripe_subscription_id is not null;
