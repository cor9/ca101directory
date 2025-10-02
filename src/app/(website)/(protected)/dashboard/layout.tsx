/**
 * Dashboard Layout - Phase 4.1: Dashboard Redesign & Role Separation
 *
 * This layout is intentionally minimal to prevent vendor content leakage.
 * Each role-specific dashboard uses its own layout component:
 * - ParentDashboardLayout for parents
 * - VendorDashboardLayout for vendors
 * - AdminDashboardLayout for admins
 *
 * No shared dashboard elements to prevent cross-role content leakage.
 */
export default async function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
  return <>{children}</>;
}
