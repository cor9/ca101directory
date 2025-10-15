import { auth } from "@/auth";
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

// Check if required environment variables are available
// Only require NEXTAUTH_SECRET for basic auth (OAuth providers temporarily disabled)
const hasAuthConfig = process.env.NEXTAUTH_SECRET;

console.log("Middleware Debug:", {
  hasAuthConfig: !!hasAuthConfig,
  nextAuthSecret: hasAuthConfig ? "***" : "missing",
  nodeEnv: process.env.NODE_ENV,
});

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
