import type { FAQConfig } from "@/types";
import { siteConfig } from "./site";

export const faqConfig: FAQConfig = {
  items: [
  {
    id: "item-1",
    question: "How do I get listed in the Child Actor 101 Directory?",
    answer:
      "Getting listed is easy! Simply choose a plan that fits your needs (Basic $29/month, Pro $49/month, Premium $99/month, or 101 Badge Add-on $25), complete payment, and fill out our submission form. Our team will review your application within 72 hours.",
  },
  {
    id: "item-2",
    question: "What makes a professional '101 Approved'?",
    answer:
      "Our 101 Approved badge is given to professionals who meet our high standards for working with young actors. This includes proper certifications, background checks, experience with children, and positive references from families. We personally vet each application.",
  },
  {
    id: "item-3",
    question: "What's the difference between the plans?",
    answer:
      "Standard ($25/month) gets you a public listing with basic contact info. Pro ($50/month) adds featured placement, logo display, and SEO boosting. Premium ($99/month) includes the 101 Badge if qualified, priority placement, and advanced analytics. The 101 Badge Add-on ($25) adds our trusted badge to existing listings.",
  },
  {
    id: "item-4",
    question: "How do parents find professionals in the directory?",
    answer:
      "Parents can browse by category (Acting Coaches, Headshot Photographers, Demo Reel Editors, etc.), filter by location, age range, virtual services, and more. Featured professionals appear at the top, and 101 Approved professionals have special badges for easy identification.",
    },
  ],
};
