import { supabase } from "@/lib/supabase";

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

export const updateUser = async (
  userId: string,
  updates: Partial<User>,
): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        ...updates,
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
