import { PricePlans } from "@/lib/submission";
import type { PriceConfig } from "@/types";

// Production Stripe Price IDs - Update these with your live Stripe price IDs
export const STRIPE_PRICE_IDS = {
  FREE: null, // Free plan doesn't need Stripe
  BASIC_MONTHLY: "price_basic_monthly_id", // Replace with actual price ID
  PRO_MONTHLY: "price_pro_monthly_id", // Replace with actual price ID
  PREMIUM_MONTHLY: "price_premium_monthly_id", // Replace with actual price ID
  BASIC_ANNUAL: "price_basic_annual_id", // Replace with actual price ID
  PRO_ANNUAL: "price_pro_annual_id", // Replace with actual price ID
  PREMIUM_ANNUAL: "price_premium_annual_id", // Replace with actual price ID
} as const;

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
      limitations: [
        "No featured placement",
        "No logo display",
        "Limited visibility",
      ],
      price: 0,
      priceSuffix: "/forever",
      stripePriceId: STRIPE_PRICE_IDS.FREE,
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
      price: 25,
      priceSuffix: "/month",
      stripePriceId: STRIPE_PRICE_IDS.BASIC_MONTHLY,
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
      price: 50,
      priceSuffix: "/month",
      stripePriceId: STRIPE_PRICE_IDS.PRO_MONTHLY,
    },
    {
      title: "Premium",
      description: "For top-tier professionals",
      benefits: [
        "All Pro features included",
        "101 Approved Badge",
        "Priority placement",
        "Dedicated support",
        "Advanced analytics",
        "Social media promotion",
      ],
      limitations: [],
      price: 90,
      priceSuffix: "/month",
      stripePriceId: STRIPE_PRICE_IDS.PREMIUM_MONTHLY,
    },
  ],
  annualPlans: [
    {
      title: "Basic Annual",
      description: "Perfect for getting started",
      benefits: [
        "All Basic features included",
        "Logo display on your listing",
        "Enhanced visibility",
        "Priority review process",
        "Email support",
        "2 months free (save $50)",
      ],
      limitations: ["No featured placement", "No 101 Badge"],
      price: 250,
      priceSuffix: "/year",
      stripePriceId: STRIPE_PRICE_IDS.BASIC_ANNUAL,
    },
    {
      title: "Pro Annual",
      description: "For established professionals",
      benefits: [
        "All Pro features included",
        "Featured placement at top of listings",
        "SEO boosting features",
        "Priority customer support",
        "Social media promotion",
        "Advanced analytics",
        "2 months free (save $100)",
      ],
      limitations: ["No 101 Badge"],
      price: 500,
      priceSuffix: "/year",
      stripePriceId: STRIPE_PRICE_IDS.PRO_ANNUAL,
    },
    {
      title: "Premium Annual",
      description: "For top-tier professionals",
      benefits: [
        "All Premium features included",
        "101 Approved Badge",
        "Priority placement",
        "Dedicated support",
        "Advanced analytics",
        "Social media promotion",
        "2 months free (save $180)",
      ],
      limitations: [],
      price: 900,
      priceSuffix: "/year",
      stripePriceId: STRIPE_PRICE_IDS.PREMIUM_ANNUAL,
    },
  ],
};
