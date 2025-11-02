"use server";

import { isRoleEnabled } from "@/config/feature-flags";
import { getUserByEmail } from "@/data/supabase-user";
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

  const { email, name, role, remember } = validatedFields.data;

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

    const magicLinkUrl = new URL(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://directory.childactor101.com'}/auth/magic-link`,
    );
    magicLinkUrl.searchParams.set("email", email);
    magicLinkUrl.searchParams.set("role", role);
    magicLinkUrl.searchParams.set("remember", remember ? "1" : "0");
    magicLinkUrl.searchParams.set("intent", "register");
    if (nextUrl) {
      magicLinkUrl.searchParams.set("redirectTo", nextUrl);
    }

    const { error: magicLinkError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: magicLinkUrl.toString(),
        shouldCreateUser: true,
        data: {
          full_name: name,
          name,
          role,
        },
      },
    });

    if (magicLinkError) {
      console.error("Supabase magic link error:", magicLinkError);

      if (magicLinkError.message.includes("rate limit")) {
        return {
          status: "error",
          message:
            "Too many registration attempts. Please try again in a few minutes.",
        };
      }

      if (magicLinkError.message.includes("already registered")) {
        return {
          status: "error",
          message: "This email is already registered. Try logging in instead.",
        };
      }

      return { status: "error", message: magicLinkError.message };
    }

    // Discord notification (non-blocking)
    sendDiscordNotification("🆕 New Sign-up", [
      { name: "Email", value: email, inline: true },
      { name: "Role", value: role, inline: true },
    ]).catch((e) => console.warn("Discord sign-up notification failed:", e));

    return {
      status: "success",
      message: "Check your email to confirm your account and finish signing in.",
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
