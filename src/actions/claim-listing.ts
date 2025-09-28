"use server";

import { sendClaimVerificationEmail } from "@/lib/mail";
import { sanityClient } from "@/sanity/lib/client";
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

    // Find the listing by slug
    const listings = await sanityClient.fetch(
      `*[_type == "item" && slug.current == $slug][0]`,
      { slug: data.listingSlug }
    );

    if (!listings) {
      return { status: "error", message: "Listing not found" };
    }

    // Check if listing is already claimed
    if (listings.claimedBy) {
      return { status: "error", message: "This listing has already been claimed" };
    }

    // Generate verification token
    const verificationToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store claim request
    await sanityClient.create({
      _type: "claimRequest",
      listing: {
        _type: "reference",
        _ref: listings._id,
      },
      email: data.email,
      businessName: data.businessName,
      verificationMessage: data.verificationMessage,
      verificationToken,
      expiresAt,
      status: "pending",
    });

    // Send verification email
    await sendClaimVerificationEmail({
      to: data.email,
      businessName: data.businessName,
      listingName: listings.name,
      verificationToken,
      listingSlug: data.listingSlug,
    });

    return { status: "success", message: "Verification email sent!" };
  } catch (error) {
    console.error("Claim listing error:", error);
    return { status: "error", message: "Failed to process claim request" };
  }
}
