import { NestedNavItem } from "@/types";
import { siteConfig } from "./site";

export const footerLinks: NestedNavItem[] = [
  {
    title: "Features",
    items: [
      { title: "Search", href: "/search" },
      { title: "Category", href: "/category" },
      { title: "Tag", href: "/tag" },
    ],
  },
  {
    title: "Support",
    items: [
      { title: "Blog", href: "/blog" },
      { title: "Pricing", href: "/pricing" },
      { title: "Submit", href: "/submit" },
    ],
  },
  {
    title: "Contact",
    items: [
      { title: "Github", href: siteConfig.links.github, external: true },
      { title: "Twitter", href: siteConfig.links.twitter, external: true },
      { title: "Email", href: `mailto:${siteConfig.mail}`, external: true },
    ],
  },
  {
    title: "General",
    items: [
      { title: "About Us", href: "/about" },
      { title: "Privacy Policy", href: "/privacy" },
      { title: "Terms of Service", href: "/terms" },
    ],
  },
];
