import authConfig from "@/auth.config";
import type { UserRole } from "@/types/user-role";
import NextAuth from "next-auth";

/**
 * Simplified auth configuration for Child Actor 101 Directory
 * Authentication will be re-implemented with Airtable when needed
 */
export const {
  handlers,
  auth,
  signIn,
  signOut,
  //unstable update in Beta version
  unstable_update,
} = NextAuth({
  ...authConfig,
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  // TODO: Implement Airtable adapter when authentication is needed
  // adapter: AirtableAdapter(airtableClient),
  // https://authjs.dev/concepts/session-strategies
  session: { strategy: "jwt" },
  // https://authjs.dev/concepts/callbacks
  callbacks: {
    // Simplified signIn callback
    signIn: async ({ user, account }) => {
      console.log("Auth signIn called - authentication disabled for now");
      return false; // Disable authentication for now
    },

    // Simplified JWT callback
    jwt: async ({ token }) => {
      console.log("Auth JWT called - authentication disabled for now");
      return token;
    },

    // Simplified session callback
    session: async ({ session, token }) => {
      console.log("Auth session called - authentication disabled for now");
      return session;
    },
  },
});
