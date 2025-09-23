import { PricePlans } from "@/lib/submission";
import type { PriceConfig } from "@/types";

export const priceConfig: PriceConfig = {
  plans: [
    {
      title: "Free",
      description: "Basic listing to get started",
      benefits: [
        "Public listing in our directory",
        "Searchable by parents",
        "Basic contact information",
        "Reviewed and approved within 72 hours",
        "Standard customer support",
      ],
      limitations: ["No featured placement", "No logo display", "Limited visibility"],
      price: 0,
      priceSuffix: "/month",
      stripePriceId: null, // Free plan doesn't need Stripe
    },
    {
      title: "Basic",
      description: "Perfect for getting started",
      benefits: [
        "All Free features included",
        "Logo display on your listing",
        "Enhanced visibility",
        "Priority review process",
        "Email support",
      ],
      limitations: ["No featured placement", "No 101 Badge"],
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
        "SEO boosting features",
        "Priority customer support",
        "Social media promotion",
        "Advanced analytics",
      ],
      limitations: ["No 101 Badge"],
      price: 59,
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
        "Custom promotion opportunities",
        "Dedicated account manager",
      ],
      limitations: [],
      price: 99,
      priceSuffix: "/month",
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM,
    },
  ],
};
