import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

/**
 * AI-powered description rewriter for listing mockups
 * Uses OpenAI to create compelling, conversion-focused descriptions
 */

export type ListingInfo = {
  businessName: string;
  currentDescription?: string;
  categories: string[];
  city?: string;
  state?: string;
  website?: string;
};

export type RewriteOptions = {
  tier: "standard" | "pro";
  tone?: "professional" | "friendly" | "persuasive";
};

/**
 * Rewrite a listing description to be more compelling
 */
export async function rewriteListingDescription(
  listing: ListingInfo,
  options: RewriteOptions = { tier: "pro" }
): Promise<string> {
  const { businessName, currentDescription, categories, city, state } = listing;
  const { tier, tone = "persuasive" } = options;

  const prompt = `You are a conversion copywriter for a child actor services directory.

Rewrite this business listing to be compelling and conversion-focused.

BUSINESS INFO:
- Name: ${businessName}
- Categories: ${categories.join(", ")}
- Location: ${city}, ${state}
- Current description: ${currentDescription || "No description provided"}

TIER: ${tier.toUpperCase()} (${tier === "pro" ? "$50/mo - premium features" : "$25/mo - enhanced visibility"})

REQUIREMENTS:
- Write in ${tone} tone
- Focus on benefits, not features
- Include social proof if possible
- Highlight what makes them unique
- Target parent audience searching for child acting services
- 3-4 short paragraphs
- Include a "Perfect for:" section at the end
- Use compelling, action-oriented language
- ${tier === "pro" ? "Premium positioning - emphasize exclusivity and results" : "Value positioning - emphasize affordability and quality"}

FORMAT:
[Strong opening hook about their unique value]

[Why they're different - 3-4 bullet points with emojis]

[Social proof or credentials if available]

Perfect for: [specific target audience]

Write the description now:`;

  try {
    const { text } = await generateText({
      model: openai("gpt-4-turbo"),
      prompt,
      maxTokens: 500,
      temperature: 0.7,
    });

    return text.trim();
  } catch (error) {
    console.error("Error rewriting description:", error);
    // Fallback to template-based description
    return generateTemplateDescription(listing, options);
  }
}

/**
 * Fallback: Generate template-based description if AI fails
 */
function generateTemplateDescription(
  listing: ListingInfo,
  options: RewriteOptions
): string {
  const { businessName, categories, city, state } = listing;
  const { tier } = options;

  const primaryCategory = categories[0] || "Professional Services";

  if (tier === "pro") {
    return `${businessName} - Premium ${primaryCategory} for Young Performers

Specializing in child actors and young performers in ${city}, ${state}.

What makes us different:
✓ Proven track record of success
✓ Industry-experienced professionals
✓ Personalized attention for each student
✓ Results-focused approach

Join the families who trust ${businessName} for their child's entertainment career development.

Perfect for: Aspiring young actors, experienced performers, and families committed to their child's success.`;
  } else {
    return `${businessName} - Quality ${primaryCategory} in ${city}

Trusted by families across ${state} for professional ${primaryCategory.toLowerCase()}.

What we offer:
✓ Experienced professionals
✓ Personalized service
✓ Convenient location
✓ Proven results

Helping young actors achieve their dreams since [year].

Perfect for: Families seeking quality ${primaryCategory.toLowerCase()} at an affordable price.`;
  }
}

/**
 * Generate bullet points highlighting tier benefits
 */
export function getTierBenefits(tier: "standard" | "pro"): string[] {
  if (tier === "pro") {
    return [
      "Featured placement - appear first in search results",
      "Professional photo gallery (4 images)",
      "Social media integration",
      "101 Approved Badge eligibility",
      "Priority customer support",
      "Enhanced analytics",
    ];
  } else {
    return [
      "Enhanced visibility - appear higher in search",
      "Professional logo display",
      "Edit your listing anytime",
      "Better search ranking",
      "Email support",
    ];
  }
}
