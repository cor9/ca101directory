import type { PriceConfig } from "@/types";

const DEFAULT_CHECKOUT_FLOW = "dashboard_pricing";

export const priceConfig: PriceConfig = {
  // 🚀 FOUNDING MEMBER PLANS - Limited Time 6-Month Launch Packages
  foundingPlans: [
    {
      title: "Founding Standard",
      description: "🎉 Early-adopter launch special - 6 months locked pricing!",
      benefits: [
        "🔒 6-month locked rate ($101 total)",
        "All Standard Vendor features included",
        "Professional logo display",
        "Advanced business description",
        "Enhanced visibility in directory",
        "Priority review process",
        "Email support",
        "⭐ Permanent Founding Vendor badge",
        "💰 Locked pricing as long as subscription active",
      ],
      limitations: ["No 101 Badge (available as add-on for $55/6mo)"],
      price: 101,
      priceSuffix: " for 6 months",
      stripePriceId: null,
      checkout: {
        planId: "founding-standard",
        billingCycle: "six_month",
        flow: DEFAULT_CHECKOUT_FLOW,
      },
      isFeatured: true,
      badge: "BEST VALUE",
    },
    {
      title: "Founding Pro",
      description: "🎉 Premium 6-month launch package for top vendors!",
      benefits: [
        "🔒 6-month locked rate ($199 total)",
        "All Pro Vendor features included",
        "Featured placement at top of listings",
        "SEO boosting features",
        "Analytics dashboard",
        "Priority customer support",
        "Social media promotion opportunities",
        "⭐ Special Founding Vendor badge",
        "💰 Locked low pricing for early adopters",
      ],
      limitations: ["No 101 Badge (available as add-on for $55/6mo)"],
      price: 199,
      priceSuffix: " for 6 months",
      stripePriceId: null,
      checkout: {
        planId: "founding-pro",
        billingCycle: "six_month",
        flow: DEFAULT_CHECKOUT_FLOW,
      },
      isFeatured: true,
      badge: "MOST POPULAR",
    },
  ],

  // Regular Plans (Show after Founding offers)
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
      stripePriceId: null,
    },
    {
      title: "Standard",
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
      stripePriceId: null,
      checkout: {
        planId: "standard",
        billingCycle: "monthly",
        flow: DEFAULT_CHECKOUT_FLOW,
      },
    },
    {
      title: "Pro",
      description: "For established professionals",
      benefits: [
        "All Standard features included",
        "Featured placement at top of listings",
        "SEO boosting features",
        "Priority customer support",
        "Social media promotion",
        "Advanced analytics",
      ],
      limitations: ["No 101 Badge"],
      price: 50,
      priceSuffix: "/month",
      stripePriceId: null,
      checkout: {
        planId: "pro",
        billingCycle: "monthly",
        flow: DEFAULT_CHECKOUT_FLOW,
      },
    },
  ],

  annualPlans: [
    {
      title: "Standard Annual",
      description: "Perfect for getting started",
      benefits: [
        "All Standard features included",
        "Logo display on your listing",
        "Enhanced visibility",
        "Priority review process",
        "Email support",
        "2 months free (save $50)",
      ],
      limitations: ["No featured placement", "No 101 Badge"],
      price: 250,
      priceSuffix: "/year",
      stripePriceId: null,
      checkout: {
        planId: "standard",
        billingCycle: "yearly",
        flow: DEFAULT_CHECKOUT_FLOW,
      },
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
      stripePriceId: null,
      checkout: {
        planId: "pro",
        billingCycle: "yearly",
        flow: DEFAULT_CHECKOUT_FLOW,
      },
    },
  ],
};
