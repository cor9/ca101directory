"use server";

import { signIn } from "@/auth";
import { getRoleBasedRedirect } from "@/lib/auth-redirects";
import { LoginSchema } from "@/lib/schemas";
import { createServerClient } from "@/lib/supabase";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
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
    // First, get user role for redirect
    const supabase = createServerClient();
    const { data: authData } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!authData.user) {
      return { status: "error", message: "Invalid credentials!" };
    }

    // Get user profile to determine role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authData.user.id)
      .single();

    // Determine redirect URL based on role
    const redirectUrl =
      callbackUrl ||
      (profile?.role
        ? getRoleBasedRedirect(profile.role)
        : DEFAULT_LOGIN_REDIRECT);

    await signIn("credentials", {
      email,
      password,
      redirectTo: redirectUrl,
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
