import {
  sendDay3CompleteProfileEmail,
  sendDay7TrafficUpdateEmail,
  sendDay14UpgradeOfferEmail,
  sendManualClaimedVendorEmailReminder,
} from "@/lib/mail";
import { createServerClient } from "@/lib/supabase";

/**
 * Email campaign data functions
 */

export type EmailCampaign = {
  id: string;
  listing_id: string;
  email_address: string;
  campaign_type: string;
  current_step: number;
  last_email_sent_at: string | null;
  next_email_due_at: string | null;
  status: string;
  opted_out: boolean;
  emails_sent: number;
  created_at: string;
  updated_at: string;
};

export async function startClaimedVendorUpgradeSequence(payload: {
  listingId: string;
  vendorEmail: string;
  vendorName: string;
  listingName: string;
}) {
  const supabase = createServerClient();
  const upgradeUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://directory.childactor101.com"}/dashboard/vendor?upgrade=true`;

  await sendManualClaimedVendorEmailReminder({
    step: "immediate",
    vendorName: payload.vendorName,
    vendorEmail: payload.vendorEmail,
    listingName: payload.listingName,
    listingId: payload.listingId,
    upgradeUrl,
  });

  const nextEmailDueAt = new Date(
    Date.now() + 48 * 60 * 60 * 1000,
  ).toISOString();

  const { error } = await supabase.from("email_campaigns").upsert(
    {
      listing_id: payload.listingId,
      email_address: payload.vendorEmail,
      campaign_type: "claimed_upgrade",
      current_step: 1,
      emails_sent: 1,
      status: "active",
      opted_out: false,
      last_email_sent_at: new Date().toISOString(),
      next_email_due_at: nextEmailDueAt,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "listing_id,campaign_type" },
  );

  if (error) {
    console.error("Failed to create claimed upgrade campaign:", error);
  }
}

/**
 * Get campaigns that are due to send next email
 */
export async function getCampaignsDueForEmail() {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("email_campaigns")
    .select(`
      *,
      listings:listing_id (
        id,
        slug,
        listing_name,
        email,
        is_claimed,
        owner_id,
        plan,
        status
      )
    `)
    .eq("status", "active")
    .eq("opted_out", false)
    .lte("next_email_due_at", new Date().toISOString())
    .limit(50); // Process in batches

  if (error) {
    console.error("Error fetching due campaigns:", error);
    return [];
  }

  return data || [];
}

/**
 * Process a single email campaign step
 */
export async function processCampaignStep(campaign: any) {
  const supabase = createServerClient();
  const listing = campaign.listings;

  if (!listing) {
    console.error(`Listing not found for campaign ${campaign.id}`);
    return false;
  }

  const campaignType = campaign.campaign_type || "unclaimed_nurture";

  // Campaign guardrails
  if (campaignType === "claimed_upgrade") {
    if (!listing.is_claimed || !listing.owner_id || listing.status !== "Live") {
      await supabase
        .from("email_campaigns")
        .update({ status: "completed", updated_at: new Date().toISOString() })
        .eq("id", campaign.id);
      return false;
    }
  } else if (
    listing.is_claimed ||
    listing.status !== "Live" ||
    (listing.plan || "").toLowerCase() !== "free"
  ) {
    await supabase
      .from("email_campaigns")
      .update({ status: "completed", updated_at: new Date().toISOString() })
      .eq("id", campaign.id);
    return false;
  }

  // Get listing view count for personalization
  const { count: viewCount } = await supabase
    .from("listing_views")
    .select("id", { count: "exact", head: true })
    .eq("listing_id", listing.id)
    .gte(
      "viewed_at",
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    );

  const vendorName = listing.listing_name?.split(" ")[0] || "there";
  const emailPayload = {
    vendorName,
    vendorEmail: listing.email,
    listingName: listing.listing_name,
    slug: listing.slug,
    viewCount: viewCount || 0,
  };

  try {
    // Determine which email to send based on current step
    const nextStep = campaign.current_step + 1;
    const upgradeUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://directory.childactor101.com"}/dashboard/vendor?upgrade=true`;

    if (campaignType === "claimed_upgrade") {
      switch (nextStep) {
        case 2:
          await sendManualClaimedVendorEmailReminder({
            step: "48h",
            vendorName,
            vendorEmail: listing.email,
            listingName: listing.listing_name,
            listingId: listing.id,
            upgradeUrl,
          });
          await updateCampaignAfterSend(campaign.id, 2, 3);
          break;
        case 3:
          await sendManualClaimedVendorEmailReminder({
            step: "day5",
            vendorName,
            vendorEmail: listing.email,
            listingName: listing.listing_name,
            listingId: listing.id,
            upgradeUrl,
          });
          await updateCampaignAfterSend(campaign.id, 3, null);
          break;
        default:
          await supabase
            .from("email_campaigns")
            .update({
              status: "completed",
              updated_at: new Date().toISOString(),
            })
            .eq("id", campaign.id);
          return false;
      }
    } else {
      switch (nextStep) {
        case 2: // Day 3
          await sendDay3CompleteProfileEmail(emailPayload);
          await updateCampaignAfterSend(campaign.id, 2, 4); // Next email in 4 days (Day 7)
          break;

        case 3: // Day 7
          await sendDay7TrafficUpdateEmail(emailPayload);
          await updateCampaignAfterSend(campaign.id, 3, 7); // Next email in 7 days (Day 14)
          break;

        case 4: // Day 14
          await sendDay14UpgradeOfferEmail(emailPayload);
          await updateCampaignAfterSend(campaign.id, 4, null); // No more emails, mark completed
          break;

        default:
          console.warn(`Unknown campaign step: ${nextStep}`);
          return false;
      }
    }

    return true;
  } catch (error) {
    console.error(`Error sending campaign email for ${campaign.id}:`, error);
    return false;
  }
}

/**
 * Update campaign after successfully sending an email
 */
async function updateCampaignAfterSend(
  campaignId: string,
  step: number,
  daysUntilNext: number | null,
) {
  const supabase = createServerClient();

  const updates: any = {
    current_step: step,
    last_email_sent_at: new Date().toISOString(),
    emails_sent: step,
    updated_at: new Date().toISOString(),
  };

  if (daysUntilNext !== null) {
    updates.next_email_due_at = new Date(
      Date.now() + daysUntilNext * 24 * 60 * 60 * 1000,
    ).toISOString();
  } else {
    updates.status = "completed";
    updates.next_email_due_at = null;
  }

  const { error } = await supabase
    .from("email_campaigns")
    .update(updates)
    .eq("id", campaignId);

  if (error) {
    console.error("Error updating campaign:", error);
  }
}

/**
 * Opt out a vendor from email campaigns
 */
export async function optOutFromCampaigns(listingId: string) {
  const supabase = createServerClient();

  const { error } = await supabase
    .from("email_campaigns")
    .update({
      opted_out: true,
      opted_out_at: new Date().toISOString(),
      status: "unsubscribed",
      updated_at: new Date().toISOString(),
    })
    .eq("listing_id", listingId);

  if (error) {
    console.error("Error opting out:", error);
    return false;
  }

  return true;
}

/**
 * Track email open (call from email tracking pixel)
 */
export async function trackEmailOpen(campaignId: string) {
  const supabase = createServerClient();

  const { error } = await supabase.rpc("increment", {
    table_name: "email_campaigns",
    row_id: campaignId,
    column_name: "emails_opened",
  });

  if (!error) {
    await supabase
      .from("email_campaigns")
      .update({ last_opened_at: new Date().toISOString() })
      .eq("id", campaignId);
  }
}

/**
 * Track email click (call from link tracking)
 */
export async function trackEmailClick(campaignId: string) {
  const supabase = createServerClient();

  const { error } = await supabase.rpc("increment", {
    table_name: "email_campaigns",
    row_id: campaignId,
    column_name: "emails_clicked",
  });

  if (!error) {
    await supabase
      .from("email_campaigns")
      .update({ last_clicked_at: new Date().toISOString() })
      .eq("id", campaignId);
  }
}
