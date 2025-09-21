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
// Only require NEXTAUTH_SECRET for basic auth (OAuth providers temporarily disabled)
const hasAuthConfig = process.env.NEXTAUTH_SECRET;

let auth: any = null;

if (hasAuthConfig) {
  try {
    auth = NextAuth(authConfig).auth;
  } catch (error) {
    console.warn("NextAuth initialization failed:", error);
  }
}

// Temporarily disabled middleware to debug deployment issues
export default function middleware(req: any) {
  // Allow all requests to pass through for debugging
  return null;
}

// https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
// https://clerk.com/docs/references/nextjs/auth-middleware#usage
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
