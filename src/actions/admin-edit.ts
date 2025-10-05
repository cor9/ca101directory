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
  region: string;
  bondNumber: string;
  active: boolean;
  comped: boolean;
  status: string;
  featured: boolean;
  gallery: string[];
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
      age_range: formData.tags,
      categories: formData.categories,
      plan: formData.plan,
      ca_permit_required: formData.performerPermit,
      is_bonded: formData.bonded,
      email: formData.email || null,
      phone: formData.phone || null,
      city: formData.city || null,
      state: formData.state || null,
      zip: formData.zip ? parseInt(formData.zip) : null,
      region: formData.region || null,
      bond_number: formData.bondNumber || null,
      is_active: formData.active,
      comped: formData.comped,
      status: formData.status,
      featured: formData.featured,
      gallery: JSON.stringify(formData.gallery),
      has_gallery: formData.gallery.length > 0,
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
