import { SHOW_QUERY_LOGS } from "@/lib/constants";
import { LoginSchema } from "@/lib/schemas";
import { AuthError, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";

/**
 * Auth config for Child Actor 101 Directory
 * Supports Google, Facebook, and email authentication
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
    // Google OAuth provider
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Facebook OAuth provider
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),

    // Email/Password authentication
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

          // TODO: Implement Airtable-based user authentication
          // For now, we'll implement a simple check
          // In production, you'll want to:
          // 1. Hash passwords properly
          // 2. Store user data in Airtable
          // 3. Implement proper password verification

          // Placeholder authentication - replace with Airtable integration
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
