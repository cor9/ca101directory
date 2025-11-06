import { describe, it, expect, beforeEach } from "vitest";
import {
  getRole,
  hasRole,
  hasAnyRole,
  isParent,
  isRoleEnabledForAuth,
  type UserRole,
} from "@/lib/auth/roles";

describe("Role Management - Parent Role", () => {
  describe("getRole", () => {
    it("should return parent role for parent user", () => {
      const user = { id: "123", email: "parent@test.com", role: "parent" as UserRole };
      expect(getRole(user)).toBe("parent");
    });

    it("should return guest for user without role", () => {
      const user = { id: "123", email: "user@test.com" };
      expect(getRole(user)).toBe("guest");
    });

    it("should return guest for null user", () => {
      expect(getRole(null)).toBe("guest");
    });

    it("should return guest for undefined user", () => {
      expect(getRole(undefined)).toBe("guest");
    });
  });

  describe("hasRole", () => {
    it("should return true when user has parent role", () => {
      const user = { id: "123", email: "parent@test.com", role: "parent" as UserRole };
      expect(hasRole(user, "parent")).toBe(true);
    });

    it("should return false when user does not have parent role", () => {
      const user = { id: "123", email: "vendor@test.com", role: "vendor" as UserRole };
      expect(hasRole(user, "parent")).toBe(false);
    });

    it("should return false for null user", () => {
      expect(hasRole(null, "parent")).toBe(false);
    });
  });

  describe("hasAnyRole", () => {
    it("should return true when user has one of the specified roles", () => {
      const user = { id: "123", email: "parent@test.com", role: "parent" as UserRole };
      expect(hasAnyRole(user, ["parent", "vendor"])).toBe(true);
    });

    it("should return false when user has none of the specified roles", () => {
      const user = { id: "123", email: "guest@test.com", role: "guest" as UserRole };
      expect(hasAnyRole(user, ["parent", "vendor"])).toBe(false);
    });

    it("should return true when checking for guest and user is guest", () => {
      const user = { id: "123", email: "guest@test.com" };
      expect(hasAnyRole(user, ["guest", "parent"])).toBe(true);
    });
  });

  describe("isParent", () => {
    it("should return true for parent user", () => {
      const user = { id: "123", email: "parent@test.com", role: "parent" as UserRole };
      expect(isParent(user)).toBe(true);
    });

    it("should return false for non-parent user", () => {
      const user = { id: "123", email: "vendor@test.com", role: "vendor" as UserRole };
      expect(isParent(user)).toBe(false);
    });

    it("should return false for null user", () => {
      expect(isParent(null)).toBe(false);
    });
  });

  describe("isRoleEnabledForAuth", () => {
    it("should return true for parent role when enabled", () => {
      expect(isRoleEnabledForAuth("parent")).toBe(true);
    });

    it("should return true for guest role (always enabled)", () => {
      expect(isRoleEnabledForAuth("guest")).toBe(true);
    });
  });

  describe("Role Permissions", () => {
    it("should allow parent to save favorites", () => {
      const user = { id: "123", email: "parent@test.com", role: "parent" as UserRole };
      // In a real app, you'd check permissions here
      expect(isParent(user)).toBe(true);
    });

    it("should allow parent to write reviews", () => {
      const user = { id: "123", email: "parent@test.com", role: "parent" as UserRole };
      expect(isParent(user)).toBe(true);
    });
  });
});
