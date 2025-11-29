import { NextResponse } from "next/server";
import { getCampaignsDueForEmail, processCampaignStep } from "@/data/email-campaigns";

/**
 * Cron job endpoint: Process automated email campaigns
 *
 * Setup in Vercel:
 * 1. Go to Project Settings > Cron Jobs
 * 2. Add: /api/cron/email-campaigns
 * 3. Schedule: 0 (star)(slash)6 (star) (star) (star) (every 6 hours)
 * 4. Or use: 0 10 (star) (star) (star) (daily at 10am UTC)
 *
 * Manual trigger for testing:
 * curl -X POST https://yourdomain.com/api/cron/email-campaigns \
 *   -H "Authorization: Bearer YOUR_CRON_SECRET"
 */

export async function POST(request: Request) {
  try {
    // Verify cron secret (basic auth)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("[Cron] Starting email campaign processing...");

    // Get all campaigns due for next email
    const campaigns = await getCampaignsDueForEmail();

    console.log(`[Cron] Found ${campaigns.length} campaigns due for email`);

    if (campaigns.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No campaigns due",
        processed: 0,
      });
    }

    // Process each campaign
    const results = await Promise.allSettled(
      campaigns.map((campaign) => processCampaignStep(campaign))
    );

    // Count successes and failures
    const successful = results.filter(
      (r) => r.status === "fulfilled" && r.value === true
    ).length;
    const failed = results.length - successful;

    console.log(
      `[Cron] Processed ${successful} campaigns successfully, ${failed} failed`
    );

    return NextResponse.json({
      success: true,
      message: "Email campaigns processed",
      total: campaigns.length,
      successful,
      failed,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Cron] Error processing email campaigns:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Allow GET for manual testing/monitoring
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Get upcoming campaigns (next 24 hours)
  const campaigns = await getCampaignsDueForEmail();
  const upcoming = campaigns.filter(
    (c: any) =>
      c.next_email_due_at &&
      new Date(c.next_email_due_at) < new Date(Date.now() + 24 * 60 * 60 * 1000)
  );

  return NextResponse.json({
    message: "Email campaigns cron endpoint",
    upcomingCampaigns: upcoming.length,
    duNow: campaigns.length,
    status: "ready",
  });
}
