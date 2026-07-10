import type { FAQConfig } from "@/types";
import { siteConfig } from "./site";

export const faqConfig: FAQConfig = {
  items: [
    {
      id: "item-1",
      question: "How do I get listed in the Child Actor 101 Directory?",
      answer:
        "Getting listed is straightforward. Choose either a Free Listing or a Pro Listing, submit your business details, and complete checkout if you want Pro visibility. Our team reviews new listings before they appear in the directory.",
    },
    {
      id: "item-2",
      question: "What is the difference between Free and Pro?",
      answer:
        "A Free Listing gives you a searchable directory profile with your basic business information and 1 active event posting. Pro is our premium annual plan at $399/year and adds stronger visibility, enhanced profile presentation, unlimited active event postings, and premium placement benefits for established vendors.",
    },
    {
      id: "item-3",
      question: "Can I start free and upgrade later?",
      answer:
        "Yes. You can start with a Free Listing and upgrade to Pro later if you want more exposure in the directory. Existing subscriptions and listing entitlements stay on their current logic; this page simply reflects the current live offers for new upgrades.",
    },
    {
      id: "item-4",
      question: "How do parents find professionals in the directory?",
      answer:
        "Parents browse by category, location, and service type to find the right fit for their child. Pro listings receive stronger placement and visibility advantages, which can help more families discover your business.",
    },
  ],
};
