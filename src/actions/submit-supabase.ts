"use server";

import { currentUser } from "@/lib/auth";
import { SubmitSchema } from "@/lib/schemas";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

type BaseSubmitFormData = {
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
  gallery?: string[];
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
  active?: boolean;
};

export type SubmitFormData = BaseSubmitFormData;

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
  id?: string;
  listingId?: string;
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

    console.log("submitToSupabase, data:", formData);
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
    } = SubmitSchema.parse(formData);

    console.log(
      "submitToSupabase, name:",
      name,
      "link:",
      link,
      "plan:",
      plan,
      "region:",
      region,
    );

    // Create listing data for Supabase
    const listingData = {
      listing_name: name,
      website: link,
      what_you_offer: description,
      who_is_it_for: introduction,
      why_is_it_unique: unique,
      format: format?.toLowerCase(),
      extras_notes: notes,
      email: email,
      phone: phone,
      city: city,
      state: state,
      zip: zip ? Number.parseInt(zip, 10) : null,
      region: region,
      categories: categories,
      age_range: tags,
      profile_image: imageId,
      gallery: gallery && gallery.length > 0 ? JSON.stringify(gallery) : null,
      plan: plan, // Keep plan as-is since forms already send correct values
      ca_permit_required: performerPermit,
      is_bonded: bonded,
      bond_number: bondNumber,
      status: "Pending",
      is_active: active ?? true,
      is_claimed: false,
      owner_id: user?.id || null, // Link to current user if authenticated
      is_approved_101: false,
    };

    console.log("submitToSupabase, creating listing in Supabase:", listingData);

    let data: any;
    let error: any;

    if (formData.isEdit && formData.listingId) {
      // Update existing listing
      console.log("Updating existing listing:", formData.listingId);
      const updateData = {
        ...listingData,
        // Keep existing status and ownership for edits
        status: undefined, // Don't change status on edit
        owner_id: undefined, // Don't change ownership on edit
        is_claimed: undefined, // Don't change claimed status on edit
        updated_at: new Date().toISOString(),
      };

      ({ data, error } = await supabase
        .from("listings")
        .update(updateData)
        .eq("id", formData.listingId)
        .eq("owner_id", user?.id) // Ensure user owns this listing
        .select()
        .single());
    } else {
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

    // Revalidate the submit page and homepage
    revalidatePath("/submit");
    revalidatePath("/");

    return {
      status: "success",
      message: formData.isEdit
        ? "Successfully updated listing"
        : "Successfully submitted listing",
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
