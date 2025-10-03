"use server";

import { isRoleEnabled } from "@/config/feature-flags";
import { createUser, getUserByEmail } from "@/data/supabase-user";
import { getRoleBasedRedirect } from "@/lib/auth-redirects";
import { RegisterSchema } from "@/lib/schemas";
import { supabase } from "@/lib/supabase";
import { UserRole } from "@/types/user-role";
import type * as z from "zod";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
  redirectUrl?: string;
};

export async function register(
  values: z.infer<typeof RegisterSchema>,
  nextUrl?: string,
): Promise<ServerActionResponse> {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { status: "error", message: "Invalid Fields!" };
  }

  const { email, password, name, role } = validatedFields.data;

  // Check if the selected role is enabled
  if (!isRoleEnabled(role)) {
    return {
      status: "error",
      message: `${role} registration is currently disabled`,
    };
  }

  // Check if user already exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { status: "error", message: "Email already being used" };
  }

  try {
    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          role: role,
        },
      },
    });

    if (authError) {
      console.error("Supabase auth error:", authError);
      return { status: "error", message: authError.message };
    }

    if (!authData.user) {
      return { status: "error", message: "Failed to create user" };
    }

    // Create user record in our profiles table
    const user = await createUser({
      id: authData.user.id,
      email: authData.user.email || "",
      name,
      role: role,
    });

    if (!user) {
      return { status: "error", message: "Failed to create user profile" };
    }

    // Check if email confirmation is required
    if (authData.user.email_confirmed_at === null) {
      return {
        status: "success",
        message:
          "Account created successfully! Please check your email to confirm your account before signing in.",
        redirectUrl: "/auth/login",
      };
    }

    return {
      status: "success",
      message: "Account created successfully! Redirecting to dashboard...",
      redirectUrl: nextUrl || getRoleBasedRedirect(role as UserRole),
    };
  } catch (error) {
    console.error("Registration error:", error);
    return { status: "error", message: "Something went wrong" };
  }
}
