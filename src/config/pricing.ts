import { PlansRow, PricePlan, SubscriptionPlan } from "@/types";

export const pricingData: PricePlan[] = [
  {
    title: "Free",
    description: "For Beginners",
    benefits: [
      "Up to 100 monthly posts",
      "Basic analytics and reporting",
      "Access to standard templates",
    ],
    limitations: [
      "No priority access to new features.",
      "Limited customer support",
      "No custom branding",
      "Limited access to business resources.",
    ],
    price: 0,
    stripeId: null,
  },
  {
    title: "Starter",
    description: "For Starters",
    benefits: [
      "Up to 500 monthly posts",
      "Advanced analytics and reporting",
      "Access to business templates",
      "Priority customer support",
      "Exclusive webinars and training.",
    ],
    limitations: [
      "No custom branding",
      "Limited access to business resources.",
    ],
    price: 9.9,
    stripeId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PLAN_ID,
  },
  {
    title: "Pro",
    description: "For Power Users",
    benefits: [
      "Unlimited posts",
      "Real-time analytics and reporting",
      "Access to all templates, including custom branding",
      "24/7 business customer support",
      "Personalized onboarding and account management.",
    ],
    limitations: [],
    price: 19.9,
    stripeId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PLAN_ID,
  },
];

export const plansColumns = [
  "free",
  "starter",
  "pro",
] as const;

export const comparePlans: PlansRow[] = [
  {
    feature: "Access to Analytics",
    free: true,
    starter: true,
    pro: true,
    tooltip: "All plans include basic analytics for tracking performance.",
  },
  {
    feature: "Custom Branding",
    free: null,
    starter: null,
    pro: "500/mo",
    tooltip: "Custom branding is available from the Pro plan onwards.",
  },
  {
    feature: "Priority Support",
    free: null,
    starter: null,
    pro: "Email",
  },
  {
    feature: "Advanced Reporting",
    free: null,
    starter: null,
    pro: null,
    tooltip: "Advanced reporting is available in Business and Enterprise plans.",
  },
  {
    feature: "Dedicated Manager",
    free: null,
    starter: null,
    pro: null,
    tooltip: "Enterprise plan includes a dedicated account manager.",
  },
  {
    feature: "API Access",
    free: null,
    starter: "Limited",
    pro: "Standard",
  },
  {
    feature: "Monthly Webinars",
    free: false,
    starter: false,
    pro: true,
    tooltip: "Pro and higher plans include access to monthly webinars.",
  },
  {
    feature: "Custom Integrations",
    free: null,
    starter: "Available",
    pro: "Available",
    tooltip: "Custom integrations are available in Business and Enterprise plans.",
  },
  {
    feature: "Roles and Permissions",
    free: null,
    starter: "Basic",
    pro: "Advanced",
    tooltip: "User roles and permissions management improves with higher plans.",
  },
  {
    feature: "Onboarding Assistance",
    free: null,
    starter: "Self-service",
    pro: "Assisted",
  },
  // Add more rows as needed
];
