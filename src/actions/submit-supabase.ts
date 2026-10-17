"use server";

import {
  LISTINGS_CACHE_TAG,
  getListingById,
  listingCacheTag,
} from "@/data/listings";
import { currentUser } from "@/lib/auth";
import { sendDiscordNotification } from "@/lib/discord";
import {
  sendAdminSubmissionNotification,
  sendListingSubmittedEmail,
} from "@/lib/mail";
import { SubmitSchema } from "@/lib/schemas";
import { createServerClient } from "@/lib/supabase";
import { revalidatePath, revalidateTag } from "next/cache";

type BaseSubmitFormData = {
  name: string;
  link: string;
  description: string;
  introduction: string;
  unique: string;
  format: string | string[]; // Can be array (tags) or string (legacy)
  notes: string;
  imageId: string;
  tags: string[];
  categories: string[];
  // Support legacy string[] and new object[] with captions
  gallery?: Array<string | { url: string; caption?: string }>;
  plan: string;
  performerPermit: boolean;
  bonded: boolean;
  email: string;
  phone: string;
  city: string;
  state: string;
  zip: string;
  region: string | string[]; // Multi-select regions
  bondNumber: string;
  active?: boolean;
};

export type SubmitFormData = BaseSubmitFormData;

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
  id?: string;
  listingId?: string;
  errors?: Record<string, string[]>; // Field-level validation errors
};

/**
 * Submit listing to Supabase
 */
export async function submitToSupabase(
  formData: SubmitFormData & { listingId?: string; isEdit?: boolean },
): Promise<ServerActionResponse> {
  try {
    // Get current user for owner_id
    const user = await currentUser();

    // SECURITY FIX (recovery audit, Phase 1B Task 6): this action used the
    // anonymous Supabase client, which runs every query as Postgres role
    // `anon` regardless of the signed-in NextAuth/Supabase session. Live
    // RLS on `listings` has no anon INSERT policy and restricts UPDATE to
    // `owner_id = auth.uid()`, which is never true for an anon-role
    // request — every create/edit through this form was failing (insert
    // denied, update affecting zero rows) or, for an edit on a non-Live
    // listing, failing the ownership check below because the anon SELECT
    // policy only exposes Live/Published rows. The ownership check in code
    // immediately below is what actually gates who may write; the service
    // role here is what lets a verified write take effect at all.
    const supabase = createServerClient();

    console.log("submitToSupabase, data:", formData);

    // Validate with detailed error messages
    const validationResult = SubmitSchema.safeParse(formData);

    if (!validationResult.success) {
      const fieldErrors: Record<string, string[]> = {};
      validationResult.error.errors.forEach((err) => {
        const field = err.path.join(".");
        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }
        fieldErrors[field].push(err.message);
      });

      console.error("Validation errors:", fieldErrors);

      // Build user-friendly error message listing the specific issues
      const errorList: string[] = [];
      if (fieldErrors.name)
        errorList.push(`• Business Name: ${fieldErrors.name[0]}`);
      if (fieldErrors.link) errorList.push(`• Website: ${fieldErrors.link[0]}`);
      if (fieldErrors.email) errorList.push(`• Email: ${fieldErrors.email[0]}`);
      if (fieldErrors.city) errorList.push(`• City: ${fieldErrors.city[0]}`);
      if (fieldErrors.state) errorList.push(`• State: ${fieldErrors.state[0]}`);
      if (fieldErrors.region)
        errorList.push(`• Region: ${fieldErrors.region[0]}`);
      if (fieldErrors.format)
        errorList.push(`• Format: ${fieldErrors.format[0]}`);
      if (fieldErrors.categories)
        errorList.push(`• Categories: ${fieldErrors.categories[0]}`);

      const errorMessage =
        errorList.length > 0
          ? `Please fix these issues:\n${errorList.join("\n")}`
          : "Please check all required fields and try again.";

      return {
        status: "error",
        message: errorMessage,
        errors: fieldErrors,
      };
    }

    const {
      name,
      link,
      description,
      introduction,
      unique,
      format,
      notes,
      imageId,
      tags,
      categories,
      plan,
      performerPermit,
      bonded,
      email,
      phone,
      city,
      state,
      zip,
      region,
      bondNumber,
      gallery,
      active,
      facebook_url,
      instagram_url,
      tiktok_url,
      youtube_url,
      linkedin_url,
      blog_url,
      custom_link_url,
      custom_link_name,
    } = validationResult.data;

    console.log(
      "submitToSupabase, name:",
      name,
      "link:",
      link,
      "plan (client-submitted, not trusted — see trustedPlan below):",
      plan,
      "region:",
      region,
    );

    // SECURITY FIX (recovery audit, Phase 1C Task 7): this action used to
    // write the client-submitted `plan` straight to the database
    // (`plan: plan, // Keep plan as-is since forms already send correct
    // values`) and derive every tier-gated field (category count, gallery
    // size, social links) from that same untrusted value. A vendor could
    // select "Pro" in the form and submit directly — no Stripe checkout,
    // no payment — and the listing would be created (or an edit saved)
    // with Pro features and Pro billing status. The only legitimate way
    // to grant Pro is a verified Stripe payment via /api/webhook. For a
    // new listing, the plan is always "Free"; for an edit, it's locked to
    // whatever plan the listing already has in the database — fetched
    // below, before any ownership check, so it's available regardless of
    // which branch runs.
    let currentListing: {
      owner_id: string | null;
      is_claimed: boolean | null;
      plan: string | null;
      is_approved_101: boolean | null;
    } | null = null;

    if (formData.isEdit && formData.listingId) {
      const { data: existing } = await supabase
        .from("listings")
        .select("owner_id, is_claimed, plan, is_approved_101")
        .eq("id", formData.listingId)
        .single();
      currentListing = existing ?? null;

      // Verify user owns this listing OR it's unclaimed (claiming flow)
      const isClaimingListing =
        currentListing?.owner_id === null && !currentListing?.is_claimed;
      const ownsListing = currentListing?.owner_id === user?.id;

      if (!isClaimingListing && !ownsListing) {
        return {
          status: "error",
          message: "You don't have permission to edit this listing",
        };
      }
    }

    const trustedPlan = formData.isEdit
      ? currentListing?.plan || "Free"
      : "Free";
    const trustedPlanLower = trustedPlan.toLowerCase();

    // Determine if this is a Free tier listing
    const isFree = trustedPlanLower === "free";
    const isStandard =
      trustedPlanLower === "standard" || trustedPlanLower === "founding standard";
    const isPro = trustedPlanLower === "pro" || trustedPlanLower === "founding pro";

    // TIER RESTRICTIONS ENFORCEMENT (Server-side validation)
    // Free tier: Strip premium content to prevent abuse
    // Standard tier: Gets premium content fields but no gallery/social
    // Pro tier: Gets everything

    const enforcedCategories = isFree
      ? categories.slice(0, 1) // Free: only 1 category
      : categories; // Paid: multiple categories allowed

    const galleryLimit = isPro ? 12 : isStandard ? 6 : 0;

    const enforcedGallery =
      galleryLimit > 0 && gallery && gallery.length > 0
        ? JSON.stringify(gallery.slice(0, galleryLimit)) // Limit based on plan
        : null; // Free: no gallery

    // Convert format array to comma-separated string for storage
    const formatString = Array.isArray(format)
      ? format.join(", ")
      : format || "";

    // Create listing data for Supabase
    const listingData = {
      listing_name: name,
      website: link,
      what_you_offer: description,
      // Premium content fields: only for paid plans (Standard/Pro)
      why_is_it_unique: isFree ? null : unique || null,
      format: formatString,
      extras_notes: isFree ? null : notes || null,
      email: email,
      phone: phone,
      city: city,
      state: state,
      zip: zip ? Number.parseInt(zip, 10) : null,
      region: region,
      categories: enforcedCategories,
      age_range: tags,
      profile_image: imageId,
      gallery: enforcedGallery,
      plan: trustedPlan, // Never the client-submitted `plan` — see note above.
      ca_permit_required: performerPermit,
      is_bonded: bonded,
      bond_number: bondNumber,
      // NEW submissions: Auto-approve paid plans, review free plans
      status: "Live",
      is_active: active ?? true,
      is_claimed: false,
      owner_id: user?.id || null, // Link to current user if authenticated
      // New listings start unapproved; an edit must not silently wipe an
      // admin-granted 101 Approved badge (this field is admin-only to
      // *set*, same as plan/featured — see Phase 1A Task 2).
      is_approved_101: formData.isEdit
        ? currentListing?.is_approved_101 ?? false
        : false,
      // Social media fields: Pro tier only
      facebook_url: isPro ? facebook_url || null : null,
      instagram_url: isPro ? instagram_url || null : null,
      tiktok_url: isPro ? tiktok_url || null : null,
      youtube_url: isPro ? youtube_url || null : null,
      linkedin_url: isPro ? linkedin_url || null : null,
      blog_url: isPro ? blog_url || null : null,
      custom_link_url: isPro ? custom_link_url || null : null,
      custom_link_name: isPro ? custom_link_name || null : null,
    };

    console.log("submitToSupabase, creating listing in Supabase:", listingData);

    let data: { id: string } | null;
    let error: { message: string } | null;

    if (formData.isEdit && formData.listingId) {
      // Update existing listing. Ownership was already verified above,
      // before listingData/trustedPlan were computed.
      console.log("Updating existing listing:", formData.listingId);

      const updateData = {
        ...listingData,
        // ALL EDITS require review (free and paid)
        status: "Live",
        // Preserve existing ownership - don't change on edit
        owner_id: currentListing?.owner_id,
        is_claimed: currentListing?.is_claimed,
        updated_at: new Date().toISOString(),
      };

      ({ data, error } = await supabase
        .from("listings")
        .update(updateData)
        .eq("id", formData.listingId)
        .select()
        .single());
    } else {
      // Duplicate detection (website or name+city+state)
      try {
        const normalizedWebsite = (link || "").trim().toLowerCase();
        let duplicateFound = false;

        if (normalizedWebsite) {
          const { data: dupBySite } = await supabase
            .from("listings")
            .select("id")
            .ilike("website", normalizedWebsite)
            .limit(1);
          if (dupBySite && dupBySite.length > 0) duplicateFound = true;
        }

        if (!duplicateFound) {
          const { data: dupByNameLoc } = await supabase
            .from("listings")
            .select("id")
            .ilike("listing_name", name)
            .ilike("city", city)
            .ilike("state", state)
            .limit(1);
          if (dupByNameLoc && dupByNameLoc.length > 0) duplicateFound = true;
        }

        if (duplicateFound) {
          // Notify Discord and return error
          sendDiscordNotification("⚠️ Duplicate Listing Blocked", [
            { name: "Listing", value: name, inline: true },
            { name: "Website", value: link || "N/A", inline: true },
            { name: "Location", value: `${city}, ${state}`, inline: true },
            {
              name: "Submitted By",
              value: user?.email || "Unknown",
              inline: false,
            },
          ]).catch((e) =>
            console.warn("Discord duplicate notification failed:", e),
          );

          return {
            status: "error",
            message:
              "It looks like this listing already exists. If you believe this is an error, please contact support.",
          };
        }
      } catch (dupCheckErr) {
        console.warn("Duplicate detection failed, continuing:", dupCheckErr);
      }

      // Insert new listing
      ({ data, error } = await supabase
        .from("listings")
        .insert([listingData])
        .select()
        .single());
    }

    if (error) {
      console.error("Supabase error:", error);
      return {
        status: "error",
        message: `Failed to ${formData.isEdit ? "update" : "submit"} listing: ${error.message}`,
      };
    }

    console.log("submitToSupabase, success, listingId:", data.id);

    // Revalidate the submit page and listing surfaces
    const revalidateTargets = [
      "/submit",
      "/",
      "/directory",
      "/category",
      "/category/[slug]",
      "/location",
      "/location/[city]",
      "/tag",
      "/tag/[slug]",
      "/dashboard/vendor/listing",
    ];

    for (const path of revalidateTargets) {
      revalidatePath(path);
    }

    let listingSlug: string | null = null;
    try {
      const canonical = await getListingById(data.id);
      listingSlug = canonical?.slug ?? null;
    } catch (slugError) {
      console.error("Failed to resolve listing slug after submit:", slugError);
    }

    if (listingSlug) {
      revalidatePath(`/listing/${listingSlug}`);
    }

    revalidateTag(LISTINGS_CACHE_TAG);
    revalidateTag(listingCacheTag(data.id));

    // Send confirmation email (non-blocking, don't fail if email fails)
    if (user?.email) {
      const userName = user.name || user.email?.split("@")[0] || "Vendor";
      sendListingSubmittedEmail(
        userName,
        user.email,
        name,
        data.id,
        trustedPlan,
        !!formData.isEdit,
      )
        .then(() => {
          console.log("Confirmation email sent to:", user.email);
        })
        .catch((emailError) => {
          console.error("Failed to send confirmation email:", emailError);
          // Don't fail the whole operation if email fails
        });
    }

    // Notify admin of submission/update (non-blocking)
    sendAdminSubmissionNotification(name, data.id, !!formData.isEdit)
      .then(() => {
        console.log("Admin notified of submission/update for:", name);
      })
      .catch((notifyError) => {
        console.error("Failed to notify admin of submission:", notifyError);
      });

    // Discord notification (non-blocking)
    sendDiscordNotification(
      formData.isEdit ? "✏️ Listing Edited" : "🆕 New Listing Submission",
      [
        { name: "Listing", value: name, inline: true },
        { name: "Listing ID", value: `\`${data.id}\``, inline: true },
        { name: "Plan", value: trustedPlan, inline: true },
        {
          name: "Submitted By",
          value: user?.email || "Unknown",
          inline: false,
        },
      ],
    ).catch((e) => console.warn("Discord submission notification failed:", e));

    // Determine success message based on plan and action
    let successMessage = "";
    if (formData.isEdit) {
      // ALL EDITS require review (free and paid)
      successMessage = successMessage =
        "Successfully updated listing! Your changes are now live and visible in the directory.";
    } else {
      // ALL submissions go live immediately
      successMessage =
        "Successfully submitted listing! Your listing is now live and visible in the directory.";
    }

    return {
      status: "success",
      message: successMessage,
      id: data.id,
      listingId: data.id,
    };
  } catch (error) {
    console.log("submitToSupabase, error", error);
    console.error("Submit error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      formData: formData,
    });
    return {
      status: "error",
      message: `Failed to submit: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}
