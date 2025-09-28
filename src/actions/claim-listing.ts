"use server";

import { sendClaimVerificationEmail } from "@/lib/claim-verification-email";
import { getListingById } from "@/lib/airtable";
import { redirect } from "next/navigation";
import { z } from "zod";

const claimSchema = z.object({
  listingSlug: z.string().min(1),
  email: z.string().email(),
  businessName: z.string().min(1),
  verificationMessage: z.string().optional(),
});

export async function claimListing(formData: FormData) {
  try {
    const data = claimSchema.parse({
      listingSlug: formData.get("listingSlug"),
      email: formData.get("email"),
      businessName: formData.get("businessName"),
      verificationMessage: formData.get("verificationMessage"),
    });

    // Find the listing by slug (convert slug back to business name)
    const businessName = data.listingSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const listing = await getListingById(businessName);

    if (!listing) {
      return { status: "error", message: "Listing not found" };
    }

    // Check if listing is already claimed
    if (listing.claimedBy) {
      return {
        status: "error",
        message: "This listing has already been claimed",
      };
    }

    // Generate verification token
    const verificationToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // TODO: Store claim request in database (Supabase or Airtable)
    // For now, we'll just send the email and handle verification differently

    // Send verification email
    await sendClaimVerificationEmail({
      to: data.email,
      businessName: data.businessName,
      listingName: listing.businessName,
      verificationToken,
      listingSlug: data.listingSlug,
    });

    return { status: "success", message: "Verification email sent!" };
  } catch (error) {
    console.error("Claim listing error:", error);
    return { status: "error", message: "Failed to process claim request" };
  }
}
