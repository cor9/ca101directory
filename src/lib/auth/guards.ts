import { currentUser } from "@/lib/auth";
import { PERMISSIONS, type Permission } from "@/lib/auth/permissions";
import type { UserRole } from "@/lib/auth/roles";

export type GuardResult =
  | { authorized: true; user: { id: string; role: UserRole; email?: string } }
  | { authorized: false; user: null };

/**
 * Permission gate for server actions and API routes.
 * Session-layer agnostic: only depends on currentUser().
 */
export async function requirePermission(
  permission: Permission,
): Promise<GuardResult> {
  const user = await currentUser();
  const role = (user?.role ?? "guest") as UserRole;
  if (
    !user?.id ||
    !(PERMISSIONS[permission] as readonly string[]).includes(role)
  ) {
    return { authorized: false, user: null };
  }
  return { authorized: true, user: user as GuardResult["user"] & object };
}

/** Convenience gate for admin-only surfaces. */
export async function requireAdmin(): Promise<GuardResult> {
  const user = await currentUser();
  if (!user?.id || user.role !== "admin") {
    return { authorized: false, user: null };
  }
  return { authorized: true, user: user as GuardResult["user"] & object };
}
