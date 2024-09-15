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
        href: "/submit",
        icon: "submit",
        title: "Submit"
      },
      {
        href: "/billing",
        icon: "billing",
        title: "Billing",
        authorizeOnly: UserRole.USER,
      },
      {
        href: "/settings",
        icon: "settings",
        title: "Settings"
      },
    ],
  },
  // {
  //   title: "ADMIN",
  //   items: [
  //     {
  //       href: "/admin",
  //       icon: "laptop",
  //       title: "Admin Panel",
  //       authorizeOnly: UserRole.ADMIN,
  //     },
  //     {
  //       href: "/admin/orders",
  //       icon: "package",
  //       title: "Orders",
  //       badge: 2,
  //       authorizeOnly: UserRole.ADMIN,
  //     },
  //   ],
  // },
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
      { // TODO: add support, mail to support@mkdirs.com
        href: "/support",
        icon: "messages",
        title: "Support",
        // authorizeOnly: UserRole.USER,
        // disabled: true,
      },
    ],
  },
];
