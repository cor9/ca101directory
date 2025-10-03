import type { HomeConfig } from "@/types";

export const homeConfig: HomeConfig = {
  valueProps: [
    {
      title: "Relevant",
      description:
        "Every listing is focused on youth acting — no filler, no distractions.",
      icon: "star",
    },
    {
      title: "Transparent",
      description:
        "You see what's offered, where they are, and how they work. Clear, simple, honest.",
      icon: "check",
    },
    {
      title: "Supportive",
      description: "Vendors who help kids grow, not just sell services.",
      icon: "heart",
    },
    {
      title: "Community-Driven",
      description:
        "Built by parents, coaches, and managers who actually understand this business.",
      icon: "users",
    },
  ],
  howItWorks: [
    {
      title: "Discover the right professionals",
      description:
        "Search by category, keyword, or location to browse curated listings that match your child's current goals.",
    },
    {
      title: "Review trusted insights",
      description:
        "See highlights, specialties, and parent-friendly notes that help you compare options with confidence.",
    },
    {
      title: "Reach out and take action",
      description:
        "Connect directly with providers to schedule consultations, lessons, or services tailored to young performers.",
    },
  ],
  pricing: {
    heading: "Simple, Transparent Pricing",
    subheading:
      "Choose the plan that fits where you are today and upgrade as your performer grows.",
    featuredPlan: "Pro",
  },
  ctaBanner: {
    heading: "Ready to List Your Business?",
    description:
      "Join our trusted directory of child actor professionals. Get discovered by families looking for quality services.",
    primaryCta: {
      label: "Submit Your Listing",
      href: "/submit",
    },
    secondaryCta: {
      label: "View Pricing Plans",
      href: "/pricing",
    },
  },
  parentCta: {
    heading: "Ready to Find the Perfect Professionals?",
    description:
      "Create a free parent account to save favorites, create custom lists, rate services, and leave reviews to help other families.",
    primaryCta: {
      label: "Create Parent Account",
      href: "/auth/register?role=parent",
    },
    secondaryCta: {
      label: "Sign In",
      href: "/auth/login",
    },
  },
};
