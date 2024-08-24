import { SidebarNavItem, SiteConfig } from "@/types";

// TODO: fix !!
const site_url = process.env.NEXT_PUBLIC_APP_URL!!;

export const siteConfig: SiteConfig = {
  name: "MkWeb",
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

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Company",
    items: [
      { title: "Features", href: "/features" },
      { title: "Pricing", href: "/pricing" },
      { title: "Terms", href: "/terms" },
      { title: "Privacy", href: "/privacy" },
    ],
  },
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
    title: "Blog",
    items: [
      { title: "Blog", href: "/blog" },
      { title: "Docs", href: "/docs" },
      { title: "Installation", href: "/installation" },
      { title: "Deployment", href: "/deployment" },
    ],
  },
  {
    title: "Resources",
    items: [
      { title: "Showcase", href: "/showcase" },
      { title: "Feedback", href: "/feedback" },
      { title: "Changelog", href: "/changelog" },
      { title: "Roadmap", href: "/roadmap" },
    ],
  }
];
