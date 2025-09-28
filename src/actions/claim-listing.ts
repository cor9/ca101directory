"use server";

import { getListingById, updateListingClaim } from "@/lib/airtable";
import { redirect } from "next/navigation";
import { z } from "zod";

const claimSchema = z.object({
  listingSlug: z.string().min(1),
  email: z.string().email(),
  businessName: z.string().min(1),
  verificationMessage: z.string().optional(),
  plan: z.string().optional(),
});

export async function claimListing(formData: FormData) {
  try {
    const data = claimSchema.parse({
      listingSlug: formData.get("listingSlug"),
      email: formData.get("email"),
      businessName: formData.get("businessName"),
      verificationMessage: formData.get("verificationMessage"),
      plan: formData.get("plan"),
    });

    // Find the listing by slug (convert slug back to business name)
    const businessName = data.listingSlug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const listing = await getListingById(businessName);

    if (!listing) {
      redirect(`/claim/${data.listingSlug}?error=listing-not-found`);
    }

    // Check if listing is already claimed
    if (listing.claimed) {
      redirect(`/claim/${data.listingSlug}?error=already-claimed`);
    }

    // Generate verification token
    const verificationToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update the listing in Airtable with claim information
    const claimDate = new Date().toISOString();
    const success = await updateListingClaim(listing.id, {
      claimed: true,
      claimedByEmail: data.email,
      claimDate: claimDate,
      verificationStatus: "Pending",
      plan: data.plan || "Free",
    });

    if (!success) {
      console.error("Failed to update listing claim status");
      redirect(`/claim/${data.listingSlug}?error=processing-failed`);
    }

    // Send verification email (dynamic import to avoid build-time initialization)
    try {
      const { sendClaimVerificationEmail } = await import("@/lib/claim-verification-email");
      await sendClaimVerificationEmail({
        to: data.email,
        businessName: data.businessName,
        listingName: listing.businessName,
        verificationToken,
        listingSlug: data.listingSlug,
      });
    } catch (emailError) {
      console.warn("Failed to send verification email:", emailError);
      // Continue with the claim process even if email fails
    }

    redirect(`/claim/${data.listingSlug}?success=email-sent`);
  } catch (error) {
    console.error("Claim listing error:", error);
    redirect(`/claim/${formData.get("listingSlug")}?error=processing-failed`);
  }
}
