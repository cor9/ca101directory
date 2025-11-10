"use server";

import { sendDiscordNotification } from "@/lib/discord";
import { sendApprovalEmail, sendRejectionEmail } from "@/lib/mail";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function approveListing(listingId: string) {
  try {
    const supabase = createServerActionClient({ cookies });

    const { error } = await supabase
      .from("listings")
      .update({ status: "Live" })
      .eq("id", listingId);

    if (error) throw error;

    revalidatePath("/dashboard/admin/listings");
    revalidatePath("/");
    revalidatePath("/directory");

    // Notify vendor (non-blocking)
    try {
      const { data: listing } = await supabase
        .from("listings")
        .select("listing_name, owner_id")
        .eq("id", listingId)
        .single();

      if (listing?.owner_id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("email, name")
          .eq("id", listing.owner_id)
          .single();

        if (profile?.email) {
          const userName = profile.name || profile.email.split("@")[0];
          const itemLink = `${process.env.NEXT_PUBLIC_APP_URL}/listing/${listingId}`;
          await sendApprovalEmail(userName, profile.email, itemLink);

          // Discord notification
          sendDiscordNotification("✅ Listing Approved", [
            {
              name: "Listing",
              value: listing.listing_name || listingId,
              inline: true,
            },
            { name: "Listing ID", value: `\`${listingId}\``, inline: true },
            { name: "Owner", value: profile.email, inline: true },
          ]).catch((e) =>
            console.warn("Discord approval notification failed:", e),
          );
        }
      }
    } catch (notifyErr) {
      console.warn("Failed to send approval notifications:", notifyErr);
    }

    return { success: true, message: "Listing approved successfully" };
  } catch (error) {
    console.error("Error approving listing:", error);
    return { success: false, message: "Failed to approve listing" };
  }
}

export async function rejectListing(listingId: string) {
  try {
    const supabase = createServerActionClient({ cookies });

    const { error } = await supabase
      .from("listings")
      .update({ status: "Rejected" })
      .eq("id", listingId);

    if (error) throw error;

    revalidatePath("/dashboard/admin/listings");

    // Notify vendor (non-blocking)
    try {
      const { data: listing } = await supabase
        .from("listings")
        .select("listing_name, owner_id")
        .eq("id", listingId)
        .single();

      if (listing?.owner_id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("email, name")
          .eq("id", listing.owner_id)
          .single();

        if (profile?.email) {
          const userName = profile.name || profile.email.split("@")[0];
          const dashboardLink = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/vendor`;
          await sendRejectionEmail(userName, profile.email, dashboardLink);

          // Discord notification
          sendDiscordNotification("❌ Listing Rejected", [
            {
              name: "Listing",
              value: listing.listing_name || listingId,
              inline: true,
            },
            { name: "Listing ID", value: `\`${listingId}\``, inline: true },
            { name: "Owner", value: profile.email, inline: true },
          ]).catch((e) =>
            console.warn("Discord rejection notification failed:", e),
          );
        }
      }
    } catch (notifyErr) {
      console.warn("Failed to send rejection notifications:", notifyErr);
    }

    return { success: true, message: "Listing rejected successfully" };
  } catch (error) {
    console.error("Error rejecting listing:", error);
    return { success: false, message: "Failed to reject listing" };
  }
}
