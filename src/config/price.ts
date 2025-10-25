import { PricePlans } from "@/lib/submission";
import type { PriceConfig } from "@/types";

// Production Stripe Payment Links - Direct links to Stripe checkout
export const STRIPE_PAYMENT_LINKS = {
  FREE: null, // Free plan doesn't need Stripe
  STANDARD_MONTHLY: "https://pay.childactor101.com/b/4gM00i3V79jbb25fAg8Vi0e",
  STANDARD_ANNUAL: "https://pay.childactor101.com/b/14A8wO0IVfHz3zDewc8Vi0f",
  PRO_MONTHLY: "https://pay.childactor101.com/b/3cIcN4gHTcvneeh2Nu8Vi0h",
  PRO_ANNUAL: "https://pay.childactor101.com/b/aFa6oG63f3YR2vz4VC8Vi0g",
  
  // Special offers
  FOUNDING_STANDARD: "https://pay.childactor101.com/b/7sY4gy2R3eDv9Y12Nu8Vi0d",
  FOUNDING_PRO: "https://pay.childactor101.com/b/4gMcN477jeDveeh4VC8Vi0i",
  FOUNDING_STANDARD_101_BADGE: "https://pay.childactor101.com/b/14AbJ0crDdzrb254VC8Vi0j",
  
  // 101 Badge add-ons
  BADGE_101_MONTHLY: "https://pay.childactor101.com/b/4gM7sK3V77b33zD1Jq8Vi0l",
  BADGE_101_ANNUAL: "https://pay.childactor101.com/b/14A9AScrD66Z2vz2Nu8Vi0k",
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
      stripePriceId: STRIPE_PAYMENT_LINKS.FREE,
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
      stripePriceId: STRIPE_PAYMENT_LINKS.STANDARD_MONTHLY,
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
      stripePriceId: STRIPE_PAYMENT_LINKS.PRO_MONTHLY,
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
      stripePriceId: STRIPE_PAYMENT_LINKS.STANDARD_ANNUAL,
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
      stripePriceId: STRIPE_PAYMENT_LINKS.PRO_ANNUAL,
    },
  ],
};
