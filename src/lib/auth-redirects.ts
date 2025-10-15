import type { UserRole } from "@/types/user-role";

/**
 * Get the appropriate dashboard URL based on user role
 */
export function getRoleBasedRedirect(role: UserRole): string {
  console.log("getRoleBasedRedirect called with role:", role);

  switch (role) {
    case "parent":
      console.log("Redirecting parent to /dashboard/parent");
      return "/dashboard/parent";
    case "vendor":
      console.log("Redirecting vendor to /dashboard/vendor");
      return "/dashboard/vendor";
    case "admin":
      console.log("Redirecting admin to /dashboard/admin");
      return "/dashboard/admin";
    default:
      console.log("Unknown role, redirecting to /dashboard");
      return "/dashboard";
  }
}
