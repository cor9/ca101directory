-- Migration: Role Selector at Signup
-- This updates the handle_new_user() function to read role from metadata
-- and adds role validation to the profiles table

-- Update the handle_new_user() function to read role from metadata
create or replace function public.handle_new_user()
returns trigger as $$
declare
  user_role text;
begin
  -- Get role from metadata, default to 'parent' if not provided
  user_role := coalesce(new.raw_user_meta_data->>'role', 'parent');

  insert into public.profiles (id, full_name, avatar_url, role, created_at, updated_at, email)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    user_role,
    now(),
    now(),
    new.email
  )
  on conflict (id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

-- Drop and recreate the trigger
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Add role validation constraint to profiles table
-- This ensures only valid roles can be stored
alter table public.profiles
add constraint role_check check (role in ('parent', 'vendor', 'admin'));

-- Optional: Add an index on role for better query performance
create index if not exists idx_profiles_role on public.profiles(role);
