import type { UserRole } from "@/types/user-role";

/**
 * Get the appropriate dashboard URL based on user role
 */
export function getRoleBasedRedirect(role: UserRole): string {
  switch (role) {
    case "parent":
      return "/dashboard/parent";
    case "vendor":
      return "/dashboard/vendor";
    case "admin":
      return "/dashboard/admin";
    default:
      return "/dashboard";
  }
}
