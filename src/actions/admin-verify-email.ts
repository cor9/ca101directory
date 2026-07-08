"use server";

import { auth } from "@/auth";
import { requirePermission } from "@/lib/auth/guards";
import { createServerClient } from "@/lib/supabase";

export async function adminVerifyEmail(email: string) {
  try {
    // Check if user is authenticated and is admin
    const guard = await requirePermission("email.verify.admin");
    if (!guard.authorized) {
      const session = await auth();
      if (!session?.user?.id) {
        return {
          status: "error" as const,
          message: "You must be logged in to perform this action.",
        };
      }
      return {
        status: "error" as const,
        message: "Unauthorized. Admin access required.",
      };
    }

    const supabase = createServerClient();

    // Check if user exists in auth.users using direct SQL query
    const { data: users, error: fetchError } = await supabase.rpc(
      "get_user_by_email",
      {
        user_email: email,
      },
    );

    // If RPC doesn't exist, use auth admin listUsers (less efficient but works)
    const { data: authData, error: authError } =
      await supabase.auth.admin.listUsers();

    if (authError) {
      console.error("Error fetching users:", authError);
      return {
        status: "error" as const,
        message: "Failed to fetch users. Please try again.",
      };
    }

    const user = authData.users.find(
      (u: any) => u.email?.toLowerCase() === email.toLowerCase(),
    );

    if (!user) {
      return {
        status: "error" as const,
        message: "No user found with that email address.",
      };
    }

    if (user.email_confirmed_at) {
      return {
        status: "error" as const,
        message: `Email ${email} is already verified (verified at ${new Date(user.email_confirmed_at).toLocaleString()}).`,
      };
    }

    // Manually verify the email using auth admin
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        email_confirm: true,
      },
    );

    if (updateError) {
      console.error("Error verifying email:", updateError);
      return {
        status: "error" as const,
        message: "Failed to verify email. Please try again.",
      };
    }

    return {
      status: "success" as const,
      message: `✅ Email ${email} has been manually verified! User can now login.`,
    };
  } catch (error) {
    console.error("Admin verify email error:", error);
    return {
      status: "error" as const,
      message: "Something went wrong. Please try again.",
    };
  }
}
