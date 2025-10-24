"use server";

import { auth } from "@/auth";
import { createServerClient } from "@/lib/supabase";
import { sendListingLiveEmail } from "@/lib/mail";
import { createClaimToken, createOptOutToken } from "@/lib/tokens";

export async function adminResendClaimEmail(listingId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    return { success: false, message: "Admin authentication required" };
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("listings")
    .select("id, listing_name, email")
    .eq("id", listingId)
    .single();

  if (error || !data) {
    return { success: false, message: "Listing not found" };
  }

  const email = (data.email || "").trim();
  if (!email) {
    return { success: false, message: "Listing has no email" };
  }

  const token = createClaimToken(data.id);
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://directory.childactor101.com";
  const slug = (data.listing_name || "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const claimUrl = `${siteUrl}/claim/${encodeURIComponent(token)}?lid=${encodeURIComponent(data.id)}`;
  const upgradeUrl = `${siteUrl}/claim-upgrade/${encodeURIComponent(slug)}?lid=${encodeURIComponent(data.id)}&utm_source=email&utm_medium=listing_live`;
  const manageUrl = `${siteUrl}/dashboard/vendor?lid=${encodeURIComponent(data.id)}`;
  const optOutUrl = `${siteUrl}/remove/${encodeURIComponent(createOptOutToken(data.id))}?lid=${encodeURIComponent(data.id)}`;

  await sendListingLiveEmail({
    vendorName: data.listing_name || "",
    vendorEmail: email,
    listingName: data.listing_name || "",
    slug,
    listingId: data.id,
    claimUrl,
    upgradeUrl,
    manageUrl,
    optOutUrl,
  });

  return { success: true, message: "Claim email resent" };
}

