"use server";

import { isRoleEnabled } from "@/config/feature-flags";
import { createUser, getUserByEmail } from "@/data/supabase-user";
import { sendDiscordNotification } from "@/lib/discord";
import { RegisterSchema } from "@/lib/schemas";
import { createServerClient } from "@/lib/supabase";
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
    return {
      status: "error",
      message: "Email already being used. Try logging in instead.",
    };
  }

  try {
    const supabase = createServerClient();

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          name: name,
          role: role,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (authError) {
      console.error("Supabase auth error:", authError);

      // Provide helpful error messages
      if (authError.message.includes("rate limit")) {
        return {
          status: "error",
          message:
            "Too many registration attempts. Please try again in a few minutes.",
        };
      }

      if (authError.message.includes("already registered")) {
        return {
          status: "error",
          message: "This email is already registered. Try logging in instead.",
        };
      }

      return { status: "error", message: authError.message };
    }

    if (!authData.user) {
      return { status: "error", message: "Failed to create user" };
    }

    // Wait a moment for trigger to complete
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify profile was created
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (!profile) {
      console.error("Profile not created by trigger, creating manually");

      // Fallback: Create user record in our profiles table
      const user = await createUser({
        id: authData.user.id,
        email: authData.user.email || "",
        name,
        role: role,
      });

      if (!user) {
        console.error("Manual profile creation failed, but continuing");
        // Don't fail - admin can fix profile later
      }
    }

    // Redirect to registration success page
    // Discord notification (non-blocking)
    sendDiscordNotification("🆕 New Sign-up", [
      { name: "Email", value: email, inline: true },
      { name: "Role", value: role, inline: true },
      { name: "User ID", value: `\`${authData.user.id}\``, inline: false },
    ]).catch((e) => console.warn("Discord sign-up notification failed:", e));

    return {
      status: "success",
      message: "Account created! Redirecting to confirmation page...",
      redirectUrl: `/auth/registration-success?email=${encodeURIComponent(email)}`,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      status: "error",
      message: "Something went wrong. Please try again or contact support.",
    };
  }
}
