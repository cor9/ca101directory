/**
 * Auth configuration helpers shared by the middleware and the login action.
 * Pure functions of the environment so they can be unit tested.
 */

type Env = Record<string, string | undefined>;

/**
 * The session secret, resolved exactly as Auth.js (next-auth v5) resolves it:
 * `AUTH_SECRET`, falling back to `NEXTAUTH_SECRET`. The middleware used to look
 * only at `NEXTAUTH_SECRET`, so a project configured with `AUTH_SECRET` (which
 * Auth.js happily uses) was treated as "auth not configured" and every
 * non-public route, including /auth/login, was redirected to the homepage.
 */
export const getAuthSecret = (env: Env = process.env): string | undefined =>
  env.AUTH_SECRET || env.NEXTAUTH_SECRET || undefined;

export const isAuthConfigured = (env: Env = process.env): boolean =>
  Boolean(getAuthSecret(env));

const PRODUCTION_SITE_URL = "https://directory.childactor101.com";

/**
 * Origin the emailed magic link should return to.
 *
 * Production (and local dev) behave as before: NEXT_PUBLIC_SITE_URL, then
 * NEXT_PUBLIC_APP_URL, then the production domain. On a Vercel PREVIEW
 * deployment the link must come back to that preview, otherwise the person
 * signs in on production while testing a preview. The host comes from Vercel's
 * own VERCEL_BRANCH_URL / VERCEL_URL variables (never from request headers),
 * so it cannot be influenced by a caller.
 */
export const magicLinkSiteUrl = (env: Env = process.env): string => {
  if (env.VERCEL_ENV === "preview") {
    const host = env.VERCEL_BRANCH_URL || env.VERCEL_URL;
    if (host && /^[a-z0-9.-]+\.vercel\.app$/i.test(host)) {
      return `https://${host}`;
    }
  }
  return (
    env.NEXT_PUBLIC_SITE_URL || env.NEXT_PUBLIC_APP_URL || PRODUCTION_SITE_URL
  );
};
