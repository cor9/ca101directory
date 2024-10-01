import { NestedNavItem, SiteConfig } from "@/types";

// TODO: fix !!
const site_url = process.env.NEXT_PUBLIC_APP_URL!!;

export const siteConfig: SiteConfig = {
  name: "Mkdirs",
  slogan: "Make any trending and profitable web directories in minutes",
  description:
    "Make any trending and profitable web directories in minutes.",
  url: site_url,
  ogImage: `${site_url}/_static/og.jpg`,
  links: {
    twitter: "https://x.com/javayhu",
    github: "https://github.com/javayhu",
    linkedin: "https://linkedin.com/in/javayhu",
    email: "mailto:javayhu@gmail.com",
  },
  mailSupport: "support@mkdirs.com",
};

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
      { title: "Twitter", href: "https://x.com/javayhu" },
      { title: "Github", href: "https://github.com/javayhu" },
      { title: "Email", href: "mailto:javayhu@gmail.com" },
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
