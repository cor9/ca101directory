import { NestedNavItem, SiteConfig } from "@/types";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL!!;

export const siteConfig: SiteConfig = {
  name: "Mkdirs",
  slogan: "Make any trending and profitable web directories in minutes",
  description: "Make any trending and profitable web directories in minutes.",
  author: "Mkdirs",
  url: SITE_URL,
  image: `${SITE_URL}/_static/og.jpg`,
  mail: "support@mkdirs.com",
  links: {
    twitter: "https://x.com/javayhu",
    github: "https://github.com/javayhu",
    linkedin: "https://linkedin.com/in/javayhu",
  },
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
    title: "Social",
    items: [
      { title: "Github", href: siteConfig.links.github },
      { title: "Twitter", href: siteConfig.links.twitter },
      { title: "Linkedin", href: siteConfig.links.linkedin },
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
