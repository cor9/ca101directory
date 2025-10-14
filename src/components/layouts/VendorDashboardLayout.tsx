import type React from "react";

/**
 * A shared layout for all vendor dashboard pages.
 * In a real application, this would contain shared navigation, headers, footers, etc.
 * specific to the vendor's logged-in experience.
 */
export const VendorDashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Example of a shared header could go here */}
      <main className="container mx-auto py-8">{children}</main>
    </div>
  );
};
