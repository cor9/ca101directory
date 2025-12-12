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
    // Passwordless magic link authentication via Supabase
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        token: { label: "Token", type: "text" },
        refreshToken: { label: "Refresh Token", type: "text" },
        remember: { label: "Remember", type: "text" },
        expiresIn: { label: "Expires In", type: "text" },
      },
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (!validatedFields.success) {
          console.error("Invalid magic link credentials received");
          return null;
        }

        const { email, token, refreshToken, remember } = validatedFields.data;
        const rememberChoice =
          remember === "true" || remember === "1" || remember === "on";

        try {
          const supabase = createServerClient();
          const { data: authUser, error: authError } =
            await supabase.auth.getUser(token);

          if (authError || !authUser?.user) {
            console.error(
              "Supabase magic link verification failed:",
              authError,
            );
            return null;
          }

          // REMOVED: email_confirmed_at check - clicking magic link IS the confirmation
          // Magic link authentication proves email ownership, no separate confirmation needed

          if (authUser.user.email?.toLowerCase() !== email.toLowerCase()) {
            console.error("Magic link email mismatch", {
              expected: email,
              actual: authUser.user.email,
            });
            return null;
          }

          let { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", authUser.user.id)
            .single();

          if (profileError || !profile) {
            console.error("Profile fetch error:", profileError);
            console.error("Profile data:", profile);
            console.error("User ID:", authUser.user.id);

            const { data: newProfile, error: createError } = await supabase
              .from("profiles")
              .insert({
                id: authUser.user.id,
                email: authUser.user.email,
                full_name:
                  authUser.user.user_metadata?.name || authUser.user.email,
                role: authUser.user.user_metadata?.role || "guest",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .select()
              .single();

            if (createError || !newProfile) {
              console.error("Failed to create profile:", createError);
              return null;
            }

            profile = newProfile;
          }

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

          const sessionDurations: Record<string, number> = {
            admin: 90,
            parent: 30,
            vendor: 30, // Increased from 7 to 30 days - vendors need longer sessions to complete claims/submissions
          };
          const defaultDays = sessionDurations[profile.role] ?? 30;
          const sessionSeconds = rememberChoice
            ? defaultDays * 24 * 60 * 60
            : 24 * 60 * 60;
          const expiresAt = new Date(Date.now() + sessionSeconds * 1000);

          return {
            id: profile.id,
            email: profile.email,
            name: profile.full_name || profile.email,
            role: profile.role,
            supabaseAccessToken: token,
            supabaseRefreshToken: refreshToken,
            remember: rememberChoice,
            sessionExpiresAt: expiresAt.toISOString(),
          } as any;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
