/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/studio(/.*)?",

  "/search(/.*)?",
  "/directory(/.*)?",
  "/collection(/.*)?",
  "/category(/.*)?",
  "/tag(/.*)?",
  "/item(/.*)?",
  "/listing(/.*)?",
  "/pricing(/.*)?",
  "/blog(/.*)?",

  "/about(/.*)?",
  "/terms(/.*)?",
  "/privacy(/.*)?",
  "/changelog(/.*)?",

  // user clicks verification link from email
  "/auth/new-verification",

  // unsubscribe
  "/unsubscribe(/.*)?",

  // stripe webhook must be public, otherwise can not receive stripe events
  "/api/webhook",

  // send emails, like submission approval or rejection emails
  "/api/send-email",

  // test airtable connection
  "/api/test-airtable",

  // debug listings
  "/api/debug-listings",

  // debug all listings
  "/api/debug-all-listings",

  // debug airtable direct
  "/api/debug-airtable-direct",

  // test airtable simple
  "/api/test-airtable-simple",

  // og images
  "/api/og",

  // draft mode
  "/api/draft",

  // submission form (public)
  "/submit(/.*)?",

  // plan selection (public)
  "/plan-selection(/.*)?",

  // payment success (public)
  "/payment-success(/.*)?",

  // claim and upgrade routes (public)
  "/claim-upgrade(/.*)?",

  // vendor landing page (public)
  "/list-your-business",

  // test pages
  "/shadcn(/.*)?",
  "/loading(/.*)?",
  "/home2(/.*)?",
  "/home3(/.*)?",

  // debug authentication (temporary)
  "/debug-auth",
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
  "/auth/new-password",
];

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
