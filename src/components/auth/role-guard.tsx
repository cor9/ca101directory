"use client";

import { type UserRole, getRole, hasAnyRole, isGuest } from "@/lib/auth/roles";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackRoute?: string;
  showFallback?: boolean;
  fallbackComponent?: React.ReactNode;
}

/**
 * RoleGuard component - Protects routes based on user roles
 *
 * Phase 4.1: Dashboard Redesign & Role Separation
 *
 * @param children - Content to render if user has required role
 * @param allowedRoles - Array of roles that can access this content
 * @param fallbackRoute - Route to redirect to if user doesn't have access
 * @param showFallback - Whether to show fallback component instead of redirecting
 * @param fallbackComponent - Component to show if user doesn't have access
 */
export function RoleGuard({
  children,
  allowedRoles,
  fallbackRoute = "/auth/login",
  showFallback = false,
  fallbackComponent = <div>Access Denied</div>,
}: RoleGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (!session?.user) {
      // Not authenticated - redirect to login with next parameter
      const currentPath = window.location.pathname;
      router.push(`/auth/login?next=${encodeURIComponent(currentPath)}`);
      return;
    }

    const userRole = getRole(session.user as any);

    // Guests are never allowed to access protected routes
    if (isGuest(session.user as any)) {
      router.push("/auth/login");
      return;
    }

    if (!hasAnyRole(session.user as any, allowedRoles)) {
      // User doesn't have required role
      if (showFallback) {
        // Show fallback component
        return;
      }
      // Redirect to fallback route
      router.push(fallbackRoute);
      return;
    }
  }, [session, status, router, allowedRoles, fallbackRoute, showFallback]);

  // Show loading state
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // Show fallback if user doesn't have access and fallback is enabled
  if (
    session?.user &&
    !hasAnyRole(session.user as any, allowedRoles) &&
    showFallback
  ) {
    return <>{fallbackComponent}</>;
  }

  // Show content if user has required role
  if (session?.user && hasAnyRole(session.user as any, allowedRoles)) {
    return <>{children}</>;
  }

  // Default fallback
  return <div>Access Denied</div>;
}

/**
 * DashboardGuard component - Specifically for dashboard routes
 *
 * Phase 4.1: Dashboard Redesign & Role Separation
 * Blocks guests and ensures only authenticated users with proper roles can access dashboard
 */
export function DashboardGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}) {
  return (
    <RoleGuard
      allowedRoles={allowedRoles}
      fallbackRoute="/auth/login"
      showFallback={false}
    >
      {children}
    </RoleGuard>
  );
}

/**
 * Hook to check if current user has required role
 */
export function useRoleCheck(allowedRoles: UserRole[]) {
  const { data: session, status } = useSession();

  if (status === "loading" || !session?.user) {
    return { hasAccess: false, isLoading: true, userRole: null };
  }

  const userRole = getRole(session.user as any);
  const hasAccess = hasAnyRole(session.user as any, allowedRoles);

  return { hasAccess, isLoading: false, userRole };
}
