"use server";

import { auth } from "@/auth";
import type { ReviewFormData } from "@/lib/schemas";
import { createClient } from "@/lib/supabase/server";

export async function submitReview(formData: ReviewFormData) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to submit a review.",
      };
    }

    // Only parents can submit reviews
    if (session.user.role !== "parent") {
      return {
        success: false,
        message: "Only parents can submit reviews.",
      };
    }

    const supabase = createClient();

    // Check if user has already reviewed this vendor
    const { data: existingReview } = await supabase
      .from("reviews")
      .select("id")
      .eq("vendor_id", formData.vendorId)
      .eq("parent_id", session.user.id)
      .single();

    if (existingReview) {
      return {
        success: false,
        message: "You have already reviewed this vendor.",
      };
    }

    // Insert the review
    const { data, error } = await supabase
      .from("reviews")
      .insert({
        vendor_id: formData.vendorId,
        parent_id: session.user.id,
        rating: formData.rating,
        comment: formData.comment,
        approved: false, // Requires admin approval
      })
      .select()
      .single();

    if (error) {
      console.error("Error submitting review:", error);
      return {
        success: false,
        message: "Failed to submit review. Please try again.",
      };
    }

    console.log("✅ Review submitted successfully:", data.id);

    return {
      success: true,
      message:
        "Thank you! Your review has been submitted and is pending approval.",
      reviewId: data.id,
    };
  } catch (error) {
    console.error("❌ Error submitting review:", error);

    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
