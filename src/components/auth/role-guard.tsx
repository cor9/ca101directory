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

    // Debug logging
    console.log("RoleGuard Debug:", {
      user: session.user,
      userRole,
      allowedRoles,
      hasAccess: hasAnyRole(session.user as any, allowedRoles),
    });

    // Guests are never allowed to access protected routes
    if (isGuest(session.user as any)) {
      console.log("RoleGuard: User is guest, redirecting to login");
      router.push("/auth/login");
      return;
    }

    if (!hasAnyRole(session.user as any, allowedRoles)) {
      console.log("RoleGuard: User doesn't have required role", {
        userRole,
        allowedRoles,
      });
      // User doesn't have required role
      if (showFallback) {
        // Show fallback component
        return;
      }
      // Redirect to fallback route
      router.push(fallbackRoute);
      return;
    }

    console.log("RoleGuard: Access granted");
  }, [session, status, router, allowedRoles, fallbackRoute, showFallback]);

  // Show loading state
  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl">⏳</div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show fallback if user doesn't have access and fallback is enabled
  if (
    session?.user &&
    !hasAnyRole(session.user as any, allowedRoles) &&
    showFallback
  ) {
    const userRole = getRole(session.user as any);
    console.error("Access denied (fallback):", {
      userRole,
      allowedRoles,
      userEmail: session.user.email,
    });
    return <>{fallbackComponent}</>;
  }

  // Show content if user has required role
  if (session?.user && hasAnyRole(session.user as any, allowedRoles)) {
    return <>{children}</>;
  }

  // Default fallback - show helpful error with actual role info
  const userRole = session?.user ? getRole(session.user as any) : "none";
  console.error("ACCESS DENIED - Check browser console for details:", {
    userRole,
    allowedRoles,
    hasSession: !!session,
    userEmail: session?.user?.email,
    fullUser: session?.user,
  });
  
  return (
    <div className="flex h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-md p-8 border rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-destructive">Access Denied</h1>
        <p className="text-lg mb-2">
          Your role: <strong className="text-primary">{userRole}</strong>
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Required: {allowedRoles.join(" or ")}
        </p>
        <p className="text-xs text-muted-foreground mb-6">
          Check browser console (F12) for debugging details.
        </p>
        <div className="space-y-3">
          <a 
            href="/dashboard" 
            className="block w-full bg-primary text-primary-foreground px-4 py-3 rounded-md hover:bg-primary/90 transition"
          >
            Go to Dashboard
          </a>
          <a 
            href="/auth/login" 
            className="block w-full bg-secondary text-secondary-foreground px-4 py-3 rounded-md hover:bg-secondary/90 transition"
          >
            Sign Out & Try Again
          </a>
        </div>
      </div>
    </div>
  );
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
