import type { FooterConfig } from "@/types";

export const footerConfig: FooterConfig = {
  links: [
    {
      title: "Directory",
      items: [
        { title: "Search Professionals", href: "/search" },
        { title: "Browse Categories", href: "/category" },
        { title: "All Listings", href: "/directory" },
        { title: "Tags", href: "/tag" },
      ],
    },
    {
      title: "For Professionals",
      items: [
        { title: "Submit Listing", href: "/submit" },
        { title: "Pricing Plans", href: "/pricing" },
        { title: "Claim Listing", href: "/claim-upgrade" },
        { title: "Dashboard", href: "/dashboard" },
      ],
    },
    {
      title: "Resources",
      items: [
        {
          title: "About Child Actor 101",
          href: "https://childactor101.com",
          external: true,
        },
        {
          title: "Parent Resources",
          href: "https://childactor101.com/resources",
          external: true,
        },
        {
          title: "Industry News",
          href: "https://childactor101.com/101-blog",
          external: true,
        },
        { title: "Contact Support", href: "mailto:corey@childactor101.com" },
      ],
    },
    {
      title: "Legal",
      items: [
        {
          title: "Terms and Conditions",
          href: "https://www.childactor101.com/terms-and-conditions",
          external: true,
        },
        {
          title: "Privacy Policy",
          href: "https://www.childactor101.com/privacy-policy",
          external: true,
        },
        {
          title: "California Child Permit",
          href: "https://www.childactor101.com/ab1660",
          external: true,
        },
        { title: "Sitemap", href: "/sitemap.xml" },
      ],
    },
  ],
};
