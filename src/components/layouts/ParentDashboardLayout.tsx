"use client";

import { RoleBadge } from "@/components/auth/role-badge";
import {
  isFavoritesEnabled,
  isParentNavEnabled,
  isReviewsEnabled,
} from "@/config/feature-flags";
import { cn } from "@/lib/utils";
import {
  Bookmark,
  Heart,
  HelpCircle,
  Search,
  Settings,
  Star,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ParentDashboardLayoutProps {
  children: React.ReactNode;
}

// Build navigation items based on feature flags
const getParentNavItems = () => {
  const items = [];

  if (isFavoritesEnabled()) {
    items.push({
      label: "Saved Listings",
      href: "/dashboard/parent/favorites",
      icon: Bookmark,
      description: "Your bookmarked vendors",
    });
  }

  if (isReviewsEnabled()) {
    items.push({
      label: "My Reviews",
      href: "/dashboard/parent/reviews",
      icon: Star,
      description: "Reviews you've written",
    });
  }

  items.push({
    label: "Search Vendors",
    href: "/",
    icon: Search,
    description: "Find new professionals",
  });

  items.push({
    label: "Account Settings",
    href: "/settings",
    icon: Settings,
    description: "Manage your account",
  });

  return items;
};

export function ParentDashboardLayout({
  children,
}: ParentDashboardLayoutProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const parentNavItems = getParentNavItems();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">Parent Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <RoleBadge showIcon />
              <span className="text-sm text-muted-foreground">
                {session?.user?.email}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <nav className="space-y-2">
              <h2 className="text-lg font-semibold mb-4">Navigation</h2>
              {parentNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                      isActive && "bg-accent text-accent-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Help Section */}
            <div className="mt-8 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Need Help?</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Find the right professionals for your child's acting journey.
              </p>
              <Link
                href="/suggest-vendor"
                className="text-xs text-primary hover:underline"
              >
                Suggest a vendor →
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="space-y-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
