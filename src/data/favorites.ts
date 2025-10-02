import type { Listing } from "@/data/listings";
import { supabase } from "@/lib/supabase";

export interface Favorite {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
  listing?: Listing;
}

/**
 * Get all favorites for a user
 */
export async function getUserFavorites(userId: string): Promise<Favorite[]> {
  try {
    const { data, error } = await supabase
      .from("favorites")
      .select(`
        *,
        listing:listings(*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user favorites:", error);
      // If table doesn't exist, return empty array
      if (error.code === "PGRST205") {
        console.warn("Favorites table not found, returning empty array");
        return [];
      }
      throw error;
    }

    return data as Favorite[];
  } catch (error) {
    console.error("Error in getUserFavorites:", error);
    return [];
  }
}

/**
 * Check if a listing is favorited by a user
 */
export async function isListingFavorited(
  userId: string,
  listingId: string,
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("listing_id", listingId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found" error, which is expected
      console.error("Error checking favorite status:", error);
      // If table doesn't exist, return false
      if (error.code === "PGRST205") {
        console.warn("Favorites table not found, returning false");
        return false;
      }
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error("Error in isListingFavorited:", error);
    return false;
  }
}

/**
 * Add a listing to favorites
 */
export async function addToFavorites(
  userId: string,
  listingId: string,
): Promise<void> {
  try {
    const { error } = await supabase.from("favorites").insert({
      user_id: userId,
      listing_id: listingId,
    });

    if (error) {
      console.error("Error adding to favorites:", error);
      // If table doesn't exist, throw a more user-friendly error
      if (error.code === "PGRST205") {
        throw new Error(
          "Favorites feature is not available yet. Please try again later.",
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Error in addToFavorites:", error);
    throw error;
  }
}

/**
 * Remove a listing from favorites
 */
export async function removeFromFavorites(
  userId: string,
  listingId: string,
): Promise<void> {
  try {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("listing_id", listingId);

    if (error) {
      console.error("Error removing from favorites:", error);
      // If table doesn't exist, throw a more user-friendly error
      if (error.code === "PGRST205") {
        throw new Error(
          "Favorites feature is not available yet. Please try again later.",
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Error in removeFromFavorites:", error);
    throw error;
  }
}

/**
 * Toggle favorite status for a listing
 */
export async function toggleFavorite(
  userId: string,
  listingId: string,
): Promise<boolean> {
  try {
    const isFavorited = await isListingFavorited(userId, listingId);

    if (isFavorited) {
      await removeFromFavorites(userId, listingId);
      return false;
    }

    await addToFavorites(userId, listingId);
    return true;
  } catch (error) {
    console.error("Error in toggleFavorite:", error);
    throw error;
  }
}
