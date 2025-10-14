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
    const redirectUrl =
      callbackUrl ||
      getRoleBasedRedirect(profile.role) ||
      DEFAULT_LOGIN_REDIRECT;

    console.log(
      "Login action: User role is",
      profile?.role,
      "redirecting to",
      redirectUrl,
    );

    // Sign in with NextAuth (don't wait for redirect, let the action handle it)
    await signIn("credentials", {
      email,
      password,
      redirect: false, // Prevent NextAuth from redirecting
    });

    return {
      status: "success",
      message: "Login successful",
      redirectUrl,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { status: "error", message: "Invalid credentials!" };
        default:
          return { status: "error", message: "Something went wrong!" };
      }
    }
    throw error;
  }
}
