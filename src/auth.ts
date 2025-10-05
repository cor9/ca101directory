import authConfig from "@/auth.config";
import { createServerClient } from "@/lib/supabase";
import type { UserRole } from "@/types/user-role";
import NextAuth from "next-auth";

/**
 * Auth configuration for Child Actor 101 Directory
 * Email-only authentication using Supabase
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
    // Redirect callback - handle post-login redirects
    redirect: async ({ url, baseUrl }) => {
      console.log("Auth redirect:", { url, baseUrl });

      // If it's a relative URL, make it absolute
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      // If it's the same origin, allow it
      if (new URL(url).origin === baseUrl) return url;

      // Default redirect to dashboard after login/signup
      // Role-based redirects will be handled in the login action
      return `${baseUrl}/dashboard`;
    },
    // SignIn callback - allow authentication
    signIn: async ({ user, account, profile }) => {
      console.log("Auth signIn:", {
        user: user.email,
        account: account?.provider,
      });

      // Allow all sign-ins for now
      // TODO: Implement proper user validation with Supabase
      return true;
    },

    // JWT callback - add user role and data
    jwt: async ({ token, user, account }) => {
      console.log("Auth JWT:", {
        user: user?.email,
        role: (user as any)?.role,
        account: account?.provider,
        tokenSub: token.sub,
      });

      if (user) {
        // Use the actual role from database, don't default to parent
        token.role = (user as any).role || "guest";
        token.id = user.id;
        console.log("JWT token role set to:", token.role);
      } else if (token.sub) {
        // On token refresh, fetch fresh role from database
        try {
          const supabase = createServerClient();
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", token.sub)
            .single();

          if (profile?.role) {
            token.role = profile.role;
            console.log("JWT token role refreshed to:", token.role);
          }
        } catch (error) {
          console.error("Error refreshing user role:", error);
        }
      }

      return token;
    },

    // Session callback - add user data to session
    session: async ({ session, token }) => {
      console.log("Auth session callback:", { 
        user: session.user?.email, 
        tokenRole: token.role,
        tokenId: token.id,
      });

      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        console.log("Session user role set to:", session.user.role);
      }

      console.log("Final session:", {
        userId: session.user.id,
        userRole: session.user.role,
        userEmail: session.user.email,
      });

      return session;
    },
  },
});
