import { SHOW_QUERY_LOGS } from "@/lib/constants";
import { LoginSchema } from "@/lib/schemas";
import { AuthError, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

/**
 * Simplified auth config for Child Actor 101 Directory
 * Authentication will be re-implemented with Airtable when needed
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
    // https://authjs.dev/getting-started/authentication/oauth
    GitHub,
    Google,
    // https://authjs.dev/getting-started/authentication/credentials
    // Simplified credentials provider - authentication disabled for now
    Credentials({
      authorize: async (credentials) => {
        console.log("Authentication disabled - returning null");
        return null; // Disable authentication for now
      },
    }),
  ],
} satisfies NextAuthConfig;
