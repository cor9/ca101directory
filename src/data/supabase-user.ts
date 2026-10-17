import { pickUserUpdatableFields } from "@/lib/auth/user-updatable-fields";
import { createServerClient } from "@/lib/supabase";

// SECURITY FIX (recovery audit, Phase 1B Task 6): this module used the
// anonymous Supabase client, which always runs as Postgres role `anon`
// regardless of the signed-in NextAuth session. RLS on `profiles`
// restricts SELECT/UPDATE to `auth.uid() = id`, which is never true for
// an anon-role request, so getUserById/getUserByEmail always returned
// null and updateUser always failed — e.g. settings()/updateUserName()
// in actions/settings.ts and actions/update-name.ts always reported
// "User not found" for every vendor and parent trying to update their
// display name. Every call site in this module scopes its own query by
// an ID or email it already has (the current session's own id, or an
// email supplied for a pre-auth duplicate/token check in
// register.ts/new-verification.ts) — none of it is arbitrary
// client-controlled access to another user's row.
const supabase = createServerClient();

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: "parent" | "vendor" | "admin";
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
}

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      console.error("getUserByEmail error:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("getUserByEmail error:", error);
    return null;
  }
};

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("getUserById error:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("getUserById error:", error);
    return null;
  }
};

export const createUser = async (userData: {
  id: string;
  email: string;
  name: string;
  role?: "parent" | "vendor" | "admin";
}): Promise<User | null> => {
  try {
    // The database trigger 'handle_new_user' automatically creates profiles
    // when auth.users records are created. Since the profile is created by the trigger,
    // we just need to return a success result. The trigger handles everything.

    console.log(
      "Profile creation handled by database trigger for user:",
      userData.id,
    );

    // Return a minimal user object to indicate success
    // We can't query the profile during registration due to RLS restrictions
    return {
      id: userData.id,
      email: userData.email,
      full_name: userData.name,
      role: userData.role || "parent",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      avatar_url: null,
      stripe_customer_id: null,
      link: null,
      subscription_plan: null,
      billing_cycle: null,
    } as User;
  } catch (error) {
    console.error("createUser error:", error);
    return null;
  }
};

// Independent follow-up audit, Task 1: updateUser() took an arbitrary
// `updates: Partial<User>` with no field allowlist of its own — it fully
// trusted every caller to never pass `role` (a privilege field also
// present on the `User` type this function is typed against) or an id
// belonging to someone other than the session's own user. Both of
// today's callers (actions/settings.ts, actions/update-name.ts) already
// only ever pass {full_name} for the current session's own id, so this
// is defense in depth, not a fix for an exploited path — but the
// function itself should not rely on every future caller getting that
// right by convention. See lib/auth/user-updatable-fields.ts for the
// allowlist itself (extracted so it's unit-testable).
export const updateUser = async (
  userId: string,
  updates: Partial<User>,
): Promise<User | null> => {
  try {
    const allowedUpdates = pickUserUpdatableFields(updates);

    const { data, error } = await supabase
      .from("profiles")
      .update({
        ...allowedUpdates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("updateUser error:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("updateUser error:", error);
    return null;
  }
};
