import { PlansRow, PricePlan } from "@/types";

// https://freeaitool.ai/submit
// Free plan: update item leads to be unpublished and reviewed again
// Pro plan: update item has no side effect
export const PRICE_PLANS: PricePlan[] = [
  {
    title: "Free",
    description: "For Beginners",
    benefits: [
      "Get one dofollow link", //  to boost your SEO
      "Review within 48 hours",
      "Permanent link with backlink maintenance",
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
      "Advanced analytics and reporting",
      "Premium customer support",
    ],
    limitations: [],
    price: 9.9,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
  },
];

// export const plansColumns = [
//   "free",
//   "pro",
// ] as const;

// export const comparePlans: PlansRow[] = [
//   {
//     feature: "Access to Analytics",
//     free: true,
//     pro: true,
//     tooltip: "All plans include basic analytics for tracking performance.",
//   },
//   {
//     feature: "Custom Branding",
//     free: null,
//     pro: "500/mo",
//     tooltip: "Custom branding is available from the Pro plan onwards.",
//   },
//   {
//     feature: "Priority Support",
//     free: null,
//     pro: "Email",
//   },
//   {
//     feature: "Advanced Reporting",
//     free: null,
//     pro: null,
//     tooltip: "Advanced reporting is available in Business and Enterprise plans.",
//   },
//   {
//     feature: "Dedicated Manager",
//     free: null,
//     pro: null,
//     tooltip: "Enterprise plan includes a dedicated account manager.",
//   },
//   {
//     feature: "API Access",
//     free: null,
//     pro: "Standard",
//   },
//   {
//     feature: "Monthly Webinars",
//     free: false,
//     pro: true,
//     tooltip: "Pro and higher plans include access to monthly webinars.",
//   },
//   {
//     feature: "Custom Integrations",
//     free: null,
//     pro: "Available",
//     tooltip: "Custom integrations are available in Business and Enterprise plans.",
//   },
//   {
//     feature: "Roles and Permissions",
//     free: null,
//     pro: "Advanced",
//     tooltip: "User roles and permissions management improves with higher plans.",
//   },
//   {
//     feature: "Onboarding Assistance",
//     free: null,
//     pro: "Assisted",
//   },
// ];
