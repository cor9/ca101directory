/**
 * Feature Flags Configuration
 *
 * Controls which features are enabled/disabled in the application.
 * Used for Directory Lite deployment mode and gradual feature rollouts.
 */

export interface FeatureFlags {
  // Authentication & Roles
  enableParentAuth: boolean;
  enableVendorAuth: boolean;
  enableAdminAuth: boolean;

  // User Features
  enableReviews: boolean;
  enableFavorites: boolean;
  enableBookmarks: boolean;

  // Dashboard Features
  enableParentDashboard: boolean;
  enableVendorDashboard: boolean;
  enableAdminDashboard: boolean;

  // UI Components
  enableReviewButtons: boolean;
  enableFavoriteButtons: boolean;
  enableBookmarkButtons: boolean;

  // API Features
  enableReviewAPI: boolean;
  enableFavoriteAPI: boolean;
  enableBookmarkAPI: boolean;

  // Navigation
  showParentNav: boolean;
  showReviewNav: boolean;
  showFavoriteNav: boolean;
}

/**
 * Default feature flags for full application
 */
export const defaultFeatureFlags: FeatureFlags = {
  // Authentication & Roles
  enableParentAuth: true, // Enabled for parent dashboard access
  enableVendorAuth: true,
  enableAdminAuth: true,

  // User Features
  enableReviews: false, // Disabled until reviews table is created
  enableFavorites: false, // Disabled - parent feature
  enableBookmarks: false, // Disabled - parent feature

  // Dashboard Features
  enableParentDashboard: true, // Enabled for parent dashboard access
  enableVendorDashboard: true,
  enableAdminDashboard: true,

  // UI Components
  enableReviewButtons: false, // Disabled until reviews table is created
  enableFavoriteButtons: false, // Disabled - parent feature
  enableBookmarkButtons: false, // Disabled - parent feature

  // API Features
  enableReviewAPI: false, // Disabled until reviews table is created
  enableFavoriteAPI: false, // Disabled - parent feature
  enableBookmarkAPI: false, // Disabled - parent feature

  // Navigation
  showParentNav: false, // Disabled - parent feature
  showReviewNav: false, // Disabled until reviews table is created
  showFavoriteNav: false, // Disabled - parent feature
};

/**
 * Directory Lite feature flags - vendor and guest only
 */
export const directoryLiteFeatureFlags: FeatureFlags = {
  // Authentication & Roles
  enableParentAuth: false,
  enableVendorAuth: true,
  enableAdminAuth: true,

  // User Features
  enableReviews: false,
  enableFavorites: false,
  enableBookmarks: false,

  // Dashboard Features
  enableParentDashboard: false,
  enableVendorDashboard: true,
  enableAdminDashboard: true,

  // UI Components
  enableReviewButtons: false,
  enableFavoriteButtons: false,
  enableBookmarkButtons: false,

  // API Features
  enableReviewAPI: false,
  enableFavoriteAPI: false,
  enableBookmarkAPI: false,

  // Navigation
  showParentNav: false,
  showReviewNav: false,
  showFavoriteNav: false,
};

/**
 * Get feature flags based on environment or deployment mode
 */
export function getFeatureFlags(): FeatureFlags {
  // Check for environment variable to enable Directory Lite mode
  const isDirectoryLite = process.env.NEXT_PUBLIC_DIRECTORY_LITE === "true";

  if (isDirectoryLite) {
    return directoryLiteFeatureFlags;
  }

  // Check for individual feature flag environment variables
  return {
    // Authentication & Roles
    enableParentAuth: process.env.NEXT_PUBLIC_ENABLE_PARENT_AUTH !== "false",
    enableVendorAuth: process.env.NEXT_PUBLIC_ENABLE_VENDOR_AUTH !== "false",
    enableAdminAuth: process.env.NEXT_PUBLIC_ENABLE_ADMIN_AUTH !== "false",

    // User Features
    enableReviews: process.env.NEXT_PUBLIC_ENABLE_REVIEWS !== "false",
    enableFavorites: process.env.NEXT_PUBLIC_ENABLE_FAVORITES !== "false",
    enableBookmarks: process.env.NEXT_PUBLIC_ENABLE_BOOKMARKS !== "false",

    // Dashboard Features
    enableParentDashboard:
      process.env.NEXT_PUBLIC_ENABLE_PARENT_DASHBOARD !== "false",
    enableVendorDashboard:
      process.env.NEXT_PUBLIC_ENABLE_VENDOR_DASHBOARD !== "false",
    enableAdminDashboard:
      process.env.NEXT_PUBLIC_ENABLE_ADMIN_DASHBOARD !== "false",

    // UI Components
    enableReviewButtons:
      process.env.NEXT_PUBLIC_ENABLE_REVIEW_BUTTONS !== "false",
    enableFavoriteButtons:
      process.env.NEXT_PUBLIC_ENABLE_FAVORITE_BUTTONS !== "false",
    enableBookmarkButtons:
      process.env.NEXT_PUBLIC_ENABLE_BOOKMARK_BUTTONS !== "false",

    // API Features
    enableReviewAPI: process.env.NEXT_PUBLIC_ENABLE_REVIEW_API !== "false",
    enableFavoriteAPI: process.env.NEXT_PUBLIC_ENABLE_FAVORITE_API !== "false",
    enableBookmarkAPI: process.env.NEXT_PUBLIC_ENABLE_BOOKMARK_API !== "false",

    // Navigation
    showParentNav: process.env.NEXT_PUBLIC_SHOW_PARENT_NAV !== "false",
    showReviewNav: process.env.NEXT_PUBLIC_SHOW_REVIEW_NAV !== "false",
    showFavoriteNav: process.env.NEXT_PUBLIC_SHOW_FAVORITE_NAV !== "false",
  };
}

/**
 * Client-side feature flags (for use in React components)
 * These are the same as server-side but available in the browser
 */
export const featureFlags = getFeatureFlags();

/**
 * Utility functions for feature flag checks
 */
export const isFeatureEnabled = (flag: keyof FeatureFlags): boolean => {
  return featureFlags[flag];
};

export const isParentAuthEnabled = (): boolean =>
  isFeatureEnabled("enableParentAuth");
export const isVendorAuthEnabled = (): boolean =>
  isFeatureEnabled("enableVendorAuth");
export const isAdminAuthEnabled = (): boolean =>
  isFeatureEnabled("enableAdminAuth");

export const isReviewsEnabled = (): boolean =>
  isFeatureEnabled("enableReviews");
export const isFavoritesEnabled = (): boolean =>
  isFeatureEnabled("enableFavorites");
export const isBookmarksEnabled = (): boolean =>
  isFeatureEnabled("enableBookmarks");

export const isParentDashboardEnabled = (): boolean =>
  isFeatureEnabled("enableParentDashboard");
export const isVendorDashboardEnabled = (): boolean =>
  isFeatureEnabled("enableVendorDashboard");
export const isAdminDashboardEnabled = (): boolean =>
  isFeatureEnabled("enableAdminDashboard");

export const isReviewButtonsEnabled = (): boolean =>
  isFeatureEnabled("enableReviewButtons");
export const isFavoriteButtonsEnabled = (): boolean =>
  isFeatureEnabled("enableFavoriteButtons");
export const isBookmarkButtonsEnabled = (): boolean =>
  isFeatureEnabled("enableBookmarkButtons");

export const isReviewAPIEnabled = (): boolean =>
  isFeatureEnabled("enableReviewAPI");
export const isFavoriteAPIEnabled = (): boolean =>
  isFeatureEnabled("enableFavoriteAPI");
export const isBookmarkAPIEnabled = (): boolean =>
  isFeatureEnabled("enableBookmarkAPI");

export const isParentNavEnabled = (): boolean =>
  isFeatureEnabled("showParentNav");
export const isReviewNavEnabled = (): boolean =>
  isFeatureEnabled("showReviewNav");
export const isFavoriteNavEnabled = (): boolean =>
  isFeatureEnabled("showFavoriteNav");

/**
 * Get enabled user roles based on feature flags
 */
export const getEnabledRoles = (): string[] => {
  const roles: string[] = ["guest"]; // Guest is always enabled

  if (isVendorAuthEnabled()) roles.push("vendor");
  if (isParentAuthEnabled()) roles.push("parent");
  if (isAdminAuthEnabled()) roles.push("admin");

  return roles;
};

/**
 * Check if a role is enabled
 */
export const isRoleEnabled = (role: string): boolean => {
  return getEnabledRoles().includes(role);
};

/**
 * Get enabled dashboard routes
 */
export const getEnabledDashboardRoutes = (): string[] => {
  const routes: string[] = [];

  if (isParentDashboardEnabled()) routes.push("/dashboard/parent");
  if (isVendorDashboardEnabled()) routes.push("/dashboard/vendor");
  if (isAdminDashboardEnabled()) routes.push("/dashboard/admin");

  return routes;
};

/**
 * Check if a dashboard route is enabled
 */
export const isDashboardRouteEnabled = (route: string): boolean => {
  return getEnabledDashboardRoutes().includes(route);
};
