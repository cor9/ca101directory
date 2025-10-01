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
    throw error;
  }

  return data as Favorite[];
}

/**
 * Check if a listing is favorited by a user
 */
export async function isListingFavorited(
  userId: string,
  listingId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("listing_id", listingId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "not found" error, which is expected
    console.error("Error checking favorite status:", error);
    throw error;
  }

  return !!data;
}

/**
 * Add a listing to favorites
 */
export async function addToFavorites(
  userId: string,
  listingId: string,
): Promise<void> {
  const { error } = await supabase.from("favorites").insert({
    user_id: userId,
    listing_id: listingId,
  });

  if (error) {
    console.error("Error adding to favorites:", error);
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
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("listing_id", listingId);

  if (error) {
    console.error("Error removing from favorites:", error);
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
  const isFavorited = await isListingFavorited(userId, listingId);

  if (isFavorited) {
    await removeFromFavorites(userId, listingId);
    return false;
  }

  await addToFavorites(userId, listingId);
  return true;
}
