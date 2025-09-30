import type { HomeConfig } from "@/types";

export const homeConfig: HomeConfig = {
  valueProps: [
    {
      title: "Vetted Industry Experts",
      description:
        "Every professional is personally reviewed by the Child Actor 101 team for safety, credentials, and proven results.",
      icon: "shieldCheck",
    },
    {
      title: "Family-First Guidance",
      description:
        "Get insights tailored for parents and young performers, including age-appropriate services and on-set expectations.",
      icon: "sparkles",
    },
    {
      title: "Trusted Community Network",
      description:
        "Connect with coaches, agents, and creatives who collaborate to move child actors forward in their careers.",
      icon: "handshake",
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
};

