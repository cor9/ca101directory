"use server";

import { auth, unstable_update } from "@/auth";
import { createServerClient } from "@/lib/supabase";
import type { UserRole } from "@/types/user-role";
import { revalidatePath } from "next/cache";

export type SwitchRoleResponse = {
  success: boolean;
  message: string;
  error?: string;
};

/**
 * Switch user role between parent and vendor
 * Fixes Bug #2: Users stuck with wrong role
 */
export async function switchUserRole(
  newRole: "parent" | "vendor",
): Promise<SwitchRoleResponse> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to change your account type.",
        error: "AUTH_REQUIRED",
      };
    }

    const supabase = createServerClient();

    // Get current profile
    const { data: currentProfile, error: profileError } = await supabase
      .from("profiles")
      .select("role, full_name, email")
      .eq("id", session.user.id)
      .single();

    if (profileError || !currentProfile) {
      return {
        success: false,
        message: "Could not find your profile. Please try again.",
        error: "PROFILE_NOT_FOUND",
      };
    }

    // Prevent switching to the same role
    if (currentProfile.role === newRole) {
      const roleName = newRole === "parent" ? "Parent" : "Vendor";
      return {
        success: false,
        message: `Your account is already set as ${roleName}.`,
        error: "SAME_ROLE",
      };
    }

    // Prevent admins from switching roles
    if (currentProfile.role === "admin") {
      return {
        success: false,
        message:
          "Admin accounts cannot switch roles. Contact support if you need assistance.",
        error: "ADMIN_CANNOT_SWITCH",
      };
    }

    // Update role in profiles table
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        role: newRole,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.user.id);

    if (updateError) {
      console.error("Role switch error:", updateError);
      return {
        success: false,
        message: "Failed to update your account type. Please try again.",
        error: "UPDATE_FAILED",
      };
    }

    // Update session with new role
    try {
      await unstable_update({
        user: {
          ...session.user,
          role: newRole as UserRole,
        },
      });
    } catch (sessionError) {
      console.error("Session update error:", sessionError);
      // Don't fail if session update fails - user can re-login
    }

    // Revalidate relevant pages
    revalidatePath("/settings");
    revalidatePath("/dashboard");

    const roleNameFrom = currentProfile.role === "parent" ? "Parent" : "Vendor";
    const roleNameTo = newRole === "parent" ? "Parent" : "Vendor";

    return {
      success: true,
      message: `Successfully switched from ${roleNameFrom} to ${roleNameTo}! Please log out and log back in for the changes to fully take effect.`,
    };
  } catch (error) {
    console.error("Unexpected error switching role:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      error: "UNEXPECTED_ERROR",
    };
  }
}
