import { SHOW_QUERY_LOGS } from "@/lib/constants";
import { LoginSchema } from "@/lib/schemas";
import { supabase } from "@/lib/supabase";
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

          try {
            // Sign in with Supabase Auth
            const { data: authData, error: authError } =
              await supabase.auth.signInWithPassword({
                email,
                password,
              });

            if (authError || !authData.user) {
              console.error("Supabase login error:", authError);
              console.error("Auth data:", authData);
              return null;
            }

            // Get user profile from profiles table
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", authData.user.id)
              .single();

            if (profileError || !profile) {
              console.error("Profile fetch error:", profileError);
              console.error("Profile data:", profile);
              console.error("User ID:", authData.user.id);
              return null;
            }

            console.log("Login successful, profile:", profile);

            return {
              id: profile.id,
              email: profile.email,
              name: profile.full_name,
              role: profile.role.toUpperCase(),
            };
          } catch (error) {
            console.error("Authorization error:", error);
            return null;
          }
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
