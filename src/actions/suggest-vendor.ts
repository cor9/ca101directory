"use server";

import type { VendorSuggestionFormData } from "@/lib/schemas";
import Airtable from "airtable";

// Initialize Airtable
const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY || "",
});

const base = airtable.base(process.env.AIRTABLE_BASE_ID || "");

export async function suggestVendor(formData: VendorSuggestionFormData) {
  try {
    // Transform form data to Airtable format
    const airtableRecord = {
      "Vendor Name": formData.name,
      Website: formData.website || "",
      Category: formData.category,
      City: formData.city,
      State: formData.state,
      Region: formData.region,
      Notes: formData.notes || "",
      "Suggested By": formData.suggestedBy || "",
      Status: "New",
      "Created Time": new Date().toISOString(),
    };

    // Create record in Vendor Suggestions table
    const record = await base("Vendor Suggestions").create(airtableRecord);

    console.log("✅ Vendor suggestion submitted to Airtable:", record.id);

    return {
      success: true,
      message:
        "Thank you! Your vendor suggestion has been submitted for review.",
      recordId: record.id,
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
