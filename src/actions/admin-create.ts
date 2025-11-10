"use server";

import { auth } from "@/auth";
import { createServerClient } from "@/lib/supabase";
import { sendListingLiveEmail } from "@/lib/mail";
import { createClaimToken, createOptOutToken } from "@/lib/tokens";
import { revalidatePath } from "next/cache";

export type AdminCreateFormData = {
  name: string;
  link?: string;
  description: string;
  introduction?: string;
  unique?: string;
  format?: string;
  notes?: string;
  imageId?: string;
  tags: string[];
  categories: string[];
  plan: string;
  performerPermit: boolean;
  bonded: boolean;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  zip?: string;
  region?: string;
  bondNumber?: string;
  active: boolean;
  comped: boolean;
  status: string;
  featured: boolean;
  approved_101: boolean;
  claimed: boolean;
  verification_status: string;
  // Social media fields
  facebook_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
  youtube_url?: string;
  linkedin_url?: string;
  blog_url?: string;
  custom_link_url?: string;
  custom_link_name?: string;
  gallery?: string[];
};

export type ServerActionResponse = {
  success: boolean;
  error?: string;
  data?: unknown;
};

/**
 * Admin server action to create a new listing
 */
export async function adminCreateListing(
  formData: AdminCreateFormData,
): Promise<ServerActionResponse> {
  try {
    const session = await auth();

    // Check if user is authenticated and is admin
    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in to perform this action",
      };
    }

    if (session.user.role !== "admin") {
      return {
        success: false,
        error: "You must be an admin to perform this action",
      };
    }

    const supabase = createServerClient();

    // Generate a slug from the name
    const slug = formData.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    // Create the listing data
    const listingData = {
      listing_name: formData.name.trim(),
      slug: slug,
      website: formData.link || null,
      what_you_offer: formData.description.trim(),
      who_is_it_for: formData.introduction || null,
      why_is_it_unique: formData.unique || null,
      format: formData.format || null,
      extras_notes: formData.notes || null,
      profile_image: formData.imageId || null,
      tags: formData.tags, // Save to proper tags field
      categories: formData.categories,
      plan: formData.plan,
      ca_permit_required: formData.performerPermit,
      is_bonded: formData.bonded,
      email: formData.email || null,
      phone: formData.phone || null,
      city: formData.city || null,
      state: formData.state || null,
      zip: formData.zip ? Number.parseInt(formData.zip) : null,
      region: formData.region || null,
      bond_number: formData.bondNumber || null,
      is_active: formData.active,
      comped: formData.comped,
      status: formData.status,
      featured: formData.featured,
      is_approved_101: formData.approved_101,
      is_claimed: formData.claimed,
      verification_status: formData.verification_status,
      gallery:
        formData.gallery && formData.gallery.length > 0
          ? JSON.stringify(formData.gallery)
          : null,
      has_gallery: formData.gallery && formData.gallery.length > 0,
      // Social media fields
      facebook_url: formData.facebook_url || null,
      instagram_url: formData.instagram_url || null,
      tiktok_url: formData.tiktok_url || null,
      youtube_url: formData.youtube_url || null,
      linkedin_url: formData.linkedin_url || null,
      blog_url: formData.blog_url || null,
      custom_link_url: formData.custom_link_url || null,
      custom_link_name: formData.custom_link_name || null,
      // Set admin-created listing metadata
      owner_id: session.user.id, // Link to admin user
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log(
      "adminCreateListing, creating listing in Supabase:",
      listingData,
    );

    const { data, error } = await supabase
      .from("listings")
      .insert([listingData])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        error: `Database error: ${error.message}`,
      };
    }

    console.log("Successfully created listing:", data);

    // Revalidate the listings pages to show the new listing
    revalidatePath("/dashboard/admin/listings");
    revalidatePath("/dashboard/admin");
    revalidatePath("/");
    revalidatePath("/directory");

    // Notify vendor if email present with individualized claim/upgrade links
    try {
      const email = (data?.email || "").trim();
      if (email) {
        let token: string | null = null;
        try {
          token = createClaimToken(data.id);
        } catch (e) {
          console.error(
            "adminCreateListing: claim token unavailable (NEXTAUTH_SECRET missing?)",
            e,
          );
        }
        const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://directory.childactor101.com";
        const slug = (data.listing_name || "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        const claimUrl = token
          ? `${siteUrl}/claim/${encodeURIComponent(token)}?lid=${encodeURIComponent(data.id)}`
          : `${siteUrl}/claim-upgrade/${encodeURIComponent(slug)}?lid=${encodeURIComponent(data.id)}`;
        const upgradeUrl = `${siteUrl}/claim-upgrade/${encodeURIComponent(slug)}?lid=${encodeURIComponent(data.id)}&utm_source=email&utm_medium=listing_live`;
        const manageUrl = `${siteUrl}/dashboard/vendor?lid=${encodeURIComponent(data.id)}`;
        let optOutUrl = `${siteUrl}/support`;
        try {
          optOutUrl = `${siteUrl}/remove/${encodeURIComponent(createOptOutToken(data.id))}?lid=${encodeURIComponent(data.id)}`;
        } catch (e) {
          console.error("adminCreateListing: opt-out token unavailable", e);
        }
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
      }
    } catch (notifyErr) {
      console.error("adminCreateListing: failed to send listing live email", notifyErr);
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Error in adminCreateListing:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

/**
 * Admin server action to bulk create listings (Free plan by default)
 */
export async function adminBulkCreateListings(
  items: AdminCreateFormData[],
): Promise<ServerActionResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return {
        success: false,
        error: "Admin authentication required",
      };
    }

    const supabase = createServerClient();

    const now = new Date().toISOString();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

    const rows = items.map((formData, index) => {
      const slug = (formData.name || "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      return {
        __row: index + 1,
        listing_name: (formData.name || "").trim(),
        slug,
        website: formData.link || null,
        what_you_offer: (formData.description || "").trim(),
        who_is_it_for: formData.introduction || null,
        why_is_it_unique: formData.unique || null,
        format: formData.format || null,
        extras_notes: formData.notes || null,
        profile_image: formData.imageId || null,
        tags: formData.tags ?? [],
        categories: formData.categories ?? [],
        // Force Free plan and Pending status for bulk
        plan: "Free",
        status: formData.status || "Pending",
        ca_permit_required: !!formData.performerPermit,
        is_bonded: !!formData.bonded,
        email: formData.email || null,
        phone: formData.phone || null,
        city: formData.city || null,
        state: formData.state || null,
        zip: formData.zip ? Number.parseInt(formData.zip) : null,
        region: formData.region || null,
        bond_number: formData.bondNumber || null,
        is_active: formData.active ?? true,
        comped: false,
        featured: formData.featured ?? false,
        is_approved_101: formData.approved_101 ?? false,
        is_claimed: formData.claimed ?? false,
        verification_status: formData.verification_status || "unverified",
        gallery:
          formData.gallery && formData.gallery.length > 0
            ? JSON.stringify(formData.gallery)
            : null,
        has_gallery: Boolean(formData.gallery && formData.gallery.length > 0),
        // Socials
        facebook_url: formData.facebook_url || null,
        instagram_url: formData.instagram_url || null,
        tiktok_url: formData.tiktok_url || null,
        youtube_url: formData.youtube_url || null,
        linkedin_url: formData.linkedin_url || null,
        blog_url: formData.blog_url || null,
        custom_link_url: formData.custom_link_url || null,
        custom_link_name: formData.custom_link_name || null,
        // metadata
        owner_id: session.user.id,
        created_at: now,
        updated_at: now,
      };
    });

    // Validate and check duplicates per-row
    const report: Array<{ row: number; status: string; reason?: string; id?: string }> = [];
    const toInsert: any[] = [];

    for (const r of rows) {
      if (!r.listing_name || r.listing_name.length === 0) {
        report.push({ row: r.__row, status: "skipped_empty_name" });
        continue;
      }
      if (r.email && !emailRegex.test(r.email)) {
        report.push({ row: r.__row, status: "invalid_email", reason: r.email });
        continue;
      }
      // duplicate by website (case-insensitive, ignoring scheme)
      let duplicate = false;
      if (r.website) {
        const clean = String(r.website).replace(/^https?:\/\//i, "");
        const { data: dup } = await supabase
          .from("listings")
          .select("id, website")
          .ilike("website", `%${clean}%`)
          .limit(1);
        if (dup && dup.length > 0) duplicate = true;
      }
      if (!duplicate) {
        const { data: dupByName } = await supabase
          .from("listings")
          .select("id")
          .ilike("listing_name", r.listing_name)
          .limit(1);
        if (dupByName && dupByName.length > 0) duplicate = true;
      }
      if (duplicate) {
        report.push({ row: r.__row, status: "skipped_duplicate" });
        continue;
      }
      const { __row, ...rowForInsert } = r as any;
      toInsert.push(rowForInsert);
    }

    if (toInsert.length === 0) {
      return { success: false, error: "No valid rows after validation" };
    }

    const { data, error } = await supabase
      .from("listings")
      .insert(toInsert)
      .select();

    if (error) {
      console.error("Supabase bulk insert error:", error);
      return { success: false, error: `Database error: ${error.message}` };
    }

    // Vendor notifications with individualized claim/upgrade links
    try {
      if (Array.isArray(data)) {
        for (const row of data) {
          const email = (row.email || "").trim();
          if (email) {
            let token: string | null = null;
            try {
              token = createClaimToken(row.id);
            } catch (e) {
              console.error(
                "adminBulkCreateListings: claim token unavailable",
                e,
              );
            }
            const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://directory.childactor101.com";
            const slug = (row.listing_name || "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
            const claimUrl = token
              ? `${siteUrl}/claim/${encodeURIComponent(token)}?lid=${encodeURIComponent(row.id)}`
              : `${siteUrl}/claim-upgrade/${encodeURIComponent(slug)}?lid=${encodeURIComponent(row.id)}`;
            const upgradeUrl = `${siteUrl}/claim-upgrade/${encodeURIComponent(slug)}?lid=${encodeURIComponent(row.id)}&utm_source=email&utm_medium=listing_live`;
            const manageUrl = `${siteUrl}/dashboard/vendor?lid=${encodeURIComponent(row.id)}`;
            let optOutUrl = `${siteUrl}/support`;
            try {
              optOutUrl = `${siteUrl}/remove/${encodeURIComponent(createOptOutToken(row.id))}?lid=${encodeURIComponent(row.id)}`;
            } catch (e) {
              console.error("adminBulkCreateListings: opt-out token unavailable", e);
            }
            await sendListingLiveEmail({
              vendorName: row.listing_name || "",
              vendorEmail: email,
              listingName: row.listing_name || "",
              slug,
              listingId: row.id,
              claimUrl,
              upgradeUrl,
              manageUrl,
              optOutUrl,
            });
          }
        }
      }
    } catch (notifyErr) {
      console.error("adminBulkCreateListings: listing live email failed", notifyErr);
    }

    revalidatePath("/dashboard/admin/listings");
    revalidatePath("/dashboard/admin");
    revalidatePath("/");
    revalidatePath("/directory");

    return { success: true, data: { created: data, report } };
  } catch (error) {
    console.error("Error in adminBulkCreateListings:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
