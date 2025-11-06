import { isParentNavEnabled } from "@/config/feature-flags";
import type { MarketingConfig } from "@/types";

export const marketingConfig: MarketingConfig = {
  menus: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "settings",
    },
    {
      title: "Listings",
      href: "/directory",
      icon: "search",
    },
    {
      title: "Category",
      href: "/category",
      icon: "category",
    },
    {
      title: "Pricing",
      href: "/pricing",
      icon: "pricing",
    },
    {
      title: "Submit",
      href: "/submit",
      icon: "plus",
    },
    {
      title: "Blog",
      href: "/blog",
      icon: "blog",
    },
    {
      title: "Help",
      href: "/help",
      icon: "shieldCheck",
    },
  ],
};
