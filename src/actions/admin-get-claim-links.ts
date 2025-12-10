"use server";

import { auth } from "@/auth";
import { createServerClient } from "@/lib/supabase";
import { createClaimToken, createOptOutToken } from "@/lib/tokens";

export async function adminGetClaimLinks(listingId: string) {
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

  let token: string | null = null;
  try {
    token = createClaimToken(data.id);
  } catch (e) {
    console.error("adminGetClaimLinks: claim token unavailable", e);
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://directory.childactor101.com";
  const slug = (data.listing_name || "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const claimUrl = token
    ? `${siteUrl}/claim/${encodeURIComponent(token)}?lid=${encodeURIComponent(data.id)}`
    : `${siteUrl}/claim-upgrade/${encodeURIComponent(slug)}?lid=${encodeURIComponent(data.id)}`;

  const upgradeUrl = `${siteUrl}/claim-upgrade/${encodeURIComponent(slug)}?lid=${encodeURIComponent(data.id)}&utm_source=email&utm_medium=listing_live`;
  const manageUrl = `${siteUrl}/dashboard/vendor?lid=${encodeURIComponent(data.id)}`;

  let optOutUrl = `${siteUrl}/support`;
  try {
    optOutUrl = `${siteUrl}/remove/${encodeURIComponent(createOptOutToken(data.id))}?lid=${encodeURIComponent(data.id)}`;
  } catch (e) {
    console.error("adminGetClaimLinks: opt-out token unavailable", e);
  }

  return {
    success: true,
    links: {
      claimUrl,
      upgradeUrl,
      manageUrl,
      optOutUrl,
    },
    listing: {
      id: data.id,
      name: data.listing_name || "",
      email: data.email || "",
      slug,
    },
  };
}
