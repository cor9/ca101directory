"use server";

import { signIn } from "@/auth";
import { getRoleBasedRedirect } from "@/lib/auth-redirects";
import { LoginSchema } from "@/lib/schemas";
import { createServerClient } from "@/lib/supabase";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
// Fix: In next-auth v5+, AuthError is imported from @auth/core/errors
import { AuthError } from "@auth/core/errors";
import type * as z from "zod";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
  redirectUrl?: string;
};

export async function login(
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null,
): Promise<ServerActionResponse> {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { status: "error", message: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  try {
    const supabase = createServerClient();
    const { data: authData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (signInError || !authData.user) {
      return { status: "error", message: "Invalid credentials provided." };
    }

    // Get user profile to determine role
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authData.user.id)
      .single();

    if (profileError) {
      console.error("Login Action - Profile Fetch Error:", profileError);
      return {
        status: "error",
        message:
          "Could not retrieve your user profile. Please contact support.",
      };
    }

    if (!profile || !profile.role) {
      console.warn(`Login Action: User ${email} is missing a profile or role.`);
      return {
        status: "error",
        message:
          "Your account is not fully configured with a user role. Please contact support.",
      };
    }

    // Determine redirect URL based on role
    const roleBasedRedirect = getRoleBasedRedirect(profile.role);
    const redirectUrl =
      callbackUrl || roleBasedRedirect || DEFAULT_LOGIN_REDIRECT;

    console.log(
      "Login action: User role is",
      profile?.role,
      "roleBasedRedirect:",
      roleBasedRedirect,
      "final redirectUrl:",
      redirectUrl,
    );

    // Sign in with NextAuth and let it handle the redirect
    await signIn("credentials", {
      email,
      password,
      redirectTo: redirectUrl, // Let NextAuth handle the redirect
    });

    return {
      status: "success",
      message: "Login successful",
      redirectUrl,
    };
  } catch (error) {
    console.error("Login error caught:", error);

    if (error instanceof AuthError) {
      console.error("AuthError type:", error.type);
      console.error("AuthError message:", error.message);

      switch (error.type) {
        case "CredentialsSignin":
          return { status: "error", message: "Invalid credentials!" };
        case "CallbackRouteError":
          return {
            status: "error",
            message:
              "Login processing error. Please try again or contact support if this persists.",
          };
        default:
          return {
            status: "error",
            message: `Authentication error: ${error.message || "Something went wrong!"}`,
          };
      }
    }

    // Log unexpected errors
    console.error("Unexpected login error:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    throw error;
  }
}
