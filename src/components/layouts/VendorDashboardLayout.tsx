import React from "react";

const navItems = [
    // This is a placeholder for where a future link might go.
    // { name: "My Listing", href: "/dashboard/vendor/listing" },
    { name: "Resource Kit", href: "/dashboard/vendor/resources" },
    // { name: "Analytics", href: "/dashboard/vendor/analytics" },
];

/**
 * A shared layout for all vendor dashboard pages.
 * Includes a header with navigation specific to the vendor's logged-in experience.
 */
export const VendorDashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // NOTE: This component does not have access to Next.js's `usePathname` hook
  // to highlight the active link, as it's not a full Next.js environment.
  // A simple navigation structure is provided instead.
  
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between">
            <a href="/dashboard/vendor" className="font-bold text-lg text-foreground">
                Vendor Dashboard
            </a>
            <nav className="flex items-center space-x-6 text-sm font-medium">
               {navItems.map((item) => (
                   <a key={item.href} href={item.href} className="text-muted-foreground transition-colors hover:text-foreground">
                       {item.name}
                   </a>
               ))}
                 {/* This would be the standard sign-out link for next-auth */}
                <a href="/api/auth/signout" className="text-muted-foreground transition-colors hover:text-foreground">Sign Out</a>
            </nav>
        </div>
      </header>
      <main className="container mx-auto py-8">{children}</main>
    </div>
  );
};
