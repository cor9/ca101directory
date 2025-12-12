import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export type RewriteOptions = {
  tier?: "standard" | "pro";
};

export type ListingInfo = {
  businessName: string;
  categories: string[];
  website?: string | null;
  city?: string | null;
  state?: string | null;
  description?: string | null;
  highlights?: string[] | null;
};

const tierAngles: Record<"standard" | "pro", string> = {
  standard:
    "Position this as a polished starter profile focused on trust, clarity, and a clear call to book.",
  pro: "Position this as premium and in-demand, with social proof, urgency, and a clear ROI angle.",
};

function buildFallbackCopy(listing: ListingInfo, tier: "standard" | "pro") {
  const location = [listing.city, listing.state].filter(Boolean).join(", ");
  const category = listing.categories?.[0] || "service provider";
  const tierTagline =
    tier === "pro"
      ? "Stand-out premium profile with priority placement"
      : "Clean, trustworthy profile that parents can act on";

  return [
    `${listing.businessName} — ${category}${location ? ` in ${location}` : ""}.`,
    tierTagline,
    listing.description ||
      "We help young performers succeed with dependable, parent-approved support.",
    "• What we do: Clear, parent-friendly services",
    "• Why choose us: Reliable, vetted, and easy to book",
    "• Next step: Reply to this email and we’ll set everything up for you",
  ].join("\n");
}

export async function rewriteListingDescription(
  listing: ListingInfo,
  options: RewriteOptions = { tier: "pro" },
): Promise<string> {
  const tier = options.tier || "pro";

  // If OpenAI key is missing, return a high-quality fallback so the flow still works
  if (!process.env.OPENAI_API_KEY) {
    return buildFallbackCopy(listing, tier);
  }

  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Rewrite this business listing to sound clear, compelling, and upgrade-worthy. Keep it concise (140-200 words), scannable, and parent-friendly.

Business name: ${listing.businessName}
Category: ${(listing.categories || []).join(", ") || "General"}
Website: ${listing.website || "N/A"}
Location: ${[listing.city, listing.state].filter(Boolean).join(", ") || "N/A"}
Tier: ${tier}
Current description: ${listing.description || "(no description provided)"}
Highlights: ${(listing.highlights || []).join(", ") || "None"}

Writing rules:
- ${tierAngles[tier]}
- Use confident but warm tone; avoid hype
- Make benefits explicit for parents and talent
- Include 3-4 short bullets with tangible outcomes
- Close with a single, clear next step to book or inquire
`,
      maxTokens: 400,
      temperature: 0.7,
    });

    return text.trim();
  } catch (error) {
    console.error("rewriteListingDescription fallback due to error", error);
    return buildFallbackCopy(listing, tier);
  }
}
