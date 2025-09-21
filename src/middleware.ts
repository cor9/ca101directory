import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";
import NextAuth from "next-auth";

/**
 * https://www.youtube.com/watch?v=1MTyCvS05V4
 * Next Auth V5 - Advanced Guide (2024)
 */

// Check if required environment variables are available
const hasAuthConfig = process.env.NEXTAUTH_SECRET && 
  process.env.GOOGLE_CLIENT_ID && 
  process.env.GOOGLE_CLIENT_SECRET;

let auth: any = null;

if (hasAuthConfig) {
  try {
    auth = NextAuth(authConfig).auth;
  } catch (error) {
    console.warn("NextAuth initialization failed:", error);
  }
}

// since we have put role in user session, so we can know the role of the user
export default function middleware(req: any) {
  // If auth is not available, allow all public routes
  if (!auth) {
    const { nextUrl } = req;
    const isPublicRoute = publicRoutes.some((route) =>
      new RegExp(`^${route}$`).test(nextUrl.pathname),
    );
    
    if (isPublicRoute) {
      return null; // Allow access to public routes
    }
    
    // For non-public routes, redirect to homepage
    return Response.redirect(new URL("/", nextUrl));
  }

  return auth((req: any) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

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
  })(req);
}

// https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
// https://clerk.com/docs/references/nextjs/auth-middleware#usage
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
