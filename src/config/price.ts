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
      limitations: [
        "No featured placement",
        "No logo display",
        "Limited visibility",
      ],
      price: 0,
      priceSuffix: "/forever",
      stripePriceId: null, // Free plan doesn't need Stripe
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
      stripePriceId: "prod_T97UwQNWLmnlay", // Standard Monthly
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
      stripePriceId: "prod_T97nFsGLkxfRxB", // Pro Monthly
    },
  ],
  annualPlans: [
    {
      title: "Standard Annual",
      description: "Perfect for getting started",
      benefits: [
        "Public listing in our directory",
        "Logo display on your listing",
        "Enhanced visibility",
        "Priority review process",
        "Email support",
        "2 months free (save $50)",
      ],
      limitations: ["No featured placement", "No 101 Badge"],
      price: 250,
      priceSuffix: "/year",
      stripePriceId: "prod_T97UwQNWLmnlay", // Standard Annual
    },
    {
      title: "Pro Annual",
      description: "For established professionals",
      benefits: [
        "All Standard features included",
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
      stripePriceId: "prod_T97nFsGLkxfRxB", // Pro Annual
    },
  ],
  foundingBundles: [
    {
      title: "Founding Standard",
      description: "Limited time founding offer",
      benefits: [
        "All Standard features included",
        "Logo display on your listing",
        "Enhanced visibility",
        "Priority review process",
        "Email support",
        "6 months for $125 (save $25)",
      ],
      limitations: ["No featured placement", "No 101 Badge"],
      price: 125,
      priceSuffix: "/6 months",
      stripePriceId: "prod_T97zPhO5FmuWdj", // Founding Standard
    },
    {
      title: "Founding Pro",
      description: "Limited time founding offer",
      benefits: [
        "All Pro features included",
        "Featured placement at top of listings",
        "SEO boosting features",
        "Priority customer support",
        "Social media promotion",
        "Advanced analytics",
        "6 months for $250 (save $50)",
      ],
      limitations: ["No 101 Badge"],
      price: 250,
      priceSuffix: "/6 months",
      stripePriceId: "prod_T987vSSXcnn6oU", // Founding Pro
    },
  ],
};
