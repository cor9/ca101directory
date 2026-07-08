import type { UserRole } from "@/lib/auth/roles";

/**
 * Central permissions map. The ONLY place that defines what roles can do.
 * Rule: code checks permissions, never roles.
 * Row-scoped permissions (.own / .assigned) additionally require a
 * query-level ownership filter in the calling action — this map only
 * answers "can this role use this capability at all."
 */
export const PERMISSIONS = {
  // Moderation & admin
  "listing.approve": ["admin"],
  "listing.reject": ["admin"],
  "listing.create.admin": ["admin"],
  "listing.edit.any": ["admin"],
  "listing.delete.any": ["admin"],
  "review.moderate": ["admin"],
  "user.role.change": ["admin"],
  "user.lookup": ["admin"],
  "claim.resend": ["admin"],
  "email.verify.admin": ["admin"],
  "email.send.system": ["admin"],

  // CRM / sales pipeline (rep-ready; rep role ships disabled)
  "crm.read.all": ["admin"],
  "crm.read.assigned": ["admin", "rep"],
  "crm.status.update": ["admin", "rep"],
  "crm.assign": ["admin"],

  // Rep-specific (no consumers yet in this sprint; defined for Sprint 2)
  "commission.read.own": ["admin", "rep"],
  "commission.read.all": ["admin"],
  "commission.approve": ["admin"],
  "commission.mark_paid": ["admin"],

  // Vendor self-service (paired with ownership check in the action)
  "listing.edit.own": ["vendor", "admin"],
  "listing.publish.own": ["vendor", "admin"],

  // Parent features
  "review.create": ["parent", "admin"],
} as const satisfies Record<string, readonly UserRole[]>;

export type Permission = keyof typeof PERMISSIONS;
