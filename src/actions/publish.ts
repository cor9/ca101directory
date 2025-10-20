"use server";

import { createServerClient } from "@/lib/supabase";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
};

export async function publish(itemId: string): Promise<ServerActionResponse> {
  console.log("publish, itemId:", itemId);
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

    // Update the listing status to Live
    const { data: result, error: updateError } = await supabase
      .from("listings")
      .update({
        status: "Live",
        updated_at: new Date().toISOString(),
      })
      .eq("id", itemId)
      .select()
      .single();

    if (updateError || !result) {
      return { status: "error", message: "Failed to publish item!" };
    }

    // Revalidate paths to show updated data
    revalidatePath("/dashboard");
    revalidatePath(`/item/${itemId}`);

    return { status: "success", message: "Successfully published!" };
  } catch (error) {
    console.log("publish, error", error);
    return { status: "error", message: "Failed to publish item!" };
  }
}
