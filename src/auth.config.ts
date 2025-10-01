import { SHOW_QUERY_LOGS } from "@/lib/constants";
import { LoginSchema } from "@/lib/schemas";
import { AuthError, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

/**
 * Auth config for Child Actor 101 Directory
 * Email-only authentication using Supabase
 * OAuth providers (Google, Facebook) have been removed
 */
export default {
  // https://authjs.dev/getting-started/migrating-to-v5#environment-variables
  // https://authjs.dev/getting-started/deployment#auth_trust_host
  // The AUTH_TRUST_HOST environment variable serves the same purpose as setting trustHost: true in your Auth.js configuration.
  // This is necessary when running Auth.js behind a proxy.
  // When set to true we will trust the X-Forwarded-Host and X-Forwarded-Proto headers
  // passed to the app by the proxy to auto-detect the host URL (AUTH_URL)
  // trustHost: true,
  providers: [
    // Email/Password authentication using Supabase
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          // TODO: Implement Supabase-based user authentication
          // For now, we'll implement a simple check
          // In production, you'll want to:
          // 1. Use Supabase Auth API
          // 2. Hash passwords properly
          // 3. Store user data in Supabase profiles table
          // 4. Implement proper password verification

          // Placeholder authentication - replace with Supabase integration
          if (email === "admin@childactor101.com" && password === "admin123") {
            return {
              id: "1",
              email: email,
              name: "Admin User",
              role: "ADMIN",
            };
          }
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
