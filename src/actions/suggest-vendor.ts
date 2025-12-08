"use server";

import { createVendorSuggestion } from "@/data/suggestions";
import { sendDiscordNotification } from "@/lib/discord";
import { sendAdminVendorSuggestionNotification } from "@/lib/mail";
import type { VendorSuggestionFormData } from "@/lib/schemas";

export async function suggestVendor(formData: VendorSuggestionFormData) {
  try {
    // Create record in Supabase
    await createVendorSuggestion({
      vendor_name: formData.name,
      website: formData.website || "",
      category: formData.category,
      city: formData.city || "",
      state: formData.state || "",
      region: undefined, // removed field
      notes: formData.notes || "",
      suggested_by: formData.suggestedBy || "",
      vendor_email: formData.vendorEmail || "",
      vendor_phone: formData.vendorPhone || "",
    });

    console.log("✅ Vendor suggestion submitted to Supabase");

    // Notify admin (non-blocking)
    sendAdminVendorSuggestionNotification({
      vendorName: formData.name,
      website: formData.website,
      category: formData.category,
      city: formData.city,
      state: formData.state,
      vendorEmail: formData.vendorEmail,
      vendorPhone: formData.vendorPhone,
      suggestedBy: formData.suggestedBy,
    }).catch((e) => console.warn("Admin suggestion email failed:", e));

    // Discord notification (non-blocking)
    sendDiscordNotification("📝 New Vendor Suggestion", [
      { name: "Vendor", value: formData.name, inline: true },
      formData.category
        ? { name: "Category", value: formData.category, inline: true }
        : { name: "Category", value: "N/A", inline: true },
      {
        name: "Suggested By",
        value: formData.suggestedBy || "Anonymous",
        inline: true,
      },
      formData.website
        ? { name: "Website", value: formData.website, inline: false }
        : { name: "Website", value: "N/A", inline: false },
      {
        name: "Location",
        value:
          `${formData.city || ""}${formData.city && formData.state ? ", " : ""}${formData.state || ""}` ||
          "N/A",
        inline: false,
      },
    ]).catch((e) => console.warn("Discord suggestion notification failed:", e));

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
