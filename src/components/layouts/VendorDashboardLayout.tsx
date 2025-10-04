"use client";

import { RoleBadge } from "@/components/auth/role-badge";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Building2,
  CreditCard,
  Eye,
  FileText,
  HelpCircle,
  Plus,
  Settings,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface VendorDashboardLayoutProps {
  children: React.ReactNode;
}

const vendorNavItems = [
  {
    label: "My Listing",
    href: "/dashboard/vendor/listing",
    icon: FileText,
    description: "Manage your professional listing",
  },
  {
    label: "Analytics",
    href: "/dashboard/vendor/analytics",
    icon: BarChart3,
    description: "View performance metrics",
  },
  {
    label: "Upgrade Plan",
    href: "/dashboard/vendor/billing",
    icon: CreditCard,
    description: "Manage subscription & billing",
  },
  {
    label: "Account Settings",
    href: "/settings",
    icon: Settings,
    description: "Manage your account",
  },
];

export function VendorDashboardLayout({
  children,
}: VendorDashboardLayoutProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-secondary-denim/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-primary-orange" />
                <h1 className="text-2xl font-bold text-paper">Vendor Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <RoleBadge showIcon />
              <span className="text-sm text-paper/80">
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
              <h2 className="text-lg font-semibold mb-4 text-paper">Navigation</h2>
              {vendorNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      "hover:bg-secondary-denim/20 hover:text-paper",
                      isActive ? "bg-secondary-denim/30 text-paper" : "text-paper/80",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-paper/60">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Quick Actions */}
            <div className="mt-8 p-4 bg-surface/20 rounded-lg border border-surface/20">
              <h3 className="text-sm font-medium mb-3 text-paper">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  href="/submit"
                  className="flex items-center gap-2 text-xs text-primary-orange hover:underline"
                >
                  <Plus className="h-3 w-3" />
                  Submit New Listing
                </Link>
                <Link
                  href="/dashboard/vendor/listing"
                  className="flex items-center gap-2 text-xs text-primary-orange hover:underline"
                >
                  <Eye className="h-3 w-3" />
                  View My Listing
                </Link>
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-4 p-4 bg-surface/20 rounded-lg border border-surface/20">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="h-4 w-4 text-paper/60" />
                <h3 className="text-sm font-medium text-paper">Need Help?</h3>
              </div>
              <p className="text-xs text-paper/70 mb-3">
                Grow your business with Child Actor 101 Directory.
              </p>
              <Link
                href="/pricing"
                className="text-xs text-primary-orange hover:underline"
              >
                View pricing plans →
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
