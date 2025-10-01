import {
  isFavoritesEnabled,
  isParentDashboardEnabled,
  isReviewsEnabled,
} from "@/config/feature-flags";
import type { UserButtonConfig } from "@/types";

export const userButtonConfig: UserButtonConfig = {
  menus: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "dashboard",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: "settings",
    },
    {
      title: "Submit",
      href: "/submit",
      icon: "submit",
    },
  ],
};

// Parent-specific menu items
export const getParentMenuItems = () => {
  const items = [
    {
      title: "Dashboard",
      href: "/dashboard/parent",
      icon: "dashboard",
    },
  ];

  if (isFavoritesEnabled()) {
    items.push({
      title: "Favorites",
      href: "/dashboard/parent/favorites",
      icon: "heart",
    });
  }

  if (isReviewsEnabled()) {
    items.push({
      title: "My Reviews",
      href: "/dashboard/parent/reviews",
      icon: "star",
    });
  }

  items.push({
    title: "Settings",
    href: "/settings",
    icon: "settings",
  });

  return items;
};
