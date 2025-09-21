import authConfig from "@/auth.config";
import type { UserRole } from "@/types/user-role";
import NextAuth from "next-auth";

/**
 * Auth configuration for Child Actor 101 Directory
 * Supports Google, Facebook, and email authentication
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
  // TODO: Implement Airtable adapter when user management is needed
  // adapter: AirtableAdapter(airtableClient),
  // https://authjs.dev/concepts/session-strategies
  session: { strategy: "jwt" },
  // https://authjs.dev/concepts/callbacks
  callbacks: {
    // SignIn callback - allow authentication
    signIn: async ({ user, account, profile }) => {
      console.log("Auth signIn:", {
        user: user.email,
        account: account?.provider,
      });

      // Allow all sign-ins for now
      // TODO: Implement proper user validation with Airtable
      return true;
    },

    // JWT callback - add user role and data
    jwt: async ({ token, user, account }) => {
      console.log("Auth JWT:", {
        user: user?.email,
        account: account?.provider,
      });

      if (user) {
        token.role = (user as any).role || "USER";
        token.id = user.id;
      }

      return token;
    },

    // Session callback - add user data to session
    session: async ({ session, token }) => {
      console.log("Auth session:", { user: session.user?.email });

      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }

      return session;
    },
  },
});
