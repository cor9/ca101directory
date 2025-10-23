-- Support issues table for capturing user-reported problems
create table if not exists public.support_issues (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  user_email text,
  path text,
  message text not null,
  context jsonb,
  created_at timestamptz default now()
);

-- Optional: disable RLS if using service role to write
alter table public.support_issues enable row level security;

-- Allow service role to insert/select by default; policies can be extended later
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'support_issues' and policyname = 'support_issues_insert'
  ) then
    create policy support_issues_insert on public.support_issues for insert to service_role using (true) with check (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'support_issues' and policyname = 'support_issues_select'
  ) then
    create policy support_issues_select on public.support_issues for select to service_role using (true);
  end if;
end $$;


