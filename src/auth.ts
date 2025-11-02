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
      console.log("=== JWT CALLBACK START ===");
      console.log("Auth JWT raw data:", {
        user: user?.email,
        userRole: (user as any)?.role,
        account: account?.provider,
        tokenSub: token.sub,
        tokenRole: token.role,
        fullUser: user,
      });

      if (user) {
        // Initial sign in - user object is available
        const userRole = (user as any).role;
        console.log("JWT: Initial sign in, user role from authorize:", userRole);

        if (!userRole || userRole === "guest") {
          console.error("⚠️ WARNING: User has no role or is guest!", {
            userId: user.id,
            userEmail: user.email,
            userObject: user,
          });
        }

        token.role = userRole || "guest";
        token.id = user.id;
        token.supabaseAccessToken = (user as any).supabaseAccessToken;
        token.supabaseRefreshToken = (user as any).supabaseRefreshToken;
        token.remember = (user as any).remember;

        if ((user as any).sessionExpiresAt) {
          token.sessionExpiresAt = (user as any).sessionExpiresAt;
          token.exp = Math.floor(
            new Date((user as any).sessionExpiresAt).getTime() / 1000,
          );
        }

        console.log("JWT: Token role set to:", token.role, "Token ID:", token.id);
      } else if (token.sub && !token.role) {
        // Token refresh but no role in token - fetch from database
        console.log("JWT: Token refresh, no role in token. Fetching from database...");
        try {
          const supabase = createServerClient();
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("role, id, email")
            .eq("id", token.sub)
            .single();

          console.log("JWT: Database profile fetch result:", { profile, error });

          if (profile?.role) {
            token.role = profile.role;
            console.log("JWT: Token role refreshed from DB to:", token.role);
          } else {
            console.error("⚠️ JWT: No role found in database for user:", token.sub);
            token.role = "guest"; // Fallback
          }
        } catch (error) {
          console.error("❌ JWT: Error refreshing user role:", error);
          token.role = "guest"; // Fallback
        }
      }

      if (token.sessionExpiresAt) {
        const expiresAt = new Date(token.sessionExpiresAt as string).getTime();
        if (Number.isFinite(expiresAt) && Date.now() > expiresAt) {
          console.log("JWT: Session expired based on role duration");
          token.exp = Math.floor(Date.now() / 1000) - 60;
        }
      }

      console.log("=== JWT CALLBACK END ===", {
        finalTokenRole: token.role,
        finalTokenId: token.id,
        sessionExpiresAt: token.sessionExpiresAt,
      });
      return token;
    },

    // Session callback - add user data to session
    session: async ({ session, token }) => {
      console.log("=== SESSION CALLBACK START ===");
      console.log("Auth session callback raw:", {
        sessionUserEmail: session.user?.email,
        tokenRole: token.role,
        tokenId: token.id,
        tokenSub: token.sub,
        sessionExpiresAt: token.sessionExpiresAt,
      });

      if (token.sessionExpiresAt) {
        const expiresAt = new Date(token.sessionExpiresAt as string).getTime();
        if (Number.isFinite(expiresAt) && Date.now() > expiresAt) {
          console.log("SESSION: Role-based session expired, returning null");
          return null;
        }
        (session as any).expires = new Date(expiresAt).toISOString();
        (session as any).sessionExpiresAt = (session as any).expires;
      }

      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        (session.user as any).supabaseAccessToken =
          token.supabaseAccessToken as string | undefined;
        (session.user as any).supabaseRefreshToken =
          token.supabaseRefreshToken as string | undefined;
        console.log("SESSION: User data set from token:", {
          id: session.user.id,
          role: session.user.role,
        });
      }

      console.log("=== SESSION CALLBACK END ===", {
        finalUserId: session.user.id,
        finalUserRole: session.user.role,
        finalUserEmail: session.user.email,
        sessionExpiresAt: (session as any).sessionExpiresAt,
      });

      return session;
    },
  },
});
