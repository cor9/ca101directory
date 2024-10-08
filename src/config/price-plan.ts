import { PricePlan } from "@/types";

/**
 * Price plans
 * 
 * Free plan: update item leads to be unpublished and reviewed again
 * Pro plan: update item has no side effect
 */
export const PRICE_PLANS: PricePlan[] = [
  {
    title: "Free",
    description: "For Beginners",
    benefits: [
      "Get one dofollow link",
      "Permanent link with backlink maintenance",
      "Review within 48 hours",
    ],
    limitations: [
      "Only one dofollow link",
      "Backlink to our site required",
      "No customer support",
    ],
    price: 0,
    stripePriceId: null,
  },
  {
    title: "Pro",
    description: "For Pro Users",
    benefits: [
      "Get at least 2 dofollow links",
      "Inclusion within 24 hours, no queue",
      "Permanent link, no backlink required",
      "Featured in our listings",
      "Premium customer support",
      "Share through social media and newsletters",
    ],
    limitations: [],
    price: 9.9,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
  },
];
