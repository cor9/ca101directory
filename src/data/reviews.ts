import type { Listing } from "@/data/listings";
import { supabase } from "@/lib/supabase";

export interface Review {
  id: string;
  listing_id: string;
  user_id: string;
  stars: number;
  text: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  listing?: Listing;
}

/**
 * Get all reviews for a listing (approved only)
 */
export async function getListingReviews(listingId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      *,
      user:profiles(id, email, name)
    `)
    .eq("listing_id", listingId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching listing reviews:", error);
    throw error;
  }

  return data as Review[];
}

/**
 * Get all reviews for a user
 */
export async function getUserReviews(userId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      *,
      listing:listings_public(*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user reviews:", error);
    throw error;
  }

  return data as Review[];
}

/**
 * Get pending reviews for admin moderation
 */
export async function getPendingReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      *,
      user:profiles(id, email, name),
      listing:listings_public(*)
    `)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching pending reviews:", error);
    throw error;
  }

  return data as Review[];
}

/**
 * Submit a new review
 */
export async function submitReview(
  listingId: string,
  userId: string,
  stars: number,
  text: string,
): Promise<Review> {
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      listing_id: listingId,
      user_id: userId,
      stars,
      text,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("Error submitting review:", error);
    throw error;
  }

  return data as Review;
}

/**
 * Update review status (admin only)
 */
export async function updateReviewStatus(
  reviewId: string,
  status: "approved" | "rejected",
): Promise<void> {
  const { error } = await supabase
    .from("reviews")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", reviewId);

  if (error) {
    console.error("Error updating review status:", error);
    throw error;
  }
}

/**
 * Get average rating for a listing
 */
export async function getListingAverageRating(listingId: string): Promise<{
  average: number;
  count: number;
}> {
  const { data, error } = await supabase
    .from("reviews")
    .select("stars")
    .eq("listing_id", listingId)
    .eq("status", "approved");

  if (error) {
    console.error("Error fetching listing rating:", error);
    throw error;
  }

  if (!data || data.length === 0) {
    return { average: 0, count: 0 };
  }

  const total = data.reduce((sum, review) => sum + review.stars, 0);
  const average = total / data.length;

  return {
    average: Math.round(average * 10) / 10, // Round to 1 decimal place
    count: data.length,
  };
}

/**
 * Check if user has already reviewed a listing
 */
export async function hasUserReviewed(
  userId: string,
  listingId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("reviews")
    .select("id")
    .eq("user_id", userId)
    .eq("listing_id", listingId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "not found" error, which is expected
    console.error("Error checking review status:", error);
    throw error;
  }

  return !!data;
}
