"use client";

import {
  Home,
  Compass,
  List,
  ShieldCheck,
  Heart,
  HelpCircle,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Compass, label: "Explore", href: "/directory" },
  { icon: List, label: "Categories", href: "/category" },
  { icon: ShieldCheck, label: "Verified Providers", href: "/collection/101-approved" },
  { icon: Heart, label: "Favorites", href: "/dashboard/parent" },
  { icon: HelpCircle, label: "Help", href: "/help" },
  { icon: User, label: "Account", href: "/settings" },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-bg-dark-3 border-r border-border-subtle sticky top-0 h-screen">
        <nav className="p-6 space-y-3">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                  isActive
                    ? "bg-accent-teal/20 text-accent-teal"
                    : "text-text-secondary hover:bg-white/10"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-bg-dark-3 border-t border-border-subtle z-50">
        <ul className="flex justify-around items-center py-2">
          {navItems.slice(0, 5).map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex flex-col items-center gap-1 px-3 py-2 ${
                    isActive ? "text-accent-teal" : "text-text-muted"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
