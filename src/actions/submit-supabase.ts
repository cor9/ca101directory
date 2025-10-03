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
  formData: SubmitFormData,
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
      format: format,
      extras_notes: notes,
      email: email,
      phone: phone,
      city: city,
      state: state,
      zip: zip,
      region: region,
      categories: categories.join(","),
      age_range: tags.join(","),
      profile_image: imageId,
      gallery: formData.gallery || null,
      plan: plan,
      ca_performer_permit: performerPermit,
      bonded_for_advanced_fees: bonded,
      bond_number: bondNumber,
      status: "Pending",
      active: true,
      claimed: false,
      owner_id: user?.id || null,
      approved_101_badge: false,
    };

    console.log("submitToSupabase, creating listing in Supabase:", listingData);

    // Insert into Supabase
    const { data, error } = await supabase
      .from("listings")
      .insert([listingData])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return {
        status: "error",
        message: `Failed to submit listing: ${error.message}`,
      };
    }

    console.log("submitToSupabase, success, listingId:", data.id);

    // Revalidate the submit page and homepage
    revalidatePath("/submit");
    revalidatePath("/");

    return {
      status: "success",
      message: "Successfully submitted listing",
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
