import { rewriteListingDescription } from "@/lib/ai/description-rewriter";
import { extractListingImages } from "@/lib/image-extractor";

export type MockupTier = "standard" | "pro";

export interface MockupData {
  listingId: string;
  listingName: string;
  tier: MockupTier;
  before: {
    description: string;
    plan: string;
    image?: string;
  };
  after: {
    description: string;
    benefits: string[];
    image?: string;
  };
  pricing: {
    monthly: number;
    semiAnnual: number;
    savings: number;
  };
}

function getTierBenefits(tier: MockupTier): string[] {
  if (tier === "pro") {
    return [
      "Priority placement in search results",
      "Add social links, videos, and rich media",
      "Upgrade badge for instant credibility",
      "Direct contact links to capture inquiries",
    ];
  }

  return [
    "Rank higher than free listings",
    "Add website and key social links",
    "Clean, credible layout for parents",
    "Easy upgrade path to Pro later",
  ];
}

function getPricing(tier: MockupTier) {
  return tier === "pro"
    ? { monthly: 50, semiAnnual: 270, savings: 30 }
    : { monthly: 25, semiAnnual: 135, savings: 15 };
}

export async function generateMockup(
  listing: any,
  tier: MockupTier,
): Promise<MockupData> {
  const images = await extractListingImages({
    website: listing.website,
    categories: listing.categories,
    profileImage: listing.profile_image,
    gallery: listing.gallery,
  });

  const enhancedDescription = await rewriteListingDescription(
    {
      businessName: listing.listing_name || "Your listing",
      categories: listing.categories || [],
      website: listing.website,
      city: listing.city,
      state: listing.state,
      description:
        listing.what_you_offer || listing.description || listing.extras_notes,
      highlights: listing.tags || listing.categories,
    },
    { tier },
  );

  const pricing = getPricing(tier);

  return {
    listingId: listing.id,
    listingName: listing.listing_name || "Listing",
    tier,
    before: {
      description:
        listing.what_you_offer ||
        listing.description ||
        "We’ll highlight your services and make it easy for parents to reach out.",
      plan: listing.plan || "free",
      image: images[0],
    },
    after: {
      description: enhancedDescription,
      benefits: getTierBenefits(tier),
      image: images[0],
    },
    pricing,
  };
}

export function generateMockupEmail(
  mockup: MockupData,
  vendorName?: string | null,
) {
  const tierLabel = mockup.tier === "pro" ? "Pro" : "Standard";
  const greeting = vendorName ? `Hi ${vendorName},` : "Hi there,";

  return `
${greeting}

Here’s a quick preview of how your listing would look with our ${tierLabel} upgrade.

Before (${mockup.before.plan || "Free"}):
${mockup.before.description}

After (${tierLabel}):
${mockup.after.description}

Key upgrades:
${mockup.after.benefits.map((b) => `• ${b}`).join("\n")}

Pricing: $${mockup.pricing.monthly}/mo or $${mockup.pricing.semiAnnual} every 6 months (save $${mockup.pricing.savings}).
Reply to this email and we’ll publish it for you.
`;
}

export function generateMockupEmailHTML(
  mockup: MockupData,
  vendorName: string | null,
  slug?: string | null,
) {
  const tierLabel = mockup.tier === "pro" ? "Pro" : "Standard";
  const upgradeLink = slug
    ? `${process.env.NEXT_PUBLIC_APP_URL || "https://directory.childactor101.com"}/claim-upgrade/${slug}`
    : `${process.env.NEXT_PUBLIC_APP_URL || "https://directory.childactor101.com"}`;

  return `
  <div style="font-family: Inter, system-ui, -apple-system, sans-serif; color: #0f172a; padding: 16px; line-height: 1.6;">
    <p style="margin: 0 0 12px 0;">${vendorName ? `Hi ${vendorName},` : "Hi there,"}</p>
    <p style="margin: 0 0 12px 0;">Here’s a before/after of your listing with our ${tierLabel} upgrade. This is ready to publish — just reply and we’ll turn it on.</p>

    <div style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin: 20px 0;">
      <div style="background: #0f172a; color: white; padding: 12px 16px; font-weight: 700;">Before (${mockup.before.plan || "Free"})</div>
      <div style="padding: 16px;">
        ${mockup.before.image ? `<img src="${mockup.before.image}" alt="Before" style="width: 100%; border-radius: 10px; margin-bottom: 12px;" />` : ""}
        <p style="margin: 0; white-space: pre-line;">${mockup.before.description}</p>
      </div>
    </div>

    <div style="border: 1px solid #0ea5e9; border-radius: 12px; overflow: hidden; margin: 20px 0; box-shadow: 0 10px 40px rgba(14, 165, 233, 0.12);">
      <div style="background: linear-gradient(120deg, #0ea5e9, #2563eb); color: white; padding: 12px 16px; font-weight: 700;">After (${tierLabel})</div>
      <div style="padding: 16px;">
        ${mockup.after.image ? `<img src="${mockup.after.image}" alt="After" style="width: 100%; border-radius: 10px; margin-bottom: 12px;" />` : ""}
        <p style="margin: 0 0 12px 0; white-space: pre-line;">${mockup.after.description}</p>
        <ul style="padding-left: 18px; margin: 0 0 12px 0;">
          ${mockup.after.benefits.map((benefit) => `<li style="margin-bottom: 6px;">${benefit}</li>`).join("")}
        </ul>
        <div style="padding: 12px; background: #f8fafc; border-radius: 10px; margin-top: 8px;">
          <strong>Pricing:</strong> $${mockup.pricing.monthly}/mo or $${mockup.pricing.semiAnnual} every 6 months (save $${mockup.pricing.savings}).
        </div>
      </div>
    </div>

    <div style="text-align: center; margin-top: 16px;">
      <a href="${upgradeLink}" style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 18px; border-radius: 999px; text-decoration: none; font-weight: 700;">Preview & Upgrade</a>
      <p style="margin: 10px 0 0 0; color: #475569;">Or just reply to this email and we’ll turn it on for you.</p>
    </div>
  </div>
`;
}
