import type { PricePlan } from "@/types";
import { siteConfig } from "./site";

export const PRICE_PLANS: PricePlan[] = [
  {
    title: "Free",
    description: "For Beginners",
    benefits: [
      "Get 3 dofollow links to boost your SEO",
      "Permanent link with backlink maintenance",
      "Reviewed and listed within 72 hours",
      "Launch your product the day you want",
    ],
    limitations: [
      "Backlink to our site is required",
      "No customer support",
    ],
    price: 0,
    stripePriceId: null,
  },
  {
    title: "Pro",
    description: "For Pro Users",
    benefits: [
      "Get at least 3 dofollow links to boost your SEO",
      "Listed immediately, launch it whenever you want",
      "Permanent link, no backlink required",
      "Featured in our listings and promoted",
      "Share through social media and newsletters",
      "Premium customer support",
    ],
    limitations: [],
    price: 9.9,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
  },
];

export const PRICING_FAQ = [
  {
    id: "item-1",
    question: "Is it free to submit my product?",
    answer:
      "Yes, it is. You can submit your product for free to get 3 dofollow links to boost your SEO, a permanent link with backlink maintenance, reviewed and listed within 72 hours. \nHowever, it's limited to 3 dofollow links, requires a backlink to our site, and doesn't include customer support.",
  },
  {
    id: "item-2",
    question: "What are the benefits of the Pro plan?",
    answer:
      "The Pro plan offers at least 3 dofollow links, included immediately, permanent links without backlink requirements, featured listings, premium customer support, and sharing through social media and newsletters. \nIt's designed for users who need more comprehensive features and faster services.",
  },
  {
    id: "item-3",
    question:
      "What's the differences between Free and Pro plans?",
    answer:
      "Free plan submissions are reviewed and listed within 72 hours, a backlink to our site is required. \nWhile Pro plan submissions are included immediately, no backlink is required. \nBoth plans can be launched whenever you want and update product information anytime.",
  },
  {
    id: "item-4",
    question: "Do I need to provide a backlink for my listing?",
    answer:
      `For the Free plan, a backlink to our site is required. The backlink is <a href='${siteConfig.url}' title='${siteConfig.tagline}'>${siteConfig.name}</a>. \nHowever, if you choose the Pro plan, you get a permanent link without any backlink requirement. This gives Pro users more flexibility in their link strategy.`,
  },
];