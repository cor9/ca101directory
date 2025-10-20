"use server";

import { createServerClient } from "@/lib/supabase";
import { currentUser } from "@/lib/auth";
import type { SUPPORT_ITEM_ICON } from "@/lib/constants";
import { sendNotifySubmissionEmail } from "@/lib/mail";
import { EditSchema } from "@/lib/schemas";
import { FreePlanStatus, PricePlans } from "@/lib/submission";
import {
  getItemLinkInStudio,
  getItemStatusLinkInWebsite,
  slugify,
} from "@/lib/utils";
import { revalidatePath } from "next/cache";


type BaseEditFormData = {
  id: string;
  name: string;
  link: string;
  description: string;
  introduction: string;
  tags: string[];
  categories: string[];
  imageId: string;
  pricePlan: string;
  planStatus: string;
};

export type EditFormData = typeof SUPPORT_ITEM_ICON extends true
  ? BaseEditFormData & { iconId: string }
  : BaseEditFormData;

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
};

/**
 * https://nextjs.org/learn/dashboard-app/mutating-data
 */
export async function edit(
  formData: EditFormData,
): Promise<ServerActionResponse> {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: "error", message: "Unauthorized" };
    }
    console.log("edit, user:", user);

    // Parse and validate the form data
    const {
      id,
      name,
      link,
      description,
      introduction,
      imageId,
      tags,
      categories,
      pricePlan,
      planStatus,
      ...rest
    } = EditSchema.parse(formData);
    const iconId = "iconId" in rest ? rest.iconId : undefined;
    console.log("edit, name:", name, "link:", link);

    const supabase = createServerClient();

    // Check if the user owns this listing
    const { data: listing, error: fetchError } = await supabase
      .from("listings")
      .select("owner_id, status")
      .eq("id", id)
      .single();

    if (fetchError || !listing) {
      return { status: "error", message: "Item not found!" };
    }

    if (listing.owner_id !== user.id) {
      return { status: "error", message: "You are not allowed to do this!" };
    }

    // Prepare update data for Supabase
    const updateData = {
      listing_name: name,
      website: link,
      what_you_offer: description,
      who_is_it_for: introduction,
      profile_image: imageId,
      tags: tags || [],
      categories: categories || [],
      plan: pricePlan,
      // Free plan: update item leads to be unpublished and reviewed again
      // remain submitted if the plan status is submitted, otherwise set to pending
      ...(pricePlan === PricePlans.FREE && {
        status: planStatus === FreePlanStatus.SUBMITTING
          ? "Pending"
          : "Pending",
      }),
      updated_at: new Date().toISOString(),
    };

    console.log("edit, updating data:", updateData);

    // Update the listing in Supabase
    const { data: res, error: updateError } = await supabase
      .from("listings")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateError || !res) {
      console.log("edit, fail:", updateError);
      return { status: "error", message: "Failed to update item" };
    }

    console.log("edit, success, res:", res);

    // Send notify email to admin and user for free plan updates
    if (pricePlan === PricePlans.FREE) {
      const statusLink = getItemStatusLinkInWebsite(id);
      const reviewLink = getItemLinkInStudio(id);
      sendNotifySubmissionEmail(
        user.name || user.email || "User",
        user.email,
        name,
        statusLink,
        reviewLink,
      );
    }

    // Revalidate paths to show updated data
    revalidatePath(`/edit/${id}`);
    revalidatePath(`/item/${slugify(name)}`);
    return { status: "success", message: "Successfully updated item" };
  } catch (error) {
    console.log("edit, error", error);
    return { status: "error", message: "Failed to update item" };
  }
}
