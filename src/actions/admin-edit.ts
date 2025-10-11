"use server";

import { auth } from "@/auth";
import { createServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export type AdminEditFormData = {
  listingId: string;
  name: string;
  link: string;
  description: string;
  introduction: string;
  unique: string;
  format: string;
  notes: string;
  imageId: string;
  tags: string[];
  categories: string[];
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
  active: boolean;
  comped: boolean;
  status: string;
  featured: boolean;
  approved_101: boolean;
  claimed: boolean;
  verification_status: string;
  gallery: string[];
  // Social media fields
  facebook_url: string;
  instagram_url: string;
  tiktok_url: string;
  youtube_url: string;
  linkedin_url: string;
  blog_url: string;
  custom_link_url: string;
  custom_link_name: string;
  isEdit?: boolean;
};

export type ServerActionResponse = {
  success: boolean;
  error?: string;
  data?: any;
};

/**
 * Admin server action to update any listing regardless of ownership
 */
export async function adminUpdateListing(
  formData: AdminEditFormData,
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

    // Prepare the update data
    const updateData = {
      listing_name: formData.name.trim(),
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
      status: formData.status, // Admin can approve by changing Pending → Live
      featured: formData.featured,
      is_approved_101: formData.approved_101,
      is_claimed: formData.claimed,
      verification_status: formData.verification_status,
      gallery: JSON.stringify(formData.gallery),
      has_gallery: formData.gallery.length > 0,
      // Social media fields
      facebook_url: formData.facebook_url || null,
      instagram_url: formData.instagram_url || null,
      tiktok_url: formData.tiktok_url || null,
      youtube_url: formData.youtube_url || null,
      linkedin_url: formData.linkedin_url || null,
      blog_url: formData.blog_url || null,
      custom_link_url: formData.custom_link_url || null,
      custom_link_name: formData.custom_link_name || null,
      updated_at: new Date().toISOString(),
    };

    // Update the listing
    const { data, error } = await supabase
      .from("listings")
      .update(updateData)
      .eq("id", formData.listingId)
      .select()
      .single();

    if (error) {
      console.error("Error updating listing:", error);
      return {
        success: false,
        error: "Failed to update listing. Please try again.",
      };
    }

    // Revalidate the relevant pages
    revalidatePath("/dashboard/admin/listings");
    revalidatePath(`/listing/${data.id}`);
    revalidatePath("/");

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("adminUpdateListing error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
