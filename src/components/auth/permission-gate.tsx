"use client";

import { type UserRole, hasPermission } from "@/lib/auth/roles";
import { useSession } from "next-auth/react";

interface PermissionGateProps {
  children: React.ReactNode;
  permission: string;
  fallbackComponent?: React.ReactNode;
  showFallback?: boolean;
}

/**
 * PermissionGate component - Shows content based on user permissions
 *
 * @param children - Content to render if user has permission
 * @param permission - Permission to check
 * @param fallbackComponent - Component to show if user doesn't have permission
 * @param showFallback - Whether to show fallback component or nothing
 */
export function PermissionGate({
  children,
  permission,
  fallbackComponent = null,
  showFallback = false,
}: PermissionGateProps) {
  const { data: session } = useSession();

  if (!session?.user) {
    return showFallback ? <>{fallbackComponent}</> : null;
  }

  const hasAccess = hasPermission(
    session.user as any,
    permission as keyof typeof import("@/lib/auth/roles").PERMISSIONS.ADMIN,
  );

  if (!hasAccess) {
    return showFallback ? <>{fallbackComponent}</> : null;
  }

  return <>{children}</>;
}

/**
 * Hook to check if current user has a specific permission
 */
export function usePermission(permission: string) {
  const { data: session } = useSession();

  if (!session?.user) {
    return { hasPermission: false, isLoading: false };
  }

  const hasAccess = hasPermission(
    session.user as any,
    permission as keyof typeof import("@/lib/auth/roles").PERMISSIONS.ADMIN,
  );

  return { hasPermission: hasAccess, isLoading: false };
}
