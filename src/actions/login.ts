"use server";

import { getUserByEmail } from "@/data/supabase-user";
import { LoginSchema } from "@/lib/schemas";
import { supabase } from "@/lib/supabase";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
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
    // Sign in with Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      console.error("Supabase login error:", authError);
      return { status: "error", message: authError.message };
    }

    if (!authData.user) {
      return { status: "error", message: "Login failed" };
    }

    // Check if user exists in our users table
    const user = await getUserByEmail(email);
    if (!user) {
      return { status: "error", message: "User profile not found" };
    }

    return {
      status: "success",
      message: "Login successful",
      redirectUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    };
  } catch (error) {
    console.error("Login error:", error);
    return { status: "error", message: "Something went wrong!" };
  }
}
