import { auth } from "@/auth";
import { isAuthConfigured } from "@/lib/auth-config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";
import type { NextRequest } from "next/server";

/**
 * https://www.youtube.com/watch?v=1MTyCvS05V4
 * Next Auth V5 - Advanced Guide (2024)
 */

// Auth is "configured" when the same secret Auth.js uses is present
// (AUTH_SECRET, or NEXTAUTH_SECRET as the fallback). Checking only
// NEXTAUTH_SECRET here made the site treat itself as signed-out-only whenever
// the secret was supplied as AUTH_SECRET.
const hasAuthConfig = isAuthConfigured();

console.log("Middleware Debug:", {
  hasAuthConfig,
  authSecret: hasAuthConfig ? "***" : "missing",
  nodeEnv: process.env.NODE_ENV,
});
if (!hasAuthConfig) {
  console.error(
    "AUTH SECRET MISSING: set AUTH_SECRET (or NEXTAUTH_SECRET) for this environment. Sign-in and protected pages are unavailable until it is set.",
  );
}

// since we have put role in user session, so we can know the role of the user
export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  console.log("Middleware request:", {
    pathname: nextUrl.pathname,
    hasAuth: !!hasAuthConfig,
  });

  // If auth is not available, allow all public routes
  if (!hasAuthConfig) {
    const isPublicRoute = publicRoutes.some((route) =>
      new RegExp(`^${route}$`).test(nextUrl.pathname),
    );

    console.log("No auth, checking public route:", {
      pathname: nextUrl.pathname,
      isPublicRoute,
    });

    if (isPublicRoute) {
      return null; // Allow access to public routes
    }

    // For non-public routes, redirect to homepage
    console.log("Redirecting to homepage for non-public route");
    return Response.redirect(new URL("/", nextUrl));
  }

  // Get the session
  const session = await auth();
  const isLoggedIn = !!session?.user;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.some((route) =>
    new RegExp(`^${route}$`).test(nextUrl.pathname),
  );
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // do nothing if on api auth routes
  if (isApiAuthRoute) {
    return null;
  }

  // redirect to dashboard if logged in and on auth routes
  if (isAuthRoute) {
    if (isLoggedIn) {
      console.log("middleware, redirecting to dashboard");
      // Let the dashboard page handle role-based routing
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  // redirect to login if not logged in and not on public routes
  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl),
    );
  }

  return null;
}

// https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
// https://clerk.com/docs/references/nextjs/auth-middleware#usage
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
