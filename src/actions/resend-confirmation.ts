"use server";

import { createServerClient } from "@/lib/supabase";

export async function resendConfirmation(email: string) {
  try {
    const supabase = createServerClient();

    // Resend confirmation email using Supabase Auth
    // Note: Supabase's resend method will check if the email is already verified
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
    });

    if (error) {
      console.error("Resend confirmation error:", error);
      return {
        status: "error" as const,
        message: "Failed to resend confirmation email. Please try again.",
      };
    }

    return {
      status: "success" as const,
      message:
        "✅ Confirmation email sent!\n\n📧 Check your inbox (and spam folder) for the new confirmation link.",
    };
  } catch (error) {
    console.error("Resend confirmation error:", error);
    return {
      status: "error" as const,
      message: "Something went wrong. Please try again.",
    };
  }
}

