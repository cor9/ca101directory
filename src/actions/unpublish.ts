"use server";

import { currentUser } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
};

export async function unpublish(itemId: string): Promise<ServerActionResponse> {
  console.log("unpublish, itemId:", itemId);
  try {
    const user = await currentUser();
    if (!user) {
      return { status: "error", message: "Unauthorized" };
    }

    const supabase = createServerClient();

    // Check if the user owns this listing
    const { data: listing, error: fetchError } = await supabase
      .from("listings")
      .select("owner_id, status")
      .eq("id", itemId)
      .single();

    if (fetchError || !listing) {
      return { status: "error", message: "Item not found!" };
    }

    if (listing.owner_id !== user.id) {
      return { status: "error", message: "You are not allowed to do this!" };
    }

    // Update the listing status to Draft
    const { data: result, error: updateError } = await supabase
      .from("listings")
      .update({
        status: "Draft",
        updated_at: new Date().toISOString(),
      })
      .eq("id", itemId)
      .select()
      .single();

    if (updateError || !result) {
      return { status: "error", message: "Failed to unpublish item!" };
    }

    // Revalidate paths to show updated data
    revalidatePath("/dashboard");
    revalidatePath(`/item/${itemId}`);

    return { status: "success", message: "Item unpublished!" };
  } catch (error) {
    console.log("unpublish, error", error);
    return { status: "error", message: "Failed to unpublish item!" };
  }
}
