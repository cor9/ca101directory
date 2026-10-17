import type { User } from "@/data/supabase-user";

/**
 * Fields a profile owner may change through updateUser() in
 * data/supabase-user.ts. Everything else on `User` — in particular
 * `role`, a privilege field the same interface happens to declare — is
 * dropped from the update payload regardless of what's passed in.
 *
 * Extracted so this allowlist can be unit tested directly (unlike
 * data/supabase-user.ts's updateUser, which talks to a module-level
 * Supabase client with no injection seam) — see
 * scripts/test-vendor-authorization.ts.
 */
export const USER_UPDATABLE_FIELDS = [
  "full_name",
] as const satisfies readonly (keyof User)[];

export function pickUserUpdatableFields(updates: Partial<User>): Partial<User> {
  const allowed: Partial<User> = {};
  for (const field of USER_UPDATABLE_FIELDS) {
    if (field in updates) {
      allowed[field] = updates[field];
    }
  }
  return allowed;
}
