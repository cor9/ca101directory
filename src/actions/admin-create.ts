"use server";

import { auth } from "@/auth";
import { createServerClient } from "@/lib/supabase";
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
