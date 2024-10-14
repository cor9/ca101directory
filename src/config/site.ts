import type { SiteConfig } from "@/types";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "Mkdirs Demo",
  tagline: "This is a demo site for Mkdirs template",
  description:
    "This is a demo site for Mkdirs template, which makes any trending and profitable web directory in minutes",
  keywords: [
    "Directory",
    "Template",
    "Boilerplate",
    "Sanity",
    "Next.js",
    "Auth.js",
    "Tailwindcss",
    "Shadcn/ui",
    "Resend",
    "Stripe",
  ],
  author: "Mkdirs",
  url: SITE_URL,
  image: `${SITE_URL}/opengraph.png`,
  mail: "support@mkdirs.com",
  utm: {
    source: "mkdirs.com",
    medium: "referral",
  },
  links: {
    twitter: "https://x.com/MkdirsHQ",
    github: "https://github.com/MkdirsHQ",
  },
};
