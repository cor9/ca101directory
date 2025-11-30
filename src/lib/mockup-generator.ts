import { rewriteListingDescription, getTierBenefits } from "./ai/description-rewriter";
import { extractImagesFromWebsite, getOpenGraphImage } from "./image-extractor";
import type { Listing } from "@/data/listings";

export type MockupTier = "standard" | "pro";

export type MockupData = {
  listingId: string;
  tier: MockupTier;
  before: {
    name: string;
    description: string;
    plan: string;
    hasLogo: boolean;
    hasGallery: boolean;
  };
  after: {
    name: string;
    description: string;
    plan: string;
    benefits: string[];
    suggestedLogo: string | null;
    suggestedGallery: string[];
  };
  pricing: {
    monthly: number;
    semiannual: number;
    savings: string;
  };
};

/**
 * Generate a complete mockup for a listing
 */
export async function generateMockup(
  listing: Listing,
  tier: MockupTier = "pro"
): Promise<MockupData> {
  // Extract current state
  const before = {
    name: listing.listing_name || "Business Name",
    description: listing.what_you_offer || listing.who_is_it_for || "No description provided",
    plan: listing.plan || "free",
    hasLogo: !!listing.profile_image,
    hasGallery: !!listing.gallery && listing.gallery.length > 0,
  };

  // Generate AI-enhanced description
  const enhancedDescription = await rewriteListingDescription(
    {
      businessName: listing.listing_name || "",
      currentDescription: before.description,
      categories: listing.categories || [],
      city: listing.city || "",
      state: listing.state || "",
      website: listing.website || "",
    },
    { tier }
  );

  // Try to extract images from website (if available)
  let suggestedLogo: string | null = null;
  let suggestedGallery: string[] = [];

  if (listing.website) {
    try {
      const ogImage = await getOpenGraphImage(listing.website);
      if (ogImage) {
        suggestedLogo = ogImage;
      }
    } catch (error) {
      console.error("Error extracting images:", error);
    }
  }

  // Get tier-specific benefits
  const benefits = getTierBenefits(tier);

  // Calculate pricing
  const pricing = {
    monthly: tier === "pro" ? 50 : 25,
    semiannual: tier === "pro" ? 199 : 101,
    savings: tier === "pro" ? "$101" : "$49",
  };

  return {
    listingId: listing.id,
    tier,
    before,
    after: {
      name: listing.listing_name || "",
      description: enhancedDescription,
      plan: tier,
      benefits,
      suggestedLogo,
      suggestedGallery,
    },
    pricing,
  };
}

/**
 * Generate email body with mockup data
 */
export function generateMockupEmail(
  mockup: MockupData,
  vendorName: string,
  listingSlug: string
): {
  subject: string;
  body: string;
} {
  const { tier, pricing, after } = mockup;

  const tierName = tier === "pro" ? "Founding Pro" : "Founding Standard";
  const subject = `Your ${after.name} listing - here's what it looks like upgraded`;

  const body = `Hi ${vendorName},

I put together a preview of what your listing would look like with our ${tierName} upgrade.

**WHAT CHANGES:**

${after.benefits.map((b) => `✓ ${b}`).join("\n")}

**YOUR NEW DESCRIPTION:**

"${after.description}"

**PRICING:**

${tierName}: $${pricing.semiannual} every 6 months
(That's $${pricing.monthly}/month if you paid monthly - you save ${pricing.savings})

This is our special founding member rate - locked in forever, even when we raise prices.

**NEXT STEP:**

Want me to push this upgrade live today?

Just reply "Yes" and I'll activate it immediately.

Your upgraded listing will appear at the top of search results with professional photos and the enhanced description above.

**Questions?**

Just reply to this email - I read every message personally.

Best,
Corey
Child Actor 101
directory.childactor101.com

P.S. I'm only offering ${tierName} pricing to a limited number of early vendors. Once these spots are gone, pricing goes up to regular rates ($${pricing.monthly * 2}/month).`;

  return { subject, body };
}

/**
 * Generate HTML email with side-by-side comparison
 */
export function generateMockupEmailHTML(
  mockup: MockupData,
  vendorName: string,
  listingSlug: string,
  beforeScreenshot?: string,
  afterScreenshot?: string
): string {
  const { tier, pricing, after, before } = mockup;
  const tierName = tier === "pro" ? "Founding Pro" : "Founding Standard";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <h2 style="color: #E4572E;">Your Upgraded Listing Preview</h2>

  <p>Hi ${vendorName},</p>

  <p>I put together a preview of what your listing would look like with our <strong>${tierName}</strong> upgrade.</p>

  ${
    beforeScreenshot && afterScreenshot
      ? `
  <table style="width: 100%; border-collapse: collapse; margin: 30px 0;">
    <tr>
      <td style="width: 50%; padding: 10px; border: 2px solid #ddd;">
        <h3 style="text-align: center; color: #666; font-size: 14px;">BEFORE (Free)</h3>
        <img src="${beforeScreenshot}" alt="Before" style="width: 100%; border-radius: 4px;">
      </td>
      <td style="width: 50%; padding: 10px; border: 2px solid #E4572E;">
        <h3 style="text-align: center; color: #E4572E; font-size: 14px;">AFTER (${tierName})</h3>
        <img src="${afterScreenshot}" alt="After" style="width: 100%; border-radius: 4px;">
      </td>
    </tr>
  </table>
  `
      : ""
  }

  <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0;">
    <h3 style="margin-top: 0; color: #92400E;">What Changes:</h3>
    <ul style="margin: 10px 0;">
      ${after.benefits.map((b) => `<li style="margin: 5px 0;">${b}</li>`).join("")}
    </ul>
  </div>

  <h3>Your Enhanced Description:</h3>
  <div style="background: #F3F4F6; padding: 15px; border-radius: 8px; font-style: italic;">
    "${after.description}"
  </div>

  <div style="background: #DBEAFE; border: 2px solid #3B82F6; padding: 20px; margin: 30px 0; border-radius: 8px; text-align: center;">
    <h3 style="margin-top: 0; color: #1E40AF;">Special Founding Member Pricing</h3>
    <p style="font-size: 24px; font-weight: bold; color: #1E40AF; margin: 10px 0;">
      $${pricing.semiannual} / 6 months
    </p>
    <p style="color: #1E40AF; margin: 5px 0;">
      Save ${pricing.savings} vs monthly billing<br>
      <strong>Price locked forever</strong>
    </p>
  </div>

  <div style="text-align: center; margin: 30px 0;">
    <a href="mailto:corey@childactor101.com?subject=Yes - Activate ${tierName} for ${after.name}"
       style="background: #E4572E; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
      Yes - Activate My Upgrade Today
    </a>
  </div>

  <p>Questions? Just reply to this email - I read every message personally.</p>

  <p style="margin-top: 30px;">
    Best,<br>
    <strong>Corey Ralston</strong><br>
    Founder, Child Actor 101<br>
    <a href="https://directory.childactor101.com" style="color: #3A76A6;">directory.childactor101.com</a>
  </p>

  <p style="font-size: 12px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
    <strong>P.S.</strong> I'm only offering ${tierName} pricing to ${tier === "pro" ? "25" : "50"} early vendors.
    Once these spots are gone, pricing goes to regular rates.
  </p>

</body>
</html>
  `;
}
