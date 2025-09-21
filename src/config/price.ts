import { PricePlans } from "@/lib/submission";
import type { PriceConfig } from "@/types";

export const priceConfig: PriceConfig = {
  plans: [
    {
      title: "Basic",
      description: "Perfect for getting started",
      benefits: [
        "Public listing in our directory",
        "Searchable by parents",
        "Basic contact information",
        "Reviewed and approved within 72 hours",
        "Standard customer support",
      ],
      limitations: ["No featured placement", "No logo display"],
      price: 29,
      priceSuffix: "/month",
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_BASIC,
    },
    {
      title: "Pro",
      description: "For established professionals",
      benefits: [
        "All Basic features included",
        "Featured placement at top of listings",
        "Logo display on your listing",
        "SEO boosting features",
        "Priority customer support",
        "Social media promotion",
      ],
      limitations: [],
      price: 49,
      priceSuffix: "/month",
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO,
    },
    {
      title: "Premium",
      description: "For top-tier professionals",
      benefits: [
        "All Pro features included",
        "101 Badge (if qualified)",
        "Priority placement",
        "Premium customer support",
        "Advanced analytics",
        "Custom promotion opportunities",
      ],
      limitations: [],
      price: 99,
      priceSuffix: "/month",
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM,
    },
    {
      title: "101 Badge Add-On",
      description: "Add our trusted badge",
      benefits: [
        "Add 101 Badge to existing listing",
        "Shows you're vetted by Child Actor 101",
        "One-time payment",
        "Instant activation",
      ],
      limitations: ["Requires existing listing", "Must meet 101 standards"],
      price: 25,
      priceSuffix: " one-time",
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_ADDON,
    },
  ],
};
