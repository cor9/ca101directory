"use server";

import { auth } from "@/auth";
import { createServerClient } from "@/lib/supabase";
import { sendListingLiveEmail } from "@/lib/mail";
import { createClaimToken, createOptOutToken } from "@/lib/tokens";

export async function bulkResendEmailsToNewListings() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    return { success: false, message: "Admin authentication required" };
  }

  const supabase = createServerClient();

  // Get listings updated on November 6, 2025 (when emails were found)
  const { data: listings, error } = await supabase
    .from("listings")
    .select("id, listing_name, email, slug")
    .not("email", "is", null)
    .neq("email", "")
    .gte("updated_at", "2025-11-06 00:00:00")
    .lt("updated_at", "2025-11-07 00:00:00")
    .order("listing_name");

  if (error) {
    return { success: false, message: `Error fetching listings: ${error.message}` };
  }

  if (!listings || listings.length === 0) {
    return { success: false, message: "No listings found updated on November 6, 2025" };
  }

  // Filter out talent agents and managers
  const targetListings = listings.filter(listing => {
    // We need to check categories, but it's not in the select
    // For now, we'll filter after fetching full data
    return true;
  });

  // Re-fetch with categories to filter properly
  const { data: fullListings, error: fullError } = await supabase
    .from("listings")
    .select("id, listing_name, email, slug, categories")
    .not("email", "is", null)
    .neq("email", "")
    .gte("updated_at", "2025-11-06 00:00:00")
    .lt("updated_at", "2025-11-07 00:00:00")
    .order("listing_name");

  if (fullError) {
    return { success: false, message: `Error fetching listings: ${fullError.message}` };
  }

  const filteredListings = (fullListings || []).filter(listing => {
    if (!listing.categories || !Array.isArray(listing.categories)) {
      return true;
    }
    return !listing.categories.includes("Talent Agents") &&
           !listing.categories.includes("Talent Managers");
  });

  const results = {
    sent: 0,
    failed: 0,
    skipped: 0,
    errors: [] as string[],
  };

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://directory.childactor101.com";

  for (const listing of filteredListings) {
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
    message: `Sent ${results.sent} emails, ${results.failed} failed, ${results.skipped} skipped`,
    details: {
      total: filteredListings.length,
      sent: results.sent,
      failed: results.failed,
      skipped: results.skipped,
      errors: results.errors,
    },
  };
}













