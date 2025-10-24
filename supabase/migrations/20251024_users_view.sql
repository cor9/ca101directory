-- Create a compatibility view `public.users` backed by `public.profiles`
-- This lets tools/queries use `users` to mean "everyone in the system"
-- without changing current app code that uses `profiles`.

do $$
begin
  -- If a base table named public.users exists, do NOT replace it.
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'users' and table_type = 'BASE TABLE'
  ) then
    raise notice 'public.users exists as a base table; skipping view creation.';
  else
    -- Create or replace the view. If an existing view is present, replace it.
    execute $$
      create or replace view public.users as
      select id, email, name, role, created_at, updated_at
      from public.profiles
    $$;

    -- Ensure read access via the view; RLS on profiles still applies.
    grant select on public.users to anon, authenticated;
  end if;
end $$;


