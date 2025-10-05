/**
 * Role-based authentication and permissions system
 * Supports three user types: guest, parent, vendor
 */

import { getEnabledRoles, isRoleEnabled } from "@/config/feature-flags";

export type UserRole = "guest" | "parent" | "vendor" | "admin";

/**
 * Get enabled roles based on feature flags
 */
export const ENABLED_ROLES = getEnabledRoles();

/**
 * Check if a role is enabled for authentication
 */
export const isRoleEnabledForAuth = (role: UserRole): boolean => {
  return isRoleEnabled(role);
};

export interface UserWithRole {
  id?: string;
  email?: string;
  role?: UserRole;
  [key: string]: unknown;
}

/**
 * Get user role with fallback to 'guest'
 */
export function getRole(user: UserWithRole | null | undefined): UserRole {
  console.log("getRole called with user:", user);

  // If user exists but no role is set, default to 'guest' 
  if (user && !user.role) {
    console.log("User exists but no role, defaulting to guest");
    return "guest";
  }

  const role = user?.role ?? "guest";
  console.log("getRole returning:", role);
  return role;
}

/**
 * Check if user has a specific role
 */
export function hasRole(
  user: UserWithRole | null | undefined,
  role: UserRole,
): boolean {
  return getRole(user) === role;
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(
  user: UserWithRole | null | undefined,
  roles: UserRole[],
): boolean {
  const userRole = getRole(user);
  const hasAccess = roles.includes(userRole);
  console.log("hasAnyRole:", { userRole, roles, hasAccess });
  return hasAccess;
}

/**
 * Check if user is authenticated (not guest)
 */
export function isAuthenticated(
  user: UserWithRole | null | undefined,
): boolean {
  return getRole(user) !== "guest";
}

/**
 * Check if user is a vendor
 */
export function isVendor(user: UserWithRole | null | undefined): boolean {
  return hasRole(user, "vendor");
}

/**
 * Check if user is a parent
 */
export function isParent(user: UserWithRole | null | undefined): boolean {
  return hasRole(user, "parent");
}

/**
 * Check if user is an admin
 */
export function isAdmin(user: UserWithRole | null | undefined): boolean {
  return hasRole(user, "admin");
}

/**
 * Check if user is a guest (not authenticated)
 */
export function isGuest(user: UserWithRole | null | undefined): boolean {
  return hasRole(user, "guest");
}

/**
 * Role-based permissions
 */
export const PERMISSIONS = {
  // Public/Guest permissions
  GUEST: {
    VIEW_LISTINGS: true,
    SEARCH_LISTINGS: true,
    VIEW_REVIEWS: true,
    CLAIM_LISTING_PROMPT: true, // Shows login prompt
  },

  // Parent permissions
  PARENT: {
    VIEW_LISTINGS: true,
    SEARCH_LISTINGS: true,
    VIEW_REVIEWS: true,
    SAVE_FAVORITES: true,
    WRITE_REVIEWS: true,
    BOOKMARK_LISTINGS: true,
    REPORT_LISTINGS: true,
    CLAIM_LISTING_PROMPT: true,
  },

  // Vendor permissions
  VENDOR: {
    VIEW_LISTINGS: true,
    SEARCH_LISTINGS: true,
    VIEW_REVIEWS: true,
    CLAIM_LISTING: true,
    CREATE_LISTING: true,
    UPDATE_LISTING: true,
    UPLOAD_IMAGES: true,
    VIEW_ANALYTICS: true,
    UPGRADE_PLAN: true,
    MANAGE_BILLING: true,
  },

  // Admin permissions
  ADMIN: {
    VIEW_LISTINGS: true,
    SEARCH_LISTINGS: true,
    VIEW_REVIEWS: true,
    CLAIM_LISTING: true,
    CREATE_LISTING: true,
    UPDATE_LISTING: true,
    UPLOAD_IMAGES: true,
    VIEW_ANALYTICS: true,
    UPGRADE_PLAN: true,
    MANAGE_BILLING: true,
    MODERATE_REVIEWS: true,
    MANAGE_USERS: true,
    MANAGE_LISTINGS: true,
    VIEW_ADMIN_DASHBOARD: true,
  },
} as const;

/**
 * Check if user has a specific permission
 */
export function hasPermission(
  user: UserWithRole | null | undefined,
  permission: keyof typeof PERMISSIONS.ADMIN,
): boolean {
  const role = getRole(user);
  const rolePermissions =
    PERMISSIONS[role.toUpperCase() as keyof typeof PERMISSIONS];
  return rolePermissions?.[permission] ?? false;
}

/**
 * Get dashboard route based on user role and feature flags
 */
export function getDashboardRoute(
  user: UserWithRole | null | undefined,
): string {
  const role = getRole(user);

  switch (role) {
    case "vendor":
      return "/dashboard/vendor";
    case "parent":
      // Check if parent dashboard is enabled
      if (isRoleEnabledForAuth("parent")) {
        return "/dashboard/parent";
      }
      // Fallback to login if parent features are disabled
      return "/auth/login";
    case "admin":
      return "/dashboard/admin";
    case "guest":
    default:
      return "/auth/login";
  }
}

/**
 * Get user role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case "guest":
      return "Guest";
    case "parent":
      return "Parent/Actor";
    case "vendor":
      return "Vendor";
    case "admin":
      return "Administrator";
    default:
      return "Unknown";
  }
}

/**
 * Get user role description
 */
export function getRoleDescription(role: UserRole): string {
  switch (role) {
    case "guest":
      return "Browse listings and search for professionals";
    case "parent":
      return "Save favorites, write reviews, and manage your child's acting journey";
    case "vendor":
      return "Manage your professional listings and grow your business";
    case "admin":
      return "Manage the platform and moderate content";
    default:
      return "Unknown role";
  }
}
