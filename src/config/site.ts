import { NestedNavItem, SiteConfig } from "@/types";

// TODO: fix !!
const site_url = process.env.NEXT_PUBLIC_APP_URL!!;

export const siteConfig: SiteConfig = {
  name: "MkDirs",
  slogan: "Make Directory website in minutes",
  description:
    "Get your project off to an explosive start with SaaS Starter! Harness the power of Next.js 14, Prisma, Neon, Auth.js v5, Resend, React Email, Shadcn/ui and Stripe to build your next big thing.",
  url: site_url,
  ogImage: `${site_url}/_static/og.jpg`,
  links: {
    twitter: "https://x.com/javayhu",
    github: "https://github.com/javayhu",
  },
  mailSupport: "support@mkdirs.com",
};

export const footerLinks: NestedNavItem[] = [
  {
    title: "Product",
    items: [
      { title: "Submit", href: "/submit" },
      { title: "Search", href: "/search" },
      { title: "Category", href: "/category" },
      { title: "Tag", href: "/tag" },
    ],
  },
  {
    title: "Support",
    items: [
      { title: "Documentation", href: "/docs" },
      { title: "Changelog", href: "/changelog" },
      { title: "Feedback", href: "/feedback" },
      { title: "Roadmap", href: "/roadmap" },
    ],
  },
  {
    title: "Company",
    items: [
      { title: "Blog", href: "/blog" },
      { title: "Twitter", href: "https://twitter.com/mkdirs" },
      { title: "Github", href: "https://github.com/mkdirs" },
      { title: "Discord", href: "https://discord.gg/mkdirs" },
    ],
  },
  {
    title: "Legal",
    items: [
      { title: "Terms", href: "/terms" },
      { title: "Privacy", href: "/privacy" },
      { title: "Sitemap", href: "/sitemap" },
    ],
  },
];
