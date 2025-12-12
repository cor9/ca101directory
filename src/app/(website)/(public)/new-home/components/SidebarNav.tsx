"use client";

import {
  Home,
  Compass,
  Grid3X3,
  BadgeCheck,
  Heart,
  HelpCircle,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Explore", href: "/directory", icon: Compass },
  { name: "Categories", href: "/category", icon: Grid3X3 },
  { name: "Verified Providers", href: "/collection/101-approved", icon: BadgeCheck },
  { name: "Favorites", href: "/dashboard/parent", icon: Heart },
  { name: "Help", href: "/help", icon: HelpCircle },
  { name: "Account", href: "/settings", icon: User },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col bg-[#0A0D14] border-r border-gray-800 z-40">
        {/* Logo Area */}
        <div className="p-6 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-[#3A76A6] text-xl font-bold italic">
              Child Actor 101
            </span>
            <span className="text-gray-400 text-sm">Directory</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#3A76A6]/20 text-[#3A76A6]"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-800">
          <Link
            href="/list-your-business"
            className="block w-full text-center py-3 bg-[#E4572E] hover:bg-[#CC4E2A] text-white font-semibold rounded-lg transition-colors"
          >
            List Your Business
          </Link>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0A0D14] border-t border-gray-800 z-50">
        <ul className="flex justify-around items-center py-2">
          {navItems.slice(0, 5).map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex flex-col items-center gap-1 px-3 py-2 ${
                    isActive ? "text-[#3A76A6]" : "text-gray-500"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
