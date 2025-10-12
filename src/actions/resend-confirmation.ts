"use server";

import { createServerClient } from "@/lib/supabase";

export async function resendConfirmationEmail(email: string) {
  try {
    const supabase = createServerClient();

    // Resend confirmation email
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      console.error("Resend confirmation error:", error);
      
      if (error.message.includes("rate limit")) {
        return {
          success: false,
          error: "Too many requests. Please wait a few minutes and try again.",
        };
      }

      if (error.message.includes("already confirmed")) {
        return {
          success: false,
          error: "Email already confirmed. Try logging in instead.",
        };
      }

      return {
        success: false,
        error: error.message || "Failed to resend confirmation email.",
      };
    }

    return {
      success: true,
      message: "Confirmation email sent! Check your inbox.",
    };
  } catch (error) {
    console.error("Unexpected resend error:", error);
    return {
      success: false,
      error: "Something went wrong. Please contact support.",
    };
  }
}
