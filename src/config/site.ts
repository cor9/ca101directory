import type { SiteConfig } from "@/types";

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://directory.childactor101.com";

export const siteConfig: SiteConfig = {
  name: "Child Actor 101 Directory",
  tagline: "Find Trusted Acting Professionals for Your Child",
  description:
    "A curated directory of vetted coaches, photographers, editors, and industry professionals specializing in youth acting. Every listing is hand-picked for quality and safety.",
  keywords: [
    "Child Actor",
    "Acting Coach",
    "Headshot Photographer",
    "Demo Reel Editor",
    "Youth Acting",
    "Acting Classes",
    "Child Entertainment",
    "Acting Professional",
    "Vetted Services",
    "Child Safety",
  ],
  author: "Child Actor 101",
  url: SITE_URL,
  logo: "/directorylogo.png",
  // set the logoDark if you have put the logo-dark.png in the public folder
  // logoDark: "/logo-dark.png",
  // please increase the version number when you update the image
  image: `${SITE_URL}/og.png?v=1`,
  mail: "hello@childactor101.com",
  utm: {
    source: "directory.childactor101.com",
    medium: "referral",
    campaign: "navigation",
  },
  links: {
    // leave it blank if you don't want to show the link (don't delete)
    twitter: "",
    github: "",
    youtube: "",
  },
};
