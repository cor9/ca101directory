"use server";

import { currentUser } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export type UserRole = "guest" | "parent" | "vendor" | "admin";

export async function updateUserRole(
  userId: string,
  newRole: UserRole
): Promise<{ status: "success" | "error"; message: string }> {
  try {
    // Verify admin access
    const admin = await currentUser();
    if (!admin?.id || admin.role !== "admin") {
      return {
        status: "error",
        message: "Unauthorized. Only admins can change user roles.",
      };
    }

    // Prevent admins from changing their own role
    if (admin.id === userId) {
      return {
        status: "error",
        message: "You cannot change your own role.",
      };
    }

    const supabase = createServerClient();

    // Update the user's role
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (error) {
      console.error("Error updating user role:", error);
      return {
        status: "error",
        message: `Failed to update role: ${error.message}`,
      };
    }

    // Revalidate the admin users page
    revalidatePath("/dashboard/admin/users");

    return {
      status: "success",
      message: `User role updated to ${newRole} successfully.`,
    };
  } catch (error) {
    console.error("Unexpected error updating user role:", error);
    return {
      status: "error",
      message: "An unexpected error occurred.",
    };
  }
}

