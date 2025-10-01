"use server";

import type { VendorSuggestionFormData } from "@/lib/schemas";
import { createVendorSuggestion } from "@/data/suggestions";

export async function suggestVendor(formData: VendorSuggestionFormData) {
  try {
    // Create record in Supabase
    await createVendorSuggestion({
      vendor_name: formData.name,
      website: formData.website || "",
      category: formData.category,
      city: formData.city,
      state: formData.state,
      region: formData.region,
      notes: formData.notes || "",
      suggested_by: formData.suggestedBy || "",
    });

    console.log("✅ Vendor suggestion submitted to Supabase");

    return {
      success: true,
      message:
        "Thank you! Your vendor suggestion has been submitted for review.",
    };
  } catch (error) {
    console.error("❌ Error submitting vendor suggestion:", error);

    return {
      success: false,
      message:
        "Sorry, there was an error submitting your suggestion. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
