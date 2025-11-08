"use server";

import { auth } from "@/auth";
import { createServerClient } from "@/lib/supabase";
import { sendListingLiveEmail } from "@/lib/mail";
import { createClaimToken, createOptOutToken } from "@/lib/tokens";

export async function bulkResendClaimEmailsToHeadshotPhotographers() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    return { success: false, message: "Admin authentication required" };
  }

  const supabase = createServerClient();

  // Get all listings with "Headshot Photographers" category that have emails
  // Use Supabase array contains operator for better performance
  const { data: listings, error } = await supabase
    .from("listings")
    .select("id, listing_name, email, slug, categories")
    .not("email", "is", null)
    .neq("email", "")
    .contains("categories", ["Headshot Photographers"])
    .order("listing_name");

  if (error) {
    return { success: false, message: `Error fetching listings: ${error.message}` };
  }

  if (!listings || listings.length === 0) {
    return { success: false, message: "No Headshot Photographers listings found" };
  }

  const results = {
    sent: 0,
    failed: 0,
    skipped: 0,
    errors: [] as string[],
  };

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://directory.childactor101.com";

  for (const listing of listings) {
    const email = (listing.email || "").trim();

    if (!email) {
      results.skipped++;
      results.errors.push(`${listing.listing_name}: No email address`);
      continue;
    }

    try {
      const slug = listing.slug || (listing.listing_name || "")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      const claimUrl = `${siteUrl}/claim/${encodeURIComponent(createClaimToken(listing.id))}?lid=${encodeURIComponent(listing.id)}`;
      const upgradeUrl = `${siteUrl}/claim-upgrade/${encodeURIComponent(slug)}?lid=${encodeURIComponent(listing.id)}&utm_source=email&utm_medium=listing_live`;
      const manageUrl = `${siteUrl}/dashboard/vendor?lid=${encodeURIComponent(listing.id)}`;
      const optOutUrl = `${siteUrl}/remove/${encodeURIComponent(createOptOutToken(listing.id))}?lid=${encodeURIComponent(listing.id)}`;

      await sendListingLiveEmail({
        vendorName: listing.listing_name || "",
        vendorEmail: email,
        listingName: listing.listing_name || "",
        slug,
        listingId: listing.id,
        claimUrl,
        upgradeUrl,
        manageUrl,
        optOutUrl,
      });

      results.sent++;
    } catch (error: any) {
      results.failed++;
      results.errors.push(`${listing.listing_name}: ${error.message}`);
    }
  }

  return {
    success: true,
    message: `Sent ${results.sent} claim emails, ${results.failed} failed, ${results.skipped} skipped`,
    details: {
      total: listings.length,
      sent: results.sent,
      failed: results.failed,
      skipped: results.skipped,
      errors: results.errors,
    },
  };
}

