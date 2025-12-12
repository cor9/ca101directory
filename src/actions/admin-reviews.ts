"use server";

import { currentUser } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase";

/**
 * Update review status (approve/reject)
 * Admin only
 */
export async function updateReviewStatus(
  reviewId: string,
  status: "approved" | "rejected",
) {
  try {
    const user = await currentUser();

    // Verify admin access
    if (!user || user.role !== "admin") {
      return {
        success: false,
        error: "Unauthorized: Admin access required",
      };
    }

    const supabase = createServerClient();

    // Update review status
    const { error } = await supabase
      .from("reviews")
      .update({ status })
      .eq("id", reviewId);

    if (error) {
      console.error("Error updating review status:", error);
      return {
        success: false,
        error: "Failed to update review status",
      };
    }

    return {
      success: true,
      message: `Review ${status}`,
    };
  } catch (error) {
    console.error("Error in updateReviewStatus:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

/**
 * Delete a review permanently
 * Admin only
 */
export async function deleteReview(reviewId: string) {
  try {
    const user = await currentUser();

    // Verify admin access
    if (!user || user.role !== "admin") {
      return {
        success: false,
        error: "Unauthorized: Admin access required",
      };
    }

    const supabase = createServerClient();

    // Delete review
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId);

    if (error) {
      console.error("Error deleting review:", error);
      return {
        success: false,
        error: "Failed to delete review",
      };
    }

    return {
      success: true,
      message: "Review deleted",
    };
  } catch (error) {
    console.error("Error in deleteReview:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

/**
 * Get review statistics for admin dashboard
 * Admin only
 */
export async function getReviewStats() {
  try {
    const user = await currentUser();

    // Verify admin access
    if (!user || user.role !== "admin") {
      return {
        success: false,
        error: "Unauthorized: Admin access required",
      };
    }

    const supabase = createServerClient();

    // Get counts by status
    const { data: reviews, error } = await supabase
      .from("reviews")
      .select("status");

    if (error) {
      console.error("Error fetching review stats:", error);
      return {
        success: false,
        error: "Failed to fetch review statistics",
      };
    }

    const stats = {
      total: reviews?.length || 0,
      pending: reviews?.filter((r) => r.status === "pending").length || 0,
      approved: reviews?.filter((r) => r.status === "approved").length || 0,
      rejected: reviews?.filter((r) => r.status === "rejected").length || 0,
    };

    return {
      success: true,
      stats,
    };
  } catch (error) {
    console.error("Error in getReviewStats:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
