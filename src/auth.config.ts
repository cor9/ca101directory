import { SHOW_QUERY_LOGS } from "@/lib/constants";
import { LoginSchema } from "@/lib/schemas";
import { createServerClient } from "@/lib/supabase";
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
            const supabase = createServerClient();
            const { data: authData, error: authError } =
              await supabase.auth.signInWithPassword({
                email,
                password,
              });

            if (authError || !authData.user) {
              console.error("Supabase login error:", authError);
              console.error("Auth data:", authData);

              // Check if user's email is not confirmed
              if (authError?.message?.includes("email_not_confirmed")) {
                throw new AuthError(
                  "Please check your email and confirm your account.",
                );
              }

              return null;
            }

            // Check if email is confirmed
            if (!authData.user.email_confirmed_at) {
              console.error("Email not confirmed for user:", authData.user.id);
              throw new AuthError(
                "Email not confirmed. Please check your email and click the confirmation link.",
              );
            }

            // Get user profile from profiles table
            let { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", authData.user.id)
              .single();

            if (profileError || !profile) {
              console.error("Profile fetch error:", profileError);
              console.error("Profile data:", profile);
              console.error("User ID:", authData.user.id);

              // TEMPORARY WORKAROUND: Create profile if it doesn't exist
              console.log(
                "Creating missing profile for user:",
                authData.user.id,
              );
              const { data: newProfile, error: createError } = await supabase
                .from("profiles")
                .insert({
                  id: authData.user.id,
                  email: authData.user.email,
                  full_name:
                    authData.user.user_metadata?.name || authData.user.email,
                  role: authData.user.user_metadata?.role || "guest",
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                })
                .select()
                .single();

              if (createError || !newProfile) {
                console.error("Failed to create profile:", createError);
                return null;
              }

              console.log("Created new profile:", newProfile);
              profile = newProfile;
            }

            console.log("Login successful, profile:", profile);

            // Check if the user's role is enabled via feature flags
            const { isRoleEnabled } = await import("@/config/feature-flags");
            if (!isRoleEnabled(profile.role)) {
              console.error(
                `Login blocked: Role '${profile.role}' is not enabled for user:`,
                profile.id,
              );
              throw new AuthError(
                `${profile.role.charAt(0).toUpperCase() + profile.role.slice(1)} accounts are not currently available. Please contact support if you need assistance.`,
              );
            }

            return {
              id: profile.id,
              email: profile.email,
              name: profile.full_name || profile.email, // Map full_name to name for session
              role: profile.role,
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
