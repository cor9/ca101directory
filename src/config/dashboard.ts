import { DashboardConfig, NestedNavItem } from "@/types";
import { UserRole } from "@/types/user-role";

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Homepage",
      href: "/",
      icon: "home",
    },
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "dashboard",
    },
    {
      title: "Submit",
      href: "/submit",
      icon: "submit",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: "settings",
    },
  ],
}

// TODO: only used if dashboard uses sidebar layout
export const sidebarLinks: NestedNavItem[] = [
  {
    title: "MENU",
    items: [
      {
        href: "/dashboard",
        icon: "dashboard",
        title: "Dashboard"
      },
      {
        href: "/submit",
        icon: "submit",
        title: "Submit"
      },
      {
        href: "/settings",
        icon: "settings",
        title: "Settings"
      },
    ],
  },
];
