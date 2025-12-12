"use server";

import { getRoleBasedRedirect } from "@/lib/auth-redirects";
import { MagicLinkRequestSchema } from "@/lib/schemas";
import { createServerClient } from "@/lib/supabase";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import type { User } from "@supabase/supabase-js";
import type * as z from "zod";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
  redirectUrl?: string;
};

export async function login(
  values: z.infer<typeof MagicLinkRequestSchema>,
  callbackUrl?: string | null,
): Promise<ServerActionResponse> {
  const validatedFields = MagicLinkRequestSchema.safeParse(values);
  if (!validatedFields.success) {
    return { status: "error", message: "Invalid fields!" };
  }

  const { email, remember } = validatedFields.data;

  try {
    const supabase = createServerClient();
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("email", email)
      .single();

    let resolvedProfile = profile;

    if (profileError || !profile?.id) {
      console.warn(
        "Login Action: Profile lookup failed, checking auth.users table",
        profileError,
      );
      const { data: authUsers, error: authLookupError } =
        await supabase.auth.admin.listUsers({
          page: 1,
          perPage: 200,
        });

      if (authLookupError) {
        console.error(
          "Login Action - Admin user lookup error",
          authLookupError,
        );
      }

      const adminUsers = (authUsers?.users ?? []) as User[];
      const authUser = adminUsers.find(
        (user) => user.email?.toLowerCase() === email.toLowerCase(),
      );

      if (!authUser) {
        return {
          status: "error",
          message:
            "We couldn't find an account for that email. Please check the address or sign up.",
        };
      }

      resolvedProfile = {
        id: authUser.id,
        role: (authUser.user_metadata as any)?.role ?? "guest",
      } as typeof profile;
    }

    if (!resolvedProfile?.role || resolvedProfile.role === "guest") {
      console.warn(
        `Login Action: User ${email} has no assigned role, defaulting to dashboard redirect`,
      );
    }

    const roleBasedRedirect = getRoleBasedRedirect(resolvedProfile.role);
    const redirectUrl =
      callbackUrl || roleBasedRedirect || DEFAULT_LOGIN_REDIRECT;

    // CRITICAL: Always use fallback if env var is missing
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://directory.childactor101.com";

    const magicLinkUrl = new URL(`${siteUrl}/auth/magic-link`);
    magicLinkUrl.searchParams.set("email", email);
    magicLinkUrl.searchParams.set("role", resolvedProfile.role ?? "guest");
    magicLinkUrl.searchParams.set("remember", remember ? "1" : "0");
    magicLinkUrl.searchParams.set("redirectTo", redirectUrl);
    magicLinkUrl.searchParams.set("intent", "login");

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: magicLinkUrl.toString(),
        shouldCreateUser: false,
      },
    });

    if (signInError) {
      console.error("Login magic link error:", signInError);
      return {
        status: "error",
        message:
          signInError.message ||
          "We couldn't send the login link. Please try again in a moment.",
      };
    }

    return {
      status: "success",
      message: "Check your email for a secure login link.",
    };
  } catch (error) {
    console.error("Login magic link error caught:", error);
    return {
      status: "error",
      message: "We couldn't start the login process. Please try again soon.",
    };
  }
}
