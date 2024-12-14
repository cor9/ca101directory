import type { PriceConfig } from "@/types";

export const priceConfig: PriceConfig = {
  plans: [
    {
      title: "Free",
      description: "For Beginners",
      benefits: [
        "Get 3 dofollow links to boost your SEO",
        "Permanent link with backlink maintenance",
        "Reviewed and listed within 72 hours",
        "Publish your product the day you want",
      ],
      limitations: [
        "Backlink to our site is required",
        "No customer support",
      ],
      price: 0,
      priceSuffix: "",
      stripePriceId: null,
    },
    {
      title: "Pro",
      description: "For Pro Users",
      benefits: [
        "Get >= 3 dofollow links to boost your SEO",
        "List now, publish it whenever you want",
        "Permanent link, no backlink required",
        "Featured placement at the top of listings",
        "Share through social media and newsletters",
        "Premium customer support",
      ],
      limitations: [],
      price: 9.9,
      priceSuffix: "",
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    },
    {
      title: "Sponsor",
      description: "For Sponsors",
      benefits: [
        "Get a prominent ad item card",
        "Customize your schedule date",
        "Available for all kinds of product",
        "Only one advertisement per period",
        "Share through social media and newsletters",
        "Premium customer support",
      ],
      limitations: [],
      price: 1.9,
      priceSuffix: "/ day",
      stripePriceId: null,
    },
  ],
};
