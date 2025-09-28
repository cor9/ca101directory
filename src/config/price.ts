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
      stripePriceId: "prod_T8QcNtQzrwS4Ql", // Basic Monthly
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
      price: 45,
      priceSuffix: "/month",
      stripePriceId: "prod_T8QopLJ3dxTZ1Z", // Pro Monthly
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
      price: 90,
      priceSuffix: "/month",
      stripePriceId: "prod_T8R9f8RbVsavty", // Premium Monthly
    },
  ],
  annualPlans: [
    {
      title: "Basic Annual",
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
      stripePriceId: "prod_T8QguikBmjYjdB", // Basic Annual
    },
    {
      title: "Pro Annual",
      description: "For established professionals",
      benefits: [
        "All Basic features included",
        "Featured placement at top of listings",
        "SEO boosting features",
        "Priority customer support",
        "Social media promotion",
        "Advanced analytics",
        "2 months free (save $90)",
      ],
      limitations: ["No 101 Badge"],
      price: 450,
      priceSuffix: "/year",
      stripePriceId: "prod_T8Qvb6K2rgnpZm", // Pro Annual
    },
    {
      title: "Premium Annual",
      description: "For top-tier professionals",
      benefits: [
        "All Pro features included",
        "101 Badge (if qualified)",
        "Priority placement",
        "Premium customer support",
        "Custom promotion opportunities",
        "Dedicated account manager",
        "2 months free (save $180)",
      ],
      limitations: [],
      price: 900,
      priceSuffix: "/year",
      stripePriceId: "prod_T8RGnW9sc2Q4Bj", // Premium Annual
    },
  ],
  foundingBundles: [
    {
      title: "Founding Pro Bundle",
      description: "Limited time founding offer",
      benefits: [
        "All Pro features included",
        "Featured placement at top of listings",
        "SEO boosting features",
        "Priority customer support",
        "Social media promotion",
        "Advanced analytics",
        "6 months for $199 (save $71)",
      ],
      limitations: ["No 101 Badge"],
      price: 199,
      priceSuffix: "/6 months",
      stripePriceId: "prod_T8RcdmVOvg01LS", // Founding Pro
    },
    {
      title: "Founding Premium Bundle",
      description: "Limited time founding offer",
      benefits: [
        "All Premium features included",
        "101 Badge (if qualified)",
        "Priority placement",
        "Premium customer support",
        "Custom promotion opportunities",
        "Dedicated account manager",
        "6 months for $399 (save $141)",
      ],
      limitations: [],
      price: 399,
      priceSuffix: "/6 months",
      stripePriceId: "prod_T8RmbPVwnvfT7E", // Founding Premium
    },
  ],
};
