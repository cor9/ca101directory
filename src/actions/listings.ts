"use server";

import { auth } from "@/auth";
import {
  FEATURED_LISTINGS_CACHE_TAG,
  LISTINGS_CACHE_TAG,
  listingCacheTag,
} from "@/data/listings";
import { sendListingLiveEmail } from "@/lib/mail";
import { createServerClient } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createClaimToken, createOptOutToken } from "@/lib/tokens";
import {
  CreateListingSchema,
  UpdateListingSchema,
} from "@/lib/validations/listings";
import { revalidatePath, revalidateTag } from "next/cache";
import type { z } from "zod";

/**
 * Server action to create a new listing.
 * @param values The form values.
 */
export async function createListing(
  values: z.infer<typeof CreateListingSchema>,
) {
  try {
    const validatedFields = CreateListingSchema.safeParse(values);
    if (!validatedFields.success) {
      console.error("Validation errors:", validatedFields.error.flatten());
      // Return more detailed error message
      const errorMessages = validatedFields.error.flatten().fieldErrors;
      const firstError = Object.entries(errorMessages)[0];
      const detailedMessage = firstError
        ? `${firstError[0]}: ${firstError[1]?.[0] || "validation error"}`
        : "Invalid fields. Please check your input.";
      return { status: "error", message: detailedMessage };
    }

    // Generate slug from listing name
    let slug = (validatedFields.data.listing_name || "")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-") // Collapse multiple hyphens
      .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens

    // Ensure slug is not empty (fallback to timestamp-based slug)
    if (!slug || slug.length === 0) {
      slug = `listing-${Date.now()}`;
    }

    // Check for existing slug and append number if needed
    const supabase = createServerClient();
    let finalSlug = slug;
    let slugCounter = 1;
    while (true) {
      const { data: existing } = await supabase
        .from("listings")
        .select("id")
        .eq("slug", finalSlug)
        .single();

      if (!existing) {
        break; // Slug is available
      }
      finalSlug = `${slug}-${slugCounter}`;
      slugCounter++;
      if (slugCounter > 100) {
        // Fallback to timestamp if too many conflicts
        finalSlug = `${slug}-${Date.now()}`;
        break;
      }
    }

    // Normalize empty strings to null for optional fields
    const normalizeString = (s?: string) =>
      typeof s === "string" && s.trim() === "" ? null : (s ?? null);
    const normalizeUrl = (s?: string) => normalizeString(s);

    // Helper to convert comma-separated strings to arrays
    const stringToArray = (
      value: string | string[] | undefined | null,
    ): string[] | null => {
      if (Array.isArray(value)) return value.length > 0 ? value : null;
      if (!value || typeof value !== "string" || value.trim() === "")
        return null;
      const array = value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      return array.length > 0 ? array : null;
    };

    // Convert single category string to categories array
    const categories = validatedFields.data.category
      ? [validatedFields.data.category.trim()].filter(Boolean)
      : [];

    // Convert region string to array
    const regionArray = stringToArray(validatedFields.data.region);

    // Prepare listing data with required fields
    // Remove 'category' field and use 'categories' array instead
    const { category, ...dataWithoutCategory } = validatedFields.data;
    const listingData = {
      ...dataWithoutCategory,
      slug: finalSlug,
      is_active: true, // Auto-approve new listings
      is_claimed: false, // Default to unclaimed
      categories: categories.length > 0 ? categories : null, // Convert to array or null
      region: regionArray, // Convert to array or null
      // Normalize optional string fields
      website: normalizeUrl(validatedFields.data.website),
      email: normalizeString(validatedFields.data.email),
      phone: normalizeString(validatedFields.data.phone),
      city: normalizeString(validatedFields.data.city),
      state: normalizeString(validatedFields.data.state),
      what_you_offer: normalizeString(validatedFields.data.what_you_offer),
      video_url: normalizeUrl(validatedFields.data.video_url),
      custom_link_url: normalizeUrl(validatedFields.data.custom_link_url),
      custom_link_name: normalizeString(validatedFields.data.custom_link_name),
      plan: normalizeString(validatedFields.data.plan),
    };

    console.log(
      "Creating listing with data:",
      JSON.stringify(listingData, null, 2),
    );

    const { data, error } = await supabase
      .from("listings")
      .insert([listingData])
      .select()
      .single();

    if (error) {
      console.error("Create Listing Error:", JSON.stringify(error, null, 2));
      console.error("Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return {
        status: "error",
        message: `Database Error: ${error.message || "Failed to create listing."}`,
      };
    }

    // Insert admin notification (non-blocking)
    try {
      await supabaseAdmin.from("notifications").insert({
        type: "new_listing",
        title: "New Listing Submission",
        message: `${validatedFields.data.listing_name || "Untitled"} (${validatedFields.data.plan || "Free"}) submitted`,
        data: {
          id: data.id,
          name: validatedFields.data.listing_name,
          plan: validatedFields.data.plan,
          email: validatedFields.data.email,
        },
      } as any);
    } catch (notifyErr) {
      console.warn("createListing: failed to insert notification:", notifyErr);
    }

    // Email vendor with individualized claim/upgrade links
    try {
      const email = (validatedFields.data.email || "").trim();
      console.log("createListing: Checking email send conditions", {
        email,
        hasDataId: !!data?.id,
        listingId: data?.id,
      });

      if (email && data?.id) {
        console.log("createListing: Sending listing live email to:", email);
        let token: string | null = null;
        try {
          token = createClaimToken(data.id);
        } catch (e) {
          console.error(
            "createListing: claim token unavailable (NEXTAUTH_SECRET missing?)",
            e,
          );
        }
        const siteUrl =
          process.env.NEXT_PUBLIC_APP_URL ||
          "https://directory.childactor101.com";
        const slug = (validatedFields.data.listing_name || "")
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
          const optOutToken = createOptOutToken(data.id);
          optOutUrl = `${siteUrl}/remove/${encodeURIComponent(optOutToken)}?lid=${encodeURIComponent(data.id)}`;
        } catch (e) {
          console.error("createListing: opt-out token unavailable", e);
        }

        await sendListingLiveEmail({
          vendorName: validatedFields.data.listing_name,
          vendorEmail: email,
          listingName: validatedFields.data.listing_name,
          slug,
          listingId: data.id as string,
          claimUrl,
          upgradeUrl,
          manageUrl,
          optOutUrl,
        });
        console.log(
          "createListing: Successfully sent listing live email to:",
          email,
        );
      } else {
        console.log(
          "createListing: Skipping email send - no email or listing ID",
        );
      }
    } catch (notifyErr) {
      console.error(
        "createListing: failed to send listing live email",
        notifyErr,
      );
    }

    // Revalidate the path to show the new listing in the table
    revalidatePath("/dashboard/admin");
    revalidateTag(LISTINGS_CACHE_TAG);

    return { status: "success", message: "Listing created successfully." };
  } catch (e) {
    console.error("Unexpected error in createListing:", e);
    return {
      status: "error",
      message: "An unexpected server error occurred.",
    };
  }
}

/**
 * Server action to update a listing.
 * @param id The UUID of the listing to update.
 * @param values The form values.
 */
export async function updateListing(
  id: string,
  values: z.infer<typeof UpdateListingSchema>,
) {
  try {
    console.log("=== UPDATE LISTING START ===");
    console.log("ID:", id);
    console.log("Raw values received:", JSON.stringify(values, null, 2));

    const validatedFields = UpdateListingSchema.safeParse(values);
    if (!validatedFields.success) {
      // Log detailed validation errors for debugging
      console.error("=== VALIDATION FAILED ===");
      console.error(
        "Validation errors:",
        JSON.stringify(validatedFields.error.flatten(), null, 2),
      );

      // Return detailed error message to help debug
      const errorMessages = validatedFields.error.flatten().fieldErrors;
      const firstError = Object.entries(errorMessages)[0];
      const detailedMessage = firstError
        ? `Invalid fields: ${firstError[0]} - ${firstError[1]?.[0] || "validation error"}`
        : "Invalid fields.";

      return { status: "error", message: detailedMessage };
    }

    console.log("=== VALIDATION SUCCESS ===");
    console.log(
      "Validated fields:",
      JSON.stringify(validatedFields.data, null, 2),
    );

    console.log("=== CREATING SUPABASE CLIENT ===");
    const supabase = createServerClient();

    console.log("=== EXECUTING DATABASE UPDATE ===");
    // Normalize values to satisfy DB constraints (empty strings -> nulls, zip to integer)
    const v = validatedFields.data;
    const toNull = (s?: string) =>
      typeof s === "string" && s.trim() === "" ? null : (s ?? null);
    const normalizeUrl = (s?: string) => toNull(s);
    const normalizeString = (s?: string) => toNull(s);
    const normalizeZip = (s?: string) => {
      if (!s || s.trim() === "") return null;
      const parsed = Number.parseInt(s.trim(), 10);
      return Number.isNaN(parsed) ? null : parsed;
    };
    const normalizedPayload = {
      ...v,
      // Strings with constraints: send null, not empty string
      website: normalizeUrl(v.website),
      email: normalizeString(v.email),
      phone: normalizeString(v.phone),
      city: normalizeString(v.city),
      state: normalizeString(v.state),
      // URL-like optional fields
      facebook_url: normalizeUrl(v.facebook_url),
      instagram_url: normalizeUrl(v.instagram_url),
      video_url: normalizeUrl(v.video_url),
      // Optional media fields
      profile_image: normalizeString(v.profile_image),
      // Gallery stored as text; empty string -> null
      gallery:
        typeof v.gallery === "string" && v.gallery.trim() === ""
          ? null
          : (v.gallery ?? null),
      // Zip must be integer
      zip: normalizeZip(v.zip),
    };
    console.log("Update query:", {
      table: "listings",
      id,
      data: normalizedPayload,
    });

    const { data, error } = await supabase
      .from("listings")
      .update(normalizedPayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("=== DATABASE ERROR ===");
      console.error("Database error:", JSON.stringify(error, null, 2));
      return {
        status: "error",
        message: `Database Error: Failed to update listing.${error?.message ? ` (${error.message})` : ""}`,
      };
    }

    console.log("=== UPDATE SUCCESS ===");
    console.log("Updated data:", JSON.stringify(data, null, 2));

    // Revalidate relevant paths so updates reflect immediately across the app
    // 1) Admin dashboard root and listings management page
    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/admin/listings");
    // 2) Public homepage (featured listings)
    revalidatePath("/");
    // 3) Listing detail page (by slug if present, else by id route)
    if (data?.slug) {
      revalidatePath(`/listing/${data.slug}`);
    } else if (data?.id) {
      revalidatePath(`/listing/${data.id}`);
    }
    // 4) Invalidate featured listings cache so image changes appear immediately
    revalidateTag(FEATURED_LISTINGS_CACHE_TAG);
    revalidateTag(LISTINGS_CACHE_TAG);
    revalidateTag(listingCacheTag(id));

    return {
      status: "success",
      message: "Listing updated successfully.",
      data,
    };
  } catch (e) {
    console.error("=== UNEXPECTED ERROR ===");
    console.error("Error type:", typeof e);
    console.error("Error message:", e instanceof Error ? e.message : String(e));
    console.error(
      "Error stack:",
      e instanceof Error ? e.stack : "No stack trace",
    );
    console.error("Full error object:", JSON.stringify(e, null, 2));
    return { status: "error", message: "An unexpected server error occurred." };
  }
}

/**
 * Server action to delete a listing by ID (admin only).
 */
export async function deleteListing(id: string) {
  try {
    const supabase = createServerClient();
    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (error) {
      console.error("Delete Listing Error:", error);
      return { status: "error", message: "Failed to delete listing." };
    }
    // Revalidate affected paths
    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/admin/listings");
    revalidateTag(LISTINGS_CACHE_TAG);
    return { status: "success" };
  } catch (e) {
    console.error("Unexpected error in deleteListing:", e);
    return { status: "error", message: "Unexpected server error." };
  }
}

/**
 * Server action for a vendor to claim an existing, unclaimed listing.
 */
export async function claimListing(listingId: string) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user || !user.id) {
      return {
        status: "error",
        message: "You must be logged in to claim a listing.",
      };
    }

    const supabase = createServerClient();

    // 1. Check if the listing is already claimed
    const { data: existingListing, error: fetchError } = await supabase
      .from("listings")
      .select("is_claimed, status")
      .eq("id", listingId)
      .single();

    if (fetchError || !existingListing) {
      return { status: "error", message: "Listing not found." };
    }

    if (existingListing.is_claimed) {
      return {
        status: "error",
        message: "This listing has already been claimed.",
      };
    }

    // 2. Update the listing to mark it as claimed by the current user
    const { error: updateError } = await supabase
      .from("listings")
      .update({
        is_claimed: true,
        owner_id: user.id,
        claimed_by_email: user.email,
        date_claimed: new Date().toISOString(),
        status: "Live", // Auto-approve claims
      })
      .eq("id", listingId);

    if (updateError) {
      console.error("Claim Listing Error:", updateError);
      return {
        status: "error",
        message: "Database Error: Failed to claim listing.",
      };
    }

    // 3. Revalidate paths to reflect changes
    revalidatePath("/dashboard/admin"); // For admin view
    revalidatePath("/dashboard/vendor/claim"); // For other vendors
    revalidateTag(LISTINGS_CACHE_TAG);

    return {
      status: "success",
      message: "Listing claim submitted! An admin will review it shortly.",
    };
  } catch (e) {
    console.error("Unexpected error in claimListing:", e);
    return { status: "error", message: "An unexpected server error occurred." };
  }
}
