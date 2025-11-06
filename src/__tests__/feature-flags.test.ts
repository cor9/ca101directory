import { describe, it, expect, beforeEach } from "vitest";
import {
  isParentAuthEnabled,
  isParentDashboardEnabled,
  isFavoritesEnabled,
  isReviewsEnabled,
  isFavoriteButtonsEnabled,
  isReviewButtonsEnabled,
  isFavoriteAPIEnabled,
  isReviewAPIEnabled,
  isParentNavEnabled,
  getEnabledRoles,
  isRoleEnabled,
} from "@/config/feature-flags";

describe("Feature Flags - Parent Features", () => {
  describe("Parent Authentication Flags", () => {
    it("should have parent auth enabled", () => {
      expect(isParentAuthEnabled()).toBe(true);
    });

    it("should have parent dashboard enabled", () => {
      expect(isParentDashboardEnabled()).toBe(true);
    });
  });

  describe("Parent Feature Flags", () => {
    it("should have favorites enabled", () => {
      expect(isFavoritesEnabled()).toBe(true);
    });

    it("should have reviews enabled", () => {
      expect(isReviewsEnabled()).toBe(true);
    });

    it("should have favorite buttons enabled", () => {
      expect(isFavoriteButtonsEnabled()).toBe(true);
    });

    it("should have review buttons enabled", () => {
      expect(isReviewButtonsEnabled()).toBe(true);
    });
  });

  describe("Parent API Flags", () => {
    it("should have favorite API enabled", () => {
      expect(isFavoriteAPIEnabled()).toBe(true);
    });

    it("should have review API enabled", () => {
      expect(isReviewAPIEnabled()).toBe(true);
    });
  });

  describe("Parent Navigation Flags", () => {
    it("should have parent nav enabled", () => {
      expect(isParentNavEnabled()).toBe(true);
    });
  });

  describe("Role Management", () => {
    it("should include parent in enabled roles", () => {
      const roles = getEnabledRoles();
      expect(roles).toContain("parent");
    });

    it("should confirm parent role is enabled", () => {
      expect(isRoleEnabled("parent")).toBe(true);
    });

    it("should have guest role always enabled", () => {
      const roles = getEnabledRoles();
      expect(roles).toContain("guest");
    });
  });
});
