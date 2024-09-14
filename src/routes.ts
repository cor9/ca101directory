/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/studio",

  "/search(/.*)?", // match /search and /search/xxx
  "/item(/.*)?",
  "/category(/.*)?",
  "/tag(/.*)?",
  
  "/blog(/.*)?",
  "/archive(/.*)?",
  "/post(/.*)?",
  "/author(/.*)?",
  
  "/submit(/.*)?",
  "/pricing(/.*)?",
  "/landing(/.*)?",
  
  "/terms(/.*)?",
  "/privacy(/.*)?",
  
  "/auth/new-verification",
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /dashboard
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password"
];

// restrictedRoutes is not used anywhere
// export const restrictedRoutes = [
//   "/dashboard",
//   "/settings",
//   "/submit",
//   "/update",
//   "/pay",
//   "/billing",
// ];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";