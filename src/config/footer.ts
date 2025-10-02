import type { FooterConfig } from "@/types";

export const footerConfig: FooterConfig = {
  links: [
    {
      title: "Directory",
      items: [
        { title: "Search", href: "/search" },
        { title: "Collection", href: "/collection" },
        { title: "Category", href: "/category" },
        { title: "Filters", href: "/directory" },
      ],
    },
    {
      title: "Resources",
      items: [
        { title: "Blog", href: "/blog" },
        { title: "Pricing", href: "/pricing" },
        { title: "Submit", href: "/submit" },
        {
          title: "Recommendations",
          href: "https://www.amazon.com/shop/influencer-be722a62?ref_=cm_sw_r_cp_ud_aipsfshop_ASWY2EF8HWY1E2JV2AVE",
          external: true,
        },
      ],
    },
    {
      title: "Studio",
      items: [
        { title: "Pages", href: "/pages" },
        { title: "Home 2", href: "/home-2" },
        { title: "Home 3", href: "/home-3" },
        { title: "Collection 1", href: "/collection-1" },
        { title: "Collection 2", href: "/collection-2" },
      ],
    },
    {
      title: "Company",
      items: [
        { title: "About Us", href: "/about" },
        {
          title: "Privacy Policy",
          href: "https://www.childactor101.com/privacy-policy",
          external: true,
        },
        {
          title: "Terms of Service",
          href: "https://www.childactor101.com/terms-and-conditions",
          external: true,
        },
        { title: "Sitemap", href: "/sitemap.xml" },
      ],
    },
  ],
};
