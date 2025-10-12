"use client";

import { RoleBadge } from "@/components/auth/role-badge";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  BarChart3,
  FileText,
  HelpCircle,
  Settings,
  Shield,
  Star,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

const adminNavItems = [
  {
    label: "All Users",
    href: "/dashboard/admin/users",
    icon: Users,
    description: "Manage user accounts",
  },
  {
    label: "Listings Moderation",
    href: "/dashboard/admin/listings",
    icon: FileText,
    description: "Review and approve listings",
  },
  // Reviews disabled until reviews table is created
  // {
  //   label: "Review Queue",
  //   href: "/dashboard/admin/reviews",
  //   icon: Star,
  //   description: "Moderate user reviews",
  // },
  {
    label: "Platform Analytics",
    href: "/dashboard/admin/analytics",
    icon: BarChart3,
    description: "View platform metrics",
  },
  {
    label: "System Settings",
    href: "/dashboard/admin/settings",
    icon: Settings,
    description: "Configure platform settings",
  },
];

export function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-destructive" />
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
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
              <h2 className="text-lg font-semibold mb-4">Administration</h2>
              {adminNavItems.map((item) => {
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

            {/* Admin Warning */}
            <div className="mt-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <h3 className="text-sm font-medium text-destructive">
                  Admin Access
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                You have administrative privileges. Use responsibly.
              </p>
              <div className="text-xs text-muted-foreground">
                <div>• Moderate content</div>
                <div>• Manage users</div>
                <div>• System configuration</div>
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Admin Resources</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Platform management and moderation tools.
              </p>
              <Link
                href="/dashboard/admin/settings"
                className="text-xs text-primary hover:underline"
              >
                System settings →
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
