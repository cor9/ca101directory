import { supabase } from "@/lib/supabase";

/**
 * Fetch ALL listings for a specific user (for dashboard)
 * @param userId - The user's ID
 * @returns Array of ALL listings owned by the user (regardless of status)
 */
export async function fetchUserListings(userId: string) {
  try {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("fetchUserListings error:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("fetchUserListings error:", error);
    return [];
  }
}

/**
 * Check if a user has any listings
 * @param userId - The user's ID
 * @returns Boolean indicating if user has listings
 */
export async function userHasListings(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("listings")
      .select("id")
      .eq("owner_id", userId)
      .eq("active", true)
      .limit(1);

    if (error) {
      console.error("userHasListings error:", error);
      return false;
    }

    return (data && data.length > 0) || false;
  } catch (error) {
    console.error("userHasListings error:", error);
    return false;
  }
}
