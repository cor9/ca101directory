import { reportStripeIssue } from "@/lib/error-reporting";
import type { SupabaseClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

type NotifyAdminFn = (
  listingName: string,
  listingId: string,
  plan: string,
  billingCycle: string | null | undefined,
  vendorId: string,
) => Promise<void>;

type NotifyDiscordFn = (
  title: string,
  fields: Array<{ name: string; value: string; inline?: boolean }>,
) => Promise<void>;

export interface CheckoutSessionProcessorDeps {
  supabase: SupabaseClient<any, any, any>;
  stripe: Stripe;
  notifyAdmin: NotifyAdminFn;
  notifyDiscord: NotifyDiscordFn;
}

export interface CheckoutSessionProcessingOutcome {
  type:
    | "processed"
    | "pending_signup"
    | "missing_metadata"
    | "multiple_pending_claim_matches";
  payload: Record<string, unknown>;
  status: number;
  context: {
    vendorId?: string;
    listingId?: string;
    plan?: string;
    billingCycle?: string | null;
  };
}

export async function processCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  deps: CheckoutSessionProcessorDeps,
): Promise<CheckoutSessionProcessingOutcome> {
  const { supabase, stripe, notifyAdmin, notifyDiscord } = deps;

  let vendorId = session.metadata?.vendor_id ?? undefined;
  let listingId = session.metadata?.listing_id ?? undefined;
  let plan = session.metadata?.plan ?? undefined;
  let billingCycle = session.metadata?.billing_cycle ?? undefined;
  const normalizedEmail = session.customer_details?.email
    ? session.customer_details.email.trim().toLowerCase()
    : undefined;

  if (!listingId && session.client_reference_id) {
    listingId = session.client_reference_id;
    console.log("[Pricing Table] Using client_reference_id as listing_id:", listingId);
  }

  if (!plan && session.mode === "subscription") {
    console.log("[Pricing Table] Plan not in metadata, retrieving line items...");

    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        limit: 1,
      });
      const firstItem = lineItems.data[0];

      if (firstItem?.price) {
        const priceAmount =
          typeof firstItem.price === "object" ? firstItem.price.unit_amount : 0;

        console.log("[Pricing Table] Line item details:", {
          priceId: typeof firstItem.price === "string" ? firstItem.price : firstItem.price.id,
          priceAmount,
          priceInterval:
            typeof firstItem.price === "object"
              ? firstItem.price.recurring?.interval
              : null,
        });

        if (priceAmount === 2500 || priceAmount === 25000) {
          plan = "Standard";
          billingCycle = priceAmount === 2500 ? "monthly" : "yearly";
        } else if (priceAmount === 5000 || priceAmount === 50000) {
          plan = "Pro";
          billingCycle = priceAmount === 5000 ? "monthly" : "yearly";
        }

        console.log("[Pricing Table] Detected plan:", {
          plan,
          billingCycle,
        });
      }
    } catch (err) {
      console.error("[Pricing Table] Error fetching line items:", err);
    }
  }

  if (listingId && !vendorId) {
    console.log(
      "[Pricing Table] No vendor_id in metadata, looking up listing owner...",
    );

    try {
      const { data: listingData, error: listingError } = await supabase
        .from("listings")
        .select("owner_id")
        .eq("id", listingId)
        .single();

      if (!listingError && listingData?.owner_id) {
        vendorId = listingData.owner_id as string;
        console.log("[Pricing Table] Found vendor_id from listing:", vendorId);
      } else {
        console.log(
          "[Pricing Table] No owner_id found for listing, will use customer email",
        );
      }
    } catch (err) {
      console.error("[Pricing Table] Error looking up listing:", err);
    }
  }

  if (!vendorId && normalizedEmail) {
    console.log("[Pricing Table] Looking up user by email:", normalizedEmail);

    try {
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", normalizedEmail)
        .single();

      if (!userError && userData?.id) {
        vendorId = userData.id as string;
        console.log("[Pricing Table] Found vendor_id by email:", vendorId);
      } else {
        console.log(
          "[Pricing Table] User doesn't exist, will be created after email verification",
        );
      }
    } catch (err) {
      console.error("[Pricing Table] Error looking up user by email:", err);
    }
  }

  if (!listingId && normalizedEmail) {
    try {
      const { data: pendingListings, error: pendingError } = await supabase
        .from("listings")
        .select("id, owner_id, plan, pending_claim_email")
        .ilike("pending_claim_email", normalizedEmail)
        .limit(2);

      if (pendingError) {
        console.error(
          "[Legacy Payment Link] Error checking pending_claim_email:",
          pendingError,
        );
      } else if ((pendingListings?.length ?? 0) === 1) {
        const [pending] = pendingListings ?? [];
        listingId = pending.id as string;
        vendorId = vendorId ?? (pending.owner_id as string | undefined);
        plan = plan ?? (pending.plan as string | undefined);
        console.log("[Legacy Payment Link] Matched listing via pending_claim_email", {
          listingId,
          vendorId,
        });
      } else if ((pendingListings?.length ?? 0) > 1) {
        await reportStripeIssue(
          "warning",
          "Multiple listings share the same pending_claim_email for a legacy checkout session",
          undefined,
          {
            email: normalizedEmail,
            sessionId: session.id,
            matches: pendingListings?.map((entry) => entry.id) ?? [],
          },
        );
        return {
          type: "multiple_pending_claim_matches",
          payload: {
            received: true,
            skipped: true,
            error: "multiple_pending_claim_matches",
            message:
              "Multiple listings found for this payment email. Please reconcile manually and clear duplicate pending_claim_email entries.",
          },
          status: 200,
          context: { listingId, vendorId, plan, billingCycle },
        };
      }
    } catch (legacyError) {
      console.error(
        "[Legacy Payment Link] Unexpected error while reconciling pending_claim_email:",
        legacyError,
      );
    }
  }

  if (!listingId || !plan) {
    const diagnostic = {
      vendorId,
      listingId,
      plan,
      billingCycle,
      clientReferenceId: session.client_reference_id,
      customerEmail: normalizedEmail,
      allMetadata: session.metadata,
      sessionId: session.id,
    };
    await reportStripeIssue(
      "warning",
      "Stripe checkout session missing listing or plan metadata. Manual follow-up required.",
      undefined,
      diagnostic,
    );
    return {
      type: "missing_metadata",
      payload: {
        received: true,
        skipped: true,
        error: "missing_metadata",
        message:
          "Stripe checkout session is missing listing metadata. Please reconcile this payment manually and update pending_claim_email if necessary.",
        diagnostic,
      },
      status: 200,
      context: { listingId, vendorId, plan, billingCycle },
    };
  }

  if (!vendorId && normalizedEmail) {
    console.log(
      "[Webhook] No user account yet, storing payment info on listing for claim after signup:",
      {
        listingId,
        plan,
        customerEmail: normalizedEmail,
      },
    );

    try {
      const { error: listingError } = await supabase
        .from("listings")
        .update({
          plan: plan,
          pending_claim_email: normalizedEmail,
          stripe_session_id: session.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", listingId);

      if (listingError) {
        console.error("Error storing pending claim info:", listingError);
      } else {
        console.log("✅ Stored pending claim info, awaiting user signup");
      }

      return {
        type: "pending_signup",
        payload: {
          received: true,
          pending_signup: true,
          message: "Payment received, awaiting user account creation",
        },
        status: 200,
        context: { listingId, vendorId, plan, billingCycle },
      };
    } catch (err) {
      console.error("[Webhook] Error storing pending claim:", err);
      return {
        type: "pending_signup",
        payload: {
          received: true,
          error: "Could not store pending claim",
        },
        status: 200,
        context: { listingId, vendorId, plan, billingCycle },
      };
    }
  }

  if (!vendorId) {
    console.error("[Webhook] Could not determine vendor_id and no email provided:", {
      listingId,
      plan,
    });
    return {
      type: "missing_metadata",
      payload: {
        received: true,
        error: "Could not determine vendor",
      },
      status: 200,
      context: { listingId, vendorId, plan, billingCycle },
    };
  }

  console.log("[Webhook] Processing with:", {
    vendorId,
    listingId,
    plan,
    billingCycle,
  });

  try {
    const { data: vendorExists, error: vendorCheckError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", vendorId)
      .single();

    if (vendorCheckError || !vendorExists) {
      console.error(
        "[Webhook] ❌ CRITICAL: Vendor doesn't exist in profiles table!",
        {
          vendorId,
          email: normalizedEmail,
          error: vendorCheckError,
        },
      );

      const { data: authUser } = await supabase
        .from("auth.users")
        .select("id, email")
        .eq("id", vendorId)
        .single();

      if (authUser) {
        console.error(
          "[Webhook] User exists in auth.users but NOT in profiles table - sync trigger failed!",
          authUser,
        );
      }

      throw new Error(
        `Vendor ${vendorId} doesn't exist in profiles table. Email: ${normalizedEmail}`,
      );
    }

    const { error: claimError } = await supabase.from("claims").insert({
      listing_id: listingId,
      vendor_id: vendorId,
      message: `Auto-claim via Stripe checkout - ${plan} plan (${billingCycle})`,
      approved: false,
    });

    if (claimError) {
      console.error("[Webhook] ❌ Error inserting claim:", claimError);
      throw claimError;
    }

    const { data: updatedListing, error: listingError } = await supabase
      .from("listings")
      .update({
        owner_id: vendorId,
        is_claimed: true,
        plan: plan,
        updated_at: new Date().toISOString(),
      })
      .eq("id", listingId)
      .select();

    if (listingError) {
      console.error("[Webhook] ❌ Error updating listing:", listingError);
      throw listingError;
    }

    const { data: updatedProfile, error: profileError } = await supabase
      .from("profiles")
      .update({
        subscription_plan: plan,
        billing_cycle: billingCycle,
        stripe_customer_id: session.customer as string,
      })
      .eq("id", vendorId)
      .select();

    if (profileError) {
      console.error("[Webhook] ❌ Error updating profile:", profileError);
      throw profileError;
    }

    console.log("[Webhook] ✅ Claim inserted, listing and profile updated", {
      updatedListing,
      updatedProfile,
    });

    try {
      const { data: listingData } = await supabase
        .from("listings")
        .select("listing_name")
        .eq("id", listingId)
        .single();
      const listingName = listingData?.listing_name || listingId;
      await notifyAdmin(listingName, listingId, plan, billingCycle, vendorId);

      try {
        const amount =
          typeof session.amount_total === "number"
            ? session.amount_total / 100
            : 0;
        const userName =
          session.customer_details?.name ||
          session.customer_details?.email ||
          "Unknown";
        await notifyDiscord("💳 Purchase Completed", [
          { name: "User", value: userName, inline: true },
          { name: "Amount", value: `$${amount.toFixed(2)}`, inline: true },
          { name: "Listing", value: listingName, inline: false },
          { name: "Plan", value: plan, inline: true },
          { name: "Billing", value: billingCycle || "N/A", inline: true },
          { name: "Session", value: `\`${session.id}\``, inline: false },
        ]);
      } catch (discordErr) {
        console.warn("Discord notification failed:", discordErr);
      }
    } catch (notifyError) {
      console.error("Failed to notify admin of upgrade:", notifyError);
      try {
        const amount =
          typeof session.amount_total === "number"
            ? session.amount_total / 100
            : 0;
        const userName =
          session.customer_details?.name ||
          session.customer_details?.email ||
          "Unknown";
        await notifyDiscord("💳 Purchase Completed", [
          { name: "User", value: userName, inline: true },
          { name: "Amount", value: `$${amount.toFixed(2)}`, inline: true },
          { name: "Listing", value: listingId, inline: false },
          { name: "Plan", value: plan, inline: true },
          { name: "Billing", value: billingCycle || "N/A", inline: true },
          { name: "Session", value: `\`${session.id}\``, inline: false },
        ]);
      } catch (discordErr) {
        console.warn("Discord fallback failed:", discordErr);
      }
    }

    return {
      type: "processed",
      payload: { received: true },
      status: 200,
      context: { listingId, vendorId, plan, billingCycle },
    };
  } catch (error) {
    console.error("Error processing claim:", error);
    return {
      type: "missing_metadata",
      payload: { error: "Failed to process claim" },
      status: 500,
      context: { listingId, vendorId, plan, billingCycle },
    };
  }
}
