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
    // Note: The database trigger 'handle_new_user' automatically creates profiles
    // when auth.users records are created. This function checks if the profile exists
    // and creates it only if missing (for edge cases where trigger didn't fire).
    
    // First, check if profile already exists
    const existingProfile = await getUserById(userData.id);
    if (existingProfile) {
      console.log("Profile already exists for user:", userData.id);
      return existingProfile;
    }

    // Profile doesn't exist, create it with correct column name
    const { data, error } = await supabase
      .from("profiles")
      .insert([
        {
          id: userData.id,
          email: userData.email,
          full_name: userData.name, // Use full_name to match database schema
          role: userData.role || "parent",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("createUser error:", error);
      return null;
    }

    return data;
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
