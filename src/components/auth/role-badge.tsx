"use client";

import { Badge } from "@/components/ui/badge";
import { type UserRole, getRole, getRoleDisplayName } from "@/lib/auth/roles";
import { useSession } from "next-auth/react";

interface RoleBadgeProps {
  userRole?: UserRole;
  showIcon?: boolean;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}

/**
 * RoleBadge component - Displays user role as a badge
 */
export function RoleBadge({
  userRole,
  showIcon = false,
  variant = "default",
  className = "",
}: RoleBadgeProps) {
  const { data: session } = useSession();

  const role = userRole || getRole(session?.user as any);
  const displayName = getRoleDisplayName(role);

  // Role-specific styling
  const getRoleVariant = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "vendor":
        return "default";
      case "parent":
        return "secondary";
      case "guest":
        return "outline";
      default:
        return "outline";
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "👑";
      case "vendor":
        return "🏢";
      case "parent":
        return "👨‍👩‍👧";
      case "guest":
        return "👤";
      default:
        return "❓";
    }
  };

  return (
    <Badge
      variant={variant === "default" ? getRoleVariant(role) : variant}
      className={`${className} ${showIcon ? "gap-1" : ""}`}
    >
      {showIcon && <span>{getRoleIcon(role)}</span>}
      {displayName}
    </Badge>
  );
}

/**
 * Hook to get current user's role information
 */
export function useUserRole() {
  const { data: session } = useSession();

  if (!session?.user) {
    return {
      role: "guest" as UserRole,
      displayName: "Guest",
      isAuthenticated: false,
    };
  }

  const role = getRole(session.user as any);
  const displayName = getRoleDisplayName(role);

  return {
    role,
    displayName,
    isAuthenticated: true,
  };
}
