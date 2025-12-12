"use server";

import { currentUser } from "@/lib/auth";
import { sendNotifySubmissionEmail } from "@/lib/mail";
import { FreePlanStatus, PricePlans } from "@/lib/submission";
import { createServerClient } from "@/lib/supabase";
import { getItemLinkInStudio, getItemStatusLinkInWebsite } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
};

export const submitToReview = async (
  itemId: string,
): Promise<ServerActionResponse> => {
  console.log("submitToReview, itemId:", itemId);
  try {
    const user = await currentUser();
    if (!user) {
      return { status: "error", message: "Unauthorized" };
    }

    const supabase = createServerClient();

    // Check if the user owns this listing
    const { data: listing, error: fetchError } = await supabase
      .from("listings")
      .select("owner_id, status, plan")
      .eq("id", itemId)
      .single();

    if (fetchError || !listing) {
      return { status: "error", message: "Item not found!" };
    }

    if (listing.owner_id !== user.id) {
      return { status: "error", message: "You are not allowed to do this!" };
    }

    if (listing.plan !== PricePlans.FREE || listing.status !== "Draft") {
      return { status: "error", message: "Item is not in right plan status!" };
    }

    // Update the listing status to Pending for review
    const { data: result, error: updateError } = await supabase
      .from("listings")
      .update({
        status: "Pending",
        updated_at: new Date().toISOString(),
      })
      .eq("id", itemId)
      .select()
      .single();

    if (updateError || !result) {
      return { status: "error", message: "Failed to submit item to review!" };
    }

    // Send notification email
    const statusLink = getItemStatusLinkInWebsite(itemId);
    const reviewLink = getItemLinkInStudio(itemId);
    sendNotifySubmissionEmail(
      user.name || user.email || "User",
      user.email,
      result.listing_name,
      statusLink,
      reviewLink,
    );

    // Revalidate paths to show updated data
    revalidatePath("/dashboard");
    revalidatePath(`/item/${itemId}`);

    return { status: "success", message: "Item submitted to review!" };
  } catch (error) {
    console.log("submitToReview, error", error);
    return { status: "error", message: "Failed to submit item to review!" };
  }
};
