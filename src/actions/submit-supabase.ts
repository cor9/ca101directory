"use server";

import { currentUser } from "@/lib/auth";
import { sendListingSubmittedEmail } from "@/lib/mail";
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
      facebook_url,
      instagram_url,
      tiktok_url,
      youtube_url,
      linkedin_url,
      blog_url,
      custom_link_url,
      custom_link_name,
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
      // NEW submissions: Auto-approve paid plans, review free plans
      status:
        formData.plan === "Free" || formData.plan === "free"
          ? "Pending"
          : "Live",
      is_active: active ?? true,
      is_claimed: false,
      owner_id: user?.id || null, // Link to current user if authenticated
      is_approved_101: false,
      // Social media fields
      facebook_url: facebook_url || null,
      instagram_url: instagram_url || null,
      tiktok_url: tiktok_url || null,
      youtube_url: youtube_url || null,
      linkedin_url: linkedin_url || null,
      blog_url: blog_url || null,
      custom_link_url: custom_link_url || null,
      custom_link_name: custom_link_name || null,
    };

    console.log("submitToSupabase, creating listing in Supabase:", listingData);

    let data: { id: string } | null;
    let error: { message: string } | null;

    if (formData.isEdit && formData.listingId) {
      // Update existing listing
      console.log("Updating existing listing:", formData.listingId);

      // Get current listing status and plan first
      const { data: currentListingStatus } = await supabase
        .from("listings")
        .select("status, plan")
        .eq("id", formData.listingId)
        .single();

      // Get current listing to preserve ownership and claimed status
      const { data: currentListing } = await supabase
        .from("listings")
        .select("owner_id, is_claimed, plan")
        .eq("id", formData.listingId)
        .single();

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

      const updateData = {
        ...listingData,
        // ALL EDITS require review (free and paid)
        status:
          currentListingStatus?.status === "Live"
            ? "Pending"
            : currentListingStatus?.status || "Pending",
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

    // Send confirmation email (non-blocking, don't fail if email fails)
    if (user?.email) {
      const userName = user.name || user.email?.split("@")[0] || "Vendor";
      sendListingSubmittedEmail(
        userName,
        user.email,
        name,
        data.id,
        plan,
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

    // Determine success message based on plan and action
    let successMessage = "";
    if (formData.isEdit) {
      // ALL EDITS require review (free and paid)
      successMessage =
        "Successfully updated listing! Your listing remains visible with the current information while changes are reviewed (typically within 24-48 hours). You'll receive an email when changes go live.";
    } else if (formData.plan === "Free" || formData.plan === "free") {
      // NEW FREE submissions require review
      successMessage =
        "Successfully submitted listing! Your listing will be reviewed within 24-48 hours. You'll receive an email confirmation when it goes live.";
    } else {
      // NEW PAID submissions go live immediately
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
