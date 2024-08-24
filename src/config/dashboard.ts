import { NestedNavItem } from "@/types";
import { UserRole } from "@/types/user-role";

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
        href: "/dashboard/billing",
        icon: "billing",
        title: "Billing",
        authorizeOnly: UserRole.USER,
      },
      {
        href: "/dashboard/settings",
        icon: "settings",
        title: "Settings"
      },
    ],
  },
  {
    title: "ADMIN",
    items: [
      {
        href: "/admin",
        icon: "laptop",
        title: "Admin Panel",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/orders",
        icon: "package",
        title: "Orders",
        badge: 2,
        authorizeOnly: UserRole.ADMIN,
      },
    ],
  },
  {
    title: "RESOURCES",
    items: [
      {
        href: "/",
        icon: "home",
        title: "Homepage"
      },
      {
        href: "/docs",
        icon: "bookOpen",
        title: "Documentation"
      },
      {
        href: "/support",
        icon: "messages",
        title: "Support",
        // authorizeOnly: UserRole.USER,
        // disabled: true,
      },
    ],
  },
];
