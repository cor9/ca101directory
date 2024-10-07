import { NestedNavItem, SiteConfig } from "@/types";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL!!;

export const siteConfig: SiteConfig = {
  name: "Demo",
  slogan: "This is a demo site for Mkdirs template",
  description: "Make any trending and profitable web directory in minutes",
  keywords: [ "Directory", "Template", "Boilerplate", "Sanity", "Next.js", "Auth.js", "Tailwindcss", "Shadcn/ui", "Resend", "Stripe"],
  author: "Mkdirs",
  url: SITE_URL,
  image: `${SITE_URL}/og.png`,
  mail: "support@mkdirs.com",
  links: {
    twitter: "https://x.com/MkdirsHQ",
    github: "https://github.com/MkdirsHQ",
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
    title: "Contact",
    items: [
      { title: "Github", href: siteConfig.links.github },
      { title: "Twitter", href: siteConfig.links.twitter },
      { title: "Email", href: `mailto:${siteConfig.mail}` },
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
